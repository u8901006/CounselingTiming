# Vercel 部署實作計畫

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 將 CounselingTiming 專案部署至 Vercel，實現 GitHub 連動自動部署

**Architecture:** 純前端 Vite + React 應用，透過 Vercel 匯入 GitHub repo，自動偵測框架並設定建構流程

**Tech Stack:** Vite, React, TypeScript, Vercel

---

### Task 1: 確認專案建構正常

**Files:**
- 驗證: `package.json`

**Step 1: 複製專案到本地（如尚未有程式碼）**

```bash
git clone https://github.com/u8901006/CounselingTiming.git
cd CounselingTiming
```

**Step 2: 安裝依賴**

```bash
npm install
```

**Step 3: 執行建構確認無誤**

```bash
npm run build
```

Expected: 建構成功，產生 `dist` 目錄

---

### Task 2: 在 Vercel 匯入專案

**Step 1: 登入 Vercel**

前往 https://vercel.com/login，使用 GitHub 帳號登入

**Step 2: 匯入新專案**

1. 點擊「Add New...」→「Project」
2. 選擇「Import Git Repository」
3. 找到 `u8901006/CounselingTiming`
4. 點擊「Import」

**Step 3: 確認專案設定**

| 設定項目 | 預期值 |
|----------|--------|
| Framework Preset | Vite |
| Root Directory | `./` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

**Step 4: 開始部署**

點擊「Deploy」按鈕，等待建構完成

Expected: 部署成功，顯示慶祝動畫並提供專案網址

---

### Task 3: 驗證部署結果

**Step 1: 開啟部署網址**

點擊 Vercel 提供的網址（格式：`https://counseling-timing.vercel.app` 或類似）

**Step 2: 確認功能正常**

- [ ] 頁面正常載入
- [ ] 紫微斗數分析功能可用
- [ ] 語言切換正常
- [ ] 無 Console 錯誤

---

### Task 4: 設定自動部署

**Step 1: 確認 Git 整合**

在 Vercel 專案設定 → Git，確認：
- Connected to GitHub: `u8901006/CounselingTiming`
- Production Branch: `main`

**Step 2: 測試自動部署**

1. 對專案做一個小改動（如更新 README）
2. Push 到 main 分支
3. 確認 Vercel 自動觸發新部署

```bash
git add .
git commit -m "chore: test auto deploy"
git push origin main
```

Expected: Vercel Dashboard 顯示新部署進行中

---

### Task 5: 完成確認

**Checklist:**
- [ ] 專案已部署至 Vercel
- [ ] 可透過 vercel.app 網址存取
- [ ] Push 到 main 會自動部署
- [ ] PR 會產生預覽網址

---

## 後續選用設定

### 自訂網域（選用）

1. Vercel 專案設定 → Domains
2. 新增自訂網域
3. 在 DNS 設定 CNAME 指向 `cname.vercel-dns.com`

### 環境變數（如需）

1. Vercel 專案設定 → Environment Variables
2. 新增需要的變數
3. 重新部署
