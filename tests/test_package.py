from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def read(p):
    return (ROOT / p).read_text(encoding='utf-8')

def test_required_files_exist():
    required = [
        'index.html','admin/index.html','assets/config.js','assets/api.js',
        'assets/front.js','assets/admin.js','assets/styles.css',
        'point-shikong-logo.png','vercel.json','README.md',
        'docs/DEPLOYMENT.md','docs/SUPABASE.md','docs/TROUBLESHOOTING.md'
    ]
    missing = [p for p in required if not (ROOT / p).exists()]
    assert not missing, f'missing: {missing}'

def test_front_has_required_behavior_markers():
    s = read('assets/front.js')
    for marker in ['報名成功', '你已報名此場次', '請輸入正確的電話號碼，以便賽事人員聯絡。', '請盡速加入官方 LINE', '請盡速傳送訊息至官方 LINE']:
        assert marker in s

def test_admin_auth_is_staged_and_timeout_protected():
    api = read('assets/api.js')
    admin = read('assets/admin.js')
    assert 'AbortController' in api
    assert 'DEFAULT_TIMEOUT_MS' in api
    assert "rpc('is_admin'" in admin
    assert '顯示後台' in admin or 'showDashboard' in admin
    assert 'Promise.allSettled' in admin

def test_admin_features_present():
    s = read('assets/admin.js')
    for marker in ['場次營運','出賽次數排行榜','YYYY-MM-DD場次 第1名','積分已儲存','批次新增場次']:
        assert marker in s

def test_logo_uses_root_path():
    for p in ['index.html','admin/index.html']:
        s = read(p)
        assert '/point-shikong-logo.png' in s
