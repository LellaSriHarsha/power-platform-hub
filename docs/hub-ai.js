/* ============================================================
   POWERVERSE hub-ai.js — AI Builder & Copilot Studio (P3)
   ------------------------------------------------------------
   Study-style TOPIC sections (accordion, not link-cards):
   • #ai-builder — 10 topics + official Microsoft UI screenshot
   • #copilot    — 11 topics + official Microsoft UI screenshots
   • +7 interview questions ("AI & Copilot" chip)
   • Nav links + nav overflow fix (white-space:nowrap)
   Repo-owned; tag re-injected by scripts/apply-growth-patches.sh
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s) };
  var $$ = function (s, p) { return Array.prototype.slice.call((p || document).querySelectorAll(s)) };

  var st = document.createElement('style');
  st.textContent = [
    '/* nav: stop link text wrapping to 2 lines */',
    '.nav-links a{white-space:nowrap}',
    '@media(min-width:1101px){.nav-links{overflow-x:auto;scrollbar-width:none;max-width:100%}.nav-links::-webkit-scrollbar{display:none}}',
    '/* study topics */',
    '.tp-list{margin-top:26px;display:flex;flex-direction:column;gap:10px}',
    '.tp{border:1px solid var(--line);border-radius:14px;background:var(--ink-2);overflow:hidden;transition:border-color .25s}',
    '.tp:hover{border-color:var(--tpc,var(--c-copilot))}',
    '.tp.open{border-color:var(--tpc,var(--c-copilot))}',
    '.tp-q{display:flex;align-items:center;gap:14px;width:100%;padding:16px 18px;background:none;border:0;cursor:pointer;text-align:left;color:var(--txt);font:inherit;font-size:15px;font-weight:600}',
    '.tp-n{flex:none;width:30px;height:30px;border-radius:9px;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;background:var(--tpc,var(--c-copilot))}',
    '.tp-tag{flex:none;margin-left:auto;font-size:11px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;padding:4px 10px;border-radius:999px;border:1px solid var(--line);color:var(--txt-dim)}',
    '.tp-q .chev{flex:none;color:var(--txt-dim);font-size:11px;transition:transform .3s}',
    '.tp.open .tp-q .chev{transform:rotate(180deg)}',
    '.tp-a{max-height:0;overflow:hidden;transition:max-height .45s cubic-bezier(.2,.7,.2,1)}',
    '.tp-a-in{padding:2px 20px 20px 62px;font-size:14px;line-height:1.65;color:var(--txt-dim)}',
    '.tp-a-in b,.tp-a-in strong{color:var(--txt)}',
    '.tp-a-in ul{margin:8px 0;padding-left:18px}',
    '.tp-a-in li{margin:4px 0}',
    '.tp-a-in code{background:rgba(148,163,204,.12);padding:1px 6px;border-radius:6px;font-size:12.5px}',
    '.tp-a-in a{color:var(--tpc,var(--c-copilot));font-weight:600}',
    '.tp-fig{margin:14px 0 4px;border:1px solid var(--line);border-radius:12px;overflow:hidden;background:#fff}',
    '.tp-fig img{display:block;width:100%;height:auto}',
    '.tp-fig figcaption{padding:10px 14px;font-size:12.5px;color:var(--txt-dim);border-top:1px solid var(--line);background:var(--ink-2)}',
    '[data-theme="light"] .tp{background:#fff}',
    '[data-theme="light"] .tp-a-in code{background:rgba(30,41,69,.08)}',
    '@media(max-width:640px){.tp-a-in{padding-left:20px}.tp-tag{display:none}}'
  ].join('\n');
  document.head.appendChild(st);

  function fig(src, alt, cap, docUrl) {
    return '<figure class="tp-fig"><img src="' + src + '" alt="' + alt + '" loading="lazy" '
      + 'onerror="this.closest(\'.tp-fig\').style.display=\'none\'">'
      + '<figcaption>' + cap + ' · <a href="' + docUrl + '" target="_blank" rel="noopener">Microsoft Learn ↗</a></figcaption></figure>';
  }

  function topicList(items, color) {
    return '<div class="tp-list">' + items.map(function (t, i) {
      return '<div class="tp" style="--tpc:' + color + '">'
        + '<button class="tp-q" aria-expanded="false">'
        + '<span class="tp-n">' + (i + 1) + '</span><span>' + t.t + '</span>'
        + '<span class="tp-tag">' + t.tag + '</span><span class="chev">\u25BC</span></button>'
        + '<div class="tp-a"><div class="tp-a-in">' + t.a + '</div></div></div>';
    }).join('') + '</div>';
  }

  function wireTopics(scope) {
    $$('.tp-q', scope).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tp = btn.closest('.tp'), body = tp.querySelector('.tp-a');
        var open = tp.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
        body.style.maxHeight = open ? body.scrollHeight + 'px' : '0px';
      });
    });
  }

  /* ================= AI BUILDER — 10 STUDY TOPICS ================= */
  var AIB_IMG = 'https://learn.microsoft.com/en-us/ai-builder/media/power-automate-ai-models.png';
  var AIB = [
    { t: 'What is AI Builder & the AI hub', tag: 'Concept',
      a: 'AI Builder is the <b>point-and-click AI layer of Power Platform</b> — you add intelligence to apps, flows and agents without writing ML code.'
       + '<ul><li>Lives in the maker portal: <b>make.powerapps.com → More → AI hub → AI models</b> (pin it for quick access).</li>'
       + '<li>Every model is either <b>prebuilt</b> (ready to use) or <b>custom</b> (you train on your data, then publish).</li>'
       + '<li>Published models are consumed from <b>Power Apps formulas</b>, the <b>Power Automate “Predict” / model actions</b>, and <b>Copilot Studio prompts</b>.</li></ul>'
       + fig(AIB_IMG, 'The AI models page in the Power Platform maker portal, listing prebuilt and custom AI Builder model types', 'The AI hub → AI models page — pick a model type to start building', 'https://learn.microsoft.com/ai-builder/model-types') },
    { t: 'Prebuilt vs custom — how to choose', tag: 'Decision',
      a: '<b>Prebuilt</b> when the pattern is universal: invoices, receipts, IDs, sentiment, OCR — zero training, instant value. <b>Custom</b> when your layout, vocabulary or data is unique.'
       + '<ul><li>Custom = bring samples → train → quick-test → publish.</li>'
       + '<li>Rule of thumb: <b>try prebuilt first</b>; go custom only when accuracy on YOUR data demands it.</li>'
       + '<li>Custom models live in Dataverse, so they travel with <b>solutions/ALM</b>.</li></ul>' },
    { t: 'Document processing (custom)', tag: 'Custom model',
      a: 'The flagship custom model — extract fields and tables from <b>your</b> forms, invoices and contracts.'
       + '<ul><li>Upload sample documents (5–15 to start), <b>tag fields, tables and checkboxes</b> on the canvas.</li>'
       + '<li>Train, review confidence scores per field, then publish.</li>'
       + '<li>In a flow: “Extract information from documents” → map fields to Dataverse/SharePoint.</li>'
       + '<li>Two engines: <b>structured/semi-structured</b> docs (fixed layout) vs <b>unstructured</b> (free-form, GPT-powered).</li></ul>' },
    { t: 'Prebuilt document models', tag: 'Prebuilt',
      a: '<b>Invoice processing, receipt processing, ID reader, business card reader, contract processing</b> and <b>text recognition (OCR)</b>.'
       + '<ul><li>No training — send a file or image, get structured JSON back.</li>'
       + '<li>Invoice model returns vendor, totals, line items + per-field confidence.</li>'
       + '<li>OCR works on printed AND handwritten text, images or PDFs.</li></ul>' },
    { t: 'Text intelligence', tag: 'Prebuilt',
      a: '<ul><li><b>Sentiment analysis</b> — positive/negative/neutral with scores, sentence-level too.</li>'
       + '<li><b>Key phrase extraction</b> — “the food was amazing but service slow” → food, service.</li>'
       + '<li><b>Language detection</b> (then pipe into translation), <b>text translation</b>.</li>'
       + '<li><b>Entity extraction</b> — prebuilt (people, dates, emails…) or custom lists/patterns.</li>'
       + '<li><b>Category classification</b> — tag feedback/tickets with your own categories (custom).</li></ul>' },
    { t: 'Prediction', tag: 'Custom model',
      a: 'Predict outcomes from your own <b>Dataverse history</b> — churn risk, late payment, delivery ETA.'
       + '<ul><li>Pick the table → pick the <b>outcome column</b> → AI Builder suggests the influencing columns.</li>'
       + '<li>Binary (yes/no) or numeric predictions; model performance grade (A–D) shown after training.</li>'
       + '<li>Schedule retraining so the model tracks your data drift.</li></ul>' },
    { t: 'Object detection & image description', tag: 'Images',
      a: '<ul><li><b>Object detection (custom)</b> — upload photos, draw boxes around your products, train; then count/locate items on retail shelves, inspections, quality checks.</li>'
       + '<li><b>Image description (prebuilt)</b> — generate a natural-language caption for any image: accessibility alt text, auto-tagging libraries.</li></ul>' },
    { t: 'AI prompts (prompt builder)', tag: 'Generative',
      a: 'Reusable <b>GPT prompts</b> you design once and call anywhere.'
       + '<ul><li>Instructions + <b>input variables</b> (text, document, image); output as text or structured <b>JSON</b>.</li>'
       + '<li><b>Grounding on Dataverse</b> rows, file inputs, even code interpreter for calculations.</li>'
       + '<li>Saved to the <b>prompt library</b> with ALM, RBAC and sharing; callable from flows, apps and Copilot Studio topics.</li>'
       + '<li>Test with sample data, iterate on wording — prompts are versioned with your solution.</li></ul>' },
    { t: 'Using models in apps & flows', tag: 'How-to',
      a: '<ul><li><b>Power Automate</b> — each model adds actions (e.g. “Extract information from invoices”, “Analyze sentiment”); drop them after triggers like “when an email arrives”.</li>'
       + '<li><b>Canvas apps</b> — AI Builder controls (form processor, object detector, text recognizer) or call the model via formulas.</li>'
       + '<li><b>Copilot Studio</b> — attach prompts as agent tools so agents can classify/extract mid-conversation.</li></ul>' },
    { t: 'Licensing: Copilot Credits', tag: 'Licensing',
      a: 'AI Builder consumption is billed in <b>Copilot Credits</b> (successor to AI Builder credits).'
       + '<ul><li>Credits come from <b>capacity add-on packs</b> or <b>pay-as-you-go</b> (Azure subscription).</li>'
       + '<li>Some capacity is <b>seeded</b> with premium licenses (Power Apps/Power Automate Premium, D365).</li>'
       + '<li>Different models burn different rates — heavy document processing costs more than sentiment.</li></ul>'
       + 'Docs: <a href="https://learn.microsoft.com/ai-builder/administer-licensing" target="_blank" rel="noopener">AI Builder licensing ↗</a>' }
  ];

  function initAIBuilder() {
    var res = document.getElementById('resources');
    if (!res || document.getElementById('ai-builder')) return;
    var sec = document.createElement('section');
    sec.id = 'ai-builder';
    sec.innerHTML = '<div class="wrap">'
      + '<div class="sec-tag rv on"><b>✦</b> AI Builder</div>'
      + '<h2 class="sec-title rv on">Add AI to any app or flow.<br><span class="hl">No data science degree.</span></h2>'
      + '<p class="sec-sub rv on">Study AI Builder topic by topic — from the AI hub and model types to prompts and licensing. Expand each topic; screenshots show the real Microsoft UI.</p>'
      + topicList(AIB, 'var(--c-copilot)')
      + '</div>';
    res.parentNode.insertBefore(sec, res);
    wireTopics(sec);
  }

  /* ================= COPILOT STUDIO — 11 STUDY TOPICS ================= */
  var COP_IMG_TOPICS = 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/media/authoring-create-edit-topics/topics-question.png';
  var COP_IMG_KNOW = 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/media/knowledge/overview-knowledge-web-search.png';
  var COP = [
    { t: 'What is Copilot Studio', tag: 'Concept',
      a: 'A <b>graphical, low-code studio</b> for building and managing AI agents and workflows — at <b>copilotstudio.microsoft.com</b>.'
       + '<ul><li><b>Agents</b> — AI assistants that converse and complete tasks using instructions, knowledge and tools.</li>'
       + '<li><b>Agent flows</b> — Power-Automate-style flows native to Copilot Studio; standalone or attached to an agent as a tool.</li>'
       + '<li><b>Workflows</b> — drag-and-drop automations Copilot Studio helps generate and validate end to end.</li>'
       + '<li>Also used to <b>extend Microsoft 365 Copilot</b> with your own instructions, tools and knowledge.</li></ul>' },
    { t: 'Anatomy of an agent', tag: 'Concept',
      a: 'Five building blocks you configure, then publish:'
       + '<ul><li><b>Instructions</b> — natural-language purpose, tone and guardrails.</li>'
       + '<li><b>Knowledge</b> — sources the agent grounds answers in.</li>'
       + '<li><b>Topics</b> — authored dialogs for critical paths.</li>'
       + '<li><b>Tools</b> — actions the agent can take (connectors, flows, prompts, MCP).</li>'
       + '<li><b>Channels</b> — where users meet it (Teams, M365 Copilot, web).</li></ul>' },
    { t: 'Generative orchestration', tag: 'AI',
      a: 'An LLM <b>planner</b> replaces rigid trigger phrases.'
       + '<ul><li>Understands <b>multi-intent</b> utterances (“book leave AND tell me the policy”).</li>'
       + '<li>Extracts entities, then <b>chains topics, actions and knowledge</b> dynamically in one turn.</li>'
       + '<li>Your job shifts from scripting dialogs to <b>curating building blocks</b> — clear tool descriptions, scoped knowledge, good instructions.</li>'
       + '<li>Trade-off: non-determinism → test broadly; use classic topics where an exact flow is mandatory.</li></ul>' },
    { t: 'Knowledge & generative answers', tag: 'AI',
      a: 'Ground the agent in your content so answers are <b>summarized, validated and cited</b>.'
       + '<ul><li>Sources: <b>SharePoint, OneDrive, Dataverse, public websites, uploaded files, Graph connectors</b>.</li>'
       + '<li>No FAQ authoring — point at content and the agent answers from it.</li>'
       + '<li>Control whether the agent may fall back to <b>ungrounded (general AI) answers</b>.</li></ul>'
       + fig(COP_IMG_KNOW, 'Copilot Studio knowledge page with web search and SharePoint sources configured', 'Adding knowledge sources — the agent grounds answers here with citations', 'https://learn.microsoft.com/microsoft-copilot-studio/knowledge-copilot-studio') },
    { t: 'Topics — the authoring canvas', tag: 'Authoring',
      a: 'Authored dialogs for business-critical paths, on a visual canvas of <b>nodes</b>.'
       + '<ul><li>Trigger phrases (or let orchestration route), <b>question nodes with slot filling</b>, variables, conditions, Adaptive Cards.</li>'
       + '<li>Exact wording where compliance demands it — mix freely with generative answers for the long tail.</li>'
       + '<li>Test utterance-by-utterance in the built-in test pane.</li></ul>'
       + fig(COP_IMG_TOPICS, 'Copilot Studio topic authoring canvas showing a question node with identity and entity selection', 'The topic canvas — question nodes, entities and branching', 'https://learn.microsoft.com/microsoft-copilot-studio/authoring-create-edit-topics') },
    { t: 'Agent tools', tag: 'Tools',
      a: 'An agent that can <b>act</b>, not just chat:'
       + '<ul><li><b>Connector actions</b> — 1,500+ Power Platform connectors.</li>'
       + '<li><b>Agent flows</b> — multi-step automations (Power Automate) as tools.</li>'
       + '<li><b>AI prompts</b> — prompt-builder prompts for classify/extract/summarize.</li>'
       + '<li><b>MCP servers</b> and <b>REST APIs</b> — plug in any system.</li>'
       + '<li>The planner picks a tool from its <b>description</b> — descriptions are the new code.</li></ul>' },
    { t: 'Autonomous agents & triggers', tag: 'Automation',
      a: 'Agents that act <b>without a chat turn</b>.'
       + '<ul><li><b>Event triggers</b> — new email, Dataverse row, SharePoint file.</li>'
       + '<li><b>Schedule triggers</b> — run every morning at 8, weekly summaries.</li>'
       + '<li>Classic uses: inbox triage, document processing, record enrichment.</li>'
       + '<li>Govern like any automation: environment routing, DLP, run analytics.</li></ul>' },
    { t: 'Computer use (CUA)', tag: 'Tools',
      a: 'Vision-driven UI automation for apps with <b>no API</b> — the agent watches the screen and clicks/types.'
       + '<ul><li>Hosted machines for prototypes; <b>BYO machines</b> (Entra + Intune) for production.</li>'
       + '<li>Use CUA when UIs shift; classic <b>RPA</b> when speed and stability rule.</li></ul>' },
    { t: 'Channels & publishing', tag: 'Deploy',
      a: 'Publish once, run everywhere:'
       + '<ul><li><b>Teams</b>, <b>Microsoft 365 Copilot</b>, <b>web chat</b> (demo site or your own).</li>'
       + '<li>Custom apps via <b>Direct Line / API</b>; omnichannel for customer service; voice.</li>'
       + '<li>Per-channel authentication — Entra ID for internal, or no-auth for public FAQ bots.</li></ul>' },
    { t: 'Analytics & evaluations', tag: 'Operate',
      a: '<ul><li>Sessions, <b>resolution and escalation rates</b>, CSAT.</li>'
       + '<li><b>Transcript mining</b> surfaces unanswered questions — your backlog of new topics/knowledge writes itself.</li>'
       + '<li><b>Evaluations</b> — validate quality with test sets and a grader library before and after publish.</li></ul>' },
    { t: 'Security, governance & licensing', tag: 'Govern',
      a: '<ul><li><b>Entra ID</b> auth, <b>DLP policies</b>, environment routing, per-agent sharing, agent inventory in the admin center.</li>'
       + '<li>Generative answers are grounded and moderated — <b>tenant data is never used to train models</b>.</li>'
       + '<li>Billed via <b>Copilot Credits</b> — capacity packs or PAYG; the chosen <b>harness</b> affects billing and capabilities.</li></ul>'
       + 'Docs: <a href="https://learn.microsoft.com/microsoft-copilot-studio/guidance/" target="_blank" rel="noopener">Copilot Studio guidance ↗</a>' }
  ];

  function initCopilot() {
    var res = document.getElementById('resources');
    if (!res || document.getElementById('copilot')) return;
    var sec = document.createElement('section');
    sec.id = 'copilot';
    sec.innerHTML = '<div class="wrap">'
      + '<div class="sec-tag rv on"><b>🤖</b> Copilot Studio</div>'
      + '<h2 class="sec-title rv on">Build <span class="hl">agents</span>,<br>not chatbots.</h2>'
      + '<p class="sec-sub rv on">The complete Copilot Studio study path — orchestration, knowledge, topics, tools, autonomous agents, channels and governance. Expand each topic; screenshots show the real Microsoft UI.</p>'
      + topicList(COP, 'var(--c-flow)')
      + '</div>';
    res.parentNode.insertBefore(sec, res);
    wireTopics(sec);
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
