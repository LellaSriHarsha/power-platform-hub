/* ============================================================
   POWERVERSE hub-ai.js — AI Builder & Copilot Studio (P4)
   ------------------------------------------------------------
   Deep study TOPICS with a curated YouTube video per topic:
   • #ai-builder — 10 topics, official MS UI screenshot
   • #copilot    — 11 topics, official MS UI screenshots
   • Videos render as click-to-play facades (youtube-nocookie
     iframe only loads on click — fast + privacy friendly)
   • +7 interview questions, nav links, nav nowrap fix
   Repo-owned; tag re-injected by scripts/apply-growth-patches.sh
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s) };
  var $$ = function (s, p) { return Array.prototype.slice.call((p || document).querySelectorAll(s)) };

  var st = document.createElement('style');
  st.textContent = [
    '.nav-links a{white-space:nowrap}',
    '@media(min-width:1101px){.nav-links{overflow-x:auto;scrollbar-width:none;max-width:100%}.nav-links::-webkit-scrollbar{display:none}}',
    '.tp-list{margin-top:26px;display:flex;flex-direction:column;gap:10px}',
    '.tp{border:1px solid var(--line);border-radius:14px;background:var(--ink-2);overflow:hidden;transition:border-color .25s}',
    '.tp:hover,.tp.open{border-color:var(--tpc,var(--c-copilot))}',
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
    '.tp-h{display:block;margin:14px 0 4px;font-size:11px;font-weight:800;letter-spacing:.6px;text-transform:uppercase;color:var(--tpc,var(--c-copilot))}',
    '.tp-fig{margin:14px 0 4px;border:1px solid var(--line);border-radius:12px;overflow:hidden;background:#fff}',
    '.tp-fig img{display:block;width:100%;height:auto}',
    '.tp-fig figcaption{padding:10px 14px;font-size:12.5px;color:var(--txt-dim);border-top:1px solid var(--line);background:var(--ink-2)}',
    '.tp-vid{display:flex;gap:14px;align-items:center;margin-top:8px;border:1px solid var(--line);border-radius:12px;padding:10px;cursor:pointer;background:var(--ink-3,rgba(148,163,204,.05));transition:border-color .25s}',
    '.tp-vid:hover{border-color:#f43f5e}',
    '.tp-vid-thumb{position:relative;flex:none;width:150px;aspect-ratio:16/9;border-radius:8px;overflow:hidden;background:#0b0e18}',
    '.tp-vid-thumb img{width:100%;height:100%;object-fit:cover;display:block}',
    '.tp-vid-thumb::after{content:"\\25B6";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:22px;color:#fff;background:rgba(8,11,22,.45);transition:background .25s}',
    '.tp-vid:hover .tp-vid-thumb::after{background:rgba(244,63,94,.55)}',
    '.tp-vid-meta{font-size:13px;font-weight:600;color:var(--txt)}',
    '.tp-vid-meta span{display:block;margin-top:3px;font-size:11.5px;font-weight:500;color:var(--txt-dim)}',
    '.tp-vid iframe{width:100%;aspect-ratio:16/9;border:0;border-radius:8px;display:block}',
    '[data-theme="light"] .tp{background:#fff}',
    '[data-theme="light"] .tp-vid{background:#f4f6fc}',
    '[data-theme="light"] .tp-a-in code{background:rgba(30,41,69,.08)}',
    '@media(max-width:640px){.tp-a-in{padding-left:20px}.tp-tag{display:none}.tp-vid{flex-direction:column;align-items:stretch}.tp-vid-thumb{width:100%}}'
  ].join('\n');
  document.head.appendChild(st);

  function fig(src, alt, cap, docUrl) {
    return '<figure class="tp-fig"><img src="' + src + '" alt="' + alt + '" loading="lazy" '
      + 'onerror="this.closest(\'.tp-fig\').style.display=\'none\'">'
      + '<figcaption>' + cap + ' · <a href="' + docUrl + '" target="_blank" rel="noopener">Microsoft Learn ↗</a></figcaption></figure>';
  }

  function vid(v) {
    if (!v) return '';
    return '<span class="tp-h">▶ Watch — best video for this topic</span>'
      + '<div class="tp-vid" data-vid="' + v.i + '" role="button" tabindex="0">'
      + '<div class="tp-vid-thumb"><img src="https://i.ytimg.com/vi/' + v.i + '/hqdefault.jpg" alt="" loading="lazy" '
      + 'onerror="this.src=\'https://i.ytimg.com/vi/' + v.i + '/mqdefault.jpg\'"></div>'
      + '<div class="tp-vid-meta">' + v.t + '<span>YouTube · click to play here</span></div></div>';
  }

  function topicList(items, color) {
    return '<div class="tp-list">' + items.map(function (t, i) {
      return '<div class="tp" style="--tpc:' + color + '">'
        + '<button class="tp-q" aria-expanded="false">'
        + '<span class="tp-n">' + (i + 1) + '</span><span>' + t.t + '</span>'
        + '<span class="tp-tag">' + t.tag + '</span><span class="chev">\u25BC</span></button>'
        + '<div class="tp-a"><div class="tp-a-in">' + t.a + vid(t.v) + '</div></div></div>';
    }).join('') + '</div>';
  }

  function wireTopics(scope) {
    $$('.tp-q', scope).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tp = btn.closest('.tp'), body = tp.querySelector('.tp-a');
        var open = tp.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
        if (open) {
          body.style.maxHeight = body.scrollHeight + 'px';
          /* after the transition, release the cap so lazy images can grow it */
          setTimeout(function () { if (tp.classList.contains('open')) body.style.maxHeight = 'none' }, 480);
        } else {
          body.style.maxHeight = body.scrollHeight + 'px';
          requestAnimationFrame(function () { requestAnimationFrame(function () { body.style.maxHeight = '0px' }) });
        }
      });
    });
    $$('.tp-vid', scope).forEach(function (el) {
      function play() {
        el.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + el.dataset.vid
          + '?autoplay=1&rel=0" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
        el.style.cursor = 'default';
      }
      el.addEventListener('click', play);
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play() } });
    });
  }

  /* ================= 1. AI BUILDER ================= */
  var AIB = [
    { t: 'What is AI Builder? (and the new AI hub)', tag: 'Concept',
      v: { i: 'iEE7FTi05hE', t: 'Get started with AI Builder in the Power Platform' },
      a: 'AI Builder is the <b>low-code AI layer of the Power Platform</b>. It lets you add intelligence — read documents, classify text, detect objects, predict outcomes — without training infrastructure or data-science code, then consume the result directly in <b>Power Apps</b> and <b>Power Automate</b>.'
      + '<span class="tp-h">Key concepts</span><ul>'
      + '<li>Everything starts in the <b>AI hub</b> (<code>make.powerapps.com</code> → AI hub / AI models) — the gallery of every <b>prebuilt</b> and <b>custom</b> model in your environment.</li>'
      + '<li><b>Model lifecycle:</b> create → train → review performance (accuracy / confidence) → <b>publish</b> → consume → monitor.</li>'
      + '<li>Models are <b>Dataverse-bound</b>: they live in an environment, travel with solutions (ALM), and are secured by the <b>Basic User</b> / environment security roles.</li>'
      + '<li>Output is a <b>confidence score</b> plus structured fields — always design for the low-confidence case.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Custom-model training data must live in <b>Dataverse</b> — plan your tables before you build.</li>'
      + '<li>Premium: AI Builder is not in standard Office 365 seeded rights — see the <b>Licensing</b> topic below.</li></ul>'
      + fig('https://learn.microsoft.com/en-us/ai-builder/media/overview-of-model-types/power-automate-ai-models.png',
            'The AI models page in the Power Platform maker portal',
            'The <b>AI hub → AI models</b> page: every prebuilt and custom model you can use, one click away',
            'https://learn.microsoft.com/en-us/ai-builder/prebuilt-overview')
      + 'Docs: <a href="https://learn.microsoft.com/en-us/ai-builder/overview" target="_blank" rel="noopener">AI Builder overview</a> · <a href="https://learn.microsoft.com/en-us/ai-builder/use-in-powerapps-overview" target="_blank" rel="noopener">Use in Power Apps</a>' },

    { t: 'Prebuilt vs custom models — the decision guide', tag: 'Concept',
      v: { i: '0HwPAUzL98U', t: 'How to use Power Platform pre-built AI models' },
      a: 'The first architectural choice: <b>prebuilt</b> (Microsoft-trained, zero data, works day one) vs <b>custom</b> (you train on your documents/images/data for your exact scenario).'
      + '<span class="tp-h">Decision rules</span><ul>'
      + '<li><b>Prebuilt</b> when the scenario is generic — invoices, receipts, business cards, ID documents, sentiment, key phrases, OCR. No training, no data, just call it.</li>'
      + '<li><b>Custom</b> when your documents/terms are specific — your PO form, your product catalog, industry vocabulary.</li>'
      + '<li>Custom needs samples: <b>5–15+ documents per layout</b> (document processing), <b>15+ images per object</b> (detection), <b>50+ rows per class</b> (text classification).</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Prebuilt ≠ free — every call still <b>bills AI Builder credits</b>.</li>'
      + '<li>Start prebuilt for an MVP; go custom only when prebuilt accuracy is insufficient. Hybrid flows are common (prebuilt OCR → custom classification).</li></ul>'
      + 'Docs: <a href="https://learn.microsoft.com/en-us/ai-builder/prebuilt-overview" target="_blank" rel="noopener">Prebuilt models</a> · <a href="https://learn.microsoft.com/en-us/ai-builder/build-model" target="_blank" rel="noopener">Build a custom model</a>' },

    { t: 'Custom document processing (form processing)', tag: 'Build',
      v: { i: '1b3DlAct21I', t: 'Extract data from invoices using a document processing model' },
      a: 'The flagship custom scenario: teach AI Builder <b>your</b> invoices, POs or contracts and extract structured fields/tables automatically.'
      + '<span class="tp-h">Build steps</span><ul>'
      + '<li>Create a <b>Document processing</b> model in the AI hub and upload at least <b>5 sample documents per layout</b> (one <b>collection</b> per vendor/layout).</li>'
      + '<li><b>Tag</b> the fields, checkboxes and <b>tables</b> (line items) you want extracted; then train and review the model performance page.</li>'
      + '<li><b>Publish</b>, then call it from a flow action <code>Extract information from documents</code> (or the Power Apps <b>Document processor</b> control) and map outputs to Dataverse / SharePoint.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Supported files: PDF, JPG, PNG (limits apply) — bad scans kill accuracy.</li>'
      + '<li>Keep layouts in separate collections; mixing layouts in one collection confuses training.</li>'
      + '<li>Always branch on <b>confidence score</b> — route low-confidence items to human review.</li></ul>'
      + 'Docs: <a href="https://learn.microsoft.com/en-us/ai-builder/form-processing-model-overview" target="_blank" rel="noopener">Document processing overview</a>' }
  ];

  AIB.push(
    { t: 'Prebuilt document models — invoices, receipts, IDs, OCR', tag: 'Prebuilt',
      v: { i: 'NM1-DaYkHN8', t: 'AI Builder invoice processing — Power Automate tutorial' },
      a: 'Prebuilt document models are <b>zero-training</b>: send a file, get structured JSON back. The fastest win in AI Builder.'
      + '<span class="tp-h">The lineup</span><ul>'
      + '<li><b>Invoice processing</b> — vendor, totals, due date, line items.</li>'
      + '<li><b>Receipt processing</b> — merchant, date, tax, total (expense apps).</li>'
      + '<li><b>ID document reader</b> — passports and driving licences.</li>'
      + '<li><b>Business card reader</b> — straight into a Contacts table.</li>'
      + '<li><b>Text recognition (OCR)</b> — printed + handwritten text from images/PDFs.</li></ul>'
      + '<span class="tp-h">How to use</span><ul>'
      + '<li>In Power Automate: action like <code>Extract information from invoices</code> → dynamic content fields appear automatically.</li>'
      + '<li>In Power Apps: <b>formula-powered</b> models — e.g. <code>\'Invoice processor\'.Predict(Image1.Image)</code>, no flow needed.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Fields vary by document quality — always null-check outputs.</li>'
      + '<li>If accuracy on <i>your</i> invoices is poor, that is the signal to go <b>custom</b> (previous topic).</li></ul>'
      + 'Docs: <a href="https://learn.microsoft.com/en-us/ai-builder/prebuilt-invoice-processing" target="_blank" rel="noopener">Invoice processing</a> · <a href="https://learn.microsoft.com/en-us/ai-builder/prebuilt-text-recognition" target="_blank" rel="noopener">Text recognition</a>' },

    { t: 'Text intelligence — classification, sentiment, entities', tag: 'Prebuilt + Custom',
      v: { i: 'qgz5xCACXvs', t: 'Create a text classification model using AI Builder' },
      a: 'Everything you can do with raw text — the backbone of triage, routing and feedback-analysis solutions.'
      + '<span class="tp-h">The capabilities</span><ul>'
      + '<li><b>Category classification (custom)</b> — your own tags on emails/feedback/tickets; needs <b>50+ rows per tag</b> in Dataverse, supports multi-label.</li>'
      + '<li><b>Sentiment analysis (prebuilt)</b> — positive/negative/neutral/mixed at document <i>and</i> sentence level.</li>'
      + '<li><b>Key phrase extraction</b> and <b>language detection</b> (prebuilt).</li>'
      + '<li><b>Entity extraction (custom)</b> — pull <i>your</i> entities (product names, policy numbers) out of free text.</li></ul>'
      + '<span class="tp-h">Typical pattern</span><ul>'
      + '<li>Flow trigger on new email/feedback → classify → <b>switch on category</b> → route to the right queue + sentiment for priority escalation.</li></ul>'
      + 'Docs: <a href="https://learn.microsoft.com/en-us/ai-builder/text-classification-overview" target="_blank" rel="noopener">Text classification</a> · <a href="https://learn.microsoft.com/en-us/ai-builder/flow-sentiment-analysis" target="_blank" rel="noopener">Sentiment analysis</a>' },

    { t: 'Prediction models — yes/no on your Dataverse data', tag: 'Custom',
      v: { i: 'xsnRv9ttsaw', t: 'How to use Power Platform custom-built AI models' },
      a: 'Prediction answers a <b>binary business question</b> from your historical Dataverse data: <i>will this deal close? will this shipment be late? will this customer churn?</i>'
      + '<span class="tp-h">Build steps</span><ul>'
      + '<li>Pick the Dataverse table + the <b>outcome column</b> (the historical yes/no you want to predict).</li>'
      + '<li>Select the <b>input columns</b> the model may learn from — drop anything that leaks the answer.</li>'
      + '<li>Train, then read the <b>performance grade (A–D)</b> and the <b>most influential factors</b> before publishing.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Binary outcomes only — multi-class is not supported.</li>'
      + '<li>Garbage in, garbage out: you need enough historical rows and clean labels.</li>'
      + '<li>Scheduled <b>batch scoring</b> writes predictions + explanation back into a column — great for list views and proactive flows.</li></ul>'
      + 'Docs: <a href="https://learn.microsoft.com/en-us/ai-builder/prediction-overview" target="_blank" rel="noopener">Prediction overview</a>' },

    { t: 'Object detection & image description', tag: 'Custom / Prebuilt',
      v: { i: 'R4LYI8f46ic', t: 'Using the Power Apps AI Builder Object Detector' },
      a: '<b>Custom object detection</b> finds and counts <i>your</i> objects in photos (retail shelf audits, quality inspection, inventory). <b>Image description</b> is the prebuilt counterpart: it captions any image (also great for alt text).'
      + '<span class="tp-h">Object detection build steps</span><ul>'
      + '<li>Choose <b>domain</b>: common objects, retail shelves, or brand logos.</li>'
      + '<li>Upload <b>15+ images per object name</b>, draw bounding boxes, train, publish.</li>'
      + '<li>Consume with the Power Apps <b>Object detector</b> control (camera-based, real-time) or the flow action.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Training photos must look like production photos — same angles, lighting, backgrounds.</li>'
      + '<li>Use the returned <b>count</b> + confidence to drive out-of-stock or pass/fail logic.</li></ul>'
      + 'Docs: <a href="https://learn.microsoft.com/en-us/ai-builder/object-detection-overview" target="_blank" rel="noopener">Object detection</a> · <a href="https://learn.microsoft.com/en-us/ai-builder/prebuilt-image-description" target="_blank" rel="noopener">Image description</a>' }
  );

  AIB.push(
    { t: 'AI prompts — GPT power inside the platform', tag: 'Prompts',
      v: { i: 'en8ZX_GDZEY', t: 'Make your own custom AI Builder prompts for the Power Platform' },
      a: '<b>AI prompts</b> (the <b>Prompt builder</b>, formerly “GPT prompts”) let you write a natural-language instruction against your data and run it as a reusable, governed platform asset — no OpenAI account or API key needed.'
      + '<span class="tp-h">Key concepts</span><ul>'
      + '<li>Author in the AI hub → <b>Prompts</b>: instructions + <b>dynamic inputs</b> (text, documents, images, <b>Dataverse records</b>) + optional grounding.</li>'
      + '<li><b>Test and iterate</b> in the builder, choose the model, then publish — the prompt becomes callable like any model.</li>'
      + '<li>Start from <b>prebuilt prompt templates</b> (summarize, classify, extract, draft replies) and adapt them.</li></ul>'
      + '<span class="tp-h">Killer use cases</span><ul>'
      + '<li>Summarize a case/email thread into a Dataverse column.</li>'
      + '<li>Draft a customer reply from order context.</li>'
      + '<li>Extract structured JSON from messy text where regex fails.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Generative = non-deterministic: validate output (JSON schema / confidence checks) before writing to systems.</li>'
      + '<li>Prompt runs consume <b>Copilot Credits</b> per model used.</li></ul>'
      + 'Docs: <a href="https://learn.microsoft.com/en-us/ai-builder/prompts-overview" target="_blank" rel="noopener">AI prompts overview</a>' },

    { t: 'Using models in apps & flows', tag: 'Integrate',
      v: { i: 'tmxvLAT3C7s', t: 'Document processing with AI Builder in Power Automate' },
      a: 'A published model is consumed in exactly two places — <b>Power Automate actions</b> (back-end automation) and <b>Power Apps</b> (controls or formulas, front-end capture).'
      + '<span class="tp-h">Power Automate</span><ul>'
      + '<li>Actions like <code>Extract information from documents</code>, <code>Analyze sentiment</code>, <code>Run a prompt</code> return dynamic content.</li>'
      + '<li>Pattern: trigger (email/SharePoint/Dataverse) → AI action → <b>condition on confidence</b> → write back / route for review.</li></ul>'
      + '<span class="tp-h">Power Apps</span><ul>'
      + '<li>Modern AI controls: <b>Text recognizer</b>, <b>Form processor / Document processor</b>, <b>Object detector</b>, <b>Business card reader</b>.</li>'
      + '<li>Formula models: <code>ModelName.Predict(input)</code> directly in app formulas for real-time results.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Flow action = async server-side; formula/control = instant client-side. Pick per UX need.</li>'
      + '<li>Models travel with <b>solutions</b> — add the model + its connections for ALM.</li></ul>'
      + 'Docs: <a href="https://learn.microsoft.com/en-us/ai-builder/use-in-flow-overview" target="_blank" rel="noopener">Use in Power Automate</a> · <a href="https://learn.microsoft.com/en-us/ai-builder/use-in-powerapps-overview" target="_blank" rel="noopener">Use in Power Apps</a>' },

    { t: 'AI Builder licensing & Copilot Credits', tag: 'Licensing',
      v: { i: 'MgMuQ-HMMos', t: 'From free to credits — Power Platform licensing explained' },
      a: 'AI Builder consumption is now measured in <b>Copilot Credits</b> (the evolution of “AI Builder credits/service credits”).'
      + '<span class="tp-h">Key concepts</span><ul>'
      + '<li>Credits come <b>bundled</b> with premium licenses (Power Apps/Power Automate premium include a seeded amount) or via <b>add-on capacity packs</b> assigned to the environment.</li>'
      + '<li>Every model call — prebuilt or custom, app or flow — deducts credits; cost <b>varies by model type</b> (OCR page vs GPT prompt).</li>'
      + '<li>Monitor usage in the <b>Power Platform admin center</b> (Copilot → credits/usage reports).</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Out of credits = <b>calls fail</b> — build error handling in flows.</li>'
      + '<li>Estimate volume before production: pages/month × per-page rate.</li></ul>'
      + 'Docs: <a href="https://learn.microsoft.com/en-us/ai-builder/administer-licensing" target="_blank" rel="noopener">AI Builder licensing</a>' }
  );

  function initAIBuilder() {
    if (document.getElementById('ai-builder')) return;
    var s = document.createElement('section');
    s.className = 'section'; s.id = 'ai-builder';
    s.innerHTML = '<div class="container">'
      + '<div class="sec-head"><p class="eyebrow">\uD83E\uDD16 AI Builder</p>'
      + '<h2 class="sec-title">AI Builder, <span class="grad-text">topic by topic</span></h2>'
      + '<p class="sec-sub">Open a topic for the deep dive — concepts, build steps, gotchas, official Microsoft UI screenshots and the best YouTube video for that topic.</p></div>'
      + topicList(AIB, 'var(--c-copilot)')
      + '</div>';
    document.getElementById('resources').before(s);
    wireTopics(s);
  }

  /* ================= 2. COPILOT STUDIO ================= */
  var COP = [
    { t: 'What is Copilot Studio? Agents vs agent flows', tag: 'Concept',
      v: { i: 'dX9MJM5EokE', t: 'How to use Microsoft Copilot Studio — step-by-step tutorial' },
      a: 'Copilot Studio is the <b>low-code platform for building agents</b> — copilots that converse, reason over knowledge, take actions, and run autonomously. It evolved from Power Virtual Agents into a full agent-building platform, and it is also where you <b>extend Microsoft 365 Copilot</b> (declarative agents + Copilot connectors).'
      + '<span class="tp-h">The three things you can build</span><ul>'
      + '<li><b>Agents</b> — conversational, knowledge-grounded assistants published to Teams, web, M365 Copilot.</li>'
      + '<li><b>Agent flows</b> — deterministic Power-Automate-style flows invoked <i>by</i> an agent (or on their own) when you need exact, auditable steps.</li>'
      + '<li><b>Declarative agents</b> — instructions + knowledge + actions that extend Microsoft 365 Copilot itself.</li></ul>'
      + '<span class="tp-h">Where it fits</span><ul>'
      + '<li>Conversational + generative AI → <b>Copilot Studio</b>; deterministic automation → <b>Power Automate</b>; UI → <b>Power Apps</b>. Real solutions mix all three.</li></ul>'
      + 'Docs: <a href="https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-what-is-copilot-studio" target="_blank" rel="noopener">What is Copilot Studio</a> · <a href="https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-build-templates" target="_blank" rel="noopener">Agent templates</a>' },

    { t: 'Anatomy of an agent — instructions, knowledge, topics, tools', tag: 'Concept',
      v: { i: 'HgLlEEMzh4U', t: 'Create your first AI agent in Copilot Studio (no code)' },
      a: 'Every agent is assembled from the same building blocks — understand these and the rest of the platform clicks into place.'
      + '<span class="tp-h">The five building blocks</span><ul>'
      + '<li><b>Instructions</b> — the system prompt: persona, tone, scope, guardrails (“you are an HR assistant, never answer legal questions…”).</li>'
      + '<li><b>Knowledge</b> — grounding sources the agent cites in answers (websites, SharePoint, files, Dataverse…).</li>'
      + '<li><b>Topics</b> — conversation paths (generative or authored) for specific intents like “check order status”.</li>'
      + '<li><b>Tools / actions</b> — connectors, agent flows, prompts the agent can call to <i>do</i> things.</li>'
      + '<li><b>Channels</b> — where the agent is published (Teams, web, M365 Copilot, WhatsApp…).</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Write instructions <b>before</b> adding knowledge — they shape how knowledge is used.</li>'
      + '<li>Small, focused agents beat one mega-agent; compose multiple agents if needed.</li></ul>'
      + 'Docs: <a href="https://learn.microsoft.com/en-us/microsoft-copilot-studio/nlu-boost-conversations" target="_blank" rel="noopener">How agents work (NLU)</a>' },

    { t: 'Generative orchestration — the AI router', tag: 'Key',
      v: { i: 'T7LdkiLq29U', t: 'Understanding generative orchestration topic triggers' },
      a: 'With <b>generative orchestration ON</b>, an AI planner reads the user message and dynamically picks the right <b>topic, tool/action or knowledge source</b> — and can chain several in one turn. This replaced the classic trigger-phrase matching model.'
      + '<span class="tp-h">How it works</span><ul>'
      + '<li>The planner matches intent using the <b>name + description</b> of each topic/tool — descriptions are the new trigger phrases.</li>'
      + '<li>Unknown intent → falls back to <b>generative answers over knowledge</b>, then the <b>Escalate / Unknown</b> system topics.</li>'
      + '<li>One user turn can chain: knowledge answer → action call → follow-up question.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Vague descriptions = wrong routing. Write descriptions like intent statements: “Check the delivery status of a customer order”.</li>'
      + '<li>Use the <b>activity map / test panel</b> to watch which plan the orchestrator chose.</li>'
      + '<li>Classic NLU (trigger phrases) still exists for deterministic scenarios and custom models.</li></ul>'
      + 'Docs: <a href="https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-generative-actions" target="_blank" rel="noopener">Generative orchestration</a>' }
  ];

  COP.push(
    { t: 'Knowledge & generative answers — grounding your agent', tag: 'Key',
      v: { i: 'W53TE5EtBQg', t: 'Mastering generative answers in Copilot Studio' },
      a: 'Knowledge sources let the agent answer questions with <b>generative answers grounded in your content</b>, with citations — instead of hard-coding every Q&A.'
      + '<span class="tp-h">Supported sources</span><ul>'
      + '<li><b>Public websites</b> (up to a URL depth), <b>SharePoint / OneDrive</b>, uploaded <b>documents</b>, <b>Dataverse</b> tables, and enterprise data via <b>Microsoft Graph / Copilot connectors</b>.</li></ul>'
      + '<span class="tp-h">How answers are generated</span><ul>'
      + '<li>User question → search across sources → <b>RAG</b>: relevant chunks + question go to the LLM → answer with <b>source citations</b>.</li>'
      + '<li>Content moderation levels (low/medium/high) control how strictly answers stick to sources.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li><b>Auth matters:</b> SharePoint/Graph knowledge requires user authentication — answers respect each user\u2019s permissions (security trimming). Public web sources work anonymously.</li>'
      + '<li>Curate sources: 3 authoritative pages beat 300 noisy ones. Test with real user phrasing.</li></ul>'
      + fig('https://learn.microsoft.com/en-us/microsoft-copilot-studio/media/knowledge/overview-knowledge-web-search.png',
            'Knowledge sources configuration page in Copilot Studio',
            'The <b>Knowledge</b> page in Copilot Studio — where grounding sources are added',
            'https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio')
      + 'Docs: <a href="https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio" target="_blank" rel="noopener">Add knowledge</a> · <a href="https://learn.microsoft.com/en-us/microsoft-copilot-studio/nlu-boost-conversations" target="_blank" rel="noopener">Generative answers</a>' },

    { t: 'Topics & the authoring canvas', tag: 'Build',
      v: { i: 'TwxCiyuwwuk', t: 'Copilot Studio tutorial — work with topics' },
      a: 'A <b>topic</b> is a conversation path for one intent (“reset password”, “check order status”). Topics are designed on a <b>visual canvas</b> of connected nodes.'
      + '<span class="tp-h">Node types to know</span><ul>'
      + '<li><b>Trigger</b> — by orchestration (description) or trigger phrases (classic NLU).</li>'
      + '<li><b>Question nodes</b> — ask + parse the reply into a typed <b>variable</b> (entity, choice, date…); retry + validation built in.</li>'
      + '<li><b>Messages, Conditions, Variables</b> (global, topic, system; environment-scoped <code>Global.*</code> persists across topics).</li>'
      + '<li><b>Call an action</b> — invoke a flow/connector/prompt; <b>Go to another topic</b>; <b>Generative answers node</b> for scoped knowledge.</li>'
      + '<li><b>End / Escalate / Transfer</b> — finish, hand to a human (Dynamics 365 Customer Service), or survey.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>System topics (Greeting, Escalate, Fallback/Unknown, Conversation Start) — customize, don\u2019t ignore them.</li>'
      + '<li>Keep topics short; chain with “go to topic” instead of mega-canvases.</li></ul>'
      + fig('https://learn.microsoft.com/en-us/microsoft-copilot-studio/media/authoring-create-edit-topics/topics-question.png',
            'Copilot Studio topic authoring canvas with question nodes',
            'The <b>topic authoring canvas</b> — question nodes collect typed variables',
            'https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-create-edit-topics')
      + 'Docs: <a href="https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-create-edit-topics" target="_blank" rel="noopener">Create & edit topics</a>' },

    { t: 'Agent tools — connectors, agent flows, prompts, MCP', tag: 'Build',
      v: { i: 'C_MaFZJMIxQ', t: 'How to create agent flows in Copilot Studio — complete tutorial' },
      a: 'Tools turn an agent from a Q&A bot into a system that <b>acts</b>: create records, send approvals, call APIs. With generative orchestration, the agent decides <i>when</i> to call each tool from its description and auto-fills inputs from the conversation.'
      + '<span class="tp-h">The tool types</span><ul>'
      + '<li><b>Connector actions</b> — 1,400+ Power Platform connectors (Dataverse, SharePoint, Outlook, SAP…).</li>'
      + '<li><b>Agent flows</b> — multi-step deterministic flows for complex or exact logic; can also run standalone.</li>'
      + '<li><b>Prompts</b> — AI Builder GPT prompts as reasoning tools; <b>Custom connectors / REST APIs</b>; <b>MCP servers</b> (Model Context Protocol) for standardized external tools.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Every tool needs a crisp <b>name + description</b> — that is how the planner picks it.</li>'
      + '<li>Decide credentials: run as the <b>user</b> (per-user auth) or the <b>agent author/maker</b>.</li>'
      + '<li>Mark outputs/inputs clearly; orchestrator maps slots by name and description.</li></ul>'
      + 'Docs: <a href="https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-plugin-actions" target="_blank" rel="noopener">Add actions (tools)</a> · <a href="https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-flows" target="_blank" rel="noopener">Agent flows</a>' },

    { t: 'Autonomous agents & triggers', tag: 'Advanced',
      v: { i: 'aBEUc4-abfw', t: 'How to build an autonomous agent in Copilot Studio (step by step)' },
      a: 'Autonomous agents <b>start themselves</b> — no user message needed. An <b>event trigger</b> (new email, new SharePoint file, Dataverse row created, schedule) wakes the agent, which then reasons, uses knowledge/tools, and completes a task end-to-end.'
      + '<span class="tp-h">How to build one</span><ul>'
      + '<li>Add a <b>trigger</b> to the agent (Overview → Triggers): choose the connector event + payload.</li>'
      + '<li>Write <b>instructions</b> describing the end-to-end job, attach the <b>tools</b> it may call, and test from the trigger test panel.</li>'
      + '<li>Classic scenarios: triage incoming support emails, process invoices landing in a mailbox, monitor Dataverse and act.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Design for unattended runs: strict instructions, narrow tools, and a <b>human-escalation path</b> (approval or handoff) for edge cases.</li>'
      + '<li>Watch credit consumption — every autonomous run bills Copilot Credits.</li></ul>'
      + 'Docs: <a href="https://learn.microsoft.com/en-us/microsoft-copilot-studio/autonomous-agents" target="_blank" rel="noopener">Autonomous agents</a>' }
  );

  COP.push(
    { t: 'Computer use — agents that operate a desktop', tag: 'Frontier',
      v: { i: 'kFvgizFVbMM', t: 'Automate any task with computer-using agents (CUA)' },
      a: '<b>Computer use</b> gives an agent (or agent flow) a <b>hosted Windows machine</b> where a Computer-Using Agent (CUA) model clicks, types and navigates apps and websites — for systems with <b>no API or connector</b> (legacy ERP, old web portals).'
      + '<span class="tp-h">How it works</span><ul>'
      + '<li>You describe the task in natural language; the CUA model sees screenshots and plans mouse/keyboard actions step by step.</li>'
      + '<li>Runs on Microsoft-hosted (or your own) Windows environments with managed credentials.</li>'
      + '<li>Think of it as <b>UI automation by AI</b> — complement to (not replacement for) API connectors.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Slower and less deterministic than APIs — prefer a connector whenever one exists.</li>'
      + '<li>UI changes can break runs; add validation steps and human review for critical tasks.</li></ul>'
      + 'Docs: <a href="https://learn.microsoft.com/en-us/microsoft-copilot-studio/computer-use" target="_blank" rel="noopener">Computer use</a>' },

    { t: 'Channels & publishing — meet users where they are', tag: 'Ship',
      v: { i: '72YcqlrIM84', t: 'How to publish an agent in Copilot Studio (step by step)' },
      a: 'Build once, publish everywhere: <b>Microsoft Teams, Microsoft 365 Copilot, websites (iframe/demo site), SharePoint, Facebook, WhatsApp, Slack, Telegram, Twilio/SMS</b> and more.'
      + '<span class="tp-h">Key concepts</span><ul>'
      + '<li><b>Publish</b> creates a versioned snapshot; channels serve the latest published version.</li>'
      + '<li><b>Authentication</b> choices: no auth (public), authenticate with Microsoft (Entra ID — unlocks SSO in Teams + SharePoint knowledge), or manual (any OAuth2 IdP).</li>'
      + '<li>The <b>demo website</b> channel is perfect for stakeholder testing; the <b>iframe</b> snippet embeds the agent in any site.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Teams channel needs admin approval policies in some tenants.</li>'
      + '<li>Knowledge sources with per-user security require an authenticated channel.</li></ul>'
      + 'Docs: <a href="https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-fundamentals-publish-channels" target="_blank" rel="noopener">Publish & channels</a>' },

    { t: 'Analytics, sessions & evaluations', tag: 'Operate',
      v: { i: 'bqUC0shbD9Q', t: 'How to monitor and maintain your Copilot Studio agents' },
      a: 'After go-live, Copilot Studio analytics tell you what to fix next — treat it as a weekly habit.'
      + '<span class="tp-h">The dashboards</span><ul>'
      + '<li><b>Summary / Engagement</b> — sessions, engagement rate, resolution rate, escalation rate, CSAT.</li>'
      + '<li><b>Topic performance</b> — which topics trigger, abandon, or escalate; spot the broken ones fast.</li>'
      + '<li><b>Generative answers quality</b> — answer rates, unhelpful answers, and the questions with <b>no good source</b> (content gaps).</li>'
      + '<li>Full <b>session transcripts</b> for qualitative review; <b>Activity map</b> for debugging a single run.</li></ul>'
      + '<span class="tp-h">Workflow</span><ul>'
      + '<li>Low resolution on a topic → fix the flow. Unanswered questions → add knowledge. High escalation → add a topic/tool.</li></ul>'
      + 'Docs: <a href="https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-overview" target="_blank" rel="noopener">Analytics overview</a>' },

    { t: 'Security, governance & Copilot Credits', tag: 'Licensing',
      v: { i: 'reU_ljZjC0U', t: 'Copilot Studio licensing A to Z — Copilot Credits explained' },
      a: 'Enterprise-grade guardrails plus a simple consumption model — know both before production.'
      + '<span class="tp-h">Licensing / Copilot Credits</span><ul>'
      + '<li>Agents consume <b>Copilot Credits</b> per response/action: classic answers, generative answers, and actions have different rates; <b>pay-as-you-go</b> (Azure) or prepaid <b>message packs</b>.</li>'
      + '<li>Makers need a <b>Copilot Studio user license</b>; M365 Copilot licenses include usage rights for declarative agents in M365 Copilot.</li></ul>'
      + '<span class="tp-h">Governance</span><ul>'
      + '<li><b>Environments + DLP policies</b> control which connectors agents can use; <b>Entra ID</b> auth; <b>Purview</b> compliance for transcripts.</li>'
      + '<li><b>Generative AI settings</b>: content moderation level, data movement across regions, and whether knowledge can use web search.</li>'
      + '<li>Admin visibility: usage + agent inventory in the <b>Power Platform admin center</b> (Copilot hub).</li></ul>'
      + 'Docs: <a href="https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing" target="_blank" rel="noopener">Billing & licensing</a> · <a href="https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-security-and-governance" target="_blank" rel="noopener">Security & governance</a>' }
  );

  function initCopilot() {
    if (document.getElementById('copilot')) return;
    var s = document.createElement('section');
    s.className = 'section'; s.id = 'copilot';
    s.innerHTML = '<div class="container">'
      + '<div class="sec-head"><p class="eyebrow">\uD83D\uDCAC Copilot Studio</p>'
      + '<h2 class="sec-title">Copilot Studio, <span class="grad-text">topic by topic</span></h2>'
      + '<p class="sec-sub">Open a topic for the deep dive — concepts, build steps, gotchas, official Microsoft UI screenshots and the best YouTube video for that topic.</p></div>'
      + topicList(COP, 'var(--c-flow)')
      + '</div>';
    document.getElementById('resources').before(s);
    wireTopics(s);
  }

  /* ================= 3. INTERVIEW QUESTIONS ================= */
  function initInterview() {
    var list = document.querySelector('#interview .iq-list');
    if (!list || list.querySelector('[data-cat="ai"]')) return;
    var Q = [
      ['How do you choose between a prebuilt and a custom AI Builder model?',
        'Start with a <b>prebuilt</b> model when the scenario is generic (invoices, receipts, sentiment, OCR) — zero training, instant value. Go <b>custom</b> when your documents/terms are specific and prebuilt accuracy is insufficient; custom needs training samples (5–15 docs per layout, 15+ images per object, 50+ rows per class) and they bill the same Copilot Credits.'],
      ['Walk me through building an invoice-processing solution with AI Builder.',
        'Create a <b>document processing</b> model in the AI hub → upload 5+ invoices per vendor layout (one collection per layout) → tag fields and line-item tables → train, review performance, publish → in a flow, trigger on email/SharePoint arrival, run <code>Extract information from documents</code>, branch on <b>confidence score</b> (low → human review), write results to Dataverse and post to Teams.'],
      ['How does generative orchestration differ from classic trigger phrases?',
        'Classic topics fire only when the user message matches <b>trigger phrases</b> (NLU). With <b>generative orchestration</b>, an AI planner reads the message and dynamically chooses and chains <b>topics, actions and knowledge</b> based on their names/descriptions — descriptions become the trigger surface, and one turn can invoke multiple tools.'],
      ['What knowledge sources can ground a Copilot Studio agent, and what is the authentication catch?',
        'Public websites, <b>SharePoint/OneDrive</b>, uploaded files, <b>Dataverse</b>, and enterprise sources via Copilot/Graph connectors. The catch: secured sources (SharePoint/Graph) require <b>user authentication</b> and answers respect each user\u2019s permissions; anonymous users can only use public sources.'],
      ['When would you add an agent flow instead of a topic or connector action?',
        'When the agent must run <b>deterministic, multi-step logic</b>: approvals, loops, exact API sequences, compensation on failure. Topics drive conversation; a single connector action is one call; an <b>agent flow</b> gives auditable, versioned automation the orchestrator can invoke as a tool — and it can also run standalone on a schedule.'],
      ['What are autonomous agents in Copilot Studio and what guardrails do they need?',
        'Agents triggered by <b>events</b> (new email, new file, Dataverse change, schedule) that reason and act without a user prompt. Guardrails: narrowly scoped instructions and tools, confidence-based branching, an explicit <b>human-escalation path</b>, transcript/activity monitoring, and credit-consumption alerts.'],
      ['How is Copilot Studio licensed, and how do you estimate cost?',
        'Usage is billed in <b>Copilot Credits</b> (pay-as-you-go via Azure subscription, or prepaid message packs); rates differ for classic answers, generative answers and actions. Makers need a Copilot Studio user license. Estimate: monthly sessions × actions per session × rate; monitor in the Power Platform admin center Copilot hub.']
    ];
    Q.forEach(function (q) {
      var div = document.createElement('div');
      div.className = 'iq'; div.dataset.cat = 'ai';
      div.innerHTML = '<button class="iq-q" aria-expanded="false"><span>' + q[0] + '</span><span class="chev">\u25BC</span></button>'
        + '<div class="iq-a"><div class="iq-a-in">' + q[1] + '</div></div>';
      list.appendChild(div);
    });
    var chips = $('#iqChips');
    if (chips && !chips.querySelector('[data-cat="ai"]')) {
      var b = document.createElement('button');
      b.className = 'chip'; b.dataset.cat = 'ai'; b.textContent = 'AI & Copilot';
      chips.appendChild(b);
    }
    if (window.PVHUB && window.PVHUB.wireAccordions) window.PVHUB.wireAccordions(list);
    if (window.PVHUB && window.PVHUB.wireInterviewFilters) window.PVHUB.wireInterviewFilters();
  }

  /* ================= 4. NAV + INIT ================= */
  function initNav() {
    var nav = $('#navLinks');
    if (!nav || nav.querySelector('[href="#ai-builder"]')) return;
    var iv = nav.querySelector('[href="#interview"]');
    function mk(href, label) { var a = document.createElement('a'); a.href = href; a.textContent = label; return a }
    if (iv) { iv.after(mk('#copilot', 'Copilot')); iv.after(mk('#ai-builder', 'AI Builder')) }
    else { nav.appendChild(mk('#ai-builder', 'AI Builder')); nav.appendChild(mk('#copilot', 'Copilot')) }
    var fl = $('.footer-links');
    if (fl && !fl.querySelector('[href*="copilot-studio"]')) {
      var a1 = document.createElement('a'); a1.href = 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/'; a1.target = '_blank'; a1.rel = 'noopener'; a1.textContent = 'Copilot Studio Docs';
      var a2 = document.createElement('a'); a2.href = 'https://learn.microsoft.com/en-us/ai-builder/'; a2.target = '_blank'; a2.rel = 'noopener'; a2.textContent = 'AI Builder Docs';
      fl.appendChild(a1); fl.appendChild(a2);
    }
  }

  function init() { initAIBuilder(); initCopilot(); initInterview(); initNav() }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
