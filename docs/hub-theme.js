/* ============================================================
   POWERVERSE hub-theme.js — light-mode code readability fix
   ------------------------------------------------------------
   Code surfaces (snippet panes, function examples, modal code,
   playground editor/highlight, hub layers) used hardcoded dark
   translucent backgrounds + light syntax colors. In light mode
   the translucent dark washes out over the light page and the
   pale text becomes unreadable. This layer injects light-theme
   overrides so every code surface is dark-on-light.
   Repo-owned; tag re-injected by scripts/apply-growth-patches.sh
   ============================================================ */
(function () {
  'use strict';
  if (document.getElementById('pv-theme-fix')) return;
  var st = document.createElement('style');
  st.id = 'pv-theme-fix';
  st.textContent = [
    '/* ---- core code surfaces ---- */',
    '[data-theme="light"] .snip pre{background:var(--ink-3);color:#26314B}',
    '[data-theme="light"] .snip pre .fn{color:#1769D2}',
    '[data-theme="light"] .snip pre .st{color:#0E7A3C}',
    '[data-theme="light"] .snip pre .kw{color:#8540AD}',
    '[data-theme="light"] .snip pre .cm{color:#63708C}',
    '[data-theme="light"] .snip .try{background:rgba(39,55,91,.05)}',
    '[data-theme="light"] .snip .try:hover{background:rgba(184,135,0,.12);color:#B88700}',
    '[data-theme="light"] .fn-card .f-ex{background:#EDF1F9;color:#26314B}',
    '[data-theme="light"] .fn-card .f-sig{color:#1769D2}',
    '[data-theme="light"] .modal-b pre{background:var(--ink-3);color:#26314B}',
    '[data-theme="light"] .modal-b code{color:#1769D2;background:rgba(23,105,210,.1)}',
    '/* ---- playground editor + highlight ---- */',
    '[data-theme="light"] .pg-hl{color:#26314B}',
    '[data-theme="light"] .pg-hl .tk-cm{color:#63708C}',
    '[data-theme="light"] .pg-hl .tk-st{color:#0E7A3C}',
    '[data-theme="light"] .pg-hl .tk-num{color:#B88700}',
    '[data-theme="light"] .pg-hl .tk-fn{color:#1769D2}',
    '[data-theme="light"] .pg-hl .tk-kw{color:#8540AD}',
    '[data-theme="light"] .pg-edit textarea::placeholder{color:#8B96B0}',
    '[data-theme="light"] .intel{box-shadow:0 20px 50px rgba(39,55,91,.25)}',
    '[data-theme="light"] .intel-it .i-name{color:#1769D2}',
    '[data-theme="light"] .copy-btn.ok,[data-theme="light"] .f-btn.ok{color:#0E7A3C!important;border-color:#0E7A3C!important}',
    '[data-theme="light"] .f-btn.try:hover{background:rgba(184,135,0,.1);color:#B88700;border-color:var(--c-bi)}',
    '/* ---- hub layers (lab / pa tabs / journey) ---- */',
    '[data-theme="light"] .lab,[data-theme="light"] .lab-ch{border-color:rgba(39,55,91,.14)}',
    '[data-theme="light"] .lab-tabs{background:rgba(39,55,91,.04);border-bottom-color:rgba(39,55,91,.1)}',
    '[data-theme="light"] .lab-row:hover{background:rgba(39,55,91,.04)}',
    '[data-theme="light"] .lab-row .lb,[data-theme="light"] .lab-ch .lb{background:#fff;border-color:rgba(39,55,91,.22)}',
    '[data-theme="light"] .lab textarea,[data-theme="light"] .lab input[type=text]{background:#fff;border-color:rgba(39,55,91,.25)}',
    '[data-theme="light"] .pa-tab{background:#fff;border-color:rgba(39,55,91,.15)}',
    '[data-theme="light"] .pa-guide-in{background:rgba(23,105,210,.05);border-color:rgba(23,105,210,.3)}',
    '[data-theme="light"] .pa-guide-in code{background:rgba(39,55,91,.09)}',
    '[data-theme="light"] .iq-prog .bar{background:rgba(39,55,91,.12)}',
    '[data-theme="light"] .iq-learn{background:#fff;border-color:rgba(39,55,91,.25)}',
    '[data-theme="light"] .iq-learn.on{color:#0E7A3C;border-color:#0E7A3C}',
    '[data-theme="light"] .iq-done .iq-q .qn{color:#0E7A3C}',
    '[data-theme="light"] .lab-note code{background:rgba(39,55,91,.09);border-radius:4px;padding:1px 5px}'
  ].join('\n');
  document.head.appendChild(st);
})();
