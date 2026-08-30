# pointshikong registration

Supabase project: pointshikong
Project ref: bzgqlykqaqzolymnctkz

Routes:
- / : customer registration form
- /admin : admin dashboard

Database tables:
- public.registrations
- public.admin_users

Security:
- anonymous users can only INSERT registrations
- only authenticated users listed in admin_users can read/update/delete registrations
- RLS is enabled

First admin bootstrap Edge Function:
- bootstrap-admin
- setup code: PSK-8F3K7Q

The React/Vite source is included. Set up hosting on Vercel/Netlify/Cloudflare Pages, then use the Supabase project URL and publishable key already configured in src/main.jsx.
