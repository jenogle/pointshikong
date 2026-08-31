# POINT SHIKONG 報名系統

這是一個純靜態前端 + Supabase 後端的賽事報名系統，可直接由 GitHub 部署到 Vercel。

## 專案結構

- `index.html`：顧客報名前台
- `admin/index.html`：管理後台
- `assets/config.js`：Supabase / LINE / 固定設定
- `assets/api.js`：Supabase API 與登入共用層
- `assets/front.js`：前台邏輯
- `assets/admin.js`：後台邏輯
- `assets/styles.css`：共用 UI
- `point-shikong-logo.png`：網站 Logo / favicon
- `docs/`：部署與維護文件

## 目前功能

前台：場次選擇、台灣手機驗證、LINE 提醒、重複報名阻擋、成功彈窗、24 小時內取消不退款說明。

後台：報名管理、付款管理、日期批次開場、場次營運名單與狀態、積分與歷史紀錄、出賽排行榜、管理員帳戶。

部署前請先閱讀 `docs/DEPLOYMENT.md`。

## 文件
- `docs/DEPLOYMENT.md`：GitHub / Vercel 部署
- `docs/SUPABASE.md`：資料庫與登入依賴
- `docs/TROUBLESHOOTING.md`：常見故障排除
- `docs/CHANGELOG.md`：本次重新打包變更
- `supabase/health_check.sql`：只讀健康檢查 SQL
