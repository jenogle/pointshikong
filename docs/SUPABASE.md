# Supabase 依賴

目前前後台依賴以下資料表：
- `registrations`
- `event_dates`
- `participants`
- `points_history`
- `admin_users`

依賴以下 RPC：
- `is_admin()`：確認目前登入帳號是否為管理員
- `admin_set_participant_points(p_email, p_points, p_note)`：更新積分並寫入歷史
- `admin_list_admins()`：取得管理員清單
- `admin_add_admin_by_email(p_email)`：將既有 Auth 使用者加入管理員
- `admin_remove_admin(p_user_id)`：移除管理員

## 管理員登入流程
1. Supabase Auth Email/Password 登入。
2. 取得 access token。
3. 呼叫 `is_admin()`。
4. 管理員驗證通過後立即顯示後台。
5. 各資料區塊並行載入；任何單一資料表失敗不會阻止登入。

## 安全性
前台只使用 publishable key。管理員資料透過 authenticated JWT + RLS / security definer RPC 控制。不要把 service-role key 放進任何前端檔案。
