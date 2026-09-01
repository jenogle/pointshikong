-- POINT SHIKONG Supabase 健康檢查（只讀）
select 'admin_users' as item, count(*)::text as value from public.admin_users
union all select 'event_dates', count(*)::text from public.event_dates
union all select 'participants', count(*)::text from public.participants
union all select 'points_history', count(*)::text from public.points_history
union all select 'registrations', count(*)::text from public.registrations;

select routine_name
from information_schema.routines
where specific_schema='public'
  and routine_name in ('is_admin','admin_set_participant_points','admin_list_admins','admin_add_admin_by_email','admin_remove_admin')
order by routine_name;
