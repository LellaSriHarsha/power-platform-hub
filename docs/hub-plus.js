/* ============================================================
   POWERVERSE hub-plus.js — repo-owned enhancement layer
   ------------------------------------------------------------
   Loaded via a <script> tag injected by scripts/apply-growth-patches.sh
   (re-applied after every Lovable sync). This file itself lives in
   docs/ and survives syncs (the docs rsync has no --delete).

   Features:
     1. Deep links:  #fn=Search   → scroll to + highlight a function card
                     #fx=<code>   → load formula into playground + run it
                     #iq=7        → expand + highlight interview question 7
                     (combinable: #fn=Search&iq=7)
     2. Share buttons: "↗ share" on every function card, interview
        answer and the playground — copies a deep link to clipboard.
     3. URL keeps in sync when a question is expanded (replaceState).
     4. Tiny toast notifications.

   Everything hooks the public DOM only (classes/ids that already exist),
   so internal refactors of the main bundle won't break it silently.
   ============================================================ */
(function () {
  'use strict';

  var BASE = location.origin + location.pathname;

  /* ---------- styles (scoped with hp- prefix) ---------- */
  var css = [
    '.hp-toast{position:fixed;left:50%;bottom:28px;transform:translateX(-50%) translateY(20px);',
    'background:#101828;color:#E8F1FF;border:1px solid rgba(120,180,255,.35);border-radius:10px;',
    'padding:10px 18px;font:600 13px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;',
    'box-shadow:0 12px 32px rgba(0,0,0,.45);opacity:0;pointer-events:none;',
    'transition:opacity .25s,transform .25s;z-index:9999}',
    '.hp-toast.on{opacity:1;transform:translateX(-50%) translateY(0)}',
    '@keyframes hpFlash{0%,60%{box-shadow:0 0 0 3px rgba(100,210,255,.85),0 0 42px rgba(100,210,255,.35)}100%{box-shadow:0 0 0 0 rgba(100,210,255,0)}}',
    '.hp-flash{animation:hpFlash 2.4s ease-out 1;border-radius:12px}',
    '.fn-card,.iq{scroll-margin-top:110px}',
    '.iq-share{margin:10px 0 2px;background:none;border:1px solid rgba(140,170,220,.3);border-radius:6px;',
    'color:inherit;opacity:.55;cursor:pointer;font:600 10px ui-monospace,Menlo,monospace;padding:3px 8px;',
    'letter-spacing:.06em}',
    '.iq-share:hover{opacity:1;border-color:rgba(100,210,255,.7)}',
    '.hp-pg-share{margin-left:8px}'
  ].join('');
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- toast ---------- */
  var toastEl = document.createElement('div');
  toastEl.className = 'hp-toast';
  document.body.appendChild(toastEl);
  var toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('on'); }, 2200);
  }

  /* ---------- clipboard (reuse site's copyText if present) ---------- */
  function copy(text) {
    var p = (typeof window.copyText === 'function')
      ? window.copyText(text)
      : navigator.clipboard.writeText(text);
    return Promise.resolve(p);
  }
  function share(url, label) {
    copy(url).then(function () { toast((label || 'Link') + ' copied ✓'); })
             .catch(function () { toast('Copy failed — ' + url); });
  }

  /* ---------- flash helper ---------- */
  function flash(el) {
    el.classList.remove('hp-flash');
    void el.offsetWidth;           /* restart animation */
    el.classList.add('hp-flash');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ============================================================
     SHARE BUTTONS
     ============================================================ */

  /* function cards: append "↗ share" next to existing copy/run buttons */
  function wireFunctionCards() {
    var acts = document.querySelectorAll('.fn-card .f-acts');
    acts.forEach(function (row) {
      if (row.querySelector('.hp-share')) return;
      var nameBtn = row.querySelector('[data-n]');
      if (!nameBtn) return;
      var name = nameBtn.getAttribute('data-n');
      var b = document.createElement('button');
      b.className = 'f-btn hp-share';
      b.textContent = '↗ share';
      b.addEventListener('click', function () {
        share(BASE + '#fn=' + encodeURIComponent(name), 'Link to ' + name);
      });
      row.appendChild(b);
    });
    return acts.length;
  }

  /* interview answers: "🔗 copy link" at the end of each answer */
  function wireInterview() {
    var items = document.querySelectorAll('#iqList .iq');
    items.forEach(function (item, i) {
      var body = item.querySelector('.iq-a-in');
      if (body && !body.querySelector('.iq-share')) {
        var b = document.createElement('button');
        b.className = 'iq-share';
        b.textContent = '🔗 copy link';
        b.addEventListener('click', function () {
          share(BASE + '#iq=' + (i + 1), 'Link to Q' + (i + 1));
        });
        body.appendChild(b);
      }

      /* keep URL in sync when a question is expanded */
      var q = item.querySelector('.iq-q');
      if (q && !q.dataset.hpWired) {
        q.dataset.hpWired = '1';
        q.addEventListener('click', function () {
          setTimeout(function () {
            if (q.getAttribute('aria-expanded') === 'true') {
              history.replaceState(null, '', '#iq=' + (i + 1));
            }
          }, 50);
        });
      }
    });
    return items.length;
  }

  /* playground: "🔗 Share formula" button beside RUN */
  function wirePlayground() {
    var run = document.getElementById('pgRun');
    if (!run || run.parentNode.querySelector('.hp-pg-share')) return !!run;
    var b = document.createElement('button');
    b.className = 'btn-run hp-pg-share';
    b.style.background = 'rgba(100,210,255,.12)';
    b.textContent = '🔗 SHARE FORMULA';
    b.addEventListener('click', function () {
      var code = (document.getElementById('pgCode') || {}).value || '';
      if (!code.trim()) { toast('Write a formula first ✍️'); return; }
      share(BASE + '#fx=' + encodeURIComponent(code), 'Playground link');
    });
    run.parentNode.insertBefore(b, run.nextSibling);
    return true;
  }

  /* The main bundle renders lists on load; wire now and re-wire if it
     re-renders later (search/filter redraws the grid). */
  function wireAll() {
    wireFunctionCards(); wireInterview(); wirePlayground();
  }
  wireAll();
  var fnSection = document.getElementById('functions');
  if (fnSection && window.MutationObserver) {
    var deb;
    new MutationObserver(function () {
      clearTimeout(deb);
      deb = setTimeout(wireAll, 150);
    }).observe(fnSection, { childList: true, subtree: true });
  }

  /* ============================================================
     DEEP-LINK ROUTER
     ============================================================ */
  function findFnCard(name) {
    var btn = document.querySelector('.fn-card [data-n="' + CSS.escape(name) + '"]');
    if (btn) return btn.closest('.fn-card');
    var want = name.toLowerCase(), cards = document.querySelectorAll('.fn-card');
    for (var i = 0; i < cards.length; i++) {
      var n = cards[i].querySelector('.f-name');
      if (n && n.textContent.trim().toLowerCase() === want) return cards[i];
    }
    return null;
  }

  function route(params) {
    var handled = false;

    if (params.fn) {
      var card = findFnCard(params.fn);
      if (card) { flash(card); handled = true; }
    }

    if (params.iq) {
      var idx = parseInt(params.iq, 10) - 1;
      var items = document.querySelectorAll('#iqList .iq');
      var item = items[idx];
      if (item) {
        var q = item.querySelector('.iq-q');
        if (q && q.getAttribute('aria-expanded') !== 'true') q.click();
        flash(item);
        handled = true;
      }
    }

    if (params.fx) {
      var ta = document.getElementById('pgCode');
      if (ta) {
        ta.value = params.fx;
        ta.dispatchEvent(new Event('input', { bubbles: true }));
        var pg = document.getElementById('playground');
        if (pg) pg.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(function () {
          var run = document.getElementById('pgRun');
          if (run) run.click();
          flash(ta.closest('.pg-codewrap') || ta);
        }, 450);
        handled = true;
      }
    }
    return handled;
  }

  function parseHash() {
    var out = {};
    var h = location.hash.replace(/^#/, '');
    if (h) {
      h.split('&').forEach(function (pair) {
        var eq = pair.indexOf('=');
        if (eq < 0) return;
        var k = pair.slice(0, eq);
        if (k === 'fn' || k === 'fx' || k === 'iq') {
          out[k] = decodeURIComponent(pair.slice(eq + 1).replace(/\+/g, ' '));
        }
      });
    }
    /* also accept ?fx= as a query param (nicer for some share targets) */
    var q = new URLSearchParams(location.search).get('fx');
    if (q && !out.fx) out.fx = q;
    return out;
  }

  /* run on load — retry briefly in case the main bundle is still rendering */
  function boot(attempt) {
    var params = parseHash();
    if (!params.fn && !params.fx && !params.iq) return;
    if (!route(params) && attempt < 10) {
      setTimeout(function () { boot(attempt + 1); }, 250);
    }
  }
  boot(0);

  /* react to in-page hash changes (paste a deep link while on the page) */
  window.addEventListener('hashchange', function () { boot(0); });
})();
