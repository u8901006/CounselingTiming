import { WUXING_THERAPIES, TherapyType, ELEMENT_NAMES } from '../../data/wuxing-therapy';

export interface ElementScores {
  wood: number;
  fire: number;
  water: number;
  earth: number;
  metal: number;
}

export interface TimingFactor {
  source: 'ziwei' | 'bazi' | 'iching' | 'tarot';
  factor: string;
  impact: number;
  description: string;
}

export interface TimingResult {
  score: number;
  level: '不建議' | '可考慮' | '建議' | '強烈建議';
  factors: TimingFactor[];
  summary: string;
}

export interface OrientationMatch {
  therapy: TherapyType;
  score: number;
  reasons: string[];
}

export interface OrientationResult {
  therapies: OrientationMatch[];
  dominantElement: string;
  deficientElement: string;
  elementScores: ElementScores;
}

export interface CounselingRecommendation {
  timing: TimingResult;
  orientation: OrientationResult;
  overallAdvice: string;
}

export function calculateElementScores(
  baziScores: Partial<ElementScores>,
  ziweiElements?: { dominant: string; secondary?: string }
): ElementScores {
  const baseScores: ElementScores = {
    wood: 20,
    fire: 20,
    water: 20,
    earth: 20,
    metal: 20,
  };

  Object.entries(baziScores).forEach(([element, score]) => {
    if (score !== undefined && element in baseScores) {
      baseScores[element as keyof ElementScores] = score;
    }
  });

  if (ziweiElements?.dominant) {
    const dominantKey = ziweiElements.dominant.toLowerCase() as keyof ElementScores;
    if (dominantKey in baseScores) {
      baseScores[dominantKey] = Math.min(100, baseScores[dominantKey] + 15);
    }
  }

  if (ziweiElements?.secondary) {
    const secondaryKey = ziweiElements.secondary.toLowerCase() as keyof ElementScores;
    if (secondaryKey in baseScores) {
      baseScores[secondaryKey] = Math.min(100, baseScores[secondaryKey] + 10);
    }
  }

  return normalizeScores(baseScores);
}

function normalizeScores(scores: ElementScores): ElementScores {
  const total = Object.values(scores).reduce((sum, s) => sum + s, 0);
  if (total === 0) return scores;

  const normalized: ElementScores = {
    wood: Math.round((scores.wood / total) * 100),
    fire: Math.round((scores.fire / total) * 100),
    water: Math.round((scores.water / total) * 100),
    earth: Math.round((scores.earth / total) * 100),
    metal: Math.round((scores.metal / total) * 100),
  };

  return normalized;
}

export function analyzeTiming(
  ziweiFactors: TimingFactor[] = [],
  baziFactors: TimingFactor[] = [],
  ichingFactors: TimingFactor[] = [],
  tarotFactors: TimingFactor[] = []
): TimingResult {
  const allFactors = [
    ...ziweiFactors,
    ...baziFactors,
    ...ichingFactors,
    ...tarotFactors,
  ];

  let baseScore = 50;
  allFactors.forEach(factor => {
    baseScore += factor.impact;
  });

  const finalScore = Math.min(100, Math.max(0, baseScore));

  const level = 
    finalScore >= 80 ? '強烈建議' :
    finalScore >= 60 ? '建議' :
    finalScore >= 40 ? '可考慮' : '不建議';

  const summary = generateTimingSummary(level, allFactors, finalScore);

  return {
    score: finalScore,
    level,
    factors: allFactors,
    summary,
  };
}

function generateTimingSummary(
  level: string, 
  factors: TimingFactor[], 
  score: number
): string {
  const positiveFactors = factors.filter(f => f.impact > 0);
  const negativeFactors = factors.filter(f => f.impact < 0);

  let summary = `諮商時機評估：${level}（${score}分）\n\n`;

  if (positiveFactors.length > 0) {
    summary += '促進諮商的因素：\n';
    positiveFactors.forEach(f => {
      summary += `• ${f.description}\n`;
    });
    summary += '\n';
  }

  if (negativeFactors.length > 0) {
    summary += '可能阻礙的因素：\n';
    negativeFactors.forEach(f => {
      summary += `• ${f.description}\n`;
    });
    summary += '\n';
  }

  switch (level) {
    case '強烈建議':
      summary += '目前是非常適合尋求心理諮商的時機，建議盡快開始。';
      break;
    case '建議':
      summary += '目前是適合開始諮商的時機，可以開始尋找合適的心理師。';
      break;
    case '可考慮':
      summary += '可以評估是否需要諮商，若感到困擾可以開始探索。';
      break;
    case '不建議':
      summary += '目前可能不是最佳時機，但不代表不需要諮商，可以繼續觀察自己的狀態。';
      break;
  }

  return summary;
}

export function matchCounselingOrientation(
  elementScores: ElementScores,
  ziweiTraits: string[] = [],
  baziTraits: string[] = []
): OrientationResult {
  const sorted = Object.entries(elementScores)
    .sort((a, b) => b[1] - a[1]);
  
  const dominantElement = sorted[0][0];
  const deficientElement = sorted[sorted.length - 1][0];

  const matches: OrientationMatch[] = [];

  for (const [element, therapies] of Object.entries(WUXING_THERAPIES)) {
    for (const therapy of therapies) {
      const match = calculateTherapyMatch(
        therapy,
        elementScores,
        element,
        dominantElement,
        deficientElement,
        ziweiTraits,
        baziTraits
      );
      matches.push(match);
    }
  }

  matches.sort((a, b) => b.score - a.score);

  return {
    therapies: matches.slice(0, 10),
    dominantElement,
    deficientElement,
    elementScores,
  };
}

function calculateTherapyMatch(
  therapy: TherapyType,
  elementScores: ElementScores,
  therapyElement: string,
  dominantElement: string,
  deficientElement: string,
  ziweiTraits: string[],
  _baziTraits: string[]
): OrientationMatch {
  let score = 0;
  const reasons: string[] = [];

  const elementStrength = elementScores[therapyElement as keyof ElementScores] || 20;
  score += elementStrength * 0.5;

  if (therapyElement === dominantElement) {
    score += 20;
    reasons.push(`您的命盤${ELEMENT_NAMES[therapyElement]}氣強，與此治療取向天然契合`);
  }

  if (therapyElement === deficientElement && elementStrength < 20) {
    score += 15;
    reasons.push(`此取向可補足您較缺乏的${ELEMENT_NAMES[therapyElement]}特質`);
  }

  if (ziweiTraits.includes('結構化思考') && ['cbt', 'dbt', 'sfbt'].includes(therapy.id)) {
    score += 10;
    reasons.push('命宮具結構化特質，適合邏輯導向的治療');
  }

  if (ziweiTraits.includes('創意表達') && ['art', 'jungian', 'narrative'].includes(therapy.id)) {
    score += 10;
    reasons.push('命宮具創意與象徵特質，適合表達性治療');
  }

  if (ziweiTraits.includes('深層探索') && ['psychoanalysis', 'emdr', 'hypnosis', 'mindfulness'].includes(therapy.id)) {
    score += 10;
    reasons.push('福德宮具深層探索特質，適合潛意識導向治療');
  }

  if (ziweiTraits.includes('身心協調') && ['se', 'tre', 'smart'].includes(therapy.id)) {
    score += 10;
    reasons.push('命宮具身心協調特質，適合身體取向治療');
  }

  if (ziweiTraits.includes('關係導向') && ['satir', 'object-relations', 'sandplay', 'eft'].includes(therapy.id)) {
    score += 10;
    reasons.push('關係宮位活躍，適合關係取向治療');
  }

  return {
    therapy,
    score: Math.min(100, Math.round(score)),
    reasons,
  };
}

export function generateOverallAdvice(
  timing: TimingResult,
  orientation: OrientationResult
): string {
  let advice = '';

  if (timing.level === '強烈建議' || timing.level === '建議') {
    advice = `根據分析，目前是${timing.level}開始心理諮商的時機。\n\n`;
  } else if (timing.level === '可考慮') {
    advice = '根據分析，您可以考慮是否開始心理諮商。\n\n';
  } else {
    advice = '根據分析，目前可能不是最佳時機，但請持續關注自己的狀態。\n\n';
  }

  const topTherapy = orientation.therapies[0];
  if (topTherapy && topTherapy.score >= 60) {
    advice += `您的特質最適合的治療取向是【${topTherapy.therapy.name}】。\n`;
    if (topTherapy.reasons.length > 0) {
      advice += `原因：${topTherapy.reasons[0]}\n\n`;
    }
  }

  const secondTherapy = orientation.therapies[1];
  if (secondTherapy && secondTherapy.score >= 50) {
    advice += `也可以考慮【${secondTherapy.therapy.name}】作為輔助。\n\n`;
  }

  advice += `您的五行特質以【${ELEMENT_NAMES[orientation.dominantElement]}】為主導，`;
  advice += `較缺乏【${ELEMENT_NAMES[orientation.deficientElement]}】的能量。\n`;
  advice += `建議選擇能夠發揮主導特質、同時補足不足的治療取向。`;

  return advice;
}

export function generateFullRecommendation(
  timing: TimingResult,
  orientation: OrientationResult
): CounselingRecommendation {
  return {
    timing,
    orientation,
    overallAdvice: generateOverallAdvice(timing, orientation),
  };
}
