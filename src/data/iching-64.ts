export interface Trigram {
  name: string;
  symbol: string;
  nature: string;
  element: 'wood' | 'fire' | 'water' | 'earth' | 'metal';
}

export interface Line {
  position: number;
  isYang: boolean;
  isChanging: boolean;
  text: string;
}

export interface Hexagram {
  number: number;
  name: string;
  upperTrigram: string;
  lowerTrigram: string;
  binary: string;
  meaning: {
    general: string;
    psychology: string;
    counseling: string;
  };
  lines: string[];
}

export const TRIGRAMS: Record<string, Trigram> = {
  qian: { name: '乾', symbol: '☰', nature: '天', element: 'metal' },
  kun: { name: '坤', symbol: '☷', nature: '地', element: 'earth' },
  zhen: { name: '震', symbol: '☳', nature: '雷', element: 'wood' },
  xun: { name: '巽', symbol: '☴', nature: '風', element: 'wood' },
  kan: { name: '坎', symbol: '☵', nature: '水', element: 'water' },
  li: { name: '離', symbol: '☲', nature: '火', element: 'fire' },
  gen: { name: '艮', symbol: '☶', nature: '山', element: 'earth' },
  dui: { name: '兌', symbol: '☱', nature: '澤', element: 'metal' },
};

export const HEXAGRAMS: Hexagram[] = [
  {
    number: 1,
    name: '乾',
    upperTrigram: 'qian',
    lowerTrigram: 'qian',
    binary: '111111',
    meaning: {
      general: '元亨利貞。天行健，君子以自強不息。',
      psychology: '陽剛進取，主動積極，追求卓越。',
      counseling: '適合目標導向、行動派的治療取向，如焦點解決或 CBT。',
    },
    lines: ['初九：潛龍勿用。', '九二：見龍在田，利見大人。', '九三：君子終日乾乾。', '九四：或躍在淵，無咎。', '九五：飛龍在天，利見大人。', '上九：亢龍有悔。'],
  },
  {
    number: 2,
    name: '坤',
    upperTrigram: 'kun',
    lowerTrigram: 'kun',
    binary: '000000',
    meaning: {
      general: '元亨，利牝馬之貞。地勢坤，君子以厚德載物。',
      psychology: '柔順包容，承載接納，穩定支持。',
      counseling: '適合支持性、關係取向的治療，如薩提爾或客體關係。',
    },
    lines: ['初六：履霜，堅冰至。', '六二：直方大，不習無不利。', '六三：含章可貞。', '六四：括囊，無咎無譽。', '六五：黃裳元吉。', '上六：龍戰於野，其血玄黃。'],
  },
  {
    number: 3,
    name: '屯',
    upperTrigram: 'kan',
    lowerTrigram: 'zhen',
    binary: '010001',
    meaning: {
      general: '元亨利貞，勿用有攸往，利建侯。',
      psychology: '創始艱難，需要耐心，逐步突破。',
      counseling: '處於困境初期，需要專業支持，建議開始諮商。',
    },
    lines: ['初九：磐桓，利居貞。', '六二：屯如邅如。', '六三：即鹿無虞。', '六四：乘馬班如。', '九五：屯其膏。', '上六：乘馬班如，泣血漣如。'],
  },
  {
    number: 4,
    name: '蒙',
    upperTrigram: 'gen',
    lowerTrigram: 'kan',
    binary: '100010',
    meaning: {
      general: '亨。匪我求童蒙，童蒙求我。',
      psychology: '學習成長，需要引導，啟蒙開發。',
      counseling: '適合探索型治療，如遊戲治療或藝術治療。',
    },
    lines: ['初六：發蒙，利用刑人。', '九二：包蒙吉。', '六三：勿用取女。', '六四：困蒙吝。', '六五：童蒙吉。', '上九：擊蒙。'],
  },
  {
    number: 5,
    name: '需',
    upperTrigram: 'kan',
    lowerTrigram: 'qian',
    binary: '010111',
    meaning: {
      general: '有孚，光亨，貞吉。利涉大川。',
      psychology: '等待時機，培養耐心，準備行動。',
      counseling: '可能需要等待更好的時機，或先做自我準備。',
    },
    lines: ['初九：需于郊。', '九二：需于沙。', '九三：需于泥。', '六四：需于血。', '九五：需于酒食。', '上六：入于穴。'],
  },
  {
    number: 6,
    name: '訟',
    upperTrigram: 'qian',
    lowerTrigram: 'kan',
    binary: '111010',
    meaning: {
      general: '有孚窒惕，中吉，終凶。',
      psychology: '內外衝突，需要調解，避免對立。',
      counseling: '內心有衝突，適合衝突調解或內在家庭系統治療。',
    },
    lines: ['初六：不永所事。', '九二：不克訟。', '六三：食舊德。', '九四：不克訟。', '九五：訟元吉。', '上九：或錫之鞶帶。'],
  },
  {
    number: 7,
    name: '師',
    upperTrigram: 'kun',
    lowerTrigram: 'kan',
    binary: '000010',
    meaning: {
      general: '貞，丈人吉，無咎。',
      psychology: '紀律嚴明，團隊合作，需要領導。',
      counseling: '適合結構化治療，如 DBT 或團體治療。',
    },
    lines: ['初六：師出以律。', '九二：在師中吉。', '六三：師或輿尸。', '六四：師左次。', '六五：田有禽。', '上六：大君有命。'],
  },
  {
    number: 8,
    name: '比',
    upperTrigram: 'kan',
    lowerTrigram: 'kun',
    binary: '010000',
    meaning: {
      general: '吉。原筮元永貞，無咎。',
      psychology: '親近結盟，建立關係，互助合作。',
      counseling: '適合關係取向治療，如家族治療或伴侶治療。',
    },
    lines: ['初六：有孚比之。', '六二：比之自內。', '六三：比之匪人。', '六四：外比之。', '九五：顯比。', '上六：比之無首。'],
  },
  {
    number: 29,
    name: '坎',
    upperTrigram: 'kan',
    lowerTrigram: 'kan',
    binary: '010010',
    meaning: {
      general: '習坎，有孚，維心亨，行有尚。',
      psychology: '險難重疊，需要勇氣，突破困境。',
      counseling: '處於困難期，強烈建議尋求專業諮商協助。',
    },
    lines: ['初六：習坎，入于坎窞。', '九二：坎有險。', '六三：來之坎坎。', '六四：樽酒簋貳。', '九五：坎不盈。', '上六：係用徽纆。'],
  },
  {
    number: 30,
    name: '離',
    upperTrigram: 'li',
    lowerTrigram: 'li',
    binary: '101101',
    meaning: {
      general: '利貞，亨。畜牝牛，吉。',
      psychology: '光明依附，溫暖連結，需要依靠。',
      counseling: '適合情感連結取向治療，如 EFT 或藝術治療。',
    },
    lines: ['初九：履錯然。', '六二：黃離元吉。', '九三：日昃之離。', '九四：突如其來如。', '六五：出涕沱若。', '上九：王用出征。'],
  },
  {
    number: 39,
    name: '蹇',
    upperTrigram: 'kan',
    lowerTrigram: 'gen',
    binary: '010100',
    meaning: {
      general: '利西南，不利東北。利見大人，貞吉。',
      psychology: '行動受阻，需要智慧，尋求幫助。',
      counseling: '建議尋求專業協助，找對方向和方法。',
    },
    lines: ['初六：往蹇來譽。', '六二：王臣蹇蹇。', '九三：往蹇來反。', '六四：往蹇來連。', '九五：大蹇朋來。', '上六：往蹇來碩。'],
  },
  {
    number: 40,
    name: '解',
    upperTrigram: 'zhen',
    lowerTrigram: 'kan',
    binary: '001010',
    meaning: {
      general: '利西南，無所往，其來復吉。',
      psychology: '困難解除，放鬆釋放，恢復平靜。',
      counseling: '適合放鬆型治療，如正念或身體經驗療法。',
    },
    lines: ['初六：無咎。', '九二：田獲三狐。', '六三：負且乘。', '九四：解而拇。', '六五：君子維有解。', '上六：公用射隼。'],
  },
  {
    number: 47,
    name: '困',
    upperTrigram: 'dui',
    lowerTrigram: 'kan',
    binary: '011010',
    meaning: {
      general: '亨，貞，大人吉，無咎。',
      psychology: '困境考驗，堅持信念，等待轉機。',
      counseling: '處於困難期，建議尋求專業諮商支持。',
    },
    lines: ['初六：臀困于株木。', '九二：困于酒食。', '六三：困于石。', '九四：來徐徐。', '九五：劓刖。', '上六：困于葛藟。'],
  },
  {
    number: 48,
    name: '井',
    upperTrigram: 'kan',
    lowerTrigram: 'xun',
    binary: '010110',
    meaning: {
      general: '改邑不改井，無喪無得。',
      psychology: '深層資源，滋養生命，持續探索。',
      counseling: '適合深層探索型治療，如精神分析或 EMDR。',
    },
    lines: ['初六：井泥不食。', '九二：井谷射鮒。', '九三：井渫不食。', '六四：井甃無咎。', '九五：井洌寒泉食。', '上六：井收勿幕。'],
  },
  {
    number: 51,
    name: '震',
    upperTrigram: 'zhen',
    lowerTrigram: 'zhen',
    binary: '001001',
    meaning: {
      general: '亨。震來虩虩，笑言啞啞。',
      psychology: '震撼覺醒，突破改變，釋放能量。',
      counseling: '適合能量釋放型治療，如 TRE 或 SE。',
    },
    lines: ['初九：震來虩虩。', '六二：震來厲。', '六三：震蘇蘇。', '九四：震遂泥。', '六五：震往來厲。', '上六：震索索。'],
  },
  {
    number: 52,
    name: '艮',
    upperTrigram: 'gen',
    lowerTrigram: 'gen',
    binary: '100100',
    meaning: {
      general: '艮其背，不獲其身，行其庭，不見其人。',
      psychology: '靜止止息，內觀沉澱，界限分明。',
      counseling: '適合內省型治療，如正念或靜心。',
    },
    lines: ['初六：艮其趾。', '六二：艮其腓。', '九三：艮其限。', '六四：艮其身。', '六五：艮其輔。', '上九：敦艮吉。'],
  },
  {
    number: 58,
    name: '兌',
    upperTrigram: 'dui',
    lowerTrigram: 'dui',
    binary: '011011',
    meaning: {
      general: '亨，利貞。',
      psychology: '喜悅交流，溝通表達，分享快樂。',
      counseling: '適合表達型治療，如藝術治療或音樂治療。',
    },
    lines: ['初九：和兌吉。', '九二：孚兌吉。', '六三：來兌凶。', '九四：商兌未寧。', '九五：孚于剝。', '上六：引兌。'],
  },
  {
    number: 61,
    name: '中孚',
    upperTrigram: 'xun',
    lowerTrigram: 'dui',
    binary: '110011',
    meaning: {
      general: '豚魚吉，利涉大川，利貞。',
      psychology: '誠信感通，內外一致，真實表達。',
      counseling: '適合真實性取向治療，如人本或薩提爾。',
    },
    lines: ['初九：虞吉。', '九二：鳴鶴在陰。', '六三：得敵。', '六四：月幾望。', '九五：有孚攣如。', '上九：翰音登于天。'],
  },
  {
    number: 62,
    name: '小過',
    upperTrigram: 'zhen',
    lowerTrigram: 'gen',
    binary: '001100',
    meaning: {
      general: '亨，利貞，可小事，不可大事。',
      psychology: '謹慎過度，細節取向，避免冒進。',
      counseling: '適合漸進式治療，逐步調整。',
    },
    lines: ['初六：飛鳥以凶。', '六二：過其祖。', '九三：弗過防之。', '九四：無咎。', '六五：密雲不雨。', '上六：弗遇過之。'],
  },
  {
    number: 63,
    name: '既濟',
    upperTrigram: 'kan',
    lowerTrigram: 'li',
    binary: '010101',
    meaning: {
      general: '亨小，利貞，初吉終亂。',
      psychology: '完成階段，需要維持，防止退步。',
      counseling: '諮商可能接近階段性目標，注意維持成效。',
    },
    lines: ['初九：曳其輪。', '六二：婦喪其茀。', '九三：高宗伐鬼方。', '六四：繻有衣袽。', '九五：東鄰殺牛。', '上六：濡其首。'],
  },
  {
    number: 64,
    name: '未濟',
    upperTrigram: 'li',
    lowerTrigram: 'kan',
    binary: '101010',
    meaning: {
      general: '亨，小狐汔濟，濡其尾，無攸利。',
      psychology: '尚未完成，繼續努力，需要耐心。',
      counseling: '諮商仍在進行中，需要持續投入。',
    },
    lines: ['初六：濡其尾。', '九二：曳其輪。', '六三：未濟征凶。', '九四：貞吉悔亡。', '六五：貞吉無悔。', '上九：有孚于飲酒。'],
  },
];

export function getHexagramByBinary(binary: string): Hexagram | undefined {
  return HEXAGRAMS.find(h => h.binary === binary);
}

export function getHexagramByName(name: string): Hexagram | undefined {
  return HEXAGRAMS.find(h => h.name === name);
}

export function getHexagramByNumber(num: number): Hexagram | undefined {
  return HEXAGRAMS.find(h => h.number === num);
}

export function binaryToLines(binary: string): boolean[] {
  return binary.split('').map(c => c === '1');
}

export function linesToBinary(lines: boolean[]): string {
  return lines.map(l => l ? '1' : '0').join('');
}

export function getChangedHexagram(binary: string, changingPositions: number[]): string {
  const lines = binaryToLines(binary);
  changingPositions.forEach(pos => {
    lines[5 - pos] = !lines[5 - pos];
  });
  return linesToBinary(lines);
}

export const DIFFICULT_HEXAGRAMS = ['屯', '坎', '困', '蹇', '明夷', '訟'];
export const FAVORABLE_HEXAGRAMS = ['泰', '頤', '益', '晉', '鼎'];
