import { astro } from 'iztro';

export interface StarInfo {
  name: string;
  type: 'major' | 'minor' | 'adj' | 'dec';
  brightness: string;
  mutagen: string;
}

export interface PalaceInfo {
  name: string;
  index: number;
  heavenlyStem: string;
  earthlyBranch: string;
  majorStars: StarInfo[];
  minorStars: StarInfo[];
  isBodyPalace: boolean;
}

export interface PatternInfo {
  name: string;
  description: string;
  stars: string[];
}

export interface ZiweiResult {
  chineseDate: string;
  lunarDate: string;
  solarDate: string;
  time: string;
  zodiac: string;
  chineseZodiac: string;
  palaces: PalaceInfo[];
  majorStars: string[];
  patterns: PatternInfo[];
  starBrightnessAnalysis: string;
  mutagenAnalysis: string;
  lifePalaceDetail: string;
  lifeAnalysis: string;
  sanfangAnalysis: string;
  shaStarsAnalysis: string;
  allPalaceAnalysis: string;
  personalityAnalysis: string;
  currentDaXian: string;
  counselingAdvice: string;
}

export interface BaziResult {
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  hourPillar: string;
  dayMaster: string;
  wuxingCount: Record<string, number>;
  wuxingScores: Record<string, number>;
  dominantWuxing: string;
  deficientWuxing: string;
  analysis: string;
}

export interface YearlyFortune {
  year: number;
  age: number;
  palaceName: string;
  majorStars: StarInfo[];
  hasJi: boolean;
  hasLu: boolean;
  summary: string;
  advice: string;
}

export interface MonthlyFortune {
  month: number;
  palaceName: string;
  summary: string;
}

const WUXING_MAP: Record<string, string> = {
  '甲': 'wood', '乙': 'wood',
  '丙': 'fire', '丁': 'fire',
  '戊': 'earth', '己': 'earth',
  '庚': 'metal', '辛': 'metal',
  '壬': 'water', '癸': 'water',
  '子': 'water', '丑': 'earth',
  '寅': 'wood', '卯': 'wood',
  '辰': 'earth', '巳': 'fire',
  '午': 'fire', '未': 'earth',
  '申': 'metal', '酉': 'metal',
  '戌': 'earth', '亥': 'water',
};

const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const CHINESE_ZODIAC = ['鼠', '牛', '虎', '兔', '龍', '蛇', '馬', '羊', '猴', '雞', '狗', '豬'];

const STAR_DESCRIPTIONS: Record<string, string> = {
  '紫微': '帝星，主尊貴、領導、權威。性格穩重，有領導才能，喜掌權。',
  '天機': '智慧之星，主聰明、謀略、變動。思慮周詳，善於規劃，但易多慮。',
  '太陽': '主光明、熱情、外向。性格開朗，喜助人，但易操勞。',
  '武曲': '財星，主剛毅、決斷、理財。個性剛強，重實際，善理財。',
  '天同': '福星，主安逸、享受、和諧。個性溫和，樂天知命，但有時懶散。',
  '廉貞': '主多變、才藝、感情。聰明多藝，感情豐富，但情緒起伏大。',
  '天府': '財庫之星，主穩重、保守、理財。個性穩重，善於守成。',
  '太陰': '月星，主陰柔、內斂、財富。個性內向，心思細膩，善理財。',
  '貪狼': '桃花星，主慾望、才藝、交際。多才多藝，交際廣闊，但慾望較強。',
  '巨門': '口舌之星，主是非、分析、口才。善於分析，口才好，但易招是非。',
  '天相': '印星，主公正、輔佐、穩重。個性公正，善於輔佐，人緣佳。',
  '天梁': '蔭星，主清高、助人、長壽。個性清高，喜助人，有長輩緣。',
  '七殺': '將星，主威嚴、獨立、衝勁。個性剛強，獨立自主，有衝勁。',
  '破軍': '變動之星，主破舊、創新、衝動。敢於突破，喜創新，但較衝動。',
};

const BRIGHTNESS_MEANINGS: Record<string, string> = {
  '廟': '星曜能量最強，發揮正面特質',
  '旺': '星曜能量強，運作順暢',
  '得': '星曜能量適中，表現平穩',
  '利': '星曜能量尚可，稍有阻礙',
  '平': '星曜能量一般，表現普通',
  '不': '星曜能量較弱，表現受限',
  '陷': '星曜能量最弱，易有負面表現',
};

const SHA_STARS = ['擎羊', '陀羅', '火星', '鈴星', '地空', '地劫'];
const LUCKY_STARS = ['左輔', '右弼', '文昌', '文曲', '天魁', '天鉞', '祿存'];

const SHA_STAR_MEANINGS: Record<string, string> = {
  '擎羊': '主剛毅、衝動、刑傷。能量強時有魄力，弱時易衝動傷人',
  '陀羅': '主糾纏、拖延、阻礙。可能帶來拖延或內在糾結',
  '火星': '主急躁、突發、動力。能量強時爆發力強，弱時易躁動',
  '鈴星': '主剛強、果斷、孤獨。有獨立思考能力，但較孤僻',
  '地空': '主空亡、虛耗、精神。與靈性、精神層面相關',
  '地劫': '主劫奪、損失、變動。可能帶來人生波折',
};

const LUCKY_STAR_MEANINGS: Record<string, string> = {
  '左輔': '主貴人助力，有長輩或上司緣',
  '右弼': '主貴人助力，有平輩或下屬緣',
  '文昌': '主文采、學識、考運',
  '文曲': '主才藝、音樂、口才',
  '天魁': '主陽貴人，有男性貴人相助',
  '天鉞': '主陰貴人，有女性貴人相助',
  '祿存': '主財祿、穩定收入',
};

const PALACE_MEANINGS: Record<string, { aspect: string; keywords: string }> = {
  '命宮': { aspect: '個性、外貌、才能、整體運勢', keywords: '核心人格' },
  '兄弟宮': { aspect: '手足關係、合夥、人際', keywords: '平輩關係' },
  '夫妻宮': { aspect: '婚姻、感情、配偶特質', keywords: '親密關係' },
  '子女宮': { aspect: '子女、下屬、創作', keywords: '下一代' },
  '財帛宮': { aspect: '財富、理財能力、收入', keywords: '物質資源' },
  '疾厄宮': { aspect: '健康、身體狀況', keywords: '身心健康' },
  '遷移宮': { aspect: '外出、人際、社會表現', keywords: '外在表現' },
  '僕役宮': { aspect: '朋友、下屬、人脈', keywords: '社交網絡' },
  '官祿宮': { aspect: '事業、工作、社會地位', keywords: '職涯發展' },
  '田宅宮': { aspect: '不動產、家庭環境', keywords: '生活根基' },
  '福德宮': { aspect: '精神享受、內心滿足', keywords: '心靈狀態' },
  '父母宮': { aspect: '與父母關係、長輩緣', keywords: '原生家庭' },
};

const PATTERNS: { name: string; stars: string[]; description: string }[] = [
  { name: '紫府同宮格', stars: ['紫微', '天府'], description: '紫微天府同宮，主富貴雙全，為人穩重有領導力' },
  { name: '紫微在子午格', stars: ['紫微'], description: '紫微獨坐子午，主獨當一面，領導才能強' },
  { name: '機月同梁格', stars: ['天機', '太陰', '天同', '天梁'], description: '適合文職、企劃，個性穩重細膩' },
  { name: '日照雷門格', stars: ['太陽', '天機'], description: '日照雷門，主聰明有才華，事業順遂' },
  { name: '日月並明格', stars: ['太陽', '太陰'], description: '日月並明，主陰陽調和，為人圓融' },
  { name: '武貪守命格', stars: ['武曲', '貪狼'], description: '武貪守命，主財慾兼備，有經商才華' },
  { name: '廉貞七殺格', stars: ['廉貞', '七殺'], description: '廉殺同宮，主敢衝敢拼，開創力強' },
  { name: '日月反背格', stars: [], description: '日月落陷，主早年辛苦，需靠努力' },
  { name: '命無正曜格', stars: [], description: '命宮無主星，需借對宮星曜，個性較受環境影響' },
  { name: '府相朝垣格', stars: ['天府', '天相'], description: '府相朝垣，主為人穩重，有貴人相助' },
];

function getChineseZodiac(chineseDate: string): string {
  const yearPillar = chineseDate.split(' ')[0];
  const yearBranch = yearPillar[1];
  const branchIndex = DIZHI.indexOf(yearBranch);
  if (branchIndex >= 0) {
    return CHINESE_ZODIAC[branchIndex];
  }
  return '';
}

function mapStarInfo(star: any): StarInfo {
  return {
    name: star.name,
    type: star.type,
    brightness: star.brightness || '',
    mutagen: star.mutagen || '',
  };
}

export function getZiweiResult(
  solarDate: string,
  hour: number,
  gender: 'male' | 'female'
): ZiweiResult | null {
  try {
    const hourIndex = Math.floor(hour / 2);
    const astrolabe = astro.bySolar(solarDate, hourIndex, gender === 'male' ? '男' : '女', true, 'zh-TW');

    const palaces: PalaceInfo[] = astrolabe.palaces.map((p: any, idx: number) => ({
      name: p.name,
      index: idx,
      heavenlyStem: p.heavenlyStem || '',
      earthlyBranch: p.earthlyBranch || '',
      majorStars: (p.majorStars || []).map(mapStarInfo),
      minorStars: (p.minorStars || []).map(mapStarInfo),
      isBodyPalace: p.isBodyPalace || false,
    }));

    const lifePalace = astrolabe.palaces.find((p: any) => p.name === '命宮');
    const majorStars = lifePalace?.majorStars?.map((s: any) => s.name) || [];

    const patterns = analyzePatterns(palaces);
    const starBrightnessAnalysis = analyzeStarBrightness(palaces);
    const mutagenAnalysis = analyzeMutagens(palaces);
    const lifePalaceDetail = generateLifePalaceDetail(lifePalace);
    const lifeAnalysis = generateLifeAnalysis(astrolabe);
    const sanfangAnalysis = analyzeSanfang(palaces);
    const shaStarsAnalysis = analyzeShaStars(palaces);
    const allPalaceAnalysis = analyzeAllPalaces(palaces);
    const personalityAnalysis = analyzePersonality(palaces);
    const currentDaXian = getCurrentDaXian(astrolabe);
    const counselingAdvice = generateCounselingAdvice(astrolabe);
    const chineseZodiac = getChineseZodiac(astrolabe.chineseDate);

    return {
      chineseDate: astrolabe.chineseDate,
      lunarDate: astrolabe.lunarDate,
      solarDate: astrolabe.solarDate,
      time: astrolabe.time,
      zodiac: astrolabe.zodiac,
      chineseZodiac,
      palaces,
      majorStars,
      patterns,
      starBrightnessAnalysis,
      mutagenAnalysis,
      lifePalaceDetail,
      lifeAnalysis,
      sanfangAnalysis,
      shaStarsAnalysis,
      allPalaceAnalysis,
      personalityAnalysis,
      currentDaXian,
      counselingAdvice,
    };
  } catch (error) {
    console.error('Error calculating ziwei:', error);
    return null;
  }
}

function analyzePatterns(palaces: PalaceInfo[]): PatternInfo[] {
  const patterns: PatternInfo[] = [];
  const lifePalace = palaces.find(p => p.name === '命宮');
  
  if (!lifePalace) return patterns;

  const lifeStars = lifePalace.majorStars.map(s => s.name);

  if (lifeStars.length === 0) {
    patterns.push({
      name: '命無正曜格',
      description: '命宮無主星，個性較受環境影響，需借對宮星曜',
      stars: [],
    });
  }

  for (const pattern of PATTERNS) {
    if (pattern.stars.length === 0) continue;
    
    const hasAllStars = pattern.stars.every(s => lifeStars.includes(s));
    if (hasAllStars) {
      patterns.push({
        name: pattern.name,
        description: pattern.description,
        stars: pattern.stars,
      });
    }
  }

  if (lifeStars.includes('太陽')) {
    const sunStar = lifePalace.majorStars.find(s => s.name === '太陽');
    if (sunStar?.brightness === '陷' || sunStar?.brightness === '不') {
      const moonPalace = palaces.find(p => 
        p.majorStars.some(s => s.name === '太陰' && (s.brightness === '陷' || s.brightness === '不'))
      );
      if (moonPalace) {
        patterns.push({
          name: '日月反背格',
          description: '日月落陷，主早年辛苦，需靠後天努力',
          stars: ['太陽', '太陰'],
        });
      }
    }
  }

  return patterns;
}

function analyzeStarBrightness(palaces: PalaceInfo[]): string {
  const analysis: string[] = [];
  const lifePalace = palaces.find(p => p.name === '命宮');
  
  if (!lifePalace) return '';

  analysis.push('【命宮星曜亮度分析】\n');

  for (const star of lifePalace.majorStars) {
    const brightness = star.brightness;
    const meaning = BRIGHTNESS_MEANINGS[brightness] || '';
    const starDesc = STAR_DESCRIPTIONS[star.name] || '';
    
    analysis.push(`${star.name}（${brightness}）：${meaning}`);
    if (starDesc) {
      analysis.push(`  ${starDesc}`);
    }
  }

  const fudePalace = palaces.find(p => p.name === '福德宮');
  if (fudePalace && fudePalace.majorStars.length > 0) {
    analysis.push('\n【福德宮星曜亮度】\n');
    for (const star of fudePalace.majorStars) {
      const brightness = star.brightness;
      const meaning = BRIGHTNESS_MEANINGS[brightness] || '';
      analysis.push(`${star.name}（${brightness}）：${meaning}`);
    }
  }

  return analysis.join('\n');
}

function analyzeMutagens(palaces: PalaceInfo[]): string {
  const analysis: string[] = [];
  
  analysis.push('【四化分析】\n');

  const mutagenStars: Record<string, { star: string; palace: string }[]> = {
    '祿': [],
    '權': [],
    '科': [],
    '忌': [],
  };

  for (const palace of palaces) {
    for (const star of palace.majorStars) {
      if (star.mutagen && mutagenStars[star.mutagen]) {
        mutagenStars[star.mutagen].push({ star: star.name, palace: palace.name });
      }
    }
  }

  const mutagenMeanings: Record<string, string> = {
    '祿': '主財富、機緣、順遂',
    '權': '主權力、掌控、行動力',
    '科': '主名聲、學識、貴人',
    '忌': '主糾結、執著、阻礙',
  };

  for (const [mutagen, stars] of Object.entries(mutagenStars)) {
    if (stars.length > 0) {
      analysis.push(`${mutagen}（${mutagenMeanings[mutagen]}）：`);
      for (const s of stars) {
        analysis.push(`  ${s.star}化${mutagen}於${s.palace}`);
      }
    }
  }

  const jiStars = mutagenStars['忌'];
  if (jiStars.length > 0) {
    analysis.push('\n【化忌提醒】');
    analysis.push('命盤中有化忌，代表需要注意的面向：');
    for (const s of jiStars) {
      analysis.push(`• ${s.star}化忌於${s.palace}：可能有相關的糾結或執著需要處理`);
    }
  }

  return analysis.join('\n');
}

function generateLifePalaceDetail(lifePalace: any): string {
  if (!lifePalace) return '';

  const detail: string[] = [];
  detail.push('【命宮各星詳解】\n');

  for (const star of lifePalace.majorStars || []) {
    const starName = star.name;
    const brightness = star.brightness || '';
    const mutagen = star.mutagen || '';
    const desc = STAR_DESCRIPTIONS[starName] || '';

    detail.push(`■ ${starName}`);
    if (brightness) detail.push(`  亮度：${brightness}`);
    if (mutagen) detail.push(`  四化：${mutagen}`);
    if (desc) detail.push(`  特質：${desc}`);
    detail.push('');
  }

  if (lifePalace.minorStars && lifePalace.minorStars.length > 0) {
    detail.push('【輔星】');
    const minorNames = lifePalace.minorStars.map((s: any) => s.name).join('、');
    detail.push(minorNames);
  }

  return detail.join('\n');
}

function generateLifeAnalysis(astrolabe: any): string {
  const lifePalace = astrolabe.palaces.find((p: any) => p.name === '命宮');
  const fudePalace = astrolabe.palaces.find((p: any) => p.name === '福德宮');
  const careerPalace = astrolabe.palaces.find((p: any) => p.name === '官祿宮');
  const wealthPalace = astrolabe.palaces.find((p: any) => p.name === '財帛宮');

  const analysis: string[] = [];

  analysis.push('【命宮】');
  if (lifePalace?.majorStars && lifePalace.majorStars.length > 0) {
    const stars = lifePalace.majorStars.map((s: any) => {
      let starStr = s.name;
      if (s.brightness) starStr += `（${s.brightness}）`;
      if (s.mutagen) starStr += `化${s.mutagen}`;
      return starStr;
    }).join('、');
    analysis.push(`主星：${stars}`);
  } else {
    analysis.push('命宮無主星，借對宮星曜');
  }

  analysis.push('\n【福德宮】');
  if (fudePalace?.majorStars && fudePalace.majorStars.length > 0) {
    const stars = fudePalace.majorStars.map((s: any) => s.name).join('、');
    analysis.push(`主星：${stars}`);
  }

  analysis.push('\n【官祿宮】');
  if (careerPalace?.majorStars && careerPalace.majorStars.length > 0) {
    const stars = careerPalace.majorStars.map((s: any) => s.name).join('、');
    analysis.push(`主星：${stars}`);
  }

  analysis.push('\n【財帛宮】');
  if (wealthPalace?.majorStars && wealthPalace.majorStars.length > 0) {
    const stars = wealthPalace.majorStars.map((s: any) => s.name).join('、');
    analysis.push(`主星：${stars}`);
  }

  return analysis.join('\n');
}

function generateCounselingAdvice(astrolabe: any): string {
  const lifePalace = astrolabe.palaces.find((p: any) => p.name === '命宮');
  const fudePalace = astrolabe.palaces.find((p: any) => p.name === '福德宮');

  const advice: string[] = [];

  const emotionalStars = ['太陰', '天機', '天梁', '巨門'];
  const structuredStars = ['天府', '武曲', '紫微'];
  const creativeStars = ['廉貞', '貪狼', '天相'];
  const bodyStars = ['七殺', '破軍'];
  const relationStars = ['天同', '天梁'];

  const lifeStars = lifePalace?.majorStars?.map((s: any) => s.name) || [];
  const fudeStars = fudePalace?.majorStars?.map((s: any) => s.name) || [];
  const allStars = [...lifeStars, ...fudeStars];

  if (emotionalStars.some(s => allStars.includes(s))) {
    advice.push('• 命盤顯示深層情緒特質，適合探索型治療（如精神分析、EMDR、正念）');
  }

  if (structuredStars.some(s => lifeStars.includes(s))) {
    advice.push('• 命宮具結構化特質，適合邏輯導向治療（如 CBT、DBT、焦點解決）');
  }

  if (creativeStars.some(s => lifeStars.includes(s))) {
    advice.push('• 命宮具創意特質，適合表達性治療（如藝術治療、敘事治療、遊戲治療）');
  }

  if (bodyStars.some(s => lifeStars.includes(s))) {
    advice.push('• 命盤具衝勁特質，適合身體取向治療（如 SE、TRE、身體經驗療法）');
  }

  if (relationStars.some(s => allStars.includes(s))) {
    advice.push('• 命盤具關係導向，適合關係取向治療（如家族治療、薩提爾模式）');
  }

  const hasJi = [...lifeStars, ...fudeStars].some((s: string) => {
    const star = lifePalace?.majorStars?.find((st: any) => st.name === s);
    return star?.mutagen === '忌';
  });

  if (hasJi) {
    advice.push('• 命盤有化忌，可能需要處理內在糾結、執著或創傷經驗');
  }

  const hasDarkStar = lifePalace?.majorStars?.some((s: any) => 
    s.brightness === '陷' || s.brightness === '不'
  );
  if (hasDarkStar) {
    advice.push('• 命宮有星曜落陷，可能需要較多支持與引導');
  }

  return advice.length > 0 ? advice.join('\n') : '• 建議根據五行特質選擇適合的諮商取向';
}

export function getBaziResult(
  solarDate: string,
  hour: number
): BaziResult | null {
  try {
    const hourIndex = Math.floor(hour / 2);
    const astrolabe = astro.bySolar(solarDate, hourIndex, '男', true, 'zh-TW');

    const parts = astrolabe.chineseDate.split(' ');
    if (parts.length !== 4) {
      throw new Error('Invalid chinese date format');
    }

    const [yearPillar, monthPillar, dayPillar, hourPillar] = parts;
    const dayMaster = dayPillar[0];

    const allChars = parts.join('');
    const wuxingCount: Record<string, number> = {
      wood: 0, fire: 0, earth: 0, metal: 0, water: 0
    };

    for (const char of allChars) {
      const wuxing = WUXING_MAP[char];
      if (wuxing) {
        wuxingCount[wuxing]++;
      }
    }

    const total = Object.values(wuxingCount).reduce((a, b) => a + b, 0);
    const wuxingScores: Record<string, number> = {};
    for (const [key, value] of Object.entries(wuxingCount)) {
      wuxingScores[key] = Math.round((value / total) * 100);
    }

    const sorted = Object.entries(wuxingScores).sort((a, b) => b[1] - a[1]);
    const dominantWuxing = sorted[0][0];
    const deficientWuxing = sorted[sorted.length - 1][0];

    const analysis = generateBaziAnalysis(dayMaster, wuxingScores, dominantWuxing, deficientWuxing);

    return {
      yearPillar,
      monthPillar,
      dayPillar,
      hourPillar,
      dayMaster,
      wuxingCount,
      wuxingScores,
      dominantWuxing,
      deficientWuxing,
      analysis,
    };
  } catch (error) {
    console.error('Error calculating bazi:', error);
    return null;
  }
}

function generateBaziAnalysis(
  dayMaster: string,
  scores: Record<string, number>,
  dominant: string,
  deficient: string
): string {
  const wuxingNames: Record<string, string> = {
    wood: '木', fire: '火', earth: '土', metal: '金', water: '水'
  };

  const wuxingTraits: Record<string, string> = {
    wood: '成長、疏通、彈性',
    fire: '情緒、轉化、創造',
    earth: '穩定、承載、關係',
    metal: '邏輯、結構、界限',
    water: '深層、流動、覺察',
  };

  let analysis = `【日主】${dayMaster}\n\n`;
  analysis += `【五行分布】\n`;
  analysis += `木 ${scores.wood}% | 火 ${scores.fire}% | 土 ${scores.earth}% | 金 ${scores.metal}% | 水 ${scores.water}%\n\n`;
  analysis += `【主導五行】${wuxingNames[dominant]}（${wuxingTraits[dominant]}）\n`;
  analysis += `【不足五行】${wuxingNames[deficient]}\n\n`;

  if (scores.water >= 40) {
    analysis += '• 水氣旺盛，具深層探索特質，適合精神分析、EMDR 等深層治療\n';
  }
  if (scores.fire >= 40) {
    analysis += '• 火氣旺盛，情緒表達豐富，適合藝術治療、情緒焦點治療\n';
  }
  if (scores.metal >= 40) {
    analysis += '• 金氣旺盛，邏輯結構強，適合 CBT、DBT 等認知行為治療\n';
  }
  if (scores.earth >= 40) {
    analysis += '• 土氣旺盛，關係導向，適合家族治療、薩提爾模式\n';
  }
  if (scores.wood >= 40) {
    analysis += '• 木氣旺盛，具成長動能，適合身體經驗療法、遊戲治療\n';
  }

  if (scores[deficient] < 15) {
    analysis += `• ${wuxingNames[deficient]}氣偏弱，可透過對應的治療取向來補足\n`;
  }

  return analysis;
}

export function getZiweiTimingFactors(ziweiResult: ZiweiResult): { factor: string; impact: number; description: string }[] {
  const factors: { factor: string; impact: number; description: string }[] = [];

  const fudePalace = ziweiResult.palaces.find(p => p.name === '福德宮');
  if (fudePalace?.majorStars.some(s => ['太陰', '巨門', '天機'].includes(s.name))) {
    factors.push({
      factor: '福德宮情緒星',
      impact: 15,
      description: '福德宮有情緒傾向星曜，內心感受較為豐富',
    });
  }

  const lifePalace = ziweiResult.palaces.find(p => p.name === '命宮');
  if (lifePalace?.majorStars.some(s => s.mutagen === '忌')) {
    factors.push({
      factor: '命宮化忌',
      impact: 10,
      description: '命宮有化忌，可能有內在糾結需要處理',
    });
  }

  if (lifePalace?.majorStars.some(s => s.brightness === '陷' || s.brightness === '不')) {
    factors.push({
      factor: '命宮星曜落陷',
      impact: 10,
      description: '命宮有星曜落陷，可能需要較多支持',
    });
  }

  return factors;
}

function analyzeSanfang(palaces: PalaceInfo[]): string {
  const analysis: string[] = [];
  
  analysis.push('【命宮三方四正分析】\n');
  analysis.push('三方四正是紫微斗數的核心邏輯，以命宮為中心，包含：\n');
  analysis.push('• 命宮：核心能力、個性特質\n');
  analysis.push('• 遷移宮（對宮）：外在表現、人際互動\n');
  analysis.push('• 官祿宮：事業發展、社會地位\n');
  analysis.push('• 財帛宮：財富累積、理財能力\n\n');

  const lifePalace = palaces.find(p => p.name === '命宮');
  const movePalace = palaces.find(p => p.name === '遷移宮');
  const careerPalace = palaces.find(p => p.name === '官祿宮');
  const wealthPalace = palaces.find(p => p.name === '財帛宮');

  const countLuckyStars = (palace: PalaceInfo | undefined): number => {
    if (!palace) return 0;
    return palace.majorStars.filter(s => LUCKY_STARS.includes(s.name)).length +
           palace.minorStars.filter(s => LUCKY_STARS.includes(s.name)).length;
  };

  const countShaStars = (palace: PalaceInfo | undefined): number => {
    if (!palace) return 0;
    return palace.majorStars.filter(s => SHA_STARS.includes(s.name)).length +
           palace.minorStars.filter(s => SHA_STARS.includes(s.name)).length;
  };

  const countJiStars = (palace: PalaceInfo | undefined): number => {
    if (!palace) return 0;
    return palace.majorStars.filter(s => s.mutagen === '忌').length;
  };

  const totalLucky = countLuckyStars(lifePalace) + countLuckyStars(movePalace) + 
                     countLuckyStars(careerPalace) + countLuckyStars(wealthPalace);
  const totalSha = countShaStars(lifePalace) + countShaStars(movePalace) + 
                   countShaStars(careerPalace) + countShaStars(wealthPalace);
  const totalJi = countJiStars(lifePalace) + countJiStars(movePalace) + 
                  countJiStars(careerPalace) + countJiStars(wealthPalace);

  analysis.push(`【吉凶星統計】\n`);
  analysis.push(`吉星總數：${totalLucky} 顆\n`);
  analysis.push(`煞星總數：${totalSha} 顆\n`);
  analysis.push(`化忌總數：${totalJi} 顆\n\n`);

  if (totalLucky > totalSha + 2) {
    analysis.push('✨ 三方四正吉星匯聚，整體運勢較為順遂，有貴人運。\n');
  } else if (totalSha > totalLucky + 2) {
    analysis.push('⚠️ 三方四正煞星較多，人生可能需要較多努力與調適。\n');
  } else {
    analysis.push('⚖️ 三方四正吉凶參半，人生起伏交替，需靈活應對。\n');
  }

  if (totalJi >= 2) {
    analysis.push('🔔 化忌較多，可能有較多內在糾結需要處理，適合探索型諮商。\n');
  }

  analysis.push('\n【各宮詳細】\n');
  
  const palaceDetails = [
    { palace: lifePalace, name: '命宮' },
    { palace: movePalace, name: '遷移宮' },
    { palace: careerPalace, name: '官祿宮' },
    { palace: wealthPalace, name: '財帛宮' },
  ];

  for (const { palace, name } of palaceDetails) {
    if (palace) {
      const stars = palace.majorStars.map(s => {
        let str = s.name;
        if (s.brightness) str += `（${s.brightness}）`;
        if (s.mutagen) str += `化${s.mutagen}`;
        return str;
      }).join('、') || '無主星';
      
      const lucky = countLuckyStars(palace);
      const sha = countShaStars(palace);
      
      analysis.push(`${name}：${stars}`);
      if (lucky > 0) analysis.push(`（吉星${lucky}）`);
      if (sha > 0) analysis.push(`（煞星${sha}）`);
      analysis.push('\n');
    }
  }

  return analysis.join('');
}

function analyzeShaStars(palaces: PalaceInfo[]): string {
  const analysis: string[] = [];
  
  analysis.push('【煞星與吉星分析】\n\n');

  const shaStarPositions: { star: string; palace: string }[] = [];
  const luckyStarPositions: { star: string; palace: string }[] = [];

  for (const palace of palaces) {
    for (const star of palace.majorStars) {
      if (SHA_STARS.includes(star.name)) {
        shaStarPositions.push({ star: star.name, palace: palace.name });
      }
      if (LUCKY_STARS.includes(star.name)) {
        luckyStarPositions.push({ star: star.name, palace: palace.name });
      }
    }
    for (const star of palace.minorStars) {
      if (SHA_STARS.includes(star.name)) {
        shaStarPositions.push({ star: star.name, palace: palace.name });
      }
      if (LUCKY_STARS.includes(star.name)) {
        luckyStarPositions.push({ star: star.name, palace: palace.name });
      }
    }
  }

  if (shaStarPositions.length > 0) {
    analysis.push('【煞星分布】\n');
    for (const pos of shaStarPositions) {
      const meaning = SHA_STAR_MEANINGS[pos.star] || '';
      analysis.push(`• ${pos.star}於${pos.palace}：${meaning}\n`);
    }
    analysis.push('\n');
  }

  if (luckyStarPositions.length > 0) {
    analysis.push('【吉星分布】\n');
    for (const pos of luckyStarPositions) {
      const meaning = LUCKY_STAR_MEANINGS[pos.star] || '';
      analysis.push(`• ${pos.star}於${pos.palace}：${meaning}\n`);
    }
  }

  analysis.push('\n【心理諮商相關解讀】\n');
  
  const lifeSha = shaStarPositions.filter(p => p.palace === '命宮').length;
  const fudeSha = shaStarPositions.filter(p => p.palace === '福德宮').length;
  
  if (lifeSha > 0) {
    analysis.push('• 命宮有煞星，性格可能有較多內在衝突或挑戰需要處理\n');
  }
  if (fudeSha > 0) {
    analysis.push('• 福德宮有煞星，內心可能有較多不安或焦慮，適合情緒調節型治療\n');
  }
  
  const hasKongJie = shaStarPositions.some(p => 
    (p.star === '地空' || p.star === '地劫') && 
    (p.palace === '命宮' || p.palace === '福德宮')
  );
  if (hasKongJie) {
    analysis.push('• 地空或地劫入命宮/福德宮，可能與靈性、存在議題相關，適合深度探索\n');
  }

  return analysis.join('');
}

function analyzeAllPalaces(palaces: PalaceInfo[]): string {
  const analysis: string[] = [];
  
  analysis.push('【十二宮位詳細解讀】\n\n');

  for (const palace of palaces) {
    const meaning = PALACE_MEANINGS[palace.name];
    if (!meaning) continue;

    analysis.push(`═══ ${palace.name} ═══\n`);
    analysis.push(`掌管：${meaning.aspect}\n\n`);

    const majorStars = palace.majorStars;
    if (majorStars.length > 0) {
      analysis.push('主星：');
      for (const star of majorStars) {
        let starStr = star.name;
        if (star.brightness) starStr += `（${star.brightness}）`;
        if (star.mutagen) starStr += `化${star.mutagen}`;
        analysis.push(starStr + ' ');
      }
      analysis.push('\n');

      for (const star of majorStars) {
        const desc = STAR_DESCRIPTIONS[star.name];
        if (desc) {
          analysis.push(`  ${star.name}：${desc}\n`);
        }
      }
    } else {
      analysis.push('主星：無（借對宮星曜）\n');
    }

    const minorStars = palace.minorStars;
    if (minorStars.length > 0) {
      const minorNames = minorStars.map(s => s.name).join('、');
      analysis.push(`輔星：${minorNames}\n`);
    }

    analysis.push('\n');
  }

  return analysis.join('');
}

function analyzePersonality(palaces: PalaceInfo[]): string {
  const analysis: string[] = [];
  
  analysis.push('【性格綜合分析】\n\n');

  const lifePalace = palaces.find(p => p.name === '命宮');
  const fudePalace = palaces.find(p => p.name === '福德宮');
  const movePalace = palaces.find(p => p.name === '遷移宮');

  if (!lifePalace) return '';

  const lifeStars = lifePalace.majorStars.map(s => s.name);
  const fudeStars = fudePalace?.majorStars.map(s => s.name) || [];

  analysis.push('【核心性格特質】\n');
  
  const traits: string[] = [];

  if (lifeStars.includes('紫微')) {
    traits.push('有領導氣質，自尊心強，喜歡被尊重');
  }
  if (lifeStars.includes('天機')) {
    traits.push('思慮周密，善於謀劃，但可能過度擔憂');
  }
  if (lifeStars.includes('太陽')) {
    traits.push('熱情外向，樂於助人，但可能過度付出');
  }
  if (lifeStars.includes('太陰')) {
    traits.push('內斂細膩，情感豐富，重視內在感受');
  }
  if (lifeStars.includes('武曲')) {
    traits.push('剛毅果斷，重視實際，理財能力強');
  }
  if (lifeStars.includes('天同')) {
    traits.push('溫和樂天，與人為善，但有時缺乏動力');
  }
  if (lifeStars.includes('廉貞')) {
    traits.push('多才多藝，感情豐富，情緒起伏較大');
  }
  if (lifeStars.includes('貪狼')) {
    traits.push('慾望多元，交際廣闊，多才多藝');
  }
  if (lifeStars.includes('巨門')) {
    traits.push('口才出眾，分析力強，但易有口舌是非');
  }
  if (lifeStars.includes('天相')) {
    traits.push('公正穩重，善於協調，人際關係良好');
  }
  if (lifeStars.includes('天梁')) {
    traits.push('清高正直，樂於助人，有長輩緣');
  }
  if (lifeStars.includes('七殺')) {
    traits.push('獨立自主，敢於突破，衝勁十足');
  }
  if (lifeStars.includes('破軍')) {
    traits.push('敢於創新，突破傳統，但較為衝動');
  }
  if (lifeStars.includes('天府')) {
    traits.push('穩重保守，善於守成，理財有方');
  }

  if (traits.length === 0) {
    traits.push('命宮無主星，性格較受環境影響，適應力強');
  }

  for (const trait of traits) {
    analysis.push(`• ${trait}\n`);
  }

  analysis.push('\n【內心世界（福德宮）】\n');
  
  const innerTraits: string[] = [];
  
  if (fudeStars.includes('太陰')) {
    innerTraits.push('內心敏感細膩，重視精神層面的滿足');
  }
  if (fudeStars.includes('天機')) {
    innerTraits.push('內心常在思考規劃，精神活動旺盛');
  }
  if (fudeStars.includes('天同')) {
    innerTraits.push('追求內心平靜與舒適，懂得享受生活');
  }
  if (fudeStars.includes('貪狼')) {
    innerTraits.push('內心慾望多元，追求多種精神滿足');
  }
  if (fudeStars.includes('巨門')) {
    innerTraits.push('內心常有疑慮，需要深入分析才能安心');
  }

  if (innerTraits.length > 0) {
    for (const trait of innerTraits) {
      analysis.push(`• ${trait}\n`);
    }
  } else {
    analysis.push('• 福德宮特質需結合主星進一步分析\n');
  }

  analysis.push('\n【外在表現（遷移宮）】\n');
  
  const outerStars = movePalace?.majorStars.map(s => s.name) || [];
  const outerTraits: string[] = [];
  
  if (outerStars.includes('紫微')) {
    outerTraits.push('外在給人尊貴、有威嚴的印象');
  }
  if (outerStars.includes('太陽')) {
    outerTraits.push('外在表現熱情開朗，社交能力強');
  }
  if (outerStars.includes('天機')) {
    outerTraits.push('外在給人聰明機靈的印象');
  }
  if (outerStars.includes('七殺') || outerStars.includes('破軍')) {
    outerTraits.push('外在表現果斷有魄力');
  }

  if (outerTraits.length > 0) {
    for (const trait of outerTraits) {
      analysis.push(`• ${trait}\n`);
    }
  } else {
    analysis.push('• 外在表現需結合遷移宮主星分析\n');
  }

  return analysis.join('');
}

function getCurrentDaXian(astrolabe: any): string {
  try {
    const analysis: string[] = [];
    
    analysis.push('【大限運勢】\n\n');

    if (astrolabe.decadal) {
      const decadal = astrolabe.decadal;
      
      if (decadal.range) {
        analysis.push(`大限時間：${decadal.range}\n`);
      }
      
      if (decadal.palaceName) {
        analysis.push(`大限命宮：${decadal.palaceName}\n`);
      }

      if (decadal.majorStars && decadal.majorStars.length > 0) {
        const stars = decadal.majorStars.map((s: any) => {
          let str = s.name;
          if (s.brightness) str += `（${s.brightness}）`;
          if (s.mutagen) str += `化${s.mutagen}`;
          return str;
        }).join('、');
        analysis.push(`大限主星：${stars}\n`);
      }

      const hasJi = decadal.majorStars?.some((s: any) => s.mutagen === '忌');
      if (hasJi) {
        analysis.push('\n⚠️ 大限有化忌，這段時間可能需要較多心理調適\n');
      }
    }

    analysis.push('\n【運勢解讀】\n');
    analysis.push('大限代表十年運勢週期，影響人生重要階段的發展。\n');
    analysis.push('目前大限的主星組合會影響這段時間的心理狀態與外在機遇。\n');

    return analysis.join('');
  } catch (error) {
    return '大限資訊計算中...';
  }
}

const PALACE_NAMES = ['命宮', '兄弟宮', '夫妻宮', '子女宮', '財帛宮', '疾厄宮', '遷移宮', '僕役宮', '官祿宮', '田宅宮', '福德宮', '父母宮'];

const YEARLY_FORTUNE_ADVICE: Record<string, string[]> = {
  '紫微': ['今年有領導機會，宜主動承擔責任', '自尊心較強，注意人際溝通', '適合設定長期目標'],
  '天機': ['思考活躍，適合規劃與策略', '避免過度擔憂，保持行動力', '學習新知有利發展'],
  '太陽': ['人際活躍，貴人運佳', '注意體力消耗，適度休息', '適合助人與公益活動'],
  '武曲': ['財運穩定，理財有方', '剛毅果斷，但需注意人際圓融', '適合投資與事業拓展'],
  '天同': ['生活平順，享受當下', '注意維持動力，避免懶散', '適合培養興趣愛好'],
  '廉貞': ['才藝發揮，感情豐富', '情緒起伏較大，注意調節', '適合創意與藝術活動'],
  '天府': ['穩定發展，守成有利', '適合鞏固現有基礎', '理財保守為宜'],
  '太陰': ['內省時期，重視內心感受', '財運平穩，適合理財', '適合靜態活動與反思'],
  '貪狼': ['社交活躍，機會多元', '注意節制慾望', '適合學習新技能'],
  '巨門': ['口才發揮，溝通重要', '注意口舌是非', '適合演說與寫作'],
  '天相': ['人際和諧，貴人相助', '適合協調與輔佐角色', '注意維持公正'],
  '天梁': ['助人運佳，有長輩緣', '適合照顧他人', '注意自身健康'],
  '七殺': ['開創力強，獨立自主', '注意衝動決策', '適合挑戰新事物'],
  '破軍': ['變動時期，突破舊框架', '注意衝動與風險', '適合創新與改革'],
};

function generateYearlySummary(palaceName: string, stars: StarInfo[], hasJi: boolean, hasLu: boolean): string {
  const lines: string[] = [];
  
  lines.push(`【流年命宮】${palaceName}`);
  
  if (stars.length > 0) {
    const starNames = stars.map(s => {
      let name = s.name;
      if (s.brightness) name += `（${s.brightness}）`;
      return name;
    }).join('、');
    lines.push(`【流年主星】${starNames}`);
  } else {
    lines.push('【流年主星】無主星，借對宮星曜');
  }
  
  lines.push('');
  
  if (hasLu && hasJi) {
    lines.push('【整體運勢】吉凶參半，有機會也有挑戰');
  } else if (hasLu) {
    lines.push('【整體運勢】流年有化祿，運勢較為順遂');
  } else if (hasJi) {
    lines.push('【整體運勢】流年有化忌，需注意調適心態');
  } else {
    lines.push('【整體運勢】平穩發展，按部就班');
  }
  
  for (const star of stars) {
    const advice = YEARLY_FORTUNE_ADVICE[star.name];
    if (advice) {
      lines.push('');
      lines.push(`【${star.name}流年】`);
      lines.push(...advice);
    }
  }
  
  if (stars.some(s => s.brightness === '陷' || s.brightness === '不')) {
    lines.push('');
    lines.push('【提醒】流年有星曜落陷，需要較多耐心與支持');
  }
  
  return lines.join('\n');
}

function generateYearlyAdvice(palaceName: string, stars: StarInfo[], hasJi: boolean): string {
  const advice: string[] = [];
  
  const palaceMeaning = PALACE_MEANINGS[palaceName];
  if (palaceMeaning) {
    advice.push(`流年命宮在${palaceName}，今年的主題與「${palaceMeaning.keywords}」相關。`);
  }
  
  if (hasJi) {
    advice.push('• 流年有化忌，可能有內在糾結或執著需要處理，適合探索型諮商');
  }
  
  const emotionalStars = ['太陰', '天機', '天梁', '巨門'];
  if (stars.some(s => emotionalStars.includes(s.name))) {
    advice.push('• 流年星曜具情緒特質，適合情緒焦點治療或正念練習');
  }
  
  const actionStars = ['七殺', '破軍', '廉貞'];
  if (stars.some(s => actionStars.includes(s.name))) {
    advice.push('• 流年星曜具開創特質，適合行動導向治療或身體經驗療法');
  }
  
  const stableStars = ['天府', '天相', '紫微'];
  if (stars.some(s => stableStars.includes(s.name))) {
    advice.push('• 流年星曜具穩定特質，適合結構化治療如 CBT 或焦點解決');
  }
  
  if (advice.length === 1) {
    advice.push('• 建議根據目前心理狀態選擇適合的諮商取向');
  }
  
  return advice.join('\n');
}

export function getYearlyFortune(
  astrolabe: any,
  birthYear: number,
  year?: number
): YearlyFortune | null {
  try {
    const currentYear = year || new Date().getFullYear();
    const age = currentYear - birthYear;
    
    const earthlyBranchIndex = (currentYear - 4) % 12;
    const palaceIndex = earthlyBranchIndex >= 0 ? earthlyBranchIndex : earthlyBranchIndex + 12;
    
    let targetPalaceIndex = palaceIndex;
    let palaceName = PALACE_NAMES[targetPalaceIndex];
    
    let majorStars: StarInfo[] = [];
    let hasJi = false;
    let hasLu = false;
    
    if (astrolabe?.horoscope?.bySolar) {
      try {
        const horoscope = astrolabe.horoscope.bySolar(`${currentYear}-01-01`, 0);
        if (horoscope?.yearly) {
          const yearly = horoscope.yearly;
          palaceName = yearly.palaceName || palaceName;
          majorStars = (yearly.majorStars || []).map(mapStarInfo);
          hasJi = majorStars.some(s => s.mutagen === '忌');
          hasLu = majorStars.some(s => s.mutagen === '祿');
        }
      } catch {
        // Fall back to default calculation
      }
    }
    
    if (majorStars.length === 0 && astrolabe?.palaces) {
      const palace = astrolabe.palaces[targetPalaceIndex];
      if (palace) {
        palaceName = palace.name;
        majorStars = (palace.majorStars || []).map(mapStarInfo);
        hasJi = majorStars.some(s => s.mutagen === '忌');
        hasLu = majorStars.some(s => s.mutagen === '祿');
      }
    }
    
    const summary = generateYearlySummary(palaceName, majorStars, hasJi, hasLu);
    const advice = generateYearlyAdvice(palaceName, majorStars, hasJi);
    
    return {
      year: currentYear,
      age,
      palaceName,
      majorStars,
      hasJi,
      hasLu,
      summary,
      advice,
    };
  } catch (error) {
    console.error('Error calculating yearly fortune:', error);
    return null;
  }
}

export function getMonthlyFortune(
  astrolabe: any,
  year: number,
  month: number
): MonthlyFortune | null {
  try {
    if (month < 1 || month > 12) {
      return null;
    }
    
    const palaceIndex = (month - 1) % 12;
    let palaceName = PALACE_NAMES[palaceIndex];
    let summary = '';
    
    if (astrolabe?.horoscope?.bySolar) {
      try {
        const horoscope = astrolabe.horoscope.bySolar(`${year}-${String(month).padStart(2, '0')}-01`, 0);
        if (horoscope?.monthly) {
          const monthly = horoscope.monthly;
          palaceName = monthly.palaceName || palaceName;
          const stars = (monthly.majorStars || []).map((s: any) => s.name).join('、');
          summary = `${month}月流月命宮在${palaceName}`;
          if (stars) {
            summary += `，主星：${stars}`;
          }
        }
      } catch {
        // Fall back to default
      }
    }
    
    if (!summary && astrolabe?.palaces) {
      const palace = astrolabe.palaces[palaceIndex];
      if (palace) {
        palaceName = palace.name;
        const stars = (palace.majorStars as StarInfo[]).map(s => s.name).join('、');
        summary = `${month}月流月命宮在${palaceName}`;
        if (stars) {
          summary += `，主星：${stars}`;
        }
      }
    }
    
    return {
      month,
      palaceName,
      summary: summary || `${month}月運勢計算中...`,
    };
  } catch (error) {
    console.error('Error calculating monthly fortune:', error);
    return null;
  }
}

export function getAllMonthlyFortunes(astrolabe: any, year: number): MonthlyFortune[] {
  const fortunes: MonthlyFortune[] = [];
  for (let month = 1; month <= 12; month++) {
    const fortune = getMonthlyFortune(astrolabe, year, month);
    if (fortune) {
      fortunes.push(fortune);
    }
  }
  return fortunes;
}

export { CHINESE_ZODIAC, TIANGAN, DIZHI };
