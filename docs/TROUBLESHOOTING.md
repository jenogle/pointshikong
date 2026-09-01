# 故障排除

## 後台一直停在「驗證中」
新版會顯示 3 個登入階段，且每個 API 請求 10 秒逾時，不會無限等待。若失敗，會直接顯示錯誤文字。

### 常見原因
- Auth 密碼錯誤：會顯示 Supabase 登入錯誤。
- `is_admin()` 回 false：該 Auth 使用者不在 `admin_users`。
- 網路或 Supabase 逾時：10 秒後會顯示「連線逾時」。
- 某資料表 RLS 問題：仍可進入後台，對應分頁會顯示「資料載入失敗」，不會整頁卡死。

## Logo 破圖
直接開：`https://你的網域/point-shikong-logo.png`。
- 200：HTML / 快取問題。
- 404：部署中沒有該檔案，檢查 GitHub commit 與 Vercel Root Directory。

## GitHub 更新後版型倒退
確認 production deployment 的 commit 是你剛 push 的 commit。不要同時從不同測試 project 進行 production deploy。

## 重複報名
資料庫已有同 Email + 同日有效報名限制。若原紀錄狀態為 `cancelled` 才允許重新建立。
