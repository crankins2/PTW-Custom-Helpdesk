const http = require('http');
const { exec } = require('child_process');
const os = require('os');

const PORT = 8765;
const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>IT HELLP DESK v1 – PTW Foundation</title>
<script src="https://alcdn.msauth.net/browser/2.38.0/js/msal-browser.min.js"></script>
<style>
:root{
  --teal:#00a0a0;--teal-d:#007a7a;--teal-l:#e0f5f5;--teal-xl:#f0fafa;
  --sidebar:#1b2b38;--sidebar-hover:#243647;--sidebar-active:#00a0a0;
  --bg:#f4f6f8;--card:#fff;--text:#2d3748;--muted:#718096;
  --border:#e2e8f0;--shadow:0 1px 4px rgba(0,0,0,.08);--shadow-md:0 4px 16px rgba(0,0,0,.1);
  --green:#48bb78;--orange:#ed8936;--red:#f56565;--blue:#4299e1;--purple:#9f7aea;
  --radius:8px;--sidebar-w:220px;
}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--text);font-size:14px;}

/* ── LOGIN ── */
#login-screen{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#0d2137 0%,#1b4f6e 50%,#00a0a0 100%);}
.login-card{background:#fff;border-radius:16px;padding:48px 40px;width:420px;box-shadow:0 20px 60px rgba(0,0,0,.3);text-align:center;}
.login-logo{width:64px;height:64px;background:var(--teal);border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:26px;font-weight:800;color:#fff;letter-spacing:-1px;}
.login-title{font-size:22px;font-weight:700;margin-bottom:4px;}
.login-sub{font-size:13px;color:var(--muted);margin-bottom:32px;}
.ms-sign-btn{width:100%;display:flex;align-items:center;justify-content:center;gap:12px;padding:13px 20px;background:#fff;border:1.5px solid var(--border);border-radius:var(--radius);font-size:15px;font-weight:600;cursor:pointer;transition:all .15s;color:var(--text);}
.ms-sign-btn:hover{border-color:var(--teal);box-shadow:var(--shadow-md);background:var(--teal-xl);}
.ms-icon{width:20px;height:20px;flex-shrink:0;}
.or-line{display:flex;align-items:center;gap:10px;margin:18px 0;color:var(--muted);font-size:12px;}
.or-line::before,.or-line::after{content:'';flex:1;border-top:1px solid var(--border);}
.demo-toggle{font-size:13px;color:var(--teal);cursor:pointer;text-decoration:none;}
.demo-toggle:hover{text-decoration:underline;}
.demo-panel{display:none;margin-top:14px;text-align:left;}
.demo-panel.open{display:block;}
.fw-input{width:100%;border:1.5px solid var(--border);border-radius:var(--radius);padding:10px 13px;font-size:14px;font-family:inherit;color:var(--text);transition:border-color .15s;}
.fw-input:focus{outline:none;border-color:var(--teal);}
.fw-label{display:block;font-size:12px;font-weight:600;color:var(--muted);margin-bottom:5px;text-transform:uppercase;letter-spacing:.4px;}
.login-err{color:var(--red);font-size:12px;margin-top:10px;display:none;}

/* ── BUTTONS ── */
.btn{display:inline-flex;align-items:center;gap:7px;padding:9px 18px;border-radius:var(--radius);font-size:13px;font-weight:600;cursor:pointer;border:none;transition:all .15s;font-family:inherit;}
.btn-teal{background:var(--teal);color:#fff;}.btn-teal:hover{background:var(--teal-d);}
.btn-ghost{background:transparent;color:var(--teal);border:1.5px solid var(--teal);}.btn-ghost:hover{background:var(--teal-l);}
.btn-white{background:#fff;color:var(--text);border:1.5px solid var(--border);}.btn-white:hover{border-color:var(--teal);color:var(--teal);}
.btn-red{background:var(--red);color:#fff;}
.btn-green{background:var(--green);color:#fff;}
.btn-sm{padding:6px 13px;font-size:12px;}
.btn-full{width:100%;justify-content:center;}

/* ── APP SHELL ── */
#app{display:none;min-height:100vh;}
#app.show{display:flex;}

/* Sidebar */
.sidebar{width:var(--sidebar-w);background:var(--sidebar);display:flex;flex-direction:column;flex-shrink:0;min-height:100vh;position:fixed;top:0;left:0;z-index:100;}
.sidebar-logo{padding:20px 18px;display:flex;align-items:center;gap:10px;border-bottom:1px solid rgba(255,255,255,.07);}
.sidebar-logo-icon{width:36px;height:36px;background:var(--teal);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;color:#fff;flex-shrink:0;}
.sidebar-logo-text{color:#fff;font-size:13.5px;font-weight:700;line-height:1.2;}
.sidebar-logo-sub{color:rgba(255,255,255,.45);font-size:10px;font-weight:400;}
.sidebar-nav{flex:1;padding:12px 0;overflow-y:auto;}
.nav-section{padding:14px 18px 6px;font-size:10px;font-weight:700;color:rgba(255,255,255,.3);text-transform:uppercase;letter-spacing:.8px;}
.nav-item{display:flex;align-items:center;gap:11px;padding:10px 18px;color:rgba(255,255,255,.65);cursor:pointer;transition:all .15s;border-left:3px solid transparent;font-size:13.5px;font-weight:500;}
.nav-item:hover{background:var(--sidebar-hover);color:#fff;}
.nav-item.active{background:rgba(0,160,160,.15);border-left-color:var(--teal);color:#fff;font-weight:600;}
.nav-icon{font-size:16px;width:20px;text-align:center;flex-shrink:0;}
.nav-badge{margin-left:auto;background:var(--teal);color:#fff;font-size:10px;font-weight:700;padding:1px 7px;border-radius:10px;}
.sidebar-footer{padding:14px 18px;border-top:1px solid rgba(255,255,255,.07);}
.sidebar-user{display:flex;align-items:center;gap:10px;}
.sidebar-avatar{width:34px;height:34px;border-radius:50%;background:var(--teal);display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:700;flex-shrink:0;}
.sidebar-user-info{flex:1;min-width:0;}
.sidebar-user-name{color:#fff;font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.sidebar-user-role{color:rgba(255,255,255,.4);font-size:11px;}
.sidebar-signout{color:rgba(255,255,255,.4);cursor:pointer;font-size:13px;padding:4px;border-radius:4px;background:none;border:none;}
.sidebar-signout:hover{color:#fff;}

/* Main */
.main-wrap{margin-left:var(--sidebar-w);flex:1;display:flex;flex-direction:column;min-height:100vh;}
.topbar{background:#fff;border-bottom:1px solid var(--border);padding:0 28px;height:58px;display:flex;align-items:center;gap:14px;position:sticky;top:0;z-index:50;}
.topbar-title{font-size:18px;font-weight:700;color:var(--text);}
.topbar-search{flex:1;max-width:380px;display:flex;align-items:center;gap:8px;background:var(--bg);border:1.5px solid var(--border);border-radius:var(--radius);padding:7px 13px;}
.topbar-search input{border:none;background:none;outline:none;font-size:13px;flex:1;font-family:inherit;color:var(--text);}
.topbar-actions{margin-left:auto;display:flex;gap:8px;align-items:center;}
.topbar-notif{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:17px;color:var(--muted);background:var(--bg);border:1.5px solid var(--border);position:relative;}
.notif-dot{position:absolute;top:6px;right:7px;width:7px;height:7px;background:var(--red);border-radius:50%;}
.topbar-av{width:36px;height:36px;border-radius:50%;background:var(--teal);display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:700;cursor:pointer;}

/* Content */
.content{padding:28px;flex:1;}

/* ── DASHBOARD ── */
.kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px;}
.kpi-card{background:#fff;border-radius:var(--radius);padding:20px;box-shadow:var(--shadow);display:flex;align-items:center;gap:16px;}
.kpi-icon{width:50px;height:50px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;}
.kpi-val{font-size:28px;font-weight:800;line-height:1;}
.kpi-lbl{font-size:12px;color:var(--muted);margin-top:3px;}
.kpi-trend{font-size:11px;margin-top:4px;font-weight:600;}

.dash-grid{display:grid;grid-template-columns:2fr 1fr;gap:20px;}
.fw-card{background:#fff;border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;}
.fw-card-head{padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;}
.fw-card-title{font-size:14px;font-weight:700;}
.fw-card-body{padding:0;}

/* ── TICKET TABLE ── */
.ticket-table{width:100%;border-collapse:collapse;}
.ticket-table th{background:#fafbfc;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;padding:10px 16px;border-bottom:1px solid var(--border);text-align:left;white-space:nowrap;}
.ticket-table td{padding:13px 16px;border-bottom:1px solid var(--border);font-size:13px;vertical-align:middle;}
.ticket-table tr:last-child td{border-bottom:none;}
.ticket-row{cursor:pointer;transition:background .1s;}
.ticket-row:hover td{background:var(--teal-xl);}
.priority-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.p-high{background:var(--red);}
.p-medium{background:var(--orange);}
.p-low{background:var(--green);}
.ticket-subject{font-weight:600;color:var(--text);max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.ticket-id{font-size:11px;color:var(--muted);margin-top:2px;}

/* ── BADGES ── */
.badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap;}
.b-open{background:#ebf8ff;color:#2b6cb0;}
.b-pending{background:#fffbeb;color:#92400e;}
.b-resolved{background:#f0fff4;color:#276749;}
.b-closed{background:#f7fafc;color:#4a5568;}
.b-high{background:#fff5f5;color:#c53030;}
.b-medium{background:#fffaf0;color:#c05621;}
.b-low{background:#f0fff4;color:#276749;}
.b-staff{background:#faf5ff;color:#6b46c1;}
.b-participant{background:#fff7ed;color:#c2410c;}

/* ── INBOX ── */
.inbox-toolbar{padding:14px 20px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--border);background:#fff;flex-wrap:wrap;}
.fw-select{border:1.5px solid var(--border);border-radius:var(--radius);padding:7px 12px;font-size:13px;background:#fff;font-family:inherit;cursor:pointer;color:var(--text);}
.fw-select:focus{outline:none;border-color:var(--teal);}
.search-row{display:flex;align-items:center;gap:8px;background:var(--bg);border:1.5px solid var(--border);border-radius:var(--radius);padding:7px 12px;flex:1;min-width:180px;}
.search-row input{border:none;background:none;outline:none;font-size:13px;flex:1;font-family:inherit;}
.inbox-wrap{background:#fff;border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;}
.inbox-empty{text-align:center;padding:60px;color:var(--muted);}
.inbox-empty-icon{font-size:44px;margin-bottom:12px;}

/* ── TICKET DETAIL SPLIT VIEW ── */
.ticket-detail-wrap{display:grid;grid-template-columns:1fr 300px;gap:20px;}
.ticket-main{background:#fff;border-radius:var(--radius);box-shadow:var(--shadow);}
.ticket-head{padding:20px 24px;border-bottom:1px solid var(--border);}
.ticket-head-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px;}
.ticket-subject-lg{font-size:18px;font-weight:700;}
.ticket-meta-row{display:flex;align-items:center;gap:12px;flex-wrap:wrap;}
.ticket-body{padding:24px;}
.ticket-desc{background:var(--bg);border-radius:var(--radius);padding:16px;font-size:14px;line-height:1.7;margin-bottom:20px;}
.note-list{display:flex;flex-direction:column;gap:10px;margin-bottom:14px;}
.note{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:14px 16px;}
.note.internal{border-left:3px solid var(--teal);}
.note-header{display:flex;align-items:center;gap:8px;margin-bottom:6px;}
.note-av{width:28px;height:28px;border-radius:50%;background:var(--teal);display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:700;flex-shrink:0;}
.note-author{font-size:13px;font-weight:600;}
.note-time{font-size:11px;color:var(--muted);}
.note-type{font-size:10px;background:var(--teal-l);color:var(--teal-d);padding:1px 7px;border-radius:10px;font-weight:700;}
.note-text{font-size:13px;line-height:1.6;color:var(--text);}
.reply-box{border:1.5px solid var(--border);border-radius:var(--radius);overflow:hidden;}
.reply-toolbar{padding:8px 12px;background:var(--bg);border-bottom:1px solid var(--border);font-size:12px;font-weight:600;color:var(--muted);}
.reply-input{width:100%;border:none;padding:12px;font-size:13px;font-family:inherit;resize:none;height:90px;outline:none;color:var(--text);}
.reply-footer{padding:10px 12px;border-top:1px solid var(--border);display:flex;justify-content:flex-end;gap:8px;}

/* Properties panel */
.ticket-props{background:#fff;border-radius:var(--radius);box-shadow:var(--shadow);padding:0;overflow:hidden;}
.props-head{padding:14px 18px;border-bottom:1px solid var(--border);font-size:13px;font-weight:700;}
.prop-row{padding:12px 18px;border-bottom:1px solid var(--border);display:flex;flex-direction:column;gap:4px;}
.prop-row:last-child{border-bottom:none;}
.prop-label{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.4px;}
.prop-val{font-size:13px;}
.prop-select{width:100%;border:1.5px solid var(--border);border-radius:6px;padding:6px 10px;font-size:13px;font-family:inherit;color:var(--text);background:#fff;}
.prop-select:focus{outline:none;border-color:var(--teal);}

/* ── MODAL ── */
.overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:500;align-items:center;justify-content:center;}
.overlay.show{display:flex;}
.fw-modal{background:#fff;width:580px;max-width:95vw;max-height:90vh;display:flex;flex-direction:column;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,.25);}
.fw-modal-head{padding:20px 24px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;}
.fw-modal-title{font-size:17px;font-weight:700;}
.fw-modal-close{background:none;border:none;font-size:20px;cursor:pointer;color:var(--muted);line-height:1;padding:4px 6px;border-radius:4px;}
.fw-modal-close:hover{background:var(--bg);}
.fw-modal-body{padding:22px 24px;overflow-y:auto;flex:1;}
.fw-modal-foot{padding:16px 24px;border-top:1px solid var(--border);display:flex;gap:8px;justify-content:flex-end;}
.field{margin-bottom:16px;}
.field label{display:block;font-size:12px;font-weight:700;color:var(--muted);margin-bottom:6px;text-transform:uppercase;letter-spacing:.4px;}
.field input,.field select,.field textarea{width:100%;border:1.5px solid var(--border);border-radius:var(--radius);padding:9px 12px;font-size:14px;font-family:inherit;color:var(--text);}
.field input:focus,.field select:focus,.field textarea:focus{outline:none;border-color:var(--teal);}

/* ── PAGES ── */
.page-header{margin-bottom:22px;display:flex;align-items:center;justify-content:space-between;}
.page-title{font-size:20px;font-weight:700;}
.page-sub{font-size:13px;color:var(--muted);margin-top:3px;}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
.info-card{background:#fff;border-radius:var(--radius);box-shadow:var(--shadow);padding:20px;}
.info-card-icon{font-size:30px;margin-bottom:10px;}
.info-card-title{font-size:14px;font-weight:700;margin-bottom:6px;}
.info-card-desc{font-size:12px;color:var(--muted);line-height:1.5;}
.alert-item{display:flex;gap:14px;padding:16px;border-radius:var(--radius);margin-bottom:12px;}
.alert-item.info{background:#ebf8ff;border:1px solid #bee3f8;}
.alert-item.warn{background:#fffbeb;border:1px solid #faf089;}
.alert-item.danger{background:#fff5f5;border:1px solid #fed7d7;}
.alert-icon{font-size:20px;flex-shrink:0;}
.alert-title{font-size:13px;font-weight:700;margin-bottom:3px;}
.alert-body{font-size:12px;color:var(--muted);line-height:1.5;}
.faq-item{background:#fff;border-radius:var(--radius);box-shadow:var(--shadow);margin-bottom:10px;overflow:hidden;}
.faq-q{display:flex;align-items:center;justify-content:space-between;padding:15px 18px;cursor:pointer;font-size:14px;font-weight:500;}
.faq-q:hover{background:var(--teal-xl);}
.faq-chevron{color:var(--muted);transition:transform .2s;}
.faq-item.open .faq-chevron{transform:rotate(180deg);}
.faq-a{display:none;padding:0 18px 15px;font-size:13px;color:var(--muted);line-height:1.6;}
.faq-item.open .faq-a{display:block;}
.team-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
.team-card{background:#fff;border-radius:var(--radius);box-shadow:var(--shadow);padding:20px;text-align:center;}
.team-av{width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;color:#fff;margin:0 auto 10px;}
.team-name{font-size:13px;font-weight:700;}
.team-role{font-size:11px;color:var(--muted);margin-top:2px;}
.device-card{background:#fff;border-radius:var(--radius);box-shadow:var(--shadow);padding:20px;}
.device-icon{font-size:32px;margin-bottom:10px;}
.device-name{font-weight:700;font-size:14px;margin-bottom:4px;}
.status-dot{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:5px;}
.doc-row{display:flex;align-items:center;gap:12px;padding:13px 18px;border-bottom:1px solid var(--border);background:#fff;}
.doc-row:last-child{border-bottom:none;}
.doc-icon{font-size:22px;flex-shrink:0;}
.doc-name{font-size:13px;font-weight:600;flex:1;}
.doc-meta{font-size:11px;color:var(--muted);}
.access-denied{text-align:center;padding:80px 40px;}
.access-denied .lock{font-size:56px;margin-bottom:16px;}
.access-denied h2{font-size:22px;font-weight:700;margin-bottom:8px;}
.access-denied p{font-size:14px;color:var(--muted);line-height:1.6;}
</style>
</head>
<body>

<!-- LOGIN -->
<div id="login-screen">
  <div class="login-card">
    <div class="login-logo">IH</div>
    <div class="login-title">IT HELLP DESK v1</div>
    <div class="login-sub">Paving The Way Foundation</div>
    <button class="ms-sign-btn" onclick="signInMicrosoft()">
      <svg class="ms-icon" viewBox="0 0 21 21"><rect x="1" y="1" width="9" height="9" fill="#f25022"/><rect x="11" y="1" width="9" height="9" fill="#7fba00"/><rect x="1" y="11" width="9" height="9" fill="#00a4ef"/><rect x="11" y="11" width="9" height="9" fill="#ffb900"/></svg>
      Sign in with Microsoft
    </button>
    <div class="or-line">or</div>
    <div style="text-align:center"><a class="demo-toggle" onclick="toggleDemo()">Demo / test mode</a></div>
    <div class="demo-panel" id="demo-panel">
      <div style="margin-top:12px" class="field"><label>Email Address</label><input class="fw-input" type="email" id="demo-email" placeholder="you@pavingthewayfd.com"></div>
      <button class="btn btn-teal btn-full" onclick="demoLogin()">Continue →</button>
    </div>
    <div class="login-err" id="login-err"></div>
  </div>
</div>

<!-- APP -->
<div id="app">
  <!-- Sidebar -->
  <div class="sidebar">
    <div class="sidebar-logo">
      <div class="sidebar-logo-icon">IH</div>
      <div><div class="sidebar-logo-text">IT HELLP DESK</div><div class="sidebar-logo-sub">Paving The Way Foundation</div></div>
    </div>
    <div class="sidebar-nav" id="sidebar-nav"></div>
    <div class="sidebar-footer">
      <div class="sidebar-user">
        <div class="sidebar-avatar" id="sb-av">?</div>
        <div class="sidebar-user-info">
          <div class="sidebar-user-name" id="sb-name">—</div>
          <div class="sidebar-user-role" id="sb-role">—</div>
        </div>
        <button class="sidebar-signout" title="Sign Out" onclick="doLogout()">⏻</button>
      </div>
    </div>
  </div>

  <!-- Main -->
  <div class="main-wrap">
    <div class="topbar">
      <div class="topbar-title" id="tb-title">Dashboard</div>
      <div class="topbar-search"><span style="color:var(--muted)">🔍</span><input type="text" placeholder="Search tickets, people…" id="global-search" oninput="onGlobalSearch()"></div>
      <div class="topbar-actions">
        <button class="btn btn-teal" onclick="openNewModal()">+ New Ticket</button>
        <div class="topbar-notif">🔔<div class="notif-dot"></div></div>
        <div class="topbar-av" id="tb-av">?</div>
      </div>
    </div>
    <div class="content" id="content"></div>
  </div>
</div>

<!-- NEW TICKET MODAL -->
<div class="overlay" id="new-modal">
  <div class="fw-modal">
    <div class="fw-modal-head"><div class="fw-modal-title">🎫 New Support Ticket</div><button class="fw-modal-close" onclick="closeNewModal()">✕</button></div>
    <div class="fw-modal-body">
      <div class="field"><label>Subject</label><input type="text" id="nm-subj" placeholder="Briefly describe the issue"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
        <div class="field"><label>Category</label><select id="nm-cat"><option>IT / Technical Issue</option><option>Program Support</option><option>Case Management</option><option>Employment / Job Search</option><option>Benefits / Resources</option><option>Training / Digital Literacy</option><option>Other</option></select></div>
        <div class="field"><label>Priority</label><select id="nm-pri"><option value="Low">🟢 Low</option><option value="Medium" selected>🟡 Medium</option><option value="High">🔴 High</option></select></div>
      </div>
      <div class="field"><label>Description</label><textarea id="nm-desc" style="height:120px;resize:vertical" placeholder="Provide as much detail as possible…"></textarea></div>
      <div class="field"><label>Contact Email (optional)</label><input type="email" id="nm-email" placeholder="your@email.com"></div>
    </div>
    <div class="fw-modal-foot"><button class="btn btn-white" onclick="closeNewModal()">Cancel</button><button class="btn btn-teal" onclick="submitTicket()">Submit Ticket</button></div>
  </div>
</div>

<!-- TICKET DETAIL MODAL -->
<div class="overlay" id="detail-modal">
  <div class="fw-modal" style="width:800px;max-width:96vw">
    <div class="fw-modal-head">
      <div><div class="fw-modal-title" id="dm-subj">—</div><div style="font-size:12px;color:var(--muted);margin-top:3px" id="dm-id"></div></div>
      <button class="fw-modal-close" onclick="closeDetail()">✕</button>
    </div>
    <div class="fw-modal-body" style="padding:0">
      <div style="display:grid;grid-template-columns:1fr 260px;min-height:420px">
        <div style="padding:20px 24px;border-right:1px solid var(--border)">
          <div class="ticket-desc" id="dm-desc"></div>
          <div class="note-list" id="dm-notes"></div>
          <div class="reply-box" id="dm-reply-box">
            <div class="reply-toolbar">📝 Internal Note</div>
            <textarea class="reply-input" id="dm-note-input" placeholder="Add an internal note visible only to your team…"></textarea>
            <div class="reply-footer"><button class="btn btn-white btn-sm" onclick="closeDetail()">Cancel</button><button class="btn btn-teal btn-sm" onclick="addNote()">Add Note</button></div>
          </div>
        </div>
        <div style="padding:16px;display:flex;flex-direction:column;gap:14px" id="dm-props"></div>
      </div>
    </div>
  </div>
</div>

<script>
// ══════ CONFIG ══════
const CONFIG = {
  MICROSOFT_CLIENT_ID: '10c1e961-81a8-4140-96bc-f3b94f4a5a85',
  MICROSOFT_TENANT_ID: 'common',
  ADMIN_EMAILS: [
    'corey@pavingthewayfd.com',
    'cvheru@pavingthewayfd.com',
    'janie@pavingthewayfd.com',
  ],
};

// ══════ STATE ══════
let user = null, currentPage = 'dashboard', activeTicket = null, nextId = 1007;
const AGENTS = ['Corey Rankins','Marcus Johnson','Aisha Patel','Keisha Thomas','Destiny Williams'];

let tickets = [
  {id:'#1001',subj:'Laptop not connecting to WiFi',cat:'IT / Technical Issue',pri:'High',status:'Open',req:'Maria Gonzalez',rtype:'participant',agent:'Corey Rankins',created:'Jun 25',updated:'Jun 27',desc:'My laptop keeps dropping the WiFi connection every 10 minutes. This is affecting my ability to complete the online training modules.',notes:[{author:'Corey Rankins',time:'Jun 26 · 9:14am',text:'Reached out to participant. Scheduling in-person visit and driver update.',internal:true}],email:'maria.g@example.com'},
  {id:'#1002',subj:'Need help updating resume',cat:'Employment / Job Search',pri:'Medium',status:'Pending',req:'James Carter',rtype:'participant',agent:'Unassigned',created:'Jun 26',updated:'Jun 26',desc:'I need assistance reformatting my resume for the construction sector.',notes:[],email:'james.c@example.com'},
  {id:'#1003',subj:'Printer not working in Room 2B',cat:'IT / Technical Issue',pri:'Low',status:'Resolved',req:'Keisha Thomas',rtype:'staff',agent:'Corey Rankins',created:'Jun 24',updated:'Jun 25',desc:'Shared printer in Room 2B queue is stuck.',notes:[{author:'Corey Rankins',time:'Jun 25 · 2:00pm',text:'Cleared queue and reinstalled driver. Tested OK.',internal:true}],email:''},
  {id:'#1004',subj:'Participant missing from Airtable',cat:'Case Management',pri:'High',status:'Open',req:'Destiny Williams',rtype:'staff',agent:'Unassigned',created:'Jun 28',updated:'Jun 28',desc:'New participant completed intake June 27th but record not appearing in Airtable.',notes:[],email:'destiny.w@pavingthewayfd.com'},
  {id:'#1005',subj:'Training module not loading',cat:'Training / Digital Literacy',pri:'Medium',status:'Pending',req:'Anthony Bell',rtype:'participant',agent:'Corey Rankins',created:'Jun 27',updated:'Jun 28',desc:'Module 3 video shows spinning circle in both Chrome and Edge.',notes:[{author:'Corey Rankins',time:'Jun 28 · 10:30am',text:'CDN rate limiting confirmed. Reuploading to backup server. Will notify participant.',internal:true}],email:''},
  {id:'#1006',subj:'Need bus pass for training',cat:'Benefits / Resources',pri:'Medium',status:'Open',req:'Latasha Moore',rtype:'participant',agent:'Unassigned',created:'Jun 29',updated:'Jun 29',desc:'Need a bus pass to attend in-person training at the downtown location.',notes:[],email:'latasha.m@example.com'},
];

// ══════ AUTH ══════
function signInMicrosoft() {
  const msal_cfg = { auth:{ clientId:CONFIG.MICROSOFT_CLIENT_ID, authority:'https://login.microsoftonline.com/'+CONFIG.MICROSOFT_TENANT_ID, redirectUri:'http://localhost:8765' }, cache:{cacheLocation:'sessionStorage'} };
  const msalInst = new msal.PublicClientApplication(msal_cfg);
  msalInst.loginPopup({scopes:['User.Read']}).then(r => {
    loginUser(r.account.name||r.account.username, r.account.username);
  }).catch(() => showErr('Sign-in cancelled or failed. Try demo mode.'));
}
function toggleDemo(){ document.getElementById('demo-panel').classList.toggle('open'); }
function demoLogin(){
  const email = document.getElementById('demo-email').value.trim().toLowerCase();
  if(!email||!email.includes('@')){ showErr('Enter a valid email.'); return; }
  const name = email.split('@')[0].replace(/[._]/g,' ').replace(/\\b\\w/g,c=>c.toUpperCase());
  loginUser(name, email);
}
function loginUser(name, email) {
  const isAdmin = CONFIG.ADMIN_EMAILS.map(e=>e.toLowerCase()).includes(email.toLowerCase());
  user = { name, email, isAdmin };
  const ini = name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  document.getElementById('sb-av').textContent = ini;
  document.getElementById('tb-av').textContent = ini;
  document.getElementById('sb-name').textContent = name;
  document.getElementById('sb-role').textContent = isAdmin ? 'Admin' : 'Member';
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app').classList.add('show');
  buildSidebar();
  goto('dashboard');
}
function doLogout(){
  user = null;
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('app').classList.remove('show');
  document.getElementById('demo-panel').classList.remove('open');
  document.getElementById('demo-email').value = '';
  document.getElementById('login-err').style.display = 'none';
}
function showErr(msg){ const e=document.getElementById('login-err'); e.textContent=msg; e.style.display='block'; }

// ══════ SIDEBAR ══════
function buildSidebar() {
  const openCount = tickets.filter(t=>t.status==='Open').length;
  const items = [
    {id:'dashboard', icon:'📊', label:'Dashboard'},
    {id:'inbox', icon:'📥', label:'All Tickets', badge: openCount},
    ...(user.isAdmin ? [{id:'my-tickets', icon:'📌', label:'My Assigned'}] : []),
    {id:'new-ticket', icon:'➕', label:'New Ticket'},
    {section:'Resources'},
    {id:'devices', icon:'💻', label:'Devices'},
    {id:'faqs', icon:'❓', label:'FAQs'},
    {id:'alerts', icon:'🔔', label:'Alerts'},
    {id:'documents', icon:'📁', label:'Documents'},
  ];
  document.getElementById('sidebar-nav').innerHTML = items.map(item => {
    if(item.section) return \`<div class="nav-section">\${item.section}</div>\`;
    return \`<div class="nav-item" id="nav-\${item.id}" onclick="goto('\${item.id}')">
      <span class="nav-icon">\${item.icon}</span>\${item.label}
      \${item.badge ? \`<span class="nav-badge">\${item.badge}</span>\` : ''}
    </div>\`;
  }).join('');
}

function goto(p) {
  if((p==='inbox'||p==='my-tickets') && !user.isAdmin) { renderAccessDenied(); return; }
  currentPage = p;
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const ni = document.getElementById('nav-'+p);
  if(ni) ni.classList.add('active');
  const titles = {dashboard:'Dashboard',inbox:'All Tickets','my-tickets':'My Assigned Tickets','new-ticket':'New Ticket',devices:'Devices & Equipment',faqs:'FAQs',alerts:'Alerts & Known Issues',documents:'Documents'};
  document.getElementById('tb-title').textContent = titles[p]||p;
  const c = document.getElementById('content');
  switch(p) {
    case 'dashboard':   c.innerHTML = renderDashboard(); break;
    case 'inbox':       c.innerHTML = renderInbox(tickets); bindRows(); break;
    case 'my-tickets':  c.innerHTML = renderInbox(tickets.filter(t=>t.agent===user.name.split(' ')[0]+' '+user.name.split(' ').slice(1).join(' '))); bindRows(); break;
    case 'new-ticket':  openNewModal(); goto('dashboard'); break;
    case 'devices':     c.innerHTML = renderDevices(); break;
    case 'faqs':        c.innerHTML = renderFAQs(); break;
    case 'alerts':      c.innerHTML = renderAlerts(); break;
    case 'documents':   c.innerHTML = renderDocuments(); break;
    default: c.innerHTML = '<div style="padding:40px;color:var(--muted)">Coming soon.</div>';
  }
}

function onGlobalSearch() {
  const q = document.getElementById('global-search').value.trim();
  if(!q) return;
  currentPage = 'inbox';
  document.querySelectorAll('.nav-item').forEach(el=>el.classList.remove('active'));
  const ni=document.getElementById('nav-inbox'); if(ni)ni.classList.add('active');
  document.getElementById('tb-title').textContent = \`Search: "\${q}"\`;
  const f = tickets.filter(t=>t.subj.toLowerCase().includes(q.toLowerCase())||t.req.toLowerCase().includes(q.toLowerCase())||t.id.includes(q));
  document.getElementById('content').innerHTML = renderInbox(f);
  bindRows();
}

// ══════ DASHBOARD ══════
function renderDashboard() {
  const open=tickets.filter(t=>t.status==='Open').length;
  const pending=tickets.filter(t=>t.status==='Pending').length;
  const resolved=tickets.filter(t=>t.status==='Resolved').length;
  const unassigned=tickets.filter(t=>t.agent==='Unassigned').length;
  const recent = tickets.slice(0,5);
  const activity = [
    {icon:'🎫',text:'New ticket <b>#1006</b> submitted by Latasha Moore',time:'2m ago'},
    {icon:'✅',text:'Ticket <b>#1003</b> resolved by Corey Rankins',time:'1h ago'},
    {icon:'📝',text:'Note added to <b>#1005</b>',time:'3h ago'},
    {icon:'👤',text:'Ticket <b>#1005</b> assigned to Corey Rankins',time:'Jun 28'},
    {icon:'🎫',text:'New ticket <b>#1004</b> submitted by Destiny Williams',time:'Jun 28'},
  ];
  return \`
  <div class="kpi-grid">
    <div class="kpi-card"><div class="kpi-icon" style="background:#ebf8ff">🎫</div><div><div class="kpi-val" style="color:var(--blue)">\${open}</div><div class="kpi-lbl">Open Tickets</div></div></div>
    <div class="kpi-card"><div class="kpi-icon" style="background:#fffbeb">⏳</div><div><div class="kpi-val" style="color:var(--orange)">\${pending}</div><div class="kpi-lbl">Pending</div></div></div>
    <div class="kpi-card"><div class="kpi-icon" style="background:#f0fff4">✅</div><div><div class="kpi-val" style="color:var(--green)">\${resolved}</div><div class="kpi-lbl">Resolved</div></div></div>
    <div class="kpi-card"><div class="kpi-icon" style="background:#fff5f5">⚠️</div><div><div class="kpi-val" style="color:var(--red)">\${unassigned}</div><div class="kpi-lbl">Unassigned</div></div></div>
  </div>
  <div class="dash-grid">
    <div class="fw-card">
      <div class="fw-card-head"><span class="fw-card-title">Recent Tickets</span>\${user.isAdmin?\`<button class="btn btn-white btn-sm" onclick="goto('inbox')">View All</button>\`:''}</div>
      <table class="ticket-table">\${ticketRows(recent)}</table>
    </div>
    <div class="fw-card">
      <div class="fw-card-head"><span class="fw-card-title">Recent Activity</span></div>
      <div style="padding:4px 0">
        \${activity.map(a=>\`<div style="display:flex;gap:12px;padding:12px 18px;border-bottom:1px solid var(--border);font-size:13px">
          <span style="font-size:16px;flex-shrink:0">\${a.icon}</span>
          <div style="flex:1"><div style="line-height:1.4">\${a.text}</div><div style="font-size:11px;color:var(--muted);margin-top:2px">\${a.time}</div></div>
        </div>\`).join('')}
      </div>
    </div>
  </div>\`;
}

// ══════ INBOX ══════
function renderInbox(list) {
  return \`
  <div class="inbox-wrap">
    <div class="inbox-toolbar">
      <div class="search-row"><span style="color:var(--muted)">🔍</span><input type="text" placeholder="Search tickets…" id="inbox-q" oninput="filterInbox()"></div>
      <select class="fw-select" id="f-status" onchange="filterInbox()"><option value="">All Statuses</option><option>Open</option><option>Pending</option><option>Resolved</option><option>Closed</option></select>
      <select class="fw-select" id="f-pri" onchange="filterInbox()"><option value="">All Priorities</option><option>High</option><option>Medium</option><option>Low</option></select>
      <select class="fw-select" id="f-type" onchange="filterInbox()"><option value="">All Types</option><option value="staff">Staff</option><option value="participant">Participant</option></select>
      <button class="btn btn-teal btn-sm" onclick="openNewModal()">+ New</button>
    </div>
    <div id="inbox-body">
      <table class="ticket-table" style="min-width:700px">
        <thead><tr><th></th><th>Ticket</th><th>Requester</th><th>Category</th><th>Priority</th><th>Status</th><th>Agent</th><th>Updated</th></tr></thead>
        <tbody id="inbox-rows">\${ticketRows(list)}</tbody>
      </table>
    </div>
  </div>\`;
}

function ticketRows(list) {
  if(!list.length) return \`<tr><td colspan="8"><div class="inbox-empty"><div class="inbox-empty-icon">📭</div><p style="color:var(--muted)">No tickets found</p></div></td></tr>\`;
  return list.map(t=>\`
    <tr class="ticket-row" data-id="\${t.id}">
      <td style="padding-left:16px"><div class="priority-dot p-\${t.pri.toLowerCase()}"></div></td>
      <td><div class="ticket-subject">\${t.subj}</div><div class="ticket-id">\${t.id}</div></td>
      <td style="font-size:13px">\${t.req}<br><span class="badge b-\${t.rtype}" style="margin-top:3px">\${t.rtype}</span></td>
      <td style="font-size:12px;color:var(--muted)">\${t.cat}</td>
      <td><span class="badge b-\${t.pri.toLowerCase()}">\${t.pri}</span></td>
      <td><span class="badge \${sbadge(t.status)}">\${t.status}</span></td>
      <td style="font-size:12px;color:var(--muted)">\${t.agent}</td>
      <td style="font-size:12px;color:var(--muted);white-space:nowrap">\${t.updated}</td>
    </tr>\`).join('');
}

function filterInbox() {
  const q=(document.getElementById('inbox-q')?.value||'').toLowerCase();
  const st=document.getElementById('f-status')?.value||'';
  const pr=document.getElementById('f-pri')?.value||'';
  const ty=document.getElementById('f-type')?.value||'';
  const base = currentPage==='my-tickets' ? tickets.filter(t=>t.agent.includes(user.name.split(' ')[0])) : tickets;
  const f=base.filter(t=>
    (!q||t.subj.toLowerCase().includes(q)||t.id.includes(q)||t.req.toLowerCase().includes(q))&&
    (!st||t.status===st)&&(!pr||t.pri===pr)&&(!ty||t.rtype===ty)
  );
  const body=document.getElementById('inbox-rows');
  if(body){body.innerHTML=ticketRows(f);bindRows();}
}

function bindRows(){document.querySelectorAll('.ticket-row').forEach(r=>r.addEventListener('click',()=>openDetail(r.dataset.id)));}

// ══════ TICKET DETAIL ══════
function openDetail(id) {
  const t=tickets.find(x=>x.id===id); if(!t){return;} activeTicket=t;
  document.getElementById('dm-subj').textContent=t.subj;
  document.getElementById('dm-id').textContent=\`\${t.id} · \${t.cat} · Opened \${t.created}\`;
  document.getElementById('dm-desc').textContent=t.desc;
  document.getElementById('dm-note-input').value='';
  document.getElementById('dm-reply-box').style.display=user.isAdmin?'block':'none';

  // Notes
  const nl=document.getElementById('dm-notes');
  nl.innerHTML=t.notes.length?t.notes.map(n=>\`
    <div class="note\${n.internal?' internal':''}">
      <div class="note-header">
        <div class="note-av">\${n.author.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
        <div><div class="note-author">\${n.author}</div><div class="note-time">\${n.time}</div></div>
        \${n.internal?'<span class="note-type">Internal</span>':''}
      </div>
      <div class="note-text">\${n.text}</div>
    </div>\`).join(''):\`<p style="color:var(--muted);font-size:13px">No notes yet.</p>\`;

  // Properties
  document.getElementById('dm-props').innerHTML=\`
    <div><div class="prop-label" style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.4px;margin-bottom:8px">Properties</div>
      \${prop('Status', user.isAdmin
        ? \`<select class="prop-select" onchange="setProp('\${id}','status',this.value)"><option \${t.status==='Open'?'selected':''}>Open</option><option \${t.status==='Pending'?'selected':''}>Pending</option><option \${t.status==='Resolved'?'selected':''}>Resolved</option><option \${t.status==='Closed'?'selected':''}>Closed</option></select>\`
        : \`<span class="badge \${sbadge(t.status)}">\${t.status}</span>\`)}
      \${prop('Priority', user.isAdmin
        ? \`<select class="prop-select" onchange="setProp('\${id}','pri',this.value)"><option \${t.pri==='Low'?'selected':''}>Low</option><option \${t.pri==='Medium'?'selected':''}>Medium</option><option \${t.pri==='High'?'selected':''}>High</option></select>\`
        : \`<span class="badge b-\${t.pri.toLowerCase()}">\${t.pri}</span>\`)}
      \${prop('Agent', user.isAdmin
        ? \`<select class="prop-select" onchange="setProp('\${id}','agent',this.value)"><option value="Unassigned" \${t.agent==='Unassigned'?'selected':''}>Unassigned</option>\${AGENTS.map(a=>\`<option \${t.agent===a?'selected':''}>\${a}</option>\`).join('')}</select>\`
        : t.agent)}
      \${prop('Requester', t.req)}
      \${prop('Type', \`<span class="badge b-\${t.rtype}">\${t.rtype}</span>\`)}
      \${t.email?prop('Email',\`<a href="mailto:\${t.email}" style="color:var(--teal)">\${t.email}</a>\`):''}
      \${prop('Opened', t.created)}
      \${prop('Updated', t.updated)}
    </div>
    \${user.isAdmin && t.status!=='Resolved' && t.status!=='Closed' ? \`<button class="btn btn-green btn-full" onclick="setProp('\${id}','status','Resolved');closeDetail();goto(currentPage)">✅ Mark Resolved</button>\` : ''}
    \${user.isAdmin && t.status!=='Closed' ? \`<button class="btn btn-white btn-full" onclick="setProp('\${id}','status','Closed');closeDetail();goto(currentPage)">🔒 Close Ticket</button>\` : ''}
    <button class="btn btn-white btn-full" onclick="closeDetail()">Close</button>
  \`;
  document.getElementById('detail-modal').classList.add('show');
}

function prop(label,val){return \`<div style="margin-bottom:12px"><div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px">\${label}</div><div style="font-size:13px">\${val}</div></div>\`;}

function setProp(id,key,val){const t=tickets.find(x=>x.id===id);if(t){t[key]=val;t.updated='Today';}}

function addNote(){
  const txt=document.getElementById('dm-note-input').value.trim();
  if(!txt||!activeTicket)return;
  const now=new Date();
  activeTicket.notes.push({author:user.name,time:'Today · '+now.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}),text:txt,internal:true});
  activeTicket.updated='Today';
  openDetail(activeTicket.id);
}
function closeDetail(){document.getElementById('detail-modal').classList.remove('show');activeTicket=null;}

// ══════ NEW TICKET ══════
function openNewModal(){document.getElementById('new-modal').classList.add('show');}
function closeNewModal(){document.getElementById('new-modal').classList.remove('show');}
function submitTicket(){
  const subj=document.getElementById('nm-subj').value.trim(),desc=document.getElementById('nm-desc').value.trim();
  if(!subj||!desc){alert('Please fill in Subject and Description.');return;}
  nextId++;
  tickets.unshift({id:'#'+nextId,subj,cat:document.getElementById('nm-cat').value,pri:document.getElementById('nm-pri').value,status:'Open',req:user.name,rtype:user.isAdmin?'staff':'participant',agent:'Unassigned',created:'Today',updated:'Today',desc,notes:[],email:document.getElementById('nm-email').value||user.email});
  closeNewModal();
  ['nm-subj','nm-desc','nm-email'].forEach(id=>document.getElementById(id).value='');
  toast('🎫 Ticket submitted! Your team will follow up shortly.');
  buildSidebar();
  goto(user.isAdmin?'inbox':'dashboard');
}

// ══════ OTHER PAGES ══════
function renderDevices(){
  const items=[{i:'💻',n:'Laptops',d:'Dell Latitude 5420 · HP EliteBook 840',s:'In stock',c:'var(--green)'},{i:'🖥️',n:'Monitors',d:'24" Dell P2422H',s:'Limited',c:'var(--orange)'},{i:'🖨️',n:'Printers',d:'HP LaserJet · Room 2B & 3A',s:'Operational',c:'var(--green)'},{i:'📱',n:'Mobile Devices',d:'Samsung Galaxy A14',s:'In stock',c:'var(--green)'},{i:'🔌',n:'Accessories',d:'Chargers, keyboards, mice',s:'Available',c:'var(--green)'},{i:'📡',n:'Network / WiFi',d:'PTW-Corp · PTW-Guest',s:'All online',c:'var(--green)'}];
  return \`<div class="page-header"><div><div class="page-title">Devices & Equipment</div><div class="page-sub">Current device inventory and status</div></div><button class="btn btn-teal" onclick="openNewModal()">Request a Device</button></div>
  <div class="grid-3">\${items.map(x=>\`<div class="device-card fw-card" style="padding:20px"><div class="device-icon">\${x.i}</div><div class="device-name">\${x.n}</div><div style="font-size:12px;color:var(--muted);margin-bottom:8px">\${x.d}</div><div style="font-size:12px;font-weight:600"><span class="status-dot" style="background:\${x.c}"></span>\${x.s}</div></div>\`).join('')}</div>\`;
}

function renderAlerts(){
  const items=[
    {type:'warn',i:'⚠️',t:'Training Module 3 — Video Playback Issue',b:'Module 3 videos may not load for some users. Migrating to backup CDN. Expected fix: June 30, 2026.'},
    {type:'danger',i:'🔒',t:'Security Update Required — All Staff Devices',b:'Run Windows Update on all staff devices by July 5, 2026.'},
    {type:'info',i:'📦',t:'New Devices Now Available',b:'Dell Latitude 5420 laptops are in stock. Eligible participants may submit a request.'},
    {type:'info',i:'📋',t:'Return-to-Worksite Policy Update',b:'Updated policies now in effect. Review the latest guidelines in Documents.'},
  ];
  return \`<div class="page-header"><div class="page-title">Alerts & Known Issues</div></div>\${items.map(a=>\`<div class="alert-item \${a.type}"><div class="alert-icon">\${a.i}</div><div><div class="alert-title">\${a.t}</div><div class="alert-body">\${a.b}</div></div></div>\`).join('')}\`;
}

function renderFAQs(){
  const items=[
    ['I\\'m unable to login. Where do I get help?','Submit a ticket or email corey@pavingthewayfd.com for urgent login issues.'],
    ['How do I change my security questions?','Go to account.microsoft.com → Security → Update your security info.'],
    ['How do I connect to the PTW network?','Use the Wi-Fi credentials from onboarding. Lost them? Submit a ticket under "IT / Technical Issue."'],
    ['How do I request a new device?','Navigate to Devices in the sidebar or open a new ticket. Our team responds within 1 business day.'],
    ['My email isn\\'t syncing — what do I do?','Sign out and back into Outlook. If it persists, submit a ticket with your device type and email client.'],
    ['How do I submit a support ticket?','Click "+ New Ticket" in the top bar or sidebar at any time to open the ticket submission form.'],
  ];
  return \`<div class="page-header"><div class="page-title">Frequently Asked Questions</div></div>\${items.map((it,i)=>\`<div class="faq-item" id="faq\${i}"><div class="faq-q" onclick="tfaq(\${i})">\${it[0]}<span class="faq-chevron">▾</span></div><div class="faq-a">\${it[1]}</div></div>\`).join('')}\`;
}
function tfaq(i){const el=document.getElementById('faq'+i);if(el)el.classList.toggle('open');}

function renderDocuments(){
  const docs=[{i:'📄',n:'PTW IT Acceptable Use Policy',d:'Jun 1, 2026',s:'PDF · 2.1 MB'},{i:'📄',n:'Return-to-Worksite Safety Guidelines',d:'May 28, 2026',s:'PDF · 890 KB'},{i:'📊',n:'Device Inventory Q2 2026',d:'Jun 15, 2026',s:'XLSX · 145 KB'},{i:'📄',n:'New Employee IT Onboarding Guide',d:'Apr 10, 2026',s:'PDF · 3.4 MB'},{i:'📊',n:'Helpdesk Ticket Report — May 2026',d:'Jun 3, 2026',s:'PDF · 512 KB'},{i:'📄',n:'Microsoft 365 Quick Reference',d:'Mar 5, 2026',s:'PDF · 1.2 MB'}];
  return \`<div class="page-header"><div class="page-title">Documents</div></div><div class="fw-card">\${docs.map(d=>\`<div class="doc-row"><div class="doc-icon">\${d.i}</div><div class="doc-name">\${d.n}</div><div class="doc-meta">\${d.d} · \${d.s}</div><button class="btn btn-white btn-sm" onclick="alert('Requires SharePoint connection.')">Open</button></div>\`).join('')}</div>\`;
}

function renderAccessDenied(){
  document.getElementById('content').innerHTML=\`<div class="access-denied"><div class="lock">🔒</div><h2>Access Restricted</h2><p>The Tickets section is only available to admins.<br>Contact your IT manager to request access.</p></div>\`;
}

// ══════ HELPERS ══════
function sbadge(s){return{Open:'b-open',Pending:'b-pending',Resolved:'b-resolved',Closed:'b-closed'}[s]||'b-open';}
function toast(msg){const el=document.createElement('div');el.style.cssText='position:fixed;bottom:24px;right:24px;background:#1b2b38;color:#fff;padding:13px 20px;border-radius:10px;font-size:13.5px;font-weight:500;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,.2)';el.textContent=msg;document.body.appendChild(el);setTimeout(()=>el.remove(),3800);}
</script>
</body>
</html>
`;

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8',
    'Access-Control-Allow-Origin': '*'});
  res.end(HTML);
});

server.listen(PORT, '127.0.0.1', () => {
  const url = 'http://localhost:' + PORT;
  const platform = os.platform();
  if (platform === 'win32') exec('start ' + url);
  else if (platform === 'darwin') exec('open ' + url);
  else exec('xdg-open ' + url);
  console.log('PTW Helpdesk running at', url);
  console.log('Press Ctrl+C to stop.');
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log('Port 8765 in use - opening existing instance');
    const { exec } = require('child_process');
    exec('start http://localhost:8765');
  }
});
