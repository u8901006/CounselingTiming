# CounselingNow

透過五行八字、紫微斗數、易經、塔羅分析您的諮商時機與適合的治療取向。

## 功能特色

- 🔮 **多元命理分析**：整合紫微斗數、八字四柱、易經、塔羅四種工具
- ⏰ **諮商時機判斷**：分析目前是否適合開始諮商
- 🎯 **取向匹配推薦**：根據五行特質推薦適合的諮商取向
- 🔒 **隱私保護**：純前端運算，出生資料不上傳伺服器

## 技術棧

- **框架**：React + TypeScript + Vite
- **樣式**：Tailwind CSS
- **狀態管理**：Zustand
- **紫微斗數**：[iztro](https://github.com/SylarLong/iztro)
- **塔羅**：Tarot Card API

## 快速開始

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 建置生產版本
npm run build
```

## 五行-諮商取向對應

### 木（成長、疏通、運動、彈性、調節）
- 身體經驗創傷療法 (SE)
- TRE 創傷釋放運動
- SMART 感官律動調節
- 遊戲治療
- 內在家庭系統治療 (IFS)

### 火（情緒、轉化、創造、象徵、意義）
- 榮格心理學
- 藝術治療
- 敘事治療
- 情緒焦點治療 (EFT)

### 水（情緒、潛意識、流動、覺察、依附）
- EMDR
- 音樂治療
- 精神分析取向
- 出生與出生前心理學
- 正念治療
- 催眠治療

### 土（穩定、結構、承載、養分、關係）
- 阿德勒心理學
- 薩提爾成長模式
- 基模治療
- 客體關係治療
- 沙盤治療

### 金（邏輯、結構、分辨、控制、界限）
- 認知行為治療 (CBT)
- 辯證行為治療 (DBT)
- 心智化取向 (MBT)
- 焦點解決治療 (SFBT)

## 專案結構

```
CounselingNow/
├── src/
│   ├── modules/          # 命理模組
│   │   ├── ziwei/        # 紫微斗數
│   │   ├── bazi/         # 八字四柱
│   │   ├── iching/       # 易經
│   │   └── tarot/        # 塔羅
│   ├── analysis/         # 分析引擎
│   │   ├── timing/       # 諮商時機
│   │   └── orientation/  # 諮商取向
│   ├── data/             # 資料定義
│   ├── components/       # UI 元件
│   └── pages/            # 頁面
├── docs/
│   └── plans/            # 設計文件
└── package.json
```

## 參考資源

- [李政洋身心診所 - 八字五行與心理諮商](https://www.leepsyclinic.com/2025/06/blog-post.html)
- [iztro - 紫微斗數開源庫](https://github.com/SylarLong/iztro)

## 授權

MIT License

---

**免責聲明**：本工具僅供參考，選擇心理諮商服務時，應以院所的專業度、口碑與自身感受為主要考量。
