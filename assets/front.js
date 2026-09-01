import { LINE_URL, PORTAL_URL, EVENT_TIME_LABEL, DEFAULT_FEE } from './config.js';
import { request } from './api.js';

const $ = id => document.getElementById(id);
document.body.classList.add('front-page');
let afterModalClose = null;

function showModal(title, text, { lineLink = false, afterClose = null } = {}) {
  $('modalTitle').textContent = title;
  $('modalText').textContent = text;
  $('modalLink').href = LINE_URL;
  $('modalLink').style.display = lineLink ? 'inline-block' : 'none';
  afterModalClose = afterClose;
  $('modal').classList.add('show');
}
function closeModal() {
  $('modal').classList.remove('show');
  const cb = afterModalClose; afterModalClose = null;
  if (cb) setTimeout(cb, 100);
}
$('modalClose').addEventListener('click', closeModal);
$('modal').addEventListener('click', e => { if (e.target === $('modal')) closeModal(); });

$('app').innerHTML = `<div class="wrap">
<header class="top"><div class="brand"><img src="/point-shikong-logo.png" alt="POINT SHIKONG"><span>POINT SHIKONG<br>BEYBLADE EVENT</span></div><div class="arena-kicker">RANKED BATTLE / POINT RACE</div></header>
<section class="hero"><div class="battle-grid" aria-hidden="true"></div><div class="hero-copy"><div class="arena-kicker hero-kicker">POINT SHIKONG // BATTLE SYSTEM</div><h1>陀螺戰爭・爭奪積分</h1><p>Email 會作為你的參賽帳號，報名請固定同一個 Email，積分與參賽紀錄才會累積。</p></div><div class="quick"><div>開賽時間<b>21:30</b></div><div>報到時間<b>21:00–21:30</b></div><div class="hot">單場報名費<b>NT$200</b></div></div></section>
<section class="notice"><h2>賽事說明</h2><p>參賽者記得加入 <a href="${LINE_URL}" target="_blank" rel="noopener">官方 Line 帳號 @054wqmoa ↗</a>，以獲得最新訊息。</p><p>賽事相關活動訊息依失控事務所官方管道發布為準。保有修改活動之權利。</p><p>比賽地點：<a href="https://www.google.com/maps?daddr=243%E6%96%B0%E5%8C%97%E5%B8%82%E6%B3%B0%E5%B1%B1%E5%8D%80%E4%BB%81%E6%84%9B%E8%B7%AF76%E8%99%9F" target="_blank" rel="noopener">失控事務所（新北市泰山區仁愛路76號）↗</a></p><p>此次比賽為 8 或 16 人開賽。名額有限，額滿為止。</p><div class="rule">重要規則：比賽報到前 24 小時內取消，恕不退款。</div></section>
<section class="section"><div class="title"><b>01</b><h2>選擇場次</h2></div><div class="layout"><main class="card"><form id="form"><div id="dates" class="dates">載入場次中…</div><input type="hidden" id="eventDate" name="event_date"><input type="hidden" id="eventFee" name="registration_fee" value="200">
<div class="section"><div class="title"><b>02</b><h2>參賽者資料</h2></div><div class="fields"><div><label>實名 *</label><input name="full_name" required></div><div><label>暱稱 *</label><input name="nickname" required></div><div><label>電話 *</label><input name="phone" inputmode="numeric" maxlength="10" placeholder="09xxxxxxxx" required></div><div><label>Email *</label><input name="email" type="email" required></div></div></div>
<div class="section"><div class="title"><b>03</b><h2>官方 LINE</h2></div><label>是否已加入官方 LINE？ *</label><div class="help">完成表單填寫後，請私訊官方 LINE 告知登記名字並取得匯款資訊。<br>完成匯款並確認款項後，才視為報名成功。</div><div class="choices"><label><input type="radio" name="joined" value="true" required>是</label><label><input type="radio" name="joined" value="false">否</label></div><br><label>是否已傳送訊息至官方 LINE？ *</label><div class="choices"><label><input type="radio" name="messaged" value="true" required>是</label><label><input type="radio" name="messaged" value="false">否</label></div><br><label>其他補充</label><textarea name="note"></textarea></div>
<div class="section"><label class="consent"><input type="checkbox" name="consent" required> 我同意主辦方蒐集、處理及使用本次活動報名所需之個人資料。</label><br><br><button id="submitBtn" class="submit" type="submit">送出報名</button></div></form></main><aside><div class="price">單場報名費<b>NT$200</b></div><a class="side" href="${LINE_URL}" target="_blank"><b>官方 LINE</b></a><a class="side" href="${PORTAL_URL}" target="_blank"><b>神奇傳送門</b></a></aside></div></section></div>`;

document.querySelectorAll('[name=joined]').forEach(r => r.addEventListener('change', () => {
  if (r.checked && r.value === 'false') showModal('請盡速加入官方 LINE', '為避免漏掉賽事通知，請盡速加入官方 LINE 帳號 @054wqmoa。', { lineLink: true });
}));
document.querySelectorAll('[name=messaged]').forEach(r => r.addEventListener('change', () => {
  if (r.checked && r.value === 'false') showModal('請盡速傳送訊息至官方 LINE', '為方便主辦方核對報名與後續聯繫，請盡速傳送訊息至官方 LINE。', { lineLink: true });
}));

async function loadDates() {
  try {
    const dates = await request('/rest/v1/event_dates?select=event_date,registration_fee&is_active=eq.true&order=event_date.asc');
    if (!Array.isArray(dates) || !dates.length) { $('dates').textContent = '目前沒有開放中的場次。'; return; }
    $('dates').innerHTML = dates.map(x => {
      const d = new Date(`${x.event_date}T00:00:00`); const w = ['日','一','二','三','四','五','六'][d.getDay()];
      return `<button type="button" class="date" data-date="${x.event_date}" data-fee="${x.registration_fee}"><b>${d.getMonth()+1}/${d.getDate()}</b><span>星期${w}<br>${EVENT_TIME_LABEL}<br>NT$${x.registration_fee}</span></button>`;
    }).join('');
    document.querySelectorAll('.date').forEach(btn => btn.addEventListener('click', () => {
      document.querySelectorAll('.date').forEach(x => x.classList.remove('active')); btn.classList.add('active');
      $('eventDate').value = btn.dataset.date; $('eventFee').value = btn.dataset.fee;
    }));
  } catch (e) { $('dates').innerHTML = `<div class="section-error">場次載入失敗：${e.message}</div>`; }
}

$('form').addEventListener('submit', async e => {
  e.preventDefault(); const f = new FormData(e.currentTarget); const phone = String(f.get('phone') || '').trim();
  if (!/^09\d{8}$/.test(phone)) return showModal('電話格式不正確', '請輸入正確的電話號碼，以便賽事人員聯絡。');
  if (!$('eventDate').value) return showModal('尚未選擇場次', '請先選擇要報名的場次。');
  const payload = { event_date:f.get('event_date'), registration_fee:Number(f.get('registration_fee')||DEFAULT_FEE), email:String(f.get('email')||'').trim().toLowerCase(), full_name:String(f.get('full_name')||'').trim(), nickname:String(f.get('nickname')||'').trim(), phone, joined_official_line:f.get('joined')==='true', messaged_official_line:f.get('messaged')==='true', consent_personal_data:f.get('consent')==='on', form_data:{extra_note:String(f.get('note')||'').trim()} };
  const btn = $('submitBtn'); btn.disabled = true; btn.textContent = '送出中…';
  try {
    await request('/rest/v1/registrations', { method:'POST', headers:{Prefer:'return=minimal'}, body:JSON.stringify(payload) });
    e.currentTarget.reset(); $('eventDate').value=''; document.querySelectorAll('.date').forEach(x=>x.classList.remove('active'));
    showModal('報名成功！', '主辦方已收到你的報名資料。', { afterClose: payload.messaged_official_line ? null : () => showModal('請盡速傳送訊息至官方 LINE', '你的報名已送出，請盡速傳送訊息至官方 LINE。', {lineLink:true}) });
  } catch (err) {
    if (err.status === 409 || /duplicate|unique/i.test(String(err.message))) showModal('你已報名此場次', '此 Email 已經報名同一天場次，請勿重複送出。若原報名已取消，請聯繫主辦方確認。');
    else showModal('送出失敗', `請稍後再試。${err.message ? `\n${err.message}` : ''}`);
  } finally { btn.disabled = false; btn.textContent = '送出報名'; }
});
loadDates();
