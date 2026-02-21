# CounselingNow 雲端 APP 設計計畫

## 專案概述

**目標**：開發一個雲端 Web APP，透過五行八字四柱、紫微斗數、易經、塔羅等傳統命理工具，幫助使用者判斷：
1. 現在是否適合諮商
2. 適合哪種取向的諮商

**目標使用者**：一般大眾（自我探索）+ 心理諮商師（輔助了解個案）

**技術方案**：方案 A - 純前端 Web App

---

## 技術棧

| 層級 | 技術選擇 | 說明 |
|------|----------|------|
| 框架 | React + TypeScript | Vite 打包 |
| 樣式 | Tailwind CSS | 快速 UI 開發 |
| 狀態 | Zustand | 輕量狀態管理 |
| 紫微斗數 | iztro | 3.3k stars，MIT 授權 |
| 八字四柱 | iztro (含四柱) + 自建五行分析 | |
| 易經 | 自建 64 卦模組（蓍草/銅錢演算法） | 完整版 |
| 塔羅 | Tarot Card API | 網路 API |
| 部署 | Vercel / GitHub Pages | 免費 HTTPS |

---

## 開源方案盤點

### 紫微斗數
- **iztro** (3.3k stars) - 最佳選擇
  - GitHub: https://github.com/SylarLong/iztro
  - JavaScript/TypeScript，MIT 授權
  - 支援多語言、鏈式調用、完整 12 宮資料
  - 可取得四柱、運限、四化等

### 八字四柱
- **CrystalMarch/bazi** (Python)
  - 八字計算引擎 + 五行分析
  - 可分析五行平衡、缺失元素
- iztro 已內含四柱計算功能

### 易經
- **YJChars** (Python) - 64卦 Unicode 生成參考
- 本專案自建完整蓍草/銅錢占卜演算法

### 塔羅
- **Tarot Card API** (Node.js)
  - RESTful API，符合 OpenAPI 3 規範
  - GitHub: https://github.com/nicc/google-tarot (參考)

---

## 專案結構

```
CounselingNow/
├── src/
│   ├── modules/
│   │   ├── ziwei/           # 紫微斗數模組
│   │   │   ├── index.ts
│   │   │   ├── astrolabe.ts
│   │   │   └── palace-analyzer.ts
│   │   ├── bazi/            # 八字四柱模組
│   │   │   ├── index.ts
│   │   │   ├── calculator.ts
│   │   │   └── wuxing-analyzer.ts
│   │   ├── iching/          # 易經模組
│   │   │   ├── index.ts
│   │   │   ├── hexagrams.ts     # 64卦資料
│   │   │   ├── yarrow.ts        # 蓍草演算法
│   │   │   └── coins.ts         # 銅錢演算法
│   │   └── tarot/           # 塔羅模組
│   │       ├── index.ts
│   │       ├── api.ts           # Tarot Card API 整合
│   │       └── spreads.ts       # 牌陣定義
│   ├── analysis/
│   │   ├── timing/          # 諮商時機判斷
│   │   │   ├── index.ts
│   │   │   └── factors.ts
│   │   ├── orientation/     # 諮商取向匹配
│   │   │   ├── index.ts
│   │   │   └── matcher.ts
│   │   └── rules/           # 規則引擎
│   │       ├── wuxing-rules.ts
│   │       └── ziwei-rules.ts
│   ├── data/
│   │   ├── wuxing-therapy.ts    # 五行-諮商對應
│   │   ├── iching-64.ts         # 64卦完整資料
│   │   └── tarot-cards.ts       # 塔羅牌義
│   ├── components/
│   │   ├── InputForm/
│   │   ├── TimingResult/
│   │   ├── WuxingChart/
│   │   ├── TherapyRecommendation/
│   │   └── Layout/
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Analysis.tsx
│   │   └── Result.tsx
│   ├── store/
│   │   └── useStore.ts
│   ├── utils/
│   │   ├── date.ts
│   │   └── calculation.ts
│   ├── App.tsx
│   └── main.tsx
├── docs/
│   └── plans/
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## 核心功能模組

### 一、五行-諮商取向對應規則庫

來源參考：李政洋身心診所（https://www.leepsyclinic.com/2025/06/blog-post.html）

#### 木（成長、疏通、運動、彈性、調節）

| 治療取向 | 英文名稱 | 適用狀況 | 說明 |
|----------|----------|----------|------|
| 身體經驗創傷療法 | Somatic Experiencing (SE) | PTSD、身體化症狀、凍結反應 | 聚焦能量釋放與身體調節，象徵肝木之疏通 |
| TRE 創傷釋放運動 | Trauma Releasing Exercises | 壓力累積、慢性緊繃、創傷後遺 | 透過身體震動釋放壓力，具生命能動性 |
| SMART 感官律動調節 | Sensory Motor Arousal Regulation | 解離、過度喚醒、感覺調節障礙 | 感官統合與律動，對應風中之木的感知與整合力 |
| 遊戲治療 | Play Therapy | 兒童情緒困擾、行為問題、發展遲緩 | 聚焦兒童發展、創造與探索，具木之生發性 |
| 內在家庭系統治療 | Internal Family Systems (IFS) | 內在衝突、自我批評、解離、創傷 | 動態協調內在人格，象徵多面枝幹的整合 |

#### 火（情緒、轉化、創造、象徵、意義）

| 治療取向 | 英文名稱 | 適用狀況 | 說明 |
|----------|----------|----------|------|
| 榮格心理學 | Jungian Psychology | 意義探索、中年危機、夢境工作 | 象徵與神話探索，精神與意識的個體化 |
| 藝術治療 | Art Therapy | 情緒表達困難、創傷、悲傷、自我探索 | 情感的創造性表達，火之表現與靈感象徵 |
| 敘事治療 | Narrative Therapy | 身份認同、主流論述壓迫、創傷敘事 | 詮釋語言與故事轉化意義，火象心靈重塑 |
| 情緒焦點治療 | EFT | 伴侶衝突、依附創傷、情感疏離 | 強調情緒的體會與溝通修復，具火的熱能與連結 |

#### 水（情緒、潛意識、流動、覺察、依附）

| 治療取向 | 英文名稱 | 適用狀況 | 說明 |
|----------|----------|----------|------|
| EMDR | Eye Movement Desensitization | PTSD、創傷記憶、恐慌、焦慮 | 情緒與記憶的加工與整合，深層情感處理 |
| 音樂治療 | Music Therapy | 情緒調節、失語症、自閉症、失智症 | 節奏與共鳴引導情緒流動，對應水之振動 |
| 精神分析取向 | Psychoanalysis | 長期困擾、重複模式、關係困難 | 潛意識探索與夢的詮釋，水象深層心理 |
| 出生與出生前心理學 | Pre/Perinatal Psychology | 早期創傷、出生創傷、依附問題 | 胎內經驗與早期依附，象徵羊水與原始情緒 |
| 正念治療 | Mindfulness Therapy | 焦慮、憂鬱、壓力、情緒調節 | 對情緒與當下的接納與流動，屬柔水之靜 |
| 催眠治療 | Hypnotherapy | 恐懼症、戒癮、疼痛管理、創傷 | 進入深層意識狀態，水的深潛象徵 |

#### 土（穩定、結構、承載、養分、關係）

| 治療取向 | 英文名稱 | 適用狀況 | 說明 |
|----------|----------|----------|------|
| 阿德勒心理學 | Adlerian Psychology | 自卑、生活方向、人際困擾、親職 | 重視社會目標與生活風格，具社會根基之土 |
| 薩提爾成長模式 | Satir Growth Model | 家庭衝突、溝通困難、自我價值 | 關注家庭互動與自我成長，土之支持性系統 |
| 基模治療 | Schema Therapy | 人格困擾、長期憂鬱、關係模式 | 重建早期信念結構，土象基礎重塑 |
| 客體關係治療 | Object Relations Therapy | 邊緣人格、依附創傷、關係困難 | 早期依附關係的內化，土之穩定與容納 |
| 沙盤治療 | Sandplay Therapy | 兒童、創傷、表達困難、內在探索 | 可觸的象徵場域，提供安全與承載 |

#### 金（邏輯、結構、分辨、控制、界限）

| 治療取向 | 英文名稱 | 適用狀況 | 說明 |
|----------|----------|----------|------|
| 認知行為治療 | CBT | 焦慮、憂鬱、強迫、恐慌、恐懼症 | 強調邏輯思辨與行為修正，具金之精密 |
| 辯證行為治療 | DBT | 邊緣人格、情緒失控、自傷、衝動 | 明確的結構與技巧訓練，金的紀律性特徵 |
| 心智化取向 | Mentalization-Based | 邊緣人格、關係困難、情緒辨識 | 聚焦於自我與他人的界線與辨識 |
| 焦點解決治療 | SFBT | 短期困擾、生涯抉擇、行動導向 | 目標導向、切中核心，迅速有效，具金的銳利與效率 |

---

### 二、諮商時機判斷邏輯

#### 評分維度

```typescript
interface TimingResult {
  score: number;              // 0-100
  level: '不建議' | '可考慮' | '建議' | '強烈建議';
  factors: TimingFactor[];
  summary: string;
}
```

#### 紫微斗數判斷因子

| 因子 | 條件 | 影響分數 | 說明 |
|------|------|----------|------|
| 福德宮憂鬱星 | 太陰陷、巨門、天機化忌 | +15 | 內心困擾較多 |
| 流年命宮化忌 | 流年命宮有天干化忌 | +20 | 處於人生低谷 |
| 大限運勢低 | 大限宮位不佳 | +15 | 低谷期更需要支持 |
| 三方四正煞星多 | 命宮三方四正煞星 > 3 | +10 | 外在壓力較大 |

#### 八字判斷因子

| 因子 | 條件 | 影響分數 | 說明 |
|------|------|----------|------|
| 五行失衡 | 單一五行 < 10% 或 > 40% | +10~20 | 身心平衡受影響 |
| 流年沖日主 | 流年地支沖日支 | +15 | 今年壓力較大 |
| 日主過弱 | 日主無根、無生扶 | +10 | 抗壓性較低 |
| 缺火（情緒） | 八字無火 | +10 | 情緒表達困難 |

#### 易經判斷因子

| 因子 | 條件 | 影響分數 | 說明 |
|------|------|----------|------|
| 困境卦象 | 坎、困、屯、蹇、明夷 | +10~15 | 處於困境期 |
| 多變爻 | 變爻數 > 3 | +10 | 變動較大 |
| 陰爻過多 | 陰爻 > 4 | +5 | 需要陽氣支持 |

#### 塔羅判斷因子

| 因子 | 條件 | 影響分數 | 說明 |
|------|------|----------|------|
| 壓力牌 | 塔、惡魔、寶劍十、寶劍三 | +10 | 高壓力狀態 |
| 逆位多 | 逆位牌 > 一半 | +5 | 能量阻塞 |

#### 等級判定

| 分數範圍 | 等級 | 說明 |
|----------|------|------|
| 80-100 | 強烈建議 | 目前非常適合尋求諮商 |
| 60-79 | 建議 | 適合開始諮商 |
| 40-59 | 可考慮 | 可以評估是否需要 |
| 0-39 | 不建議 | 目前可能不是最佳時機（但不代表不需要） |

---

### 三、諮商取向匹配引擎

#### 五行強度計算

```typescript
interface ElementScores {
  wood: number;   // 0-100
  fire: number;
  water: number;
  earth: number;
  metal: number;
}
```

計算來源：
1. **八字**：天干地支五行分布
2. **紫微**：命宮主星五行屬性
3. **季節**：出生季節加權

#### 紫微斗數特質匹配規則

| 治療類型 | 匹配星曜 | 加分 | 說明 |
|----------|----------|------|------|
| CBT/DBT | 天府、武曲 | +15 | 結構化思考特質 |
| 藝術/榮格 | 廉貞、貪狼、紅鸞、天姚 | +15 | 創意與象徵特質 |
| 精神分析/EMDR/催眠 | 太陰、天機、天梁（福德宮） | +15 | 深層探索特質 |
| SE/TRE/SMART | 天相、天府、天機（命宮） | +10 | 身心協調特質 |
| 家族/薩提爾 | 天同、天梁（子女/夫妻宮活躍） | +10 | 關係導向 |

#### 八字特質匹配規則

| 治療類型 | 匹配條件 | 加分 | 說明 |
|----------|----------|------|------|
| CBT/DBT | 土金旺 | +15 | 邏輯結構特質 |
| 藝術/榮格 | 火旺 | +15 | 創造表達特質 |
| 精神分析/EMDR | 水旺 | +15 | 深層流動特質 |
| SE/TRE | 木旺 | +15 | 疏通成長特質 |
| 家族/沙盤 | 土旺 | +15 | 穩定承載特質 |

---

### 四、易經模組設計

#### 蓍草演算法（傳統）

1. 取 49 根蓍草
2. 分而為二，象兩儀
3. 掛一象三
4. 揲之以四，象四時
5. 歸奇於扐，象閏
6. 重複 3 次得一爻
7. 共 18 變得 6 爻成卦

#### 銅錢演算法（簡化）

1. 使用 3 枚銅錢
2. 擲 6 次，每次得 1 爻
3. 背面數量對應：
   - 0 背（3 字）：老陽 ☱ → 變陰
   - 1 背：少陽 ☰
   - 2 背：少陰 ☱
   - 3 背（0 字）：老陰 ☰ → 變陽

#### 64 卦資料結構

```typescript
interface Hexagram {
  number: number;           // 1-64
  name: string;             // 卦名
  upperTrigram: Trigram;    // 上卦
  lowerTrigram: Trigram;    // 下卦
  binary: string;           // 二進位表示 (如 "111111")
  meaning: {
    general: string;        // 總體含義
    career: string;         // 事業
    relationship: string;   // 關係
    health: string;         // 健康
    psychology: string;     // 心理諮商相關
  };
  lines: Line[];            // 六爻
  changedHexagram?: number; // 變卦編號
}
```

---

### 五、塔羅模組設計

#### Tarot Card API 整合

- Base URL: `https://tarot-api.onrender.com/api/v1`
- 端點：
  - `GET /cards` - 獲取所有牌
  - `GET /cards/search?q={name}` - 搜尋牌
  - `GET /cards/random?n={count}` - 隨機抽牌

#### 牌陣定義

| 牌陣 | 牌數 | 用途 |
|------|------|------|
| 單牌 | 1 | 快速指引 |
| 三牌 | 3 | 過去/現在/未來 |
| 凱爾特十字 | 10 | 深度分析 |

#### 心理狀態判斷

| 牌 | 心理狀態指標 |
|------|----------|
| 塔、惡魔 | 壓力、崩潰 |
| 寶劍三、寶劍十 | 悲傷、痛苦 |
| 月亮 | 迷惘、潛意識活躍 |
| 星星、太陽 | 希望、正向 |
| 節制 | 平衡、調和 |
| 隱士 | 內省、獨處 |

---

## 輸出格式

### 完整結果結構

```typescript
interface CounselingRecommendation {
  userInfo: {
    birthDate: string;
    solarDate: string;
    lunarDate: string;
    zodiac: string;          // 西方星座
    chineseZodiac: string;   // 生肖
    bazi: string;            // 八字
  };

  timing: {
    score: number;
    level: string;
    summary: string;
    factors: TimingFactor[];
  };

  wuxingAnalysis: {
    scores: ElementScores;
    dominant: string;
    deficient: string;
    description: string;
    chart: string;           // SVG 圖表
  };

  recommendations: Array<{
    rank: number;
    therapy: TherapyType;
    score: number;
    reasons: string[];
  }>;

  divinationResults: {
    ziwei?: ZiweiResult;
    iching?: IChingResult;
    tarot?: TarotResult;
  };

  overallAdvice: string;
}
```

### UI 輸出畫面

```
┌─────────────────────────────────────────────────────┐
│  諮商時機評估                              75/100    │
│  ████████████████████████████░░░░░░░░  建議諮商     │
│                                                      │
│  影響因素：                                          │
│  • 流年化忌衝命宮 (+20)                              │
│  • 五行水弱缺火 (+15)                                │
│  • 福德宮太陰陷 (+10)                                │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  您的五行特質                                        │
│                                                      │
│  木 ████████░░ 32%  火 ████░░░░░░ 16%               │
│  水 ████████████ 48% 土 ██████░░░░ 24%              │
│  金 ██████████ 40%                                   │
│                                                      │
│  主導：水（深層、流動、覺察）                        │
│  不足：火（轉化、創造、意義）                        │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  諮商取向推薦 TOP 5                                  │
│                                                      │
│  #1 EMDR 眼動減敏與歷程更新治療         92分        │
│     ████████████████████████████████████████        │
│     ✓ 命盤水氣強，適合深層記憶處理                   │
│     ✓ 福德宮太陰，具情緒流動特質                     │
│                                                      │
│  #2 正念治療                            85分        │
│  ...                                                 │
└─────────────────────────────────────────────────────┘
```

---

## 開發階段規劃

| 階段 | 週次 | 內容 | 產出 | 狀態 |
|------|------|------|------|------|
| **Phase 1** | 1-2 | 專案初始化 + iztro 整合 | 紫微排盤可用 | ⬜ 待開始 |
| **Phase 2** | 2-3 | 八字五行計算 + 五行規則庫 | 五行分析完成 | ⬜ 待開始 |
| **Phase 3** | 3-4 | 諮商時機判斷 + 取向匹配引擎 | 核心邏輯完成 | ⬜ 待開始 |
| **Phase 4** | 4-5 | 易經模組（蓍草/銅錢） + 塔羅模組 | 四術整合 | ⬜ 待開始 |
| **Phase 5** | 5-6 | UI 設計 + 結果頁面 | 可用原型 | ⬜ 待開始 |
| **Phase 6** | 6-7 | 測試 + 優化 + 部署 | 上線 | ⬜ 待開始 |

---

## 參考資源

### 開源專案
- [iztro - 紫微斗數](https://github.com/SylarLong/iztro)
- [CrystalMarch/bazi - 八字計算](https://github.com/CrystalMarch/bazi)
- [Tarot Card API](https://github.com/nicc/google-tarot)

### 專業參考
- [李政洋身心診所 - 八字五行與心理諮商](https://www.leepsyclinic.com/2025/06/blog-post.html)

---

## 版本歷程

| 日期 | 版本 | 說明 |
|------|------|------|
| 2025-02-21 | v1.0 | 初版計畫文件 |

---

## 授權

MIT License
