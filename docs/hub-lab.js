/* ============================================================
   POWERVERSE hub-lab.js — playground power-ups (P1/P2)
   ------------------------------------------------------------
   • Formula history + favorites (localStorage)
   • Paste-your-own-data (JSON/CSV → ClearCollect via real engine)
   • Export results (Markdown / CSV)
   • Formula challenges with shareable results (#ch=N deep links)
   Repo-owned; tag re-injected by scripts/apply-growth-patches.sh
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s) };
  var $$ = function (s, p) { return Array.prototype.slice.call((p || document).querySelectorAll(s)) };

  /* ---------- styling ---------- */
  var st = document.createElement('style');
  st.textContent = [
    '.lab{margin-top:14px;border:1px solid rgba(255,255,255,.1);border-radius:14px;overflow:hidden}',
    '.lab-tabs{display:flex;flex-wrap:wrap;background:rgba(255,255,255,.03);border-bottom:1px solid rgba(255,255,255,.08)}',
    '.lab-tabs button{flex:1;min-width:110px;background:none;border:0;color:inherit;padding:10px 8px;font:600 12px inherit;letter-spacing:.03em;cursor:pointer;opacity:.65}',
    '.lab-tabs button.on{opacity:1;background:rgba(89,212,255,.09);box-shadow:0 -2px 0 var(--c-flow) inset}',
    '.lab-body{padding:12px 14px;max-height:260px;overflow:auto}',
    '.lab-row{display:flex;align-items:center;gap:8px;padding:7px 8px;border-radius:8px;font-size:13px}',
    '.lab-row:hover{background:rgba(255,255,255,.04)}',
    '.lab-row code{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:12px;opacity:.9;cursor:pointer}',
    '.lab-row .lb{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:inherit;border-radius:6px;padding:2px 9px;cursor:pointer;font-size:12px}',
    '.lab-row .lb.star.on{color:#FFD60A;border-color:#FFD60A}',
    '.lab-note{font-size:12px;opacity:.6;padding:8px}',
    '.lab-ch{border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:10px 12px;margin:0 0 8px;font-size:13px}',
    '.lab-ch.done{border-color:rgba(48,209,88,.5);background:rgba(48,209,88,.07)}',
    '.lab-ch h6{margin:0 0 4px;font-size:13px}.lab-ch p{margin:0 0 8px;opacity:.75;font-size:12px}',
    '.lab-ch .lb{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:inherit;border-radius:6px;padding:3px 10px;cursor:pointer;font-size:12px;margin-right:6px}',
    '.lab-ch.active{border-color:var(--c-flow);box-shadow:0 0 0 1px var(--c-flow) inset}',
    '.lab textarea{width:100%;min-height:80px;background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.15);border-radius:8px;color:inherit;font:12px/1.5 ui-monospace,Menlo,monospace;padding:8px;margin:6px 0}',
    '.lab input[type=text]{background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.15);border-radius:8px;color:inherit;padding:6px 10px;font-size:12px;width:140px}',
    '.lab .go{background:var(--c-flow);border:0;color:#04121a;border-radius:8px;padding:7px 16px;font:700 12px inherit;cursor:pointer}'
  ].join('\n');
  document.head.appendChild(st);

  /* ---------- toast (reuse hub-plus element if present) ---------- */
  var toastEl = document.querySelector('.hp-toast');
  if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'hp-toast'; document.body.appendChild(toastEl); }
  var toastT;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('on') }, 2200) }
  function copy(t) { var p = (typeof window.copyText === 'function') ? window.copyText(t) : navigator.clipboard.writeText(t); return Promise.resolve(p) }

  var LS = {
    get: function (k, d) { try { return JSON.parse(localStorage.getItem('pv:' + k)) || d } catch (e) { return d } },
    set: function (k, v) { try { localStorage.setItem('pv:' + k, JSON.stringify(v)) } catch (e) { } }
  };

  /* ================= HISTORY + FAVORITES ================= */
  var hist = LS.get('hist', []);
  function saveHist() { LS.set('hist', hist.slice(0, 30)) }
  function pushHist(code) {
    code = code.trim();
    if (!code || (hist[0] && hist[0].c === code)) return;
    var old = hist.filter(function (h) { return h.c === code })[0];
    hist = hist.filter(function (h) { return h.c !== code });
    hist.unshift({ c: code, t: Date.now(), fav: old ? !!old.fav : false });
    saveHist();
    if (labTab === 'hist' || labTab === 'fav') renderLab();
  }

  function histRow(h) {
    var row = document.createElement('div');
    row.className = 'lab-row';
    row.innerHTML = '<code title="' + h.c.replace(/"/g, '&quot;') + '">' + h.c.replace(/</g, '&lt;') + '</code>'
      + '<button class="lb load">↩ load</button>'
      + '<button class="lb star' + (h.fav ? ' on' : '') + '">' + (h.fav ? '★' : '☆') + '</button>'
      + '<button class="lb del">✕</button>';
    row.querySelector('.load').addEventListener('click', function () { loadCode(h.c) });
    row.querySelector('code').addEventListener('click', function () { loadCode(h.c) });
    row.querySelector('.star').addEventListener('click', function () { h.fav = !h.fav; saveHist(); renderLab() });
    row.querySelector('.del').addEventListener('click', function () { hist = hist.filter(function (x) { return x !== h }); saveHist(); renderLab() });
    return row;
  }

  function loadCode(code) {
    var ta = $('#pgCode');
    if (!ta) return;
    var fxBtn = $$('.pg-tab').filter(function (b) { return b.dataset.tab === 'fx' })[0];
    if (fxBtn && !fxBtn.classList.contains('on')) fxBtn.click();
    ta.value = code;
    if (typeof window.renderEditor === 'function') window.renderEditor();
    $('#playground').scrollIntoView({ behavior: 'smooth' });
    toast('Formula loaded ↩');
  }

  /* watch output — a finished successful run records history + checks challenges */
  function watchOutput() {
    var out = $('#pgOut');
    if (!out) return;
    new MutationObserver(function () {
      if (!out.querySelector('.ok') || out.querySelector('.err')) return;
      var ta = $('#pgCode');
      if (ta && ta.value.trim()) pushHist(ta.value);
      checkChallenge(out);
    }).observe(out, { childList: true });
  }

  /* ================= IMPORT YOUR OWN DATA ================= */
  function csvParse(t) {
    var rows = [['']], r = 0, inQ = false;
    for (var i = 0; i < t.length; i++) {
      var ch = t[i];
      if (inQ) { if (ch === '"') { if (t[i + 1] === '"') { rows[r][rows[r].length - 1] += '"'; i++ } else inQ = false } else rows[r][rows[r].length - 1] += ch }
      else if (ch === '"') inQ = true;
      else if (ch === ',') rows[r].push('');
      else if (ch === '\n' || ch === '\r') { if (ch === '\r' && t[i + 1] === '\n') i++; rows.push(['']); r++ }
      else rows[r][rows[r].length - 1] += ch;
    }
    return rows.filter(function (x) { return x.length > 1 || x[0].trim() });
  }
  function colName(s, i) {
    var n = String(s || '').trim().replace(/[^A-Za-z0-9_]/g, '_');
    if (!n || !/^[A-Za-z]/.test(n)) n = 'Col' + (i + 1);
    return n;
  }
  function toVal(s) {
    var v = String(s).trim();
    if (v === '') return 'Blank()';
    if (/^-?\d+(\.\d+)?$/.test(v)) return v;
    if (/^(true|false)$/i.test(v)) return v.toLowerCase();
    return '"' + v.replace(/"/g, '""') + '"';
  }
  function rowsToCollect(name, rows) {
    return 'ClearCollect(' + name + ', [\n  ' + rows.map(function (r) {
      return '{' + r.map(function (p) { return p[0] + ':' + p[1] }).join(', ') + '}';
    }).join(',\n  ') + '\n])';
  }
  function importData() {
    var raw = $('#labDataIn').value.trim();
    var name = colName($('#labDataName').value || 'MyData', 0);
    if (!raw) { toast('Paste JSON or CSV first'); return }
    var rows = [];
    try {
      if (raw[0] === '[') {
        var arr = JSON.parse(raw);
        if (!Array.isArray(arr) || !arr.length) throw new Error('empty');
        rows = arr.slice(0, 50).map(function (o) {
          return Object.keys(o).slice(0, 10).map(function (k, i) { return [colName(k, i), toVal(o[k])] });
        });
      } else {
        var t = csvParse(raw);
        if (t.length < 2) throw new Error('need header + rows');
        var heads = t[0].slice(0, 10).map(colName);
        rows = t.slice(1, 51).map(function (r) { return heads.map(function (h, i) { return [h, toVal(r[i] || '')] }) });
      }
    } catch (e) { toast('Could not parse — need a JSON array of objects or CSV with a header row'); return }
    if (!rows.length) { toast('No rows found'); return }
    LS.set('udata', { name: name, stmt: rowsToCollect(name, rows), rows: rows.length });
    toast(rows.length + ' rows loaded as ' + name + ' ✓ — use it in any formula like Employees/Orders');
    renderLab();
  }
  function clearData() { localStorage.removeItem('pv:udata'); toast('Custom collection removed'); renderLab() }

  /* Wrap the site's fxEval: when a formula mentions the imported collection,
     transparently prepend its ClearCollect so it exists in every run. */
  function patchEngine() {
    if (typeof window.fxEval !== 'function' || window.fxEval.__pvPatched) return;
    var orig = window.fxEval;
    var wrapped = function (src) {
      var ud = LS.get('udata', null);
      if (ud && ud.name && src.indexOf(ud.name) > -1 && src.indexOf('ClearCollect(' + ud.name) === -1) {
        src = ud.stmt + ';\n' + src;
      }
      return orig(src);
    };
    wrapped.__pvPatched = true;
    window.fxEval = wrapped;
  }

  function dataTabHTML(body) {
    var ud = LS.get('udata', null);
    var status = ud
      ? '<div class="lab-note" style="color:#30D158">✓ <b>' + ud.name + '</b> loaded (' + ud.rows + ' rows) — reference it in any formula, e.g. <code>Filter(' + ud.name + ', Score &gt; 80)</code>. <button class="go" id="labDataClear" style="background:#ff453a;color:#fff">🗑 clear</button></div>'
      : '';
    body.innerHTML = status
      + '<div class="lab-note">Paste a <b>JSON array of objects</b> or <b>CSV with a header row</b> (max 50 rows × 10 columns). '
      + 'It becomes a real collection via <code>ClearCollect</code> — query it with Filter, CountIf, Sum… just like Employees. Persists in your browser until cleared.</div>'
      + '<input type="text" id="labDataName" value="MyData" title="Collection name"> '
      + '<button class="go" id="labDataGo">⚡ Load collection</button>'
      + '<textarea id="labDataIn" spellcheck="false" placeholder="Name,City,Score\nAda,London,91\nGrace,Nairobi,88\n— or —\n[{\u0022Name\u0022:\u0022Ada\u0022,\u0022Score\u0022:91}]"></textarea>';
    body.querySelector('#labDataGo').addEventListener('click', importData);
    var clr = body.querySelector('#labDataClear');
    if (clr) clr.addEventListener('click', clearData);
  }

  /* ================= CHALLENGES ================= */
  var CH = [
    { t: 'Warm-up: shout it', q: 'Make the text contoso ALL CAPS using a Text function.', x: 'Upper("contoso")', expect: '"CONTOSO"' },
    { t: 'Count the IT team', q: 'How many employees work in the IT department?', x: 'CountIf(Employees, Department = "IT")', expect: '20' },
    { t: 'Order book size', q: 'How many rows are in the Orders table?', x: 'CountRows(Orders)', expect: '100' },
    { t: 'Critical only', q: 'How many orders have Critical priority?', x: 'CountIf(Orders, Priority = "Critical")', expect: '22' },
    { t: 'Average salary', q: 'What is the average employee Salary, rounded to a whole number?', x: 'Round(Average(Employees, Salary), 0)', expect: '97540' },
    { t: 'Who is employee 42?', q: 'Return the full name (First Last) of the employee with Id 42.', x: 'Concatenate(LookUp(Employees, Id = 42).FirstName, " ", LookUp(Employees, Id = 42).LastName)', expect: '"Felix Berg"' },
    { t: 'Hardware revenue', q: 'Total Amount of all orders in the Hardware category.', x: 'Sum(Filter(Orders, Category = "Hardware"), Amount)', expect: '445440' },
    { t: 'The veteran', q: 'Which City does the earliest-joined employee live in?', x: 'First(SortByColumns(Employees, "Joined", SortOrder.Ascending)).City', expect: '"New York"' }
  ];
  var solved = LS.get('ch', []);
  var activeCh = -1;

  function checkChallenge(out) {
    if (activeCh < 0 || solved.indexOf(activeCh) > -1) return;
    var oks = out.querySelectorAll('.ok');
    if (!oks.length) return;
    var got = oks[oks.length - 1].textContent.trim();
    if (got === CH[activeCh].expect) {
      solved.push(activeCh); LS.set('ch', solved);
      toast('🏆 Challenge solved: ' + CH[activeCh].t + ' (' + solved.length + '/' + CH.length + ')');
      if (labTab === 'ch') renderLab();
    }
  }

  function chTabHTML(body) {
    body.innerHTML = '<div class="lab-note">Write a formula that produces the target result, then hit <b>RUN</b>. Solved ' + solved.length + '/' + CH.length + ' · progress saved in your browser.</div>';
    CH.forEach(function (c, i) {
      var d = document.createElement('div');
      d.className = 'lab-ch' + (solved.indexOf(i) > -1 ? ' done' : '') + (i === activeCh ? ' active' : '');
      d.innerHTML = '<h6>' + (solved.indexOf(i) > -1 ? '✅ ' : (i === activeCh ? '🎯 ' : '')) + (i + 1) + '. ' + c.t + '</h6><p>' + c.q + '</p>'
        + '<button class="lb start">' + (i === activeCh ? 'active — run your formula!' : 'start') + '</button>'
        + '<button class="lb peek">peek solution</button>'
        + '<button class="lb share">↗ share</button>';
      d.querySelector('.start').addEventListener('click', function () { activeCh = i; renderLab(); toast('Challenge active: write your formula and press RUN') });
      d.querySelector('.peek').addEventListener('click', function () { loadCode(c.x); activeCh = i });
      d.querySelector('.share').addEventListener('click', function () {
        var u = location.origin + location.pathname + '#ch=' + (i + 1);
        copy((solved.indexOf(i) > -1 ? 'I solved' : 'Try') + ' the "' + c.t + '" Power Fx challenge on POWERVERSE — ' + u)
          .then(function () { toast('Challenge link copied ✓') });
      });
      body.appendChild(d);
    });
  }

  /* ================= EXPORT ================= */
  function initExport() {
    var head = $('.pg-out-h');
    if (!head || $('#labExp')) return;
    var b = document.createElement('button');
    b.id = 'labExp'; b.className = 'btn-clr'; b.style.cssText = 'margin-left:auto;padding:2px 10px;font-size:11px';
    b.textContent = '⬇ export';
    b.title = 'Copy formula + result as Markdown';
    b.addEventListener('click', function () {
      var ta = $('#pgCode'), out = $('#pgOut');
      var txt = out.innerText.replace(/\n{2,}/g, '\n').trim();
      var md = '### Power Fx\n```powerfx\n' + ta.value.trim() + '\n```\n**Result:**\n```\n' + txt + '\n```\n— [POWERVERSE Playground](' + location.origin + location.pathname + '#playground)';
      copy(md).then(function () { toast('Result copied as Markdown ✓') });
    });
    head.appendChild(b);
    head.style.display = 'flex'; head.style.alignItems = 'center';
  }

  /* ================= PANEL + ROUTER + INIT ================= */
  var labTab = 'hist', labBody;
  function renderLab() {
    if (!labBody) return;
    $$('.lab-tabs button').forEach(function (b) { b.classList.toggle('on', b.dataset.t === labTab) });
    if (labTab === 'hist') {
      labBody.innerHTML = hist.length ? '' : '<div class="lab-note">Run any formula and it lands here. ★ pins it to Favorites. Last 30 kept, stored only in your browser.</div>';
      hist.forEach(function (h) { labBody.appendChild(histRow(h)) });
    } else if (labTab === 'fav') {
      var favs = hist.filter(function (h) { return h.fav });
      labBody.innerHTML = favs.length ? '' : '<div class="lab-note">No favorites yet — hit ☆ on any history entry.</div>';
      favs.forEach(function (h) { labBody.appendChild(histRow(h)) });
    } else if (labTab === 'ch') chTabHTML(labBody);
    else if (labTab === 'data') dataTabHTML(labBody);
  }

  function init() {
    var foot = $('.pg-foot');
    if (!foot || $('#labPanel')) return;
    var panel = document.createElement('div');
    panel.className = 'lab'; panel.id = 'labPanel';
    panel.innerHTML = '<div class="lab-tabs">'
      + '<button data-t="hist" class="on">🕘 History</button>'
      + '<button data-t="fav">★ Favorites</button>'
      + '<button data-t="ch">🏆 Challenges</button>'
      + '<button data-t="data">📥 My Data</button>'
      + '</div><div class="lab-body"></div>';
    foot.parentNode.insertBefore(panel, foot);
    labBody = panel.querySelector('.lab-body');
    $$('.lab-tabs button', panel).forEach(function (b) {
      b.addEventListener('click', function () { labTab = b.dataset.t; renderLab() });
    });
    renderLab();
    watchOutput();
    initExport();
    patchEngine();

    /* #ch=N deep link */
    function routeCh() {
      var m = location.hash.match(/(?:^|[#&])ch=(\d+)/);
      if (!m) return;
      var i = Math.min(CH.length, Math.max(1, +m[1])) - 1;
      activeCh = i; labTab = 'ch'; renderLab();
      document.getElementById('playground').scrollIntoView({ behavior: 'smooth' });
      setTimeout(function () { toast('🎯 Challenge ' + (i + 1) + ': ' + CH[i].q) }, 400);
    }
    window.addEventListener('hashchange', routeCh);
    routeCh();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
