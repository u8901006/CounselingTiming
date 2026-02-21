export interface TarotCard {
  name: string;
  nameShort: string;
  value: string;
  valueInt: number;
  suit: string;
  type: string;
  meaningUp: string;
  meaningRev: string;
  description: string;
}

export interface TarotReading {
  cards: DrawnCard[];
  spread: SpreadType;
  summary: string;
  psychologicalState: PsychologicalIndicators;
  counselingAdvice: string;
}

export interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  position: string;
  positionMeaning: string;
}

export interface PsychologicalIndicators {
  stressLevel: number;
  hopeLevel: number;
  needForSupport: number;
  emotionalState: string;
}

export type SpreadType = 'single' | 'three' | 'celtic';

export interface SpreadDefinition {
  type: SpreadType;
  name: string;
  cardCount: number;
  positions: string[];
  positionMeanings: string[];
}

export const SPREADS: Record<SpreadType, SpreadDefinition> = {
  single: {
    type: 'single',
    name: '單牌指引',
    cardCount: 1,
    positions: ['指引'],
    positionMeanings: ['當前的指引牌'],
  },
  three: {
    type: 'three',
    name: '時間流牌陣',
    cardCount: 3,
    positions: ['過去', '現在', '未來'],
    positionMeanings: ['影響當前狀況的過去因素', '目前的狀態', '可能的發展方向'],
  },
  celtic: {
    type: 'celtic',
    name: '凱爾特十字',
    cardCount: 10,
    positions: [
      '現狀',
      '挑戰',
      '基礎',
      '過去',
      '目標',
      '近期未來',
      '自我',
      '環境',
      '希望/恐懼',
      '結果',
    ],
    positionMeanings: [
      '你目前的狀態',
      '你面臨的挑戰或障礙',
      '這個問題的基礎或根源',
      '已經過去的影響',
      '你想要達成的目標',
      '不久的將來會發生的事',
      '你對這個問題的態度',
      '外部環境的影響',
      '你的希望或恐懼',
      '最終可能的結果',
    ],
  },
};

const TAROT_API_BASE = 'https://tarot-api.onrender.com/api/v1';

const FALLBACK_TAROT_CARDS: TarotCard[] = [
  { name: 'The Fool', nameShort: 'fool', value: '0', valueInt: 0, suit: 'major', type: 'major', meaningUp: 'New beginnings, innocence, spontaneity, a free spirit', meaningRev: 'Recklessness, risk-taking, inconsideration, naivety', description: 'The Fool represents new beginnings and innocence.' },
  { name: 'The Magician', nameShort: 'magician', value: '1', valueInt: 1, suit: 'major', type: 'major', meaningUp: 'Manifestation, resourcefulness, power, inspired action', meaningRev: 'Manipulation, poor planning, untapped talents', description: 'The Magician represents manifestation and resourcefulness.' },
  { name: 'The High Priestess', nameShort: 'priestess', value: '2', valueInt: 2, suit: 'major', type: 'major', meaningUp: 'Intuition, sacred knowledge, divine feminine, the subconscious mind', meaningRev: 'Secrets, disconnection from intuition, withdrawal', description: 'The High Priestess represents intuition and sacred knowledge.' },
  { name: 'The Empress', nameShort: 'empress', value: '3', valueInt: 3, suit: 'major', type: 'major', meaningUp: 'Femininity, beauty, nature, nurturing, abundance', meaningRev: 'Creative block, dependence on others', description: 'The Empress represents femininity and nurturing.' },
  { name: 'The Emperor', nameShort: 'emperor', value: '4', valueInt: 4, suit: 'major', type: 'major', meaningUp: 'Authority, establishment, structure, a father figure', meaningRev: 'Tyranny, rigidity, coldness', description: 'The Emperor represents authority and structure.' },
  { name: 'The Hierophant', nameShort: 'hierophant', value: '5', valueInt: 5, suit: 'major', type: 'major', meaningUp: 'Spiritual wisdom, religious beliefs, conformity, tradition', meaningRev: 'Personal beliefs, freedom, challenging convention', description: 'The Hierophant represents spiritual wisdom.' },
  { name: 'The Lovers', nameShort: 'lovers', value: '6', valueInt: 6, suit: 'major', type: 'major', meaningUp: 'Love, harmony, relationships, values alignment, choices', meaningRev: 'Self-love, disharmony, imbalance, misalignment', description: 'The Lovers represents love and relationships.' },
  { name: 'The Chariot', nameShort: 'chariot', value: '7', valueInt: 7, suit: 'major', type: 'major', meaningUp: 'Control, willpower, success, action, determination', meaningRev: 'Self-discipline, opposition, lack of direction', description: 'The Chariot represents control and determination.' },
  { name: 'Strength', nameShort: 'strength', value: '8', valueInt: 8, suit: 'major', type: 'major', meaningUp: 'Strength, courage, persuasion, influence, compassion', meaningRev: 'Inner strength, self-doubt, raw emotion', description: 'Strength represents courage and compassion.' },
  { name: 'The Hermit', nameShort: 'hermit', value: '9', valueInt: 9, suit: 'major', type: 'major', meaningUp: 'Soul-searching, introspection, being alone, inner guidance', meaningRev: 'Isolation, loneliness, withdrawal', description: 'The Hermit represents introspection and inner guidance.' },
  { name: 'Wheel of Fortune', nameShort: 'fortune', value: '10', valueInt: 10, suit: 'major', type: 'major', meaningUp: 'Good luck, karma, life cycles, destiny, a turning point', meaningRev: 'Bad luck, resistance to change, breaking cycles', description: 'Wheel of Fortune represents life cycles and destiny.' },
  { name: 'Justice', nameShort: 'justice', value: '11', valueInt: 11, suit: 'major', type: 'major', meaningUp: 'Justice, fairness, truth, cause and effect, law', meaningRev: 'Unfairness, lack of accountability, dishonesty', description: 'Justice represents fairness and truth.' },
  { name: 'The Hanged Man', nameShort: 'hangedman', value: '12', valueInt: 12, suit: 'major', type: 'major', meaningUp: 'Pause, surrender, letting go, new perspectives', meaningRev: 'Stalling, resistance, indecision', description: 'The Hanged Man represents surrender and new perspectives.' },
  { name: 'Death', nameShort: 'death', value: '13', valueInt: 13, suit: 'major', type: 'major', meaningUp: 'Endings, change, transformation, transition', meaningRev: 'Resistance to change, personal transformation, inner purging', description: 'Death represents transformation and endings.' },
  { name: 'Temperance', nameShort: 'temperance', value: '14', valueInt: 14, suit: 'major', type: 'major', meaningUp: 'Balance, moderation, patience, purpose', meaningRev: 'Imbalance, excess, self-healing, realignment', description: 'Temperance represents balance and moderation.' },
  { name: 'The Devil', nameShort: 'devil', value: '15', valueInt: 15, suit: 'major', type: 'major', meaningUp: 'Shadow self, attachment, addiction, restriction', meaningRev: 'Releasing limiting beliefs, exploring dark thoughts', description: 'The Devil represents attachment and restriction.' },
  { name: 'The Tower', nameShort: 'tower', value: '16', valueInt: 16, suit: 'major', type: 'major', meaningUp: 'Sudden change, upheaval, chaos, revelation, awakening', meaningRev: 'Personal transformation, fear of change, averting disaster', description: 'The Tower represents sudden change and upheaval.' },
  { name: 'The Star', nameShort: 'star', value: '17', valueInt: 17, suit: 'major', type: 'major', meaningUp: 'Hope, faith, purpose, renewal, spirituality', meaningRev: 'Lack of faith, despair, self-trust, disconnection', description: 'The Star represents hope and renewal.' },
  { name: 'The Moon', nameShort: 'moon', value: '18', valueInt: 18, suit: 'major', type: 'major', meaningUp: 'Illusion, fear, anxiety, subconscious, intuition', meaningRev: 'Release of fear, repressed emotions, inner confusion', description: 'The Moon represents illusion and intuition.' },
  { name: 'The Sun', nameShort: 'sun', value: '19', valueInt: 19, suit: 'major', type: 'major', meaningUp: 'Positivity, fun, warmth, success, vitality', meaningRev: 'Inner child, feeling down, overly optimistic', description: 'The Sun represents positivity and success.' },
  { name: 'Judgement', nameShort: 'judgement', value: '20', valueInt: 20, suit: 'major', type: 'major', meaningUp: 'Judgement, rebirth, inner calling, absolution', meaningRev: 'Self-doubt, refusing self-examination', description: 'Judgement represents rebirth and inner calling.' },
  { name: 'The World', nameShort: 'world', value: '21', valueInt: 21, suit: 'major', type: 'major', meaningUp: 'Completion, integration, accomplishment, travel', meaningRev: 'Seeking personal closure, short-cuts, delays', description: 'The World represents completion and accomplishment.' },
];

export async function fetchAllCards(): Promise<TarotCard[]> {
  try {
    const response = await fetch(`${TAROT_API_BASE}/cards`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.cards && data.cards.length > 0) {
      return data.cards;
    }
    return FALLBACK_TAROT_CARDS;
  } catch (error) {
    console.error('Error fetching tarot cards, using fallback data:', error);
    return FALLBACK_TAROT_CARDS;
  }
}

export async function fetchRandomCards(count: number): Promise<TarotCard[]> {
  try {
    const response = await fetch(`${TAROT_API_BASE}/cards/random?n=${count}`);
    const data = await response.json();
    return data.cards || [];
  } catch (error) {
    console.error('Error fetching random cards:', error);
    return [];
  }
}

export function drawCards(cards: TarotCard[], count: number): DrawnCard[] {
  const shuffled = [...cards].sort(() => Math.random() - 0.5);
  const drawn: DrawnCard[] = [];
  const spread = count === 1 ? SPREADS.single : count === 3 ? SPREADS.three : SPREADS.celtic;

  for (let i = 0; i < count && i < shuffled.length; i++) {
    drawn.push({
      card: shuffled[i],
      isReversed: Math.random() > 0.5,
      position: spread.positions[i],
      positionMeaning: spread.positionMeanings[i],
    });
  }

  return drawn;
}

export function interpretReading(cards: DrawnCard[], spreadType: SpreadType): TarotReading {
  const summary = generateSummary(cards);
  const psychologicalState = analyzePsychologicalState(cards);
  const counselingAdvice = generateCounselingAdvice(cards, psychologicalState);

  return {
    cards,
    spread: spreadType,
    summary,
    psychologicalState,
    counselingAdvice,
  };
}

const STRESS_CARDS = ['The Tower', 'The Devil', 'Ten of Swords', 'Three of Swords', 'Five of Cups'];
const HOPE_CARDS = ['The Star', 'The Sun', 'The World', 'Ace of Cups', 'Ten of Cups', 'Temperance'];
const REFLECTION_CARDS = ['The Hermit', 'The High Priestess', 'The Moon', 'Four of Swords'];
const CHANGE_CARDS = ['Death', 'The Hanged Man', 'Wheel of Fortune', 'The Tower'];

function generateSummary(cards: DrawnCard[]): string {
  let summary = '塔羅占卜結果：\n\n';

  cards.forEach((drawn) => {
    const meaning = drawn.isReversed ? drawn.card.meaningRev : drawn.card.meaningUp;
    summary += `【${drawn.position}】${drawn.card.name}`;
    if (drawn.isReversed) {
      summary += '（逆位）';
    }
    summary += `\n${meaning}\n\n`;
  });

  return summary;
}

function analyzePsychologicalState(cards: DrawnCard[]): PsychologicalIndicators {
  let stressLevel = 0;
  let hopeLevel = 0;
  let needForSupport = 0;
  const emotionalIndicators: string[] = [];

  cards.forEach(drawn => {
    const cardName = drawn.card.name;
    const isReversed = drawn.isReversed;

    if (STRESS_CARDS.includes(cardName)) {
      stressLevel += isReversed ? 10 : 20;
      emotionalIndicators.push('壓力');
    }

    if (HOPE_CARDS.includes(cardName)) {
      hopeLevel += isReversed ? 5 : 15;
      emotionalIndicators.push('希望');
    }

    if (REFLECTION_CARDS.includes(cardName)) {
      emotionalIndicators.push('內省');
    }

    if (CHANGE_CARDS.includes(cardName)) {
      emotionalIndicators.push('轉變');
      needForSupport += 10;
    }

    if (isReversed) {
      needForSupport += 5;
    }
  });

  const reversedCount = cards.filter(c => c.isReversed).length;
  if (reversedCount > cards.length / 2) {
    needForSupport += 15;
  }

  stressLevel = Math.min(100, stressLevel);
  hopeLevel = Math.min(100, hopeLevel);
  needForSupport = Math.min(100, needForSupport + 30);

  let emotionalState = '目前情緒狀態：';
  if (emotionalIndicators.length === 0) {
    emotionalState += '相對穩定';
  } else {
    emotionalState += emotionalIndicators.join('、');
  }

  return {
    stressLevel,
    hopeLevel,
    needForSupport,
    emotionalState,
  };
}

function generateCounselingAdvice(
  cards: DrawnCard[], 
  state: PsychologicalIndicators
): string {
  let advice = '心理諮商建議：\n\n';

  if (state.stressLevel > 50) {
    advice += '⚠️ 壓力指數較高，建議考慮尋求專業心理支持。\n';
  }

  if (state.needForSupport > 60) {
    advice += '🌟 目前需要較多支持，適合開始諮商歷程。\n';
  }

  if (state.hopeLevel > 40) {
    advice += '✨ 內在仍有希望資源，可作為諮商的基礎。\n';
  }

  advice += `\n情緒狀態評估：${state.emotionalState}\n`;

  const hasStressCard = cards.some(c => STRESS_CARDS.includes(c.card.name));
  const hasReflectionCard = cards.some(c => REFLECTION_CARDS.includes(c.card.name));

  if (hasStressCard && hasReflectionCard) {
    advice += '\n💡 建議：同時經歷壓力與內省，適合深層探索型治療（如 EMDR 或精神分析）。';
  } else if (hasStressCard) {
    advice += '\n💡 建議：壓力較大，適合結構化治療（如 CBT）或身體取向治療（如 SE）。';
  } else if (hasReflectionCard) {
    advice += '\n💡 建議：適合內省型治療（如正念或榮格取向）。';
  }

  return advice;
}

export function getTimingScoreFromTarot(reading: TarotReading): { score: number; factors: string[] } {
  const factors: string[] = [];
  let score = 50;

  if (reading.psychologicalState.stressLevel > 50) {
    score += 15;
    factors.push(`壓力指數高(${reading.psychologicalState.stressLevel}%) (+15)`);
  }

  if (reading.psychologicalState.needForSupport > 60) {
    score += 20;
    factors.push(`需要支持度高(${reading.psychologicalState.needForSupport}%) (+20)`);
  }

  const stressCardCount = reading.cards.filter(c => 
    STRESS_CARDS.includes(c.card.name)
  ).length;
  if (stressCardCount > 0) {
    score += stressCardCount * 5;
    factors.push(`壓力象徵牌 ${stressCardCount} 張 (+${stressCardCount * 5})`);
  }

  const reversedRatio = reading.cards.filter(c => c.isReversed).length / reading.cards.length;
  if (reversedRatio > 0.5) {
    score += 10;
    factors.push(`逆位牌較多(${Math.round(reversedRatio * 100)}%) (+10)`);
  }

  return {
    score: Math.min(100, score),
    factors,
  };
}
