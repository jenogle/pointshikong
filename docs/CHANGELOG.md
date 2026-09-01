# 本次重新打包重點

- 前後台完全拆開，不再用 pathname 判斷共用同一份 HTML。
- 共用 Supabase API 封裝抽到 `assets/api.js`。
- 所有 API 請求都有 10 秒 timeout。
- 後台登入分成 Auth → `is_admin()` → 顯示 Dashboard 三階段。
- 驗證管理員成功後先顯示後台，再用 `Promise.allSettled` 分批載入資料；單一資料表出錯不會讓整個後台卡死。
- 前台保留 LINE 選否提醒、台灣手機格式、同 Email 同日重複報名提示、成功彈窗。
- Logo 固定使用根目錄 `/point-shikong-logo.png`。
- 補上部署、Supabase、故障排除文件與只讀健康檢查 SQL。
