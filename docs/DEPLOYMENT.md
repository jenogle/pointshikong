# 部署說明

## GitHub
將整個資料夾內容放到 `jenogle/pointshikong` 的 repo 根目錄。不要只上傳 HTML；`assets/`、`admin/`、Logo 都必須一起 commit。

根目錄應至少包含：

```text
index.html
admin/index.html
assets/
point-shikong-logo.png
vercel.json
README.md
docs/
```

## Vercel
1. Project 使用 `pointshikong`。
2. Git Repository 綁定 `jenogle/pointshikong`。
3. Framework Preset 可使用 `Other` / 無框架。
4. Root Directory 保持 repo 根目錄（`.` / 空白），不要指到 `admin` 或 `assets`。
5. 不需要 Build Command。
6. 不需要 Output Directory。

部署後檢查：
- `/` 前台可開啟
- `/admin/` 後台可開啟
- `/point-shikong-logo.png` 應回 200 並直接顯示圖片
- `/assets/admin.js` 與 `/assets/front.js` 可直接開啟

若 Logo 404，代表 PNG 沒有進入該次 commit 或 Vercel Root Directory 設錯。
