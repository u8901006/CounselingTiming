export interface TherapyType {
  id: string;
  name: string;
  enName: string;
  element: 'wood' | 'fire' | 'water' | 'earth' | 'metal';
  keywords: string[];
  suitable: string[];
  description: string;
}

export const ELEMENT_NAMES: Record<string, string> = {
  wood: '木',
  fire: '火',
  water: '水',
  earth: '土',
  metal: '金',
};

export const ELEMENT_TRAITS: Record<string, string> = {
  wood: '成長、疏通、運動、彈性、調節',
  fire: '情緒、轉化、創造、象徵、意義',
  water: '情緒、潛意識、流動、覺察、依附',
  earth: '穩定、結構、承載、養分、關係',
  metal: '邏輯、結構、分辨、控制、界限',
};

export const WUXING_THERAPIES: Record<string, TherapyType[]> = {
  wood: [
    {
      id: 'se',
      name: '身體經驗創傷療法',
      enName: 'Somatic Experiencing (SE)',
      element: 'wood',
      keywords: ['身體調節', '能量釋放', '創傷', '疏通'],
      suitable: ['PTSD', '身體化症狀', '凍結反應', '自律神經失調'],
      description: '聚焦能量釋放與身體調節，象徵肝木之疏通',
    },
    {
      id: 'tre',
      name: 'TRE 創傷釋放運動',
      enName: 'Trauma Releasing Exercises',
      element: 'wood',
      keywords: ['震動', '釋放', '身體', '能動性'],
      suitable: ['壓力累積', '慢性緊繃', '創傷後遺'],
      description: '透過身體震動釋放壓力，具生命能動性',
    },
    {
      id: 'smart',
      name: 'SMART 感官律動調節',
      enName: 'Sensory Motor Arousal Regulation Treatment',
      element: 'wood',
      keywords: ['感官', '律動', '整合', '感知'],
      suitable: ['解離', '過度喚醒', '感覺調節障礙'],
      description: '感官統合與律動，對應風中之木的感知與整合力',
    },
    {
      id: 'play',
      name: '遊戲治療',
      enName: 'Play Therapy',
      element: 'wood',
      keywords: ['兒童', '創造', '探索', '發展'],
      suitable: ['兒童情緒困擾', '行為問題', '發展遲緩', '選擇性緘默'],
      description: '聚焦兒童發展、創造與探索，具木之生發性',
    },
    {
      id: 'ifs',
      name: '內在家庭系統治療',
      enName: 'Internal Family Systems (IFS)',
      element: 'wood',
      keywords: ['內在人格', '協調', '整合', '多重自我'],
      suitable: ['內在衝突', '自我批評', '解離', '創傷'],
      description: '動態協調內在人格，象徵多面枝幹的整合',
    },
  ],

  fire: [
    {
      id: 'jungian',
      name: '榮格心理學',
      enName: 'Jungian Psychology',
      element: 'fire',
      keywords: ['象徵', '神話', '個體化', '陰影'],
      suitable: ['意義探索', '中年危機', '夢境工作', '靈性追尋'],
      description: '象徵與神話探索，精神與意識的個體化',
    },
    {
      id: 'art',
      name: '藝術治療',
      enName: 'Art Therapy',
      element: 'fire',
      keywords: ['創造', '表達', '情感', '視覺'],
      suitable: ['情緒表達困難', '創傷', '悲傷', '自我探索'],
      description: '情感的創造性表達，火之表現與靈感象徵',
    },
    {
      id: 'narrative',
      name: '敘事治療',
      enName: 'Narrative Therapy',
      element: 'fire',
      keywords: ['故事', '詮釋', '意義', '重寫'],
      suitable: ['身份認同', '主流論述壓迫', '創傷敘事'],
      description: '詮釋語言與故事轉化意義，火象心靈重塑',
    },
    {
      id: 'eft',
      name: '情緒焦點治療',
      enName: 'Emotionally Focused Therapy (EFT)',
      element: 'fire',
      keywords: ['情緒', '連結', '依附', '修復'],
      suitable: ['伴侶衝突', '依附創傷', '情感疏離'],
      description: '強調情緒的體會與溝通修復，具火的熱能與連結',
    },
  ],

  water: [
    {
      id: 'emdr',
      name: 'EMDR 眼動減敏與歷程更新',
      enName: 'Eye Movement Desensitization and Reprocessing',
      element: 'water',
      keywords: ['記憶', '加工', '整合', '雙側刺激'],
      suitable: ['PTSD', '創傷記憶', '恐慌', '焦慮'],
      description: '情緒與記憶的加工與整合，深層情感處理',
    },
    {
      id: 'music',
      name: '音樂治療',
      enName: 'Music Therapy',
      element: 'water',
      keywords: ['節奏', '共鳴', '流動', '振動'],
      suitable: ['情緒調節', '失語症', '自閉症', '失智症'],
      description: '節奏與共鳴引導情緒流動，對應水之振動',
    },
    {
      id: 'psychoanalysis',
      name: '精神分析取向',
      enName: 'Psychoanalysis',
      element: 'water',
      keywords: ['潛意識', '夢', '深層', '探索'],
      suitable: ['長期困擾', '重複模式', '關係困難', '自我了解'],
      description: '潛意識探索與夢的詮釋，水象深層心理',
    },
    {
      id: 'ppn',
      name: '出生與出生前心理學',
      enName: 'Pre/Perinatal Psychology',
      element: 'water',
      keywords: ['胎內', '早期', '依附', '原始'],
      suitable: ['早期創傷', '出生創傷', '依附問題'],
      description: '胎內經驗與早期依附，象徵羊水與原始情緒',
    },
    {
      id: 'mindfulness',
      name: '正念治療',
      enName: 'Mindfulness Therapy',
      element: 'water',
      keywords: ['覺察', '當下', '接納', '流動'],
      suitable: ['焦慮', '憂鬱', '壓力', '情緒調節'],
      description: '對情緒與當下的接納與流動，屬柔水之靜',
    },
    {
      id: 'hypnosis',
      name: '催眠治療',
      enName: 'Hypnotherapy',
      element: 'water',
      keywords: ['深層意識', '暗示', '潛意識', '轉化'],
      suitable: ['恐懼症', '戒癮', '疼痛管理', '創傷'],
      description: '進入深層意識狀態，水的深潛象徵',
    },
  ],

  earth: [
    {
      id: 'adler',
      name: '阿德勒心理學',
      enName: 'Adlerian Psychology',
      element: 'earth',
      keywords: ['社會目標', '生活風格', '社群', '根基'],
      suitable: ['自卑', '生活方向', '人際困擾', '親職'],
      description: '重視社會目標與生活風格，具社會根基之土',
    },
    {
      id: 'satir',
      name: '薩提爾成長模式',
      enName: 'Satir Growth Model',
      element: 'earth',
      keywords: ['家庭', '互動', '成長', '支持'],
      suitable: ['家庭衝突', '溝通困難', '自我價值'],
      description: '關注家庭互動與自我成長，土之支持性系統',
    },
    {
      id: 'schema',
      name: '基模治療',
      enName: 'Schema Therapy',
      element: 'earth',
      keywords: ['信念', '結構', '重塑', '早期'],
      suitable: ['人格困擾', '長期憂鬱', '關係模式'],
      description: '重建早期信念結構，土象基礎重塑',
    },
    {
      id: 'object-relations',
      name: '客體關係治療',
      enName: 'Object Relations Therapy',
      element: 'earth',
      keywords: ['依附', '內化', '穩定', '容納'],
      suitable: ['邊緣人格', '依附創傷', '關係困難'],
      description: '早期依附關係的內化，土之穩定與容納',
    },
    {
      id: 'sandplay',
      name: '沙盤治療',
      enName: 'Sandplay Therapy',
      element: 'earth',
      keywords: ['象徵', '場域', '安全', '承載'],
      suitable: ['兒童', '創傷', '表達困難', '內在探索'],
      description: '可觸的象徵場域，提供安全與承載',
    },
  ],

  metal: [
    {
      id: 'cbt',
      name: '認知行為治療',
      enName: 'Cognitive Behavioral Therapy (CBT)',
      element: 'metal',
      keywords: ['邏輯', '思辨', '行為', '修正'],
      suitable: ['焦慮', '憂鬱', '強迫', '恐慌', '恐懼症'],
      description: '強調邏輯思辨與行為修正，具金之精密',
    },
    {
      id: 'dbt',
      name: '辯證行為治療',
      enName: 'Dialectical Behavior Therapy (DBT)',
      element: 'metal',
      keywords: ['結構', '技巧', '紀律', '平衡'],
      suitable: ['邊緣人格', '情緒失控', '自傷', '衝動'],
      description: '明確的結構與技巧訓練，金的紀律性特徵',
    },
    {
      id: 'mentalization',
      name: '心智化取向',
      enName: 'Mentalization-Based Treatment (MBT)',
      element: 'metal',
      keywords: ['界線', '辨識', '理解', '心智'],
      suitable: ['邊緣人格', '關係困難', '情緒辨識'],
      description: '聚焦於自我與他人的界線與辨識',
    },
    {
      id: 'sfbt',
      name: '焦點解決治療',
      enName: 'Solution-Focused Brief Therapy (SFBT)',
      element: 'metal',
      keywords: ['目標', '效率', '核心', '銳利'],
      suitable: ['短期困擾', '生涯抉擇', '行動導向'],
      description: '目標導向、切中核心，迅速有效，具金的銳利與效率',
    },
  ],
};

export function getAllTherapies(): TherapyType[] {
  return Object.values(WUXING_THERAPIES).flat();
}

export function getTherapiesByElement(element: string): TherapyType[] {
  return WUXING_THERAPIES[element] || [];
}

export function getTherapyById(id: string): TherapyType | undefined {
  return getAllTherapies().find(t => t.id === id);
}
