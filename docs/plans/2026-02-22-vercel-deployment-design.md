# CounselingTiming Vercel 部署設計

## 概述

將 CounselingTiming（命理諮商分析工具）部署至 Vercel，採用 GitHub 連動實現自動化部署。

## 專案背景

- **技術棧**：Vite + React + TypeScript
- **特性**：純前端應用，無後端需求
- **資料儲存**：localStorage
- **Repo**：https://github.com/u8901006/CounselingTiming

## 部署架構

```
GitHub (main branch)
        │
        ▼
    Vercel (自動觸發)
        │
        ▼
    CDN 全球分發
        │
        ▼
    https://[project].vercel.app
```

## 部署方案

**採用：Vercel + GitHub 連動**

### 優點
- Push 至 main 自動部署
- PR 自動產生預覽網址
- 免費 SSL 憑證
- 全球 CDN 加速
- 零設定（Vercel 自動偵測 Vite）

### 設定

| 項目 | 值 |
|------|-----|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Node.js Version | 18.x（預設） |

## 部署流程

1. 登入 Vercel，選擇「Import Project」
2. 連接 GitHub，選擇 `u8901006/CounselingTiming`
3. 確認 Vite 自動偵測設定
4. 點擊「Deploy」
5. 等待構建完成，取得網址

## 後續維護

- **更新部署**：push 到 main 即可
- **預覽變更**：開 PR 後自動產生預覽網址
- **自訂網域**：可在 Vercel 設定中新增

## 不使用的資源

- Supabase：本專案為純前端，無需後端服務
