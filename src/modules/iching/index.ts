import { 
  Hexagram, 
  getHexagramByBinary, 
  getHexagramByName,
  getHexagramByNumber,
  getChangedHexagram,
  DIFFICULT_HEXAGRAMS,
  FAVORABLE_HEXAGRAMS
} from '../../data/iching-64';

export interface DivinationResult {
  originalHexagram: Hexagram;
  changedHexagram?: Hexagram;
  changingLines: number[];
  lines: LineResult[];
  summary: string;
  counselingAdvice: string;
}

export interface LineResult {
  position: number;
  value: 'yang' | 'yin';
  isChanging: boolean;
  text: string;
}

export interface TimingAdvice {
  isGoodTime: boolean;
  score: number;
  factors: string[];
}

export function yarrowStalkDivination(): DivinationResult {
  const lines: LineResult[] = [];
  const changingLines: number[] = [];

  for (let i = 0; i < 6; i++) {
    const lineResult = simulateYarrowLine();
    lines.unshift({
      position: i + 1,
      value: lineResult.value,
      isChanging: lineResult.isChanging,
      text: '',
    });
    
    if (lineResult.isChanging) {
      changingLines.push(i + 1);
    }
  }

  return buildDivinationResult(lines, changingLines);
}

function simulateYarrowLine(): { value: 'yang' | 'yin'; isChanging: boolean } {
  let remainder = 49;

  const divide = (): number => {
    const left = Math.floor(Math.random() * (remainder - 1)) + 1;
    const right = remainder - left - 1;
    return right % 4 || 4;
  };

  let count = 0;
  for (let i = 0; i < 3; i++) {
    remainder = remainder - divide() - 1;
    remainder = Math.floor(remainder / 4) * 4;
    count++;
  }

  const finalRemainder = remainder / 4;

  if (finalRemainder === 9) {
    return { value: 'yang', isChanging: true };
  } else if (finalRemainder === 5) {
    return { value: 'yin', isChanging: false };
  } else if (finalRemainder === 4) {
    return { value: 'yang', isChanging: false };
  } else {
    return { value: 'yin', isChanging: true };
  }
}

export function coinDivination(): DivinationResult {
  const lines: LineResult[] = [];
  const changingLines: number[] = [];

  for (let i = 0; i < 6; i++) {
    const lineResult = simulateCoinLine();
    lines.unshift({
      position: i + 1,
      value: lineResult.value,
      isChanging: lineResult.isChanging,
      text: '',
    });
    
    if (lineResult.isChanging) {
      changingLines.push(i + 1);
    }
  }

  return buildDivinationResult(lines, changingLines);
}

function simulateCoinLine(): { value: 'yang' | 'yin'; isChanging: boolean } {
  const heads = Math.floor(Math.random() * 3);
  
  switch (heads) {
    case 0:
      return { value: 'yang', isChanging: true };
    case 1:
      return { value: 'yin', isChanging: false };
    case 2:
      return { value: 'yang', isChanging: false };
    case 3:
      return { value: 'yin', isChanging: true };
    default:
      return { value: 'yang', isChanging: false };
  }
}

export function manualDivination(coinResults: number[]): DivinationResult {
  const lines: LineResult[] = [];
  const changingLines: number[] = [];

  coinResults.forEach((heads, index) => {
    let lineResult: { value: 'yang' | 'yin'; isChanging: boolean };
    
    switch (heads) {
      case 0:
        lineResult = { value: 'yang', isChanging: true };
        break;
      case 1:
        lineResult = { value: 'yin', isChanging: false };
        break;
      case 2:
        lineResult = { value: 'yang', isChanging: false };
        break;
      case 3:
        lineResult = { value: 'yin', isChanging: true };
        break;
      default:
        lineResult = { value: 'yang', isChanging: false };
    }

    lines.unshift({
      position: 6 - index,
      value: lineResult.value,
      isChanging: lineResult.isChanging,
      text: '',
    });
    
    if (lineResult.isChanging) {
      changingLines.push(6 - index);
    }
  });

  return buildDivinationResult(lines, changingLines);
}

function buildDivinationResult(lines: LineResult[], changingLines: number[]): DivinationResult {
  const binary = lines.map(l => l.value === 'yang' ? '1' : '0').join('');
  const originalHexagram = getHexagramByBinary(binary);
  
  if (!originalHexagram) {
    throw new Error('無法找到對應卦象');
  }

  lines.forEach((line, index) => {
    line.text = originalHexagram.lines[index] || '';
  });

  let changedHexagram: Hexagram | undefined;
  if (changingLines.length > 0) {
    const changedBinary = getChangedHexagram(binary, changingLines);
    changedHexagram = getHexagramByBinary(changedBinary);
  }

  const summary = generateSummary(originalHexagram, changedHexagram, changingLines);
  const counselingAdvice = generateCounselingAdvice(originalHexagram, changedHexagram, changingLines);

  return {
    originalHexagram,
    changedHexagram,
    changingLines,
    lines,
    summary,
    counselingAdvice,
  };
}

function generateSummary(
  original: Hexagram, 
  changed?: Hexagram, 
  changingLines: number[] = []
): string {
  let summary = `占得【${original.name}卦】第${original.number}卦\n\n`;
  summary += `${original.meaning.general}\n\n`;
  
  if (changingLines.length > 0 && changed) {
    summary += `動爻：第 ${changingLines.join('、')} 爻\n`;
    summary += `變卦為【${changed.name}卦】\n\n`;
    
    changingLines.forEach(pos => {
      const lineIndex = 6 - pos;
      if (original.lines[lineIndex]) {
        summary += `${original.lines[lineIndex]}\n`;
      }
    });
  }
  
  return summary;
}

function generateCounselingAdvice(
  original: Hexagram, 
  changed?: Hexagram, 
  changingLines: number[] = []
): string {
  let advice = `${original.name}卦 - 諮商建議：\n\n`;
  advice += `${original.meaning.counseling}\n\n`;
  
  if (DIFFICULT_HEXAGRAMS.includes(original.name)) {
    advice += '⚠️ 此卦象顯示目前處於困境期，建議尋求專業諮商協助。\n';
  } else if (FAVORABLE_HEXAGRAMS.includes(original.name)) {
    advice += '✨ 此卦象顯示目前運勢較佳，是進行自我探索的好時機。\n';
  }
  
  if (changingLines.length > 3) {
    advice += '🔄 變爻較多，顯示目前處於變動期，適合進行調整與轉化。\n';
  }
  
  if (changed) {
    if (DIFFICULT_HEXAGRAMS.includes(changed.name) && !DIFFICULT_HEXAGRAMS.includes(original.name)) {
      advice += '📈 變卦趨向困境，建議及早尋求專業支持。\n';
    } else if (FAVORABLE_HEXAGRAMS.includes(changed.name) && !FAVORABLE_HEXAGRAMS.includes(original.name)) {
      advice += '📈 變卦趨向吉利，堅持下去將會有所突破。\n';
    }
  }
  
  advice += `\n心理層面解讀：${original.meaning.psychology}`;
  
  return advice;
}

export function analyzeTimingFromHexagram(result: DivinationResult): TimingAdvice {
  const factors: string[] = [];
  let score = 50;

  if (DIFFICULT_HEXAGRAMS.includes(result.originalHexagram.name)) {
    score += 20;
    factors.push(`主卦【${result.originalHexagram.name}】為困境卦象 (+20)`);
  }

  if (FAVORABLE_HEXAGRAMS.includes(result.originalHexagram.name)) {
    score -= 10;
    factors.push(`主卦【${result.originalHexagram.name}】為吉利卦象 (-10)`);
  }

  if (result.changingLines.length > 3) {
    score += 10;
    factors.push(`變爻較多(${result.changingLines.length}個)，變動期 (+10)`);
  }

  if (result.changingLines.length === 0) {
    factors.push('無變爻，狀態穩定 (±0)');
  }

  if (result.changedHexagram) {
    if (DIFFICULT_HEXAGRAMS.includes(result.changedHexagram.name)) {
      score += 10;
      factors.push(`變卦【${result.changedHexagram.name}】趨向困境 (+10)`);
    }
    if (FAVORABLE_HEXAGRAMS.includes(result.changedHexagram.name)) {
      score += 5;
      factors.push(`變卦【${result.changedHexagram.name}】趨向吉利，突破契機 (+5)`);
    }
  }

  const yinCount = result.lines.filter(l => l.value === 'yin').length;
  if (yinCount >= 4) {
    score += 5;
    factors.push(`陰爻較多(${yinCount}個)，需要陽氣支持 (+5)`);
  }

  return {
    isGoodTime: score >= 60,
    score: Math.min(100, Math.max(0, score)),
    factors,
  };
}

export { getHexagramByBinary, getHexagramByName, getHexagramByNumber };
