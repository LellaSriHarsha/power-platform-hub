/* ============================================================
   POWERVERSE hub-ai.js — AI Builder & Copilot Studio (P2)
   ------------------------------------------------------------
   • #ai-builder section — every model type, AI prompts, licensing
   • #copilot section — Copilot Studio: orchestration, knowledge,
     tools, autonomous agents, channels, analytics, governance
   • +7 interview questions (new "AI & Copilot" chip)
   • Nav + footer links
   Content grounded in Microsoft Learn (2026): model-types,
   agent-tools, ai-capabilities guidance pages.
   Repo-owned; tag re-injected by scripts/apply-growth-patches.sh
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s) };
  var $$ = function (s, p) { return Array.prototype.slice.call((p || document).querySelectorAll(s)) };

  var st = document.createElement('style');
  st.textContent = [
    '.ai-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;margin-top:26px}',
    '.ai-grid .res{cursor:pointer}',
    '.cop-steps{counter-reset:cs;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-top:26px;list-style:none;padding:0}',
    '.cop-steps li{border:1px solid var(--line);border-radius:12px;padding:14px 16px;font-size:13px;background:var(--ink-2)}',
    '.cop-steps li::before{counter-increment:cs;content:counter(cs);display:inline-flex;width:24px;height:24px;align-items:center;justify-content:center;border-radius:8px;background:var(--c-copilot);color:#fff;font-weight:700;font-size:12px;margin-bottom:8px}',
    '.cop-steps b{display:block;margin-bottom:2px}',
    '[data-theme="light"] .cop-steps li{background:#fff}'
  ].join('\n');
  document.head.appendChild(st);

  function card(c) {
    return '<a class="res" style="--rc:' + c.c + '" href="' + c.u + '" target="_blank" rel="noopener">'
      + '<div class="r-ico">' + c.ico + '</div><div><h5>' + c.t + ' <span class="ext">↗</span></h5>'
      + '<p>' + c.d + '</p></div></a>';
  }

  /* ================= AI BUILDER ================= */
  var AIB = [
    { ico: '📄', t: 'Document processing · custom', c: 'var(--c-data)', u: 'https://learn.microsoft.com/ai-builder/form-processing-model-overview',
      d: 'Train on <b>your</b> forms, invoices and contracts — tag the fields and tables once, extract them forever. The flagship custom model.' },
    { ico: '🧾', t: 'Prebuilt documents', c: 'var(--c-flow)', u: 'https://learn.microsoft.com/ai-builder/prebuilt-overview',
      d: '<b>Invoice, receipt, ID reader, business card, contract</b> processing and <b>text recognition (OCR)</b> — ready to use, zero training.' },
    { ico: '📝', t: 'Text intelligence', c: 'var(--c-apps)', u: 'https://learn.microsoft.com/ai-builder/prebuilt-sentiment-analysis',
      d: '<b>Sentiment analysis, key phrases, language detection, translation, entity extraction</b> and category classification (prebuilt + custom).' },
    { ico: '📊', t: 'Prediction', c: 'var(--c-bi)', u: 'https://learn.microsoft.com/ai-builder/prediction-overview',
      d: 'Binary and numeric predictions from your own <b>Dataverse history</b> — churn risk, late payment, delivery ETA. No code, just pick the outcome column.' },
    { ico: '🖼️', t: 'Object detection & image description', c: 'var(--c-pages)', u: 'https://learn.microsoft.com/ai-builder/object-detection-overview',
      d: 'Detect and count your products in photos (retail shelves, inspections) with a custom model, or auto-describe any image with the prebuilt one.' },
    { ico: '✨', t: 'AI prompts (prompt builder)', c: 'var(--c-copilot)', u: 'https://learn.microsoft.com/ai-builder/prompts-overview',
      d: 'Reusable <b>GPT prompts</b> with input variables, text or JSON output, Dataverse grounding, file inputs and code interpreter — callable from flows, apps and agents. Saved in a prompt library with ALM + sharing.' },
    { ico: '💳', t: 'Licensing: Copilot Credits', c: 'var(--c-bi)', u: 'https://learn.microsoft.com/ai-builder/administer-licensing',
      d: 'AI Builder consumption is billed in <b>Copilot Credits</b> (successor to AI Builder credits) — capacity add-ons or pay-as-you-go; some capacity is seeded with premium licenses.' },
    { ico: '🚀', t: 'Try it in 2 minutes', c: 'var(--c-flow)', u: 'https://make.powerapps.com/',
      d: 'Open the maker portal → <b>More → AI hub → AI models</b>. Pick a prebuilt model, drop it into a flow, and process your first document.' }
  ];

  function initAIBuilder() {
    var res = document.getElementById('resources');
    if (!res || document.getElementById('ai-builder')) return;
    var sec = document.createElement('section');
    sec.id = 'ai-builder';
    sec.innerHTML = '<div class="wrap">'
      + '<div class="sec-tag rv on"><b>✦</b> AI Builder</div>'
      + '<h2 class="sec-title rv on">Add AI to any app or flow.<br><span class="hl">No data science degree.</span></h2>'
      + '<p class="sec-sub rv on">AI Builder puts prebuilt and custom models one click away inside Power Apps, Power Automate and Copilot Studio — classify text, read documents, detect objects and predict outcomes against your own Dataverse data.</p>'
      + '<div class="ai-grid rv on">' + AIB.map(card).join('') + '</div></div>';
    res.parentNode.insertBefore(sec, res);
  }

  /* ================= COPILOT STUDIO ================= */
  var COP = [
    { ico: '🧠', t: 'Generative orchestration', c: 'var(--c-copilot)', u: 'https://learn.microsoft.com/microsoft-copilot-studio/guidance/ai-capabilities',
      d: 'An LLM planner replaces rigid trigger phrases: <b>multi-intent</b> understanding, entity extraction, and dynamic chaining of topics, actions and knowledge in a single turn.' },
    { ico: '📚', t: 'Generative answers & knowledge', c: 'var(--c-flow)', u: 'https://learn.microsoft.com/microsoft-copilot-studio/knowledge-copilot-studio',
      d: 'Ground answers in <b>SharePoint, OneDrive, Dataverse, public websites, uploaded files and Graph connectors</b> — summarized, validated, with citations. No FAQ authoring.' },
    { ico: '🧩', t: 'Topics', c: 'var(--c-apps)', u: 'https://learn.microsoft.com/microsoft-copilot-studio/authoring-create-edit-topics',
      d: 'Authored dialogs for business-critical paths: slot filling, variables, branching, Adaptive Cards — exact control where compliance demands it. Mix freely with generative AI.' },
    { ico: '🔧', t: 'Agent tools', c: 'var(--c-data)', u: 'https://learn.microsoft.com/microsoft-copilot-studio/guidance/agent-tools',
      d: '<b>1,500+ connectors</b>, <b>agent flows</b> (Power Automate), <b>AI prompts</b>, <b>MCP servers</b> and REST APIs — an agent that can act across every system, not just chat.' },
    { ico: '🤖', t: 'Autonomous agents', c: 'var(--c-pages)', u: 'https://learn.microsoft.com/microsoft-copilot-studio/autonomous-agents',
      d: 'Trigger agents on <b>events</b> (new email, row, file) or a <b>schedule</b> — no chat turn required. Inbox triage, record enrichment, document processing on arrival.' },
    { ico: '🖥️', t: 'Computer use (CUA)', c: 'var(--c-bi)', u: 'https://learn.microsoft.com/microsoft-copilot-studio/guidance/agent-tools',
      d: 'Vision-driven UI automation for apps with no API — the agent watches the screen and clicks/types. Hosted machines for prototypes, <b>BYO machines</b> (Entra + Intune) for production. Use CUA when UIs shift; classic RPA when speed and stability rule.' },
    { ico: '📡', t: 'Channels', c: 'var(--c-flow)', u: 'https://learn.microsoft.com/microsoft-copilot-studio/publication-connect-bot-to-channels',
      d: 'Publish once, run everywhere: <b>Teams, Microsoft 365 Copilot, web chat, custom apps</b> (Direct Line / API), omnichannel for customer service and voice.' },
    { ico: '📊', t: 'Analytics & improvement loop', c: 'var(--c-pages)', u: 'https://learn.microsoft.com/microsoft-copilot-studio/analytics-overview',
      d: 'Sessions, resolution and escalation rates, plus <b>transcript mining</b> that surfaces unanswered questions — your backlog of new topics and knowledge writes itself.' },
    { ico: '🔒', t: 'Security & governance', c: 'var(--c-data)', u: 'https://learn.microsoft.com/microsoft-copilot-studio/guidance/responsible-ai-overview',
      d: 'Entra ID authentication, DLP policies, environment routing and per-agent sharing. Generative answers are grounded and moderated — <b>tenant data is never used to train models</b>.' }
  ];

  function initCopilot() {
    var res = document.getElementById('resources');
    if (!res || document.getElementById('copilot')) return;
    var sec = document.createElement('section');
    sec.id = 'copilot';
    sec.innerHTML = '<div class="wrap">'
      + '<div class="sec-tag rv on"><b>🤖</b> Copilot Studio</div>'
      + '<h2 class="sec-title rv on">Build <span class="hl">agents</span>,<br>not chatbots.</h2>'
      + '<p class="sec-sub rv on">Copilot Studio is where Power Platform makers build declarative and custom agents — grounded in your data, wired to your systems, and deployable to Teams, Microsoft 365 Copilot and the web.</p>'
      + '<ol class="cop-steps rv on">'
      + '<li><b>Describe it</b>Natural-language instructions define purpose, tone and guardrails.</li>'
      + '<li><b>Ground it</b>Add knowledge sources — SharePoint, Dataverse, websites, files.</li>'
      + '<li><b>Tool it</b>Attach connectors, agent flows, prompts and MCP servers.</li>'
      + '<li><b>Test it</b>Iterate in the built-in test pane, utterance by utterance.</li>'
      + '<li><b>Publish it</b>Ship to Teams, M365 Copilot or your site — then watch analytics.</li>'
      + '</ol>'
      + '<div class="ai-grid rv on">' + COP.map(card).join('') + '</div></div>';
    res.parentNode.insertBefore(sec, res);
  }

  /* ================= INTERVIEW ADDITIONS ================= */
  var NEW_IQ = [
    { cat: 'ai', d: 'easy', q: 'What is AI Builder? Name three prebuilt models.',
      a: `<b>AI Builder</b> is point-and-click AI inside Power Platform — use models in apps, flows and agents without writing ML code. Prebuilt: <b>invoice processing, receipt processing, ID reader, business card reader, text recognition (OCR), sentiment analysis, key phrase extraction, language detection, translation</b>. Custom: document processing, object detection, prediction, category classification, entity extraction.` },
    { cat: 'ai', d: 'med', q: 'Prebuilt vs custom AI Builder model — when do you train your own?',
      a: `<b>Prebuilt</b> when the document/text pattern is universal (invoices, receipts, IDs, sentiment) — zero training, instant value. <b>Custom</b> when your layout, vocabulary or data is unique: your own forms (document processing), your products in photos (object detection), your Dataverse history (prediction). Rule: try prebuilt first; train custom when accuracy on YOUR data demands it.` },
    { cat: 'ai', d: 'med', q: 'What are AI prompts (prompt builder) and where can you call them?',
      a: `Reusable <b>GPT prompts</b>: instructions + input variables, output as text or structured <b>JSON</b>. They support <b>Dataverse grounding</b>, file inputs and code interpreter, and can run on built-in or Microsoft Foundry models. Call them from Power Automate, Power Apps and Copilot Studio topics. Prompts live in a <b>prompt library</b> with ALM, RBAC and sharing.` },
    { cat: 'ai', d: 'med', q: 'Copilot Studio: generative answers vs classic authored topics?',
      a: `<b>Generative answers</b> compose replies from knowledge sources (SharePoint, websites, Dataverse, files) with citations — huge coverage, near-zero authoring, but non-deterministic. <b>Topics</b> are authored dialogs with exact wording, branching and slot filling — full control for business-critical paths. Best agents mix both: topics for the critical journeys, generative answers for the long tail.` },
    { cat: 'ai', d: 'hard', q: 'How does generative orchestration change agent design?',
      a: `The LLM <b>planner</b> replaces trigger-phrase NLU: it handles <b>multi-intent</b> utterances, extracts entities, and chains topics, actions and knowledge dynamically. You stop scripting dialogs and start <b>curating building blocks</b> — clear tool descriptions, scoped knowledge, good instructions. Trade-off: non-determinism, so test broadly and use classic topics where an exact flow is mandatory.` },
    { cat: 'ai', d: 'hard', q: 'What tools can you give a Copilot Studio agent?',
      a: `<b>Connector actions</b> (1,500+), <b>agent flows</b> (Power Automate for multi-step work), <b>AI prompts</b>, <b>MCP servers</b>, <b>REST APIs</b>, and <b>computer use</b> for UI-only legacy apps. Plus knowledge sources for grounding and <b>handoff</b> to live agents. The planner picks the right tool from its description — descriptions are the new code.` },
    { cat: 'ai', d: 'med', q: 'What are autonomous agents and how are they triggered?',
      a: `Agents that act <b>without a chat turn</b>: an <b>event trigger</b> (new email, Dataverse row, SharePoint file) or a <b>schedule</b> kicks off a run — classic uses are inbox triage, document processing and record enrichment. Govern them like any automation: environment routing, DLP, and the agent-run analytics to audit what they did.` }
  ];

  function wireIQCard(d) {
    var btn = d.querySelector('.iq-q');
    btn.addEventListener('click', function () {
      var body = d.querySelector('.iq-a'), open = d.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      body.style.maxHeight = open ? body.scrollHeight + 'px' : '0px';
    });
  }

  function addInterview() {
    var list = $('#iqList');
    if (!list || $('#iqList .iq[data-pv="ai"]')) return;
    var base = $$('.iq', list).length;
    NEW_IQ.forEach(function (it, i) {
      var d = document.createElement('div');
      d.className = 'iq'; d.dataset.cat = it.cat; d.dataset.pv = 'ai';
      d.innerHTML = '<button class="iq-q" aria-expanded="false">'
        + '<span class="qn">Q' + String(base + i + 1).padStart(2, '0') + '</span>'
        + '<span>' + it.q + '</span>'
        + '<span class="diff ' + it.d + '">' + (it.d === 'easy' ? 'Easy' : it.d === 'med' ? 'Medium' : 'Hard') + '</span>'
        + '<span class="chev">\u25BC</span></button>'
        + '<div class="iq-a"><div class="iq-a-in">' + it.a + '</div></div>';
      wireIQCard(d);
      list.appendChild(d);
    });
    var row = $('.iq-filters');
    if (row && !row.querySelector('[data-cat="ai"]')) {
      var b = document.createElement('button');
      b.className = 'iq-f'; b.dataset.cat = 'ai'; b.textContent = 'AI & Copilot';
      b.addEventListener('click', function () {
        $$('.iq-f:not(.iq-fd)', row).forEach(function (x) { x.classList.remove('on') });
        b.classList.add('on');
        setTimeout(function () {
          $$('.iq').forEach(function (el) { el.classList.toggle('hide', el.dataset.cat !== 'ai') });
        }, 0);
      });
      row.appendChild(b);
    }
  }

  /* ================= NAV + FOOTER LINKS ================= */
  function addNav() {
    $$('a[href="#interview"]').forEach(function (a) {
      var nav = a.parentNode;
      if (!nav.querySelector('a[href="#copilot"]')) {
        var c = document.createElement('a'); c.href = '#copilot'; c.textContent = 'Copilot';
        nav.insertBefore(c, a.nextSibling);
      }
      if (!nav.querySelector('a[href="#ai-builder"]')) {
        var b = document.createElement('a'); b.href = '#ai-builder'; b.textContent = 'AI Builder';
        nav.insertBefore(b, a.nextSibling);
      }
    });
    var off = $$('.foot-col').find(function (c) { return /Official/.test(c.textContent) });
    if (off && !off.querySelector('a[href*="copilot-studio"]')) {
      var l1 = document.createElement('a');
      l1.href = 'https://learn.microsoft.com/microsoft-copilot-studio/'; l1.target = '_blank'; l1.rel = 'noopener';
      l1.textContent = 'Copilot Studio docs'; off.appendChild(l1);
      var l2 = document.createElement('a');
      l2.href = 'https://learn.microsoft.com/ai-builder/'; l2.target = '_blank'; l2.rel = 'noopener';
      l2.textContent = 'AI Builder docs'; off.appendChild(l2);
    }
  }

  /* ================= INIT ================= */
  function init() { initAIBuilder(); initCopilot(); addInterview(); addNav() }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
