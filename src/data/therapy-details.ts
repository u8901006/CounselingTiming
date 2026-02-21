export interface TherapyDetail {
  id: string
  name: string
  enName: string
  wuxing: 'wood' | 'fire' | 'water' | 'earth' | 'metal'
  description: string
  suitableFor: string[]
  howItWorks: string
  sessionFormat: string
  duration: string
  references: string[]
}

export const therapyDetails: TherapyDetail[] = [
  {
    id: 'se',
    name: '身體經驗創傷療法',
    enName: 'Somatic Experiencing (SE)',
    wuxing: 'wood',
    description: '一種專注於身體感覺的創傷治療方法，透過覺察和釋放儲存在身體中的創傷能量來促進療癒。此療法基於對動物行為的觀察，認為創傷會在神經系統中形成「凍結」的能量，需要透過自然的釋放過程來完成修復。',
    suitableFor: ['PTSD', '身體化症狀', '凍結反應', '慢性疼痛', '焦慮', '自律神經失調'],
    howItWorks: '治療師引導個案注意身體感受，識別並釋放被困住的能量，重建神經系統的調節能力。透過「pendulation」（擺盪）技巧，在安全與不適之間來回，逐步擴展耐受窗口。',
    sessionFormat: '一對一，談話搭配身體覺察練習',
    duration: '每週1-2次，每次50-60分鐘，療程視個人狀況而定，通常需要數月到一年',
    references: ['Peter Levine《喚醒老虎：啟動身體的自我療癒機制》']
  },
  {
    id: 'tre',
    name: 'TRE 創傷釋放運動',
    enName: 'Trauma Releasing Exercises',
    wuxing: 'wood',
    description: '透過特定的身體運動引發自然的震動反應，釋放深層肌肉中的壓力和創傷。這種方法認為所有哺乳類動物都天生具備透過震動來釋放壓力的能力。',
    suitableFor: ['壓力累積', '慢性緊繃', '創傷後遺', '睡眠問題', '慢性疲勞'],
    howItWorks: '執行一系列簡單動作，包括伸展和特定姿勢，引發身體自然的震動機制（神經性震動），釋放深層肌肉張力，重新設定身體的壓力反應模式。',
    sessionFormat: '團體課程或一對一教學',
    duration: '學習後可自行練習，建議每週2-3次，每次15-20分鐘',
    references: ['David Berceli《The Revolutionary Trauma Release Process》']
  },
  {
    id: 'smart',
    name: 'SMART 感官律動調節',
    enName: 'Sensory Motor Arousal Regulation Treatment',
    wuxing: 'wood',
    description: '結合感官統合與身體取向治療的方法，專門設計用於處理複雜創傷和解離症狀。強調透過身體動作和感官經驗來重建神經系統的調節能力。',
    suitableFor: ['解離症狀', '過度喚醒', '感覺調節障礙', '複雜性創傷', '情緒調節困難'],
    howItWorks: '運用感官輸入（如觸覺、前庭覺、本體覺）配合律動動作，幫助神經系統學習新的調節模式，建立安全感和身體界線。',
    sessionFormat: '一對一治療，可能包含躺姿、坐姿和站姿的活動',
    duration: '每週1次，每次60-90分鐘，療程通常持續6-12個月',
    references: ['SMART: A Sensory Motor Approach to Trauma Treatment']
  },
  {
    id: 'play',
    name: '遊戲治療',
    enName: 'Play Therapy',
    wuxing: 'wood',
    description: '以遊戲作為主要溝通媒介的心理治療方法，特別適用於兒童。遊戲是兒童的自然語言，透過遊戲可以表達難以言說的情感和經驗。',
    suitableFor: ['兒童情緒困擾', '行為問題', '發展遲緩', '選擇性緘默', '家庭變故適應', '創傷'],
    howItWorks: '在安全的遊戲環境中，治療師提供各種玩具和素材，讓兒童自由遊戲或進行引導式活動。治療師觀察並回應兒童的遊戲內容，協助其表達情感、解決問題和發展因應能力。',
    sessionFormat: '一對一為主，也可能包含父母參與的家庭遊戲治療',
    duration: '每週1次，每次30-50分鐘，療程視問題嚴重程度而定',
    references: ['Virginia Axline《遊戲治療》', 'Garry Landreth《遊戲治療關係》']
  },
  {
    id: 'ifs',
    name: '內在家庭系統治療',
    enName: 'Internal Family Systems (IFS)',
    wuxing: 'wood',
    description: '將人格視為由多個「部分」組成的內在系統，每個部分都有其正向意圖。治療目標是協助「自我」（Self）領導內在系統，達到內在和諧。',
    suitableFor: ['內在衝突', '自我批評', '解離', '創傷', '飲食障礙', '強迫行為'],
    howItWorks: '治療師協助個案辨識並了解不同內在部分（如保護者、放逐者），建立與這些部分的關係，最終由「自我」整合和領導整個內在系統。',
    sessionFormat: '一對一談話治療，引導個案進入內在探索',
    duration: '每週1次，每次50-60分鐘，療程通常需要6個月至數年',
    references: ['Richard Schwartz《No Bad Parts》', 'Jay Earley《Self-Therapy》']
  },
  {
    id: 'jungian',
    name: '榮格心理學',
    enName: 'Jungian Psychology',
    wuxing: 'fire',
    description: '由卡爾·榮格發展的深度心理學，強調集體潛意識、原型和個體化過程。探索夢境、象徵和神話，協助個體實現心理的完整與平衡。',
    suitableFor: ['意義探索', '中年危機', '夢境工作', '靈性追尋', '創造力阻滯', '身份認同'],
    howItWorks: '透過夢境分析、積極想像和象徵探索，連結意識與潛意識。治療師協助個案理解原型的影響，走向個體化——實現真正的自我。',
    sessionFormat: '一對一深度對話，通常包含夢境分析',
    duration: '每週1-2次，每次50分鐘，傳統上為長期治療（數年）',
    references: ['Carl Jung《紅書》', 'Murray Stein《榮格心靈地圖》', '馮·法蘭茲《童話解析》']
  },
  {
    id: 'art',
    name: '藝術治療',
    enName: 'Art Therapy',
    wuxing: 'fire',
    description: '運用視覺藝術創作作為治療媒介的心理治療方法。透過繪畫、雕塑、拼貼等形式，表達和處理難以言說的情感和經驗。',
    suitableFor: ['情緒表達困難', '創傷', '悲傷', '自我探索', '壓力調適', '慢性疾病適應'],
    howItWorks: '在安全、不評價的環境中進行藝術創作，治療師引導個案探索作品中的象徵意義，促進情感表達、自我理解和問題解決。',
    sessionFormat: '一對一或團體，包含創作和對話時間',
    duration: '每週1次，每次60-90分鐘，療程長短視需求而定',
    references: ['Judith Rubin《藝術治療》', 'Cathy Malchiodi《藝術治療手冊》']
  },
  {
    id: 'narrative',
    name: '敘事治療',
    enName: 'Narrative Therapy',
    wuxing: 'fire',
    description: '將問題視為與人分離的存在，透過重新敘說生命故事來創造新的可能性。強調語言和故事對身份認同的塑造力量。',
    suitableFor: ['身份認同困擾', '主流論述壓迫', '創傷敘事', '家庭問題', '自我價值低落'],
    howItWorks: '治療師協助個案「外化」問題，尋找生命中的「閃亮時刻」，重寫被問題故事所淹沒的替代故事，開創新的生命可能性。',
    sessionFormat: '一對一談話，或伴侶/家庭形式',
    duration: '每週1次，每次50-60分鐘，可以是短期或長期',
    references: ['Michael White《敘事治療地圖》', 'Alice Morgan《什麼是敘事治療？》']
  },
  {
    id: 'eft',
    name: '情緒焦點治療',
    enName: 'Emotionally Focused Therapy (EFT)',
    wuxing: 'fire',
    description: '以依附理論為基礎，專注於情緒經驗和人際連結的治療方法。特別在伴侶治療中效果顯著，幫助建立安全的情感連結。',
    suitableFor: ['伴侶衝突', '依附創傷', '情感疏離', '關係修復', '家庭關係困難'],
    howItWorks: '識別負面互動循環，探索底層的情緒需求，協助個案表達脆弱情感，建立安全的依附連結。伴侶EFT通常分為三階段九步驟。',
    sessionFormat: '伴侶或個人形式，每次治療聚焦於情緒經驗',
    duration: '伴侶EFT通常為8-20次，每週1次，每次75-90分鐘',
    references: ['Sue Johnson《抱緊我》', 'Sue Johnson《Emotionally Focused Couple Therapy with Trauma Survivors》']
  },
  {
    id: 'emdr',
    name: 'EMDR 眼動減敏與歷程更新',
    enName: 'Eye Movement Desensitization and Reprocessing',
    wuxing: 'water',
    description: '一種經過實證研究支持的創傷治療方法，透過雙側刺激（如眼動）協助大腦重新處理困擾的記憶，減輕情緒痛苦。',
    suitableFor: ['PTSD', '創傷記憶', '恐慌症', '焦慮症', '恐懼症', '複雜悲傷'],
    howItWorks: '遵循八階段標準程序，在回想困擾記憶的同時進行雙側刺激（眼動、觸碰或聲音），促進大腦的適應性訊息處理，使記憶不再引發強烈情緒反應。',
    sessionFormat: '一對一治療，標準化程序',
    duration: '單一創傷事件可能6-12次，複雜創傷可能需要更長時間',
    references: ['Francine Shapiro《EMDR: 革命性創傷治療》']
  },
  {
    id: 'music',
    name: '音樂治療',
    enName: 'Music Therapy',
    wuxing: 'water',
    description: '運用音樂及其元素（節奏、旋律、和聲）作為治療媒介的方法。音樂的非語言特性使其能觸及深層情感，適用於各年齡層和診斷。',
    suitableFor: ['情緒調節困難', '失語症', '自閉症譜系', '失智症', '慢性疼痛', '安寧療護'],
    howItWorks: '透過聆聽、即興創作、歌唱或音樂活動，促進情感表達、人際互動、認知功能和生理調節。治療師根據個案需求設計音樂介入。',
    sessionFormat: '一對一或團體，可能包含樂器演奏、歌唱或聆聽',
    duration: '每週1-2次，每次30-60分鐘，療程長短視目標而定',
    references: ['Kenneth Bruscia《音樂治療定義》', '台灣音樂治療學會']
  },
  {
    id: 'psychoanalysis',
    name: '精神分析取向',
    enName: 'Psychoanalysis',
    wuxing: 'water',
    description: '由佛洛伊德創立，探索潛意識對行為和情感影響的深度心理治療。透過自由聯想、夢境解析和移情分析來理解心理動力。',
    suitableFor: ['長期心理困擾', '重複行為模式', '關係困難', '自我了解需求', '人格困擾'],
    howItWorks: '在躺椅上進行自由聯想，分析師協助探索潛意識衝突、防衛機制和早期經驗的影響。移情關係是重要的治療工具。',
    sessionFormat: '傳統躺椅式或面對面，高頻率治療',
    duration: '傳統上每週3-5次，持續數年；現代精神分析可能每週1-2次',
    references: ['Sigmund Freud《夢的解析》', 'Nancy McWilliams《精神分析診斷》']
  },
  {
    id: 'ppn',
    name: '出生與出生前心理學',
    enName: 'Pre/Perinatal Psychology',
    wuxing: 'water',
    description: '探索從受孕、胎兒期、出生過程到早期嬰兒階段的經驗如何影響一生。認為這些早期經驗形成潛意識的基模。',
    suitableFor: ['早期創傷', '出生創傷', '依附問題', '莫名恐懼', '重複模式', '難以解釋的焦慮'],
    howItWorks: '透過特定的引導和身體工作，探索可能殘存的早期記憶和印記。治療師協助個案重新經驗和整合這些早期經驗。',
    sessionFormat: '一對一深度探索，可能包含身體覺察',
    duration: '每週1次，每次60-90分鐘，療程通常較長',
    references: ['Thomas Verny《胎兒的秘密生活》', 'William Emerson']
  },
  {
    id: 'mindfulness',
    name: '正念治療',
    enName: 'Mindfulness Therapy',
    wuxing: 'water',
    description: '源自佛教禪修傳統，結合現代心理學的治療方法。培養對當下經驗的非評價性覺察，促進情緒調節和心理彈性。',
    suitableFor: ['焦慮症', '憂鬱症', '壓力管理', '情緒調節困難', '慢性疼痛', '強迫症'],
    howItWorks: '透過正式和 informal 的正念練習（如呼吸覺察、身體掃描），訓練將注意力帶回當下，培養對想法和情緒的接納態度。',
    sessionFormat: '團體課程（如MBSR、MBCT）或一對一整合治療',
    duration: 'MBSR標準課程8週，每週2.5小時；一對一治療則依需求',
    references: ['Jon Kabat-Zinn《正念療癒力》', 'Mark Williams《正念：八週靜心計畫》']
  },
  {
    id: 'hypnosis',
    name: '催眠治療',
    enName: 'Hypnotherapy',
    wuxing: 'water',
    description: '運用催眠狀態（一種專注且放鬆的意識狀態）來進行治療的方法。在催眠狀態下，個案更容易接受正向暗示和探索潛意識。',
    suitableFor: ['恐懼症', '戒菸/戒癮', '疼痛管理', '創傷', '焦慮', '睡眠問題'],
    howItWorks: '治療師透過引導進入催眠狀態，運用暗示、年齡回溯或部分工作等技術，促進行為改變、症狀緩解或創傷處理。',
    sessionFormat: '一對一，治療師引導進入催眠狀態',
    duration: '每次60-90分鐘，療程長短視問題而定，可能是1-6次或更長',
    references: ['Michael Yapko《催眠與心理治療》', 'Milton Erickson著作']
  },
  {
    id: 'adler',
    name: '阿德勒心理學',
    enName: 'Adlerian Psychology',
    wuxing: 'earth',
    description: '由阿爾弗雷德·阿德勒創立的個體心理學，強調社會興趣、生活風格和目標導向。認為人是社會性存在，追求歸屬感和意義。',
    suitableFor: ['自卑感', '生活方向困擾', '人際困難', '親職教養', '職涯困惑'],
    howItWorks: '探索早期記憶、家庭星座和生活風格，理解個人的「私人邏輯」。治療師協助個案調整錯誤信念，發展社會興趣和建設性的生活目標。',
    sessionFormat: '一對一談話，或親職諮詢',
    duration: '每週1次，每次50分鐘，可以是短期或長期',
    references: ['Alfred Adler《自卑與超越》', 'Rudolf Dreikurs《孩子：挑戰》']
  },
  {
    id: 'satir',
    name: '薩提爾成長模式',
    enName: 'Satir Growth Model',
    wuxing: 'earth',
    description: '由維吉尼亞·薩提爾發展的家族治療方法，強調自我價值、溝通模式和家庭系統。相信每個人都有成長的內在資源。',
    suitableFor: ['家庭衝突', '溝通困難', '自我價值低落', '家庭系統問題', '情緒表達'],
    howItWorks: '運用家庭雕塑、冰山隱喻和家庭重塑等技術，探索溝通模式和情感表達。提升自我價值感，轉化不健康的家庭規則。',
    sessionFormat: '個人、伴侶或家庭治療，可能包含體驗性活動',
    duration: '每週或隔週1次，每次60-90分鐘，療程長短視情況',
    references: ['維吉尼亞·薩提爾《薩提爾的家族治療模式》', '《新家庭如何塑造人》']
  },
  {
    id: 'schema',
    name: '基模治療',
    enName: 'Schema Therapy',
    wuxing: 'earth',
    description: '由傑弗里·楊發展，整合認知、行為、情感和人際元素的治療方法。識別並改變早期適應不良基模（深層信念模式）。',
    suitableFor: ['人格困擾', '長期憂鬱', '重複關係模式', '慢性心理問題', '邊緣人格'],
    howItWorks: '識別18種早期適應不良基模（如被遺棄、缺陷、失敗等），運用基模對話、空椅法等技術改變這些根深蒂固的模式。',
    sessionFormat: '一對一治療，包含認知、情感和行為介入',
    duration: '每週1次，每次50-60分鐘，通常為長期治療（1-3年）',
    references: ['Jeffrey Young《基模治療》', 'Wendy Behary《Disarming the Narcissist》']
  },
  {
    id: 'object-relations',
    name: '客體關係治療',
    enName: 'Object Relations Therapy',
    wuxing: 'earth',
    description: '精神分析的一個分支，專注於早期依附關係如何內化形成「內在客體」，影響人際關係模式和自我概念。',
    suitableFor: ['邊緣人格', '依附創傷', '關係困難', '分離焦慮', '自戀問題'],
    howItWorks: '探索早期關係經驗如何形成內在客體表徵，分析治療關係中的移情現象，重建較健康的內在客體關係。',
    sessionFormat: '一對一深度心理治療',
    duration: '每週1-2次，每次45-50分鐘，通常為長期治療',
    references: ['Otto Kernberg著作', 'D.W. Winnicott著作', 'Nancy McWilliams']
  },
  {
    id: 'sandplay',
    name: '沙盤治療',
    enName: 'Sandplay Therapy',
    wuxing: 'earth',
    description: '由多拉·卡夫發展的非語言治療方法，在裝有沙子的盤中擺放各種沙具，創造三維圖像來表達內在世界。',
    suitableFor: ['兒童', '創傷', '表達困難', '內在探索', '選擇性緘默', '發展問題'],
    howItWorks: '在「自由且受保護的空間」中，個案於沙盤中創造場景，以非語言方式表達潛意識內容。治療師作為見證者，陪伴療癒過程。',
    sessionFormat: '一對一，標準沙盤尺寸（57×72×7cm）',
    duration: '每週1次，每次45-50分鐘，療程可能持續數月至數年',
    references: ['Dora Kalff《沙遊：心靈的自我療癒》', 'Ruth Ammann《沙遊治療》']
  },
  {
    id: 'cbt',
    name: '認知行為治療',
    enName: 'Cognitive Behavioral Therapy (CBT)',
    wuxing: 'metal',
    description: '結合認知和行為技巧的結構化心理治療方法。認為想法、情緒和行為相互影響，透過改變負面思考模式來改善情緒和行為。',
    suitableFor: ['焦慮症', '憂鬱症', '強迫症', '恐慌症', '恐懼症', '飲食障礙', '睡眠問題'],
    howItWorks: '識別自動化負面思考，檢驗其真實性，發展較平衡的替代想法。搭配行為實驗、暴露練習等行為技術。治療結構化、目標導向。',
    sessionFormat: '一對一結構化會談，通常有家庭作業',
    duration: '每週1次，每次50分鐘，通常8-20次（視問題而定）',
    references: ['Judith Beck《認知治療》', 'David Burns《好心情手冊》']
  },
  {
    id: 'dbt',
    name: '辯證行為治療',
    enName: 'Dialectical Behavior Therapy (DBT)',
    wuxing: 'metal',
    description: '由瑪莎·林納漢發展，專門針對情緒調節困難和邊緣人格障礙的治療方法。結合認知行為技巧與接納哲學。',
    suitableFor: ['邊緣人格障礙', '情緒失控', '自傷行為', '衝動行為', '自殺意念'],
    howItWorks: '標準DBT包含個別治療、技巧訓練團體、電話諮詢和治療師團隊。四大技巧模組：正念、人際效能、情緒調節、痛苦耐受。',
    sessionFormat: '標準DBT包含每週個別治療+每週技巧團體',
    duration: '標準DBT為一年課程，每週2次（個別+團體）',
    references: ['Marsha Linehan《DBT技巧訓練手冊》']
  },
  {
    id: 'mentalization',
    name: '心智化取向',
    enName: 'Mentalization-Based Treatment (MBT)',
    wuxing: 'metal',
    description: '專注於發展「心智化」能力——理解自己和他人心智狀態（想法、感受、意圖）的能力。對邊緣人格特別有效。',
    suitableFor: ['邊緣人格障礙', '關係困難', '情緒辨識困難', '衝動行為'],
    howItWorks: '在安全的治療關係中練習心智化：辨識和標記情緒，理解行為背後的心理狀態，區分自己和他人。治療師保持「心智化立場」。',
    sessionFormat: '可為個別或團體，或兩者結合',
    duration: '標準MBT為12-18個月，每週1-2次',
    references: ['Jon G. Allen《Mentalizing in Clinical Practice》', 'Peter Fonagy著作']
  },
  {
    id: 'sfbt',
    name: '焦點解決治療',
    enName: 'Solution-Focused Brief Therapy (SFBT)',
    wuxing: 'metal',
    description: '後現代取向的短期治療方法，聚焦於解決方案而非問題。相信個案擁有解決問題的資源和能力。',
    suitableFor: ['短期困擾', '生涯抉擇', '行動導向需求', '學校適應', '生活轉變'],
    howItWorks: '運用奇蹟問句、評量問句、例外問句等技術，探索期望的未來和現有的資源。強調個案的成功經驗和優勢。',
    sessionFormat: '一對一談話，目標導向',
    duration: '短期治療，通常3-10次，每週1次',
    references: ['Steve de Shazer《焦點解決諮商》', 'Insoo Kim Berg《焦點解決訪談》']
  }
]

export function getTherapyById(id: string): TherapyDetail | undefined {
  return therapyDetails.find(t => t.id === id)
}

export function getTherapiesByWuxing(wuxing: string): TherapyDetail[] {
  return therapyDetails.filter(t => t.wuxing === wuxing)
}
