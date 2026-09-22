/* ============================================================
   POWERVERSE hub-journey.js — learner journey features (P1/P2)
   ------------------------------------------------------------
   • Interview progress tracking (✓ learned, localStorage, bar)
   • Difficulty filters (Easy/Medium/Hard) combined with topics
   • Certifications section (injected, sync-proof) + nav links
   Repo-owned; tag re-injected by scripts/apply-growth-patches.sh
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s) };
  var $$ = function (s, p) { return Array.prototype.slice.call((p || document).querySelectorAll(s)) };

  var st = document.createElement('style');
  st.textContent = [
    '.iq-prog{display:flex;align-items:center;gap:12px;margin:0 0 14px;font-size:12px;opacity:.95}',
    '.iq-prog .bar{flex:1;max-width:280px;height:8px;border-radius:6px;background:rgba(255,255,255,.08);overflow:hidden}',
    '.iq-prog .bar i{display:block;height:100%;background:linear-gradient(90deg,var(--c-flow),#30D158);border-radius:6px;transition:width .4s}',
    '.iq-prog .reset{background:none;border:0;color:inherit;opacity:.5;cursor:pointer;font-size:11px;text-decoration:underline}',
    '.iq-done .iq-q{opacity:.55}.iq-done .iq-q .qn{color:#30D158}',
    '.iq-learn{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);color:inherit;border-radius:6px;padding:3px 10px;cursor:pointer;font-size:11px;margin-left:8px}',
    '.iq-learn.on{color:#30D158;border-color:#30D158}',
    '.iq-fd{gap:6px}.iq-fd.on{border-color:#FFD60A!important;color:#FFD60A}',
    '.cert-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;margin-top:26px}'
  ].join('\n');
  document.head.appendChild(st);

  var LS = {
    get: function (k, d) { try { return JSON.parse(localStorage.getItem('pv:' + k)) || d } catch (e) { return d } },
    set: function (k, v) { try { localStorage.setItem('pv:' + k, JSON.stringify(v)) } catch (e) { } }
  };

  /* ================= INTERVIEW PROGRESS ================= */
  var done = LS.get('iq', []);

  function iqIndex(el) { return $$('.iq').indexOf(el) }

  function renderProgress() {
    var bar = $('#iqProg');
    if (!bar) return;
    var total = $$('.iq').length;
    bar.querySelector('span').textContent = done.length + ' / ' + total + ' learned';
    bar.querySelector('i').style.width = (total ? Math.round(done.length / total * 100) : 0) + '%';
  }

  function wireIQ() {
    $$('.iq').forEach(function (el) {
      var i = iqIndex(el);
      if (done.indexOf(i) > -1) el.classList.add('iq-done');
      var box = el.querySelector('.iq-a-in');
      if (!box || box.querySelector('.iq-learn')) return;
      var b = document.createElement('button');
      b.className = 'iq-learn' + (done.indexOf(i) > -1 ? ' on' : '');
      b.textContent = done.indexOf(i) > -1 ? '✓ learned' : 'mark as learned';
      b.addEventListener('click', function () {
        var on = done.indexOf(i) === -1;
        done = done.filter(function (x) { return x !== i });
        if (on) done.push(i);
        LS.set('iq', done);
        el.classList.toggle('iq-done', on);
        b.classList.toggle('on', on);
        b.textContent = on ? '✓ learned' : 'mark as learned';
        renderProgress();
      });
      box.appendChild(b);
    });
  }

  /* ================= DIFFICULTY FILTERS ================= */
  var diffF = null; /* null | 'easy' | 'med' | 'hard' */

  function applyFilters() {
    var catBtn = $('.iq-f.on');
    var cat = catBtn ? catBtn.dataset.cat : 'all';
    $$('.iq').forEach(function (el) {
      var dEl = el.querySelector('.diff');
      var d = dEl ? dEl.className.replace('diff', '').trim() : '';
      var hide = (cat !== 'all' && el.dataset.cat !== cat) || (diffF && d !== diffF);
      el.classList.toggle('hide', hide);
    });
  }

  function initDiff() {
    var row = $('.iq-filters');
    if (!row || row.querySelector('.iq-fd')) return;
    [['easy', 'Easy'], ['med', 'Medium'], ['hard', 'Hard']].forEach(function (p) {
      var b = document.createElement('button');
      b.className = 'iq-f iq-fd'; b.dataset.d = p[0]; b.textContent = p[1];
      b.style.marginLeft = p[0] === 'easy' ? '14px' : '';
      b.addEventListener('click', function () {
        diffF = (diffF === p[0]) ? null : p[0];
        $$('.iq-fd', row).forEach(function (x) { x.classList.toggle('on', x.dataset.d === diffF) });
        applyFilters();
      });
      row.appendChild(b);
    });
    /* re-apply combined filter after the site's own category chips run */
    $$('.iq-f:not(.iq-fd)', row).forEach(function (b) {
      b.addEventListener('click', function () { setTimeout(applyFilters, 0) });
    });
  }

  /* ================= CERTIFICATIONS SECTION ================= */
  var CERTS = [
    { code: 'PL-900', name: 'Power Platform Fundamentals', lvl: 'Fundamentals', ico: '🌱', c: 'var(--c-copilot)',
      d: 'The entry point — proves you understand the business value and core components of the platform. No prerequisites.',
      u: 'https://learn.microsoft.com/credentials/certifications/power-platform-fundamentals/' },
    { code: 'PL-300', name: 'Power BI Data Analyst Associate', lvl: 'Associate', ico: '📊', c: 'var(--c-bi)',
      d: 'Model, visualize and analyze data with Power BI — semantic models, DAX, reports and deployment pipelines.',
      u: 'https://learn.microsoft.com/credentials/certifications/power-bi-data-analyst-associate/' },
    { code: 'PL-200', name: 'Power Platform Functional Consultant', lvl: 'Associate', ico: '🧭', c: 'var(--c-flow)',
      d: 'Configure Dataverse, model-driven apps, Power Automate and Copilot Studio for business requirements.',
      u: 'https://learn.microsoft.com/credentials/certifications/power-platform-functional-consultant-associate/' },
    { code: 'PL-400', name: 'Power Platform Developer', lvl: 'Associate', ico: '💻', c: 'var(--c-apps)',
      d: 'Extend the platform with code — plugins, PCF components, custom connectors, integrations and ALM.',
      u: 'https://learn.microsoft.com/credentials/certifications/power-platform-developer-associate/' },
    { code: 'PL-500', name: 'Power Automate RPA Developer', lvl: 'Associate', ico: '🤖', c: 'var(--c-pages)',
      d: 'Desktop flows, unattended RPA, machine groups and bridging legacy systems with cloud automation.',
      u: 'https://learn.microsoft.com/credentials/certifications/power-automate-rpa-developer-associate/' },
    { code: 'PL-600', name: 'Power Platform Solution Architect', lvl: 'Expert', ico: '🏛️', c: 'var(--c-data)',
      d: 'The expert capstone — lead solution design, security, integration and ALM across enterprise implementations.',
      u: 'https://learn.microsoft.com/credentials/certifications/power-platform-solution-architect-expert/' }
  ];

  function initCerts() {
    var res = document.getElementById('resources');
    if (!res || document.getElementById('certs')) return;
    var sec = document.createElement('section');
    sec.id = 'certs';
    sec.innerHTML = '<div class="wrap">'
      + '<div class="sec-tag rv on"><b>★</b> Certifications</div>'
      + '<h2 class="sec-title rv on">Get <span class="hl">certified</span>.<br>Get hired.</h2>'
      + '<p class="sec-sub rv on">The official Microsoft certification path for Power Platform — from fundamentals to expert architect. Every exam maps to free Microsoft Learn paths.</p>'
      + '<div class="cert-grid rv on">'
      + CERTS.map(function (c) {
        return '<a class="res" style="--rc:' + c.c + '" href="' + c.u + '" target="_blank" rel="noopener">'
          + '<div class="r-ico">' + c.ico + '</div><div><h5>' + c.code + ' · ' + c.name + ' <span class="ext">↗</span></h5>'
          + '<p><b style="opacity:.7">' + c.lvl + '</b> — ' + c.d + '</p></div></a>';
      }).join('')
      + '</div></div>';
    res.parentNode.insertBefore(sec, res);

    /* nav links (desktop + mobile) */
    $$('a[href="#interview"]').forEach(function (a) {
      if (a.parentNode.querySelector('a[href="#certs"]')) return;
      var n = document.createElement('a');
      n.href = '#certs'; n.textContent = 'Certs';
      a.parentNode.insertBefore(n, a.nextSibling);
    });
  }

  /* ================= INIT ================= */
  function init() {
    var list = $('#iqList');
    if (list && !$('#iqProg')) {
      var prog = document.createElement('div');
      prog.className = 'iq-prog'; prog.id = 'iqProg';
      prog.innerHTML = '<span></span><div class="bar"><i></i></div>'
        + '<button class="reset">reset progress</button>';
      prog.querySelector('.reset').addEventListener('click', function () {
        done = []; LS.set('iq', done);
        $$('.iq').forEach(function (el) { el.classList.remove('iq-done') });
        $$('.iq-learn').forEach(function (b) { b.classList.remove('on'); b.textContent = 'mark as learned' });
        renderProgress();
      });
      list.parentNode.insertBefore(prog, list);
    }
    wireIQ(); renderProgress(); initDiff(); initCerts();
    /* answers render lazily on some builds — rewire if the list changes */
    if (list) new MutationObserver(function () { wireIQ(); renderProgress() })
      .observe(list, { childList: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
