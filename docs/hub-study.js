/* ============================================================
   POWERVERSE hub-study.js — unified Study Hub (P5)
   ------------------------------------------------------------
   ONE section (#study) with per-product tabs holding ALL deep
   study material in a single place:
     • Power Apps      — 10 topics  (#pa-study)
     • Power Automate  — 10 topics  (#flow-study)
     • Power Pages     — 8 topics + Liquid/Web API quick
                         reference grid  (#pages-study)
     • AI Builder      — relocated from hub-ai.js (#ai-builder)
     • Copilot Studio  — relocated from hub-ai.js (#copilot)
   Every topic ends with a curated YouTube video LINK that opens
   on youtube.com in a new tab — nothing is embedded in the page.
   Also:
     • consolidates the two AI nav links into one "Study Hub" link
     • nav overflow affordance: edge fades + one-time auto-scroll
       hint so users can tell the top nav scrolls
     • hero stat counters synced with the REAL content counts
       (functions / interview questions / scenarios) so they can
       never go stale again
   Repo-owned; tag re-injected by scripts/apply-growth-patches.sh
   (MUST stay last in the layer list — it counts .iq items and
   relocates hub-ai.js sections).
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s) };
  var $$ = function (s, p) { return Array.prototype.slice.call((p || document).querySelectorAll(s)) };

  /* ================= 1. STYLES ================= */
  var st = document.createElement('style');
  st.id = 'pv-study';
  st.textContent = [
    '/* ---- nav: allow internal scrolling + edge fades ---- */',
    '@media(min-width:1101px){.nav-links{min-width:0;flex:0 1 auto}}',
    '.nav-links.can-scroll{-webkit-mask-image:linear-gradient(90deg,#000 0,#000 86%,transparent 99%);mask-image:linear-gradient(90deg,#000 0,#000 86%,transparent 99%)}',
    '.nav-links.can-scroll:not(.at-start){-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 10%,#000 86%,transparent 99%);mask-image:linear-gradient(90deg,transparent 0,#000 10%,#000 86%,transparent 99%)}',
    '.nav-links.can-scroll.at-end{-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 14%);mask-image:linear-gradient(90deg,transparent 0,#000 14%)}',
    '/* ---- study hub tabs + panels ---- */',
    '#study{scroll-margin-top:84px}',
    '.study-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:36px 0 8px}',
    '.study-tab{display:inline-flex;align-items:center;gap:9px;padding:10px 18px;border-radius:999px;border:1px solid var(--line);background:var(--ink-2);color:var(--txt-dim);font:inherit;font-size:13.5px;font-weight:600;cursor:pointer;transition:.2s}',
    '.study-tab .dot{width:9px;height:9px;border-radius:50%;background:var(--tc)}',
    '.study-tab .cnt{font-family:var(--mono);font-size:11px;color:var(--txt-mute)}',
    '.study-tab:hover{border-color:var(--tc);color:var(--txt)}',
    '.study-tab.on{border-color:var(--tc);color:var(--txt);background:rgba(148,163,204,.08);box-shadow:inset 0 0 18px rgba(148,163,204,.06)}',
    '.study-panel[hidden]{display:none}',
    '[data-theme="light"] .study-tab{background:#fff;border-color:rgba(39,55,91,.18)}',
    '[data-theme="light"] .study-tab.on{background:rgba(39,55,91,.06)}',
    '/* ---- Power Pages quick reference ---- */',
    '.ppref{margin-top:34px;border-top:1px dashed var(--line);padding-top:24px}',
    '.ppref-t{font-size:15px;font-weight:700;color:var(--txt);margin:0 0 4px}',
    '.ppref-s{font-size:13px;color:var(--txt-dim);margin:0}',
    '.ppref-g{margin:20px 0 10px;font-size:11px;font-weight:800;letter-spacing:.6px;text-transform:uppercase;color:var(--c-pages)}',
    '.ppref-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px}',
    '.ppref-item{border:1px solid var(--line);border-radius:10px;padding:10px 12px;background:var(--ink-2)}',
    '.ppref-item code{display:block;color:var(--c-pages);font-size:12.5px;margin-bottom:4px;white-space:normal;word-break:break-word;background:none;padding:0}',
    '.ppref-item span{font-size:12px;color:var(--txt-dim);line-height:1.45}',
    '[data-theme="light"] .ppref-item{background:#fff;border-color:rgba(39,55,91,.15)}'
  ].join('\n');
  document.head.appendChild(st);

  /* ================= 2. POWER APPS TOPICS ================= */
  var PA = [
    { tag: 'Foundations', n: 1, t: 'Canvas apps: build your first app & tour the studio',
      a: 'Canvas apps start from data or a blank screen and give you pixel-level control. The mental model: <b>screens</b> hold <b>controls</b>, and every control <b>property</b> is a live Power Fx formula that recalculates automatically.'
      + '<span class="tp-h">Build steps</span><ul>'
      + '<li>Start at <b>make.powerapps.com</b> → create <i>from data</i> (SharePoint or Dataverse) to get a free 3-screen app: browse → detail → edit.</li>'
      + '<li>Learn the studio rails: Tree view, Insert, Data sources, Media — plus the property panel and formula bar.</li>'
      + '<li>Drive behaviour with properties: <code>Visible</code>, <code>DisplayMode</code>, <code>OnSelect</code> — expressions, never code-behind.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Rename controls before referencing them — <code>galProjects</code> beats <code>Gallery1</code> when formulas grow.</li>'
      + '<li>Auto-generated apps are learning scaffolds: rebuild the screens for production UX.</li></ul>',
      v: { i: 'q2gOaI7EtOc', t: 'Power Apps: Tutorial for Beginners (Build your first Canvas App)' } },
    { tag: 'Power Fx', n: 2, t: 'Power Fx essentials for app makers',
      a: 'Power Fx is the Excel-like, declarative language behind every property. Formulas <b>recalculate live</b> as their inputs change — think spreadsheet, not script.'
      + '<span class="tp-h">What to learn</span><ul>'
      + '<li>Data types: text, number, boolean, <b>record</b> and <b>table</b> — and how dot-notation walks records.</li>'
      + '<li>String interpolation: <code>$"Hello {User().FullName}"</code> beats chained <code>&amp;</code>.</li>'
      + '<li>Behaviour formulas (<code>OnSelect</code>) chain statements with <code>;;</code> and can <code>Set</code>/<code>UpdateContext</code>/<code>Navigate</code>.</li>'
      + '<li><code>ThisItem</code> (gallery row), <code>Parent</code> (container), <code>Self</code> (the control).</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Non-behaviour properties cannot patch or navigate — the compiler stops you.</li>'
      + '<li>Errors surface with <code>IfError</code>/<code>Errors()</code> — wrap writes, never assume success.</li></ul>',
      v: { i: '853JOMA-AoY', t: 'What is Microsoft Power Fx? (Overview and Demo)' } },
    { tag: 'UI & Data', n: 3, t: 'Galleries, forms & data binding',
      a: 'A <b>gallery</b> repeats one template per record; a <b>form</b> displays and edits a single record. Together they are the CRUD backbone of almost every canvas app.'
      + '<span class="tp-h">Build steps</span><ul>'
      + '<li>Gallery <code>Items</code>: <code>Sort(Filter(Employees, StartsWith(Name, txtSearch.Text)), "Name")</code>; inside the template use <code>ThisItem.Name</code>.</li>'
      + '<li>Form <code>DataSource</code> = the table, <code>Item</code> = <code>gal.Selected</code>; switch modes with <code>NewForm</code>/<code>EditForm</code>/<code>ViewForm</code>.</li>'
      + '<li>Save with <code>SubmitForm</code>; react in <code>OnSuccess</code>/<code>OnFailure</code>.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Unlock data cards before customising — and never mix <code>SubmitForm</code> with <code>Patch</code> on the same record save.</li>'
      + '<li>Check <code>Form.Valid</code> before submitting; <code>Form.Updates</code> exposes pending edits.</li></ul>',
      v: { i: 'HHXKfB1iAH4', t: 'Power Apps Gallery Edit Form Tutorial for Beginners' } },
    { tag: 'Data', n: 4, t: 'Patch: create, update & delete records',
      a: '<b>Patch</b> is the write workhorse: create or update records in Dataverse/SharePoint with full control — no form required.'
      + '<span class="tp-h">Build steps</span><ul>'
      + '<li>Create: <code>Patch(Employees, Defaults(Employees), { Name: "Ada" })</code> — <code>Defaults()</code> means "new row".</li>'
      + '<li>Update: pass the existing record as the base: <code>Patch(Employees, gal.Selected, { Status: "Done" })</code>.</li>'
      + '<li>Delete with <code>Remove</code>/<code>RemoveIf</code>; capture the returned record from Patch for the new id.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Patch <b>merges</b> the columns you pass — it never wipes the others.</li>'
      + '<li>Choice, lookup and person columns need record-shaped values (see the Dataverse · SharePoint snippets pane).</li>'
      + '<li>Always check <code>Errors(Employees)</code> after a write.</li></ul>',
      v: { i: 'W8JjF2k0IQA', t: 'Saving Power Apps Data with the Patch Function' } },
    { tag: 'State', n: 5, t: 'Variables & collections: app state',
      a: 'Three scopes to master: <b>context variables</b> (<code>UpdateContext</code>, one screen), <b>globals</b> (<code>Set</code>, app-wide) and <b>collections</b> (<code>Collect</code>/<code>ClearCollect</code> — in-memory tables).'
      + '<span class="tp-h">Build steps</span><ul>'
      + '<li><code>Set(varUser, User())</code> once in <code>App.OnStart</code>; use everywhere for personalisation.</li>'
      + '<li><code>ClearCollect(colCart, Filter(Products, InStock))</code> — snapshot server data locally, then bind galleries to the collection.</li>'
      + '<li><code>UpdateContext({ showPopup: true })</code> for screen-local UI state; inspect everything in Settings → Variables/Collections.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Context variables die on <code>Navigate</code> — use globals for cross-screen state.</li>'
      + '<li>Collections are volatile: <code>SaveData</code>/<code>LoadData</code> for offline persistence.</li>'
      + '<li>Reusing one variable name with two types confuses the compiler — adopt a <code>var</code>/<code>col</code>/<code>loc</code> prefix convention.</li></ul>',
      v: { i: 'AfuG4mLPaJw', t: 'Power Apps Variables - All 5 Types' } }
  ];

  PA.push(
    { tag: 'Performance', n: 6, t: 'Delegation: push queries to the data source',
      a: 'Delegation hands <code>Filter</code>/<code>LookUp</code>/<code>Sort</code> work to the data source. Non-delegable queries silently see only the first <b>500–2,000 rows</b> — the #1 cause of "missing data" in production apps.'
      + '<span class="tp-h">Build steps</span><ul>'
      + '<li>Watch for the blue underline warning in the formula bar — never ship with it.</li>'
      + '<li>Prefer delegable operators: <code>=</code>, <code>StartsWith</code>, <code>And</code>/<code>Or</code> over delegable parts; Dataverse also delegates <code>in</code> and <code>&lt;&gt;</code>.</li>'
      + '<li>Raise the row limit (Settings → up to 2,000) only as a stop-gap — fix the query instead.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li><code>Search()</code> is <b>not</b> delegable on SharePoint; use <code>StartsWith</code> filters or Dataverse.</li>'
      + '<li><code>AddColumns</code> breaks delegation unless the base table is delegable and shaped first.</li>'
      + '<li>Test with more than 2,000 records before go-live — small dev data hides delegation bugs.</li></ul>',
      v: { i: '2FQoTp6RXwc', t: 'Mastering Delegation in Power Apps: A Comprehensive Guide' } },
    { tag: 'Reuse', n: 7, t: 'Components & component libraries',
      a: '<b>Components</b> package UI + logic into reusable controls with custom input/output properties. <b>Component libraries</b> share them across every app in the org with versioning.'
      + '<span class="tp-h">Build steps</span><ul>'
      + '<li>Create on the Components tab: define <b>input</b> properties (data in) and <b>output</b> properties (data/events out).</li>'
      + '<li>Keep the component generic — no references to app screens or data sources; pass everything via properties.</li>'
      + '<li>Promote to a component library; consuming apps pull updates via "check for updates".</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Components cannot touch app data sources directly — inject collections/records as inputs.</li>'
      + '<li>Behaviour properties are limited; expose events as output properties the app reacts to.</li></ul>',
      v: { i: '1n9dUduWk4g', t: 'PowerApps Reusable Component Beginner Tutorial' } },
    { tag: 'Model-driven', n: 8, t: 'Model-driven apps: data-first applications',
      a: 'Model-driven apps generate a responsive UI from your <b>Dataverse schema</b> — tables, forms, views, sitemap and security roles. You configure instead of paint.'
      + '<span class="tp-h">Build steps</span><ul>'
      + '<li>Design tables, columns and relationships first — the data model IS the app.</li>'
      + '<li>Build forms (main, quick create, quick view) and public views per table.</li>'
      + '<li>Compose the app in the app designer: areas, groups and subareas in the sitemap.</li>'
      + '<li>Add server-side logic with business rules and business process flows; share via security roles.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Choose model-driven for dense, record-centric work — canvas for bespoke pixel-perfect UX.</li>'
      + '<li>Security roles gate everything; test as a non-admin early.</li></ul>',
      v: { i: 'HrILchHvMUA', t: 'Model Driven Power Apps FULL COURSE for Beginners' } },
    { tag: 'Layout', n: 9, t: 'Responsive apps with containers',
      a: 'Modern responsive design uses <b>horizontal and vertical containers</b> with flex-style layout — no X/Y maths — so one app adapts to phone, tablet and desktop.'
      + '<span class="tp-h">Build steps</span><ul>'
      + '<li>Compose screens from nested containers; use <code>Fill portions</code>, align and justify instead of absolute positions.</li>'
      + '<li>Size children with <code>Parent.Width</code>/<code>Parent.Height</code>; turn <b>off</b> "Scale to fit" for true responsiveness.</li>'
      + '<li>Branch layouts on <code>Parent.Width</code> breakpoints (phone vs desktop sections).</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Mixing containers with absolute X/Y controls breaks the flow — commit to containers per screen.</li>'
      + '<li>Test at real device sizes, not just the studio preview.</li></ul>',
      v: { i: '1o2L0DADzKQ', t: 'How to build Responsive Power Apps' } },
    { tag: 'ALM', n: 10, t: 'Environments, solutions & ALM basics',
      a: '<b>Solutions</b> package apps, flows and tables for transport dev → test → prod. <b>Unmanaged</b> = editable dev workspace; <b>managed</b> = locked deployable artifact.'
      + '<span class="tp-h">Build steps</span><ul>'
      + '<li>Build inside a solution from day one; add existing components as you go.</li>'
      + '<li>Use <b>environment variables</b> and <b>connection references</b> so nothing is hardcoded per environment.</li>'
      + '<li>Export managed for test/prod; use pipelines for repeatable one-click deploys.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Never edit managed components directly in prod — it creates an unmanaged "active layer" that shadows updates.</li>'
      + '<li>Set the publisher prefix once; connection references must be re-bound after each import.</li></ul>',
      v: { i: 'Xo-TvZ9N3BM', t: 'Solutions in Power Platform | ALM, Power Apps, flows & Environments' } }
  );

  /* ================= 3. POWER AUTOMATE TOPICS ================= */
  var FLOW = [
    { tag: 'Foundations', n: 1, t: 'Flow types & triggers',
      a: 'Three cloud flow types: <b>automated</b> (fires on an event), <b>instant</b> (button/manual) and <b>scheduled</b> (recurrence). Every flow is exactly one trigger plus one-to-many actions.'
      + '<span class="tp-h">Build steps</span><ul>'
      + '<li>Pick the trigger that matches the business event: "When an item is created" (SharePoint), "When a row is added" (Dataverse), "When an email arrives".</li>'
      + '<li>Add actions and feed them <b>dynamic content</b> from the trigger.</li>'
      + '<li>Add <b>trigger conditions</b> (Settings) so the flow only runs when it should — every run costs against quotas.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Polling triggers check on an interval tied to your license — not truly real-time.</li>'
      + '<li>Guard against infinite loops: a flow that updates the item it triggered on will re-fire forever without a trigger condition or a service-account filter.</li></ul>',
      v: { i: 'dDO4Y4aDYXw', t: 'Power Automate Tutorial for Beginners' } },
    { tag: 'Dataverse', n: 2, t: 'Dataverse triggers & actions',
      a: 'The Dataverse connector is the enterprise backbone: triggers on add/update/delete with <b>column filtering</b>, plus full CRUD, Relate/Unrelate rows, and bound/unbound actions.'
      + '<span class="tp-h">Build steps</span><ul>'
      + '<li>Scope triggers with column filters and row (OData) filters so flows fire only on relevant changes.</li>'
      + '<li>"Get a row by ID" for single records; "List rows" with OData or FetchXML for sets — enable pagination.</li>'
      + '<li>Choose the impersonation context deliberately: run as triggering user vs flow owner.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>The update trigger fires on ANY column change unless you set <b>Select columns</b> on the trigger.</li>'
      + '<li>"List rows" returns 50 rows by default — turn on Pagination with a threshold.</li>'
      + '<li>Rename actions in the designer: future-you will thank you.</li></ul>',
      v: { i: 'KMW-mEUdSig', t: 'Power Automate Dataverse Actions Explained | Real-World Flow' } },
    { tag: 'Approvals', n: 3, t: 'Approvals: start and wait',
      a: '"Start and wait for an approval" pauses the flow until approvers respond in Teams, Outlook or the Approvals app — with outcomes, comments and full audit history in Dataverse.'
      + '<span class="tp-h">Build steps</span><ul>'
      + '<li>Choose the type: Approve/Reject, custom responses, "first to respond" vs "everyone must approve".</li>'
      + '<li>Consume <code>Outcome</code> and <code>Responses</code> dynamic content; branch on rejection with comments.</li>'
      + '<li>Approvals live in Dataverse — build a dashboard or history view on top.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Flows time out after 30 days — long approvals need escalation patterns (parallel reminder branch with a delay).</li>'
      + '<li>For advanced control split into "Create an approval" + "Wait for an approval".</li></ul>',
      v: { i: '3FfcKUdlKK8', t: 'Approval Flows in Power Automate - Beginners Tutorial' } },
    { tag: 'Expressions', n: 4, t: 'Expressions 101',
      a: 'The workflow expression language reshapes data without extra actions: <code>concat()</code>, <code>formatDateTime()</code>, <code>if()</code>, <code>coalesce()</code>, <code>json()</code>, <code>split()</code>…'
      + '<span class="tp-h">Build steps</span><ul>'
      + '<li>Use the expression tab next to dynamic content; chain calls: <code>formatDateTime(utcNow(), \'yyyy-MM-dd\')</code>.</li>'
      + '<li>Null-safety: <code>coalesce(triggerBody()?[\'email\'], \'noreply@contoso.com\')</code> and the <code>?</code> navigator.</li>'
      + '<li>This hub ships a searchable library of 81 expressions — #functions → Automate tab.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Single quotes inside expressions; double quotes only in JSON payloads.</li>'
      + '<li><code>utcNow()</code> is UTC — convert time zones explicitly for user-facing text.</li>'
      + '<li>Cast before comparing: <code>int()</code>/<code>float()</code> — string "5" is not number 5.</li></ul>',
      v: { i: 'k-yIhdseTQE', t: 'Power Automate Tutorial - Expressions 101' } },
    { tag: 'Data ops', n: 5, t: 'Data operations: Select, Filter array, Compose',
      a: 'Reshape arrays <b>without loops</b>: <b>Select</b> maps each item, <b>Filter array</b> whittles the set down, <b>Compose</b> holds intermediate values, <b>Parse JSON</b> types untyped payloads.'
      + '<span class="tp-h">Build steps</span><ul>'
      + '<li>Map a SharePoint list with Select (key:value mode) into a clean table for emails or files.</li>'
      + '<li>Chain Filter array → Select; reference the loop item with <code>item()</code>.</li>'
      + '<li>Finish with "Create HTML table" / "Create CSV table" for reports and attachments.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Select is dramatically faster than Apply to each for pure transforms.</li>'
      + '<li>Filter array comparisons are type-strict — cast with <code>int()</code>/<code>string()</code> first.</li>'
      + '<li>Compose doubles as a debug inspector: run, then read its outputs in history.</li></ul>',
      v: { i: 'YfhaU17Q-Rg', t: '7 Power Automate Data Operations: Complete Guide' } }
  ];

  FLOW.push(
    { tag: 'Reliability', n: 6, t: 'Error handling: run after, retries & scopes',
      a: 'Production flows fail deliberately, not accidentally: <b>"run after"</b> conditions, try/catch/finally with Scope actions, retry policies and timeouts.'
      + '<span class="tp-h">Build steps</span><ul>'
      + '<li>Wrap risky calls in a Scope named "Try"; add a "Catch" scope set to run after <b>has failed / has timed out</b>.</li>'
      + '<li>Inside Catch, read <code>result(\'Try\')</code> for the error detail; notify via Teams/email and <code>Terminate</code> gracefully.</li>'
      + '<li>Tune per-action Settings: retry policy (exponential), timeout (PT1H), and secure inputs/outputs for secrets.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Default retry is 4 attempts — flaky APIs need explicit tuning.</li>'
      + '<li>One failed child action fails the whole run unless caught by a run-after scope.</li>'
      + '<li>Use run history → Resubmit for recovery, but fix the root cause first.</li></ul>',
      v: { i: 'qLADf8ne5qQ', t: 'Error Handling in Power Automate flows | Try Catch Scope Action' } },
    { tag: 'Scale', n: 7, t: 'Apply to each, concurrency & pagination',
      a: 'Loops process arrays; <b>concurrency control</b> runs up to 50 iterations in parallel; <b>pagination</b> pulls more than the default 50–5,000 record caps.'
      + '<span class="tp-h">Build steps</span><ul>'
      + '<li>Enable Concurrency Control on Apply to each (Settings) when iterations are independent.</li>'
      + '<li>Enable Pagination + set a threshold on "List rows"/"Get items" for large tables.</li>'
      + '<li>Keep loop bodies minimal: pre-shape with Filter array/Select first; avoid nested loops (O(n²) action calls).</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Concurrency + writing to a shared variable = race conditions — use Select to build arrays instead.</li>'
      + '<li>Pagination maxes at 100,000 items; huge jobs belong in child flows or Dataverse-side logic.</li></ul>',
      v: { i: '4rjZNnFjhn8', t: 'Power Automate 101 | Concurrency Control' } },
    { tag: 'Integration', n: 8, t: 'HTTP action & custom connectors',
      a: 'No connector? The <b>HTTP</b> action calls any REST API directly. <b>Custom connectors</b> wrap an API with auth, triggers and a first-class maker experience for the whole org.'
      + '<span class="tp-h">Build steps</span><ul>'
      + '<li>HTTP action: method, URI, headers, JSON body; parse the response with Parse JSON (generate schema from sample).</li>'
      + '<li>Build a custom connector from an OpenAPI file or Postman collection; configure security (API key / OAuth2 / Entra ID) once.</li>'
      + '<li>Premium licensing: HTTP and custom connectors need premium plans — budget it.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Never paste secrets into flow text — put them in the connector security config or environment variables.</li>'
      + '<li>Mind response-size and per-API throttling limits; batch where the API allows.</li></ul>',
      v: { i: 'DtGWudDKzHg', t: 'Power Automate HTTP action beginner tutorial' } },
    { tag: 'RPA', n: 9, t: 'Desktop flows: RPA for legacy apps',
      a: '<b>Power Automate Desktop</b> (PAD) records and scripts UI automation for apps with no API — running attended on your PC or unattended on registered machines.'
      + '<span class="tp-h">Build steps</span><ul>'
      + '<li>Install PAD + the machine runtime; register the machine (or a machine group for scale).</li>'
      + '<li>Record or drag actions: UI automation, Excel, files, web, OCR; define input/output variables to bridge cloud ↔ desktop.</li>'
      + '<li>Call the desktop flow from a cloud flow with the machine connection; configure sign-in for unattended runs.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>UI selectors break when the target app updates — build resilient selectors (avoid dynamic ids).</li>'
      + '<li>Unattended runs need premium licensing and specific Windows sign-in settings.</li></ul>',
      v: { i: 'Y35ZJs16APQ', t: 'Power Automate Desktop Tutorial for Beginners | Zero to Hero' } },
    { tag: 'Operations', n: 10, t: 'Scheduled flows, monitoring & run history',
      a: '<b>Recurrence</b> triggers run flows on a schedule — nightly syncs, weekly digests — while run history, analytics and the admin center keep production flows observable.'
      + '<span class="tp-h">Build steps</span><ul>'
      + '<li>Recurrence trigger: interval/frequency, plus advanced scheduling with time zone and specific hours.</li>'
      + '<li>Add trigger conditions so empty runs do not execute; monitor via run history and the flow analytics pane.</li>'
      + '<li>Assign co-owners or a service principal so the flow survives staff changes; document the business purpose in the description.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Run history expires after 28 days — export logs if you need an audit trail.</li>'
      + '<li>Schedules are UTC-based — plan for daylight-saving shifts.</li></ul>',
      v: { i: '6Sq9v8FjKwo', t: 'How to create a recurring flow in Power Automate' } }
  );

  /* ================= 4. POWER PAGES TOPICS ================= */
  var PAGES = [
    { tag: 'Foundations', n: 1, t: 'Power Pages overview & your first site',
      a: 'Power Pages builds <b>secure, external-facing websites</b> on Dataverse — customer portals, partner hubs and community sites — with no-code design and full pro-code escape hatches.'
      + '<span class="tp-h">Build steps</span><ul>'
      + '<li>Create a site from a template at <b>make.powerpages.microsoft.com</b> (needs a Dataverse environment).</li>'
      + '<li>Learn the workspaces: <b>Pages</b> (sitemap + content), <b>Styling</b> (themes), <b>Data</b> (tables), <b>Set up</b> (security, identity, Web API).</li>'
      + '<li>Preview, then go live: custom domain, SSL, CDN and site visibility (private → public).</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Licensing counts <b>authenticated users</b> and <b>anonymous page views</b> separately — estimate both.</li>'
      + '<li>The template you pick sets the information architecture — choose deliberately.</li></ul>',
      v: { i: 'ISQ55UNa6iI', t: 'Create your First Power Pages Site | EP 01' } },
    { tag: 'Design', n: 2, t: 'Design studio, themes & styling',
      a: 'The design studio gives no-code themes — colors, fonts, spacing, buttons — layered over Bootstrap, with full CSS/JavaScript escape hatches per page or site-wide.'
      + '<span class="tp-h">Build steps</span><ul>'
      + '<li>Start in the Styling workspace: set brand palette and typography as theme variables.</li>'
      + '<li>Add custom CSS via the code editor (site) or a page\'s "Custom CSS"; upload assets as web files.</li>'
      + '<li>Header/footer live in web templates — edit once, apply everywhere.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Heavy overrides fight Bootstrap upgrades — prefer theme variables over hard CSS.</li>'
      + '<li>Check contrast and mobile breakpoints; accessibility is your responsibility.</li></ul>',
      v: { i: 'ccU0UgQE0z8', t: 'Getting started with styling your Power Pages' } },
    { tag: 'Liquid', n: 3, t: 'Liquid templating: dynamic pages',
      a: '<b>Liquid</b> is the server-side template language of Power Pages: render Dataverse data, conditionals and loops inside web templates, page copy and content snippets.'
      + '<span class="tp-h">Build steps</span><ul>'
      + '<li>Output with <code>{{ user.fullname }}</code>; logic with <code>{% if %}</code>, <code>{% for %}</code>.</li>'
      + '<li>Query Dataverse with the <code>{% fetchxml %}</code> tag; transform values with filters (<code>| date</code>, <code>| default</code>).</li>'
      + '<li>Reuse markup with <code>{% include %}</code> web templates; the full quick-reference grid sits below this topic list.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Liquid runs <b>server-side</b> — it is not a JavaScript replacement; use JS for interactivity.</li>'
      + '<li>FetchXML results honour table permissions; clear the cache (site checker / restart) when changes seem stuck.</li>'
      + '<li>Escape untrusted output with the <code>h</code> filter to prevent XSS.</li></ul>',
      v: { i: 'i2retSXmbHA', t: 'Liquid Template Code in Power Pages | Basics of Liquid Code' } },
    { tag: 'Data', n: 4, t: 'Lists & forms: Dataverse on the page',
      a: '<b>Lists</b> render Dataverse views with search, filters and pagination; <b>forms</b> create and edit records with metadata-driven fields — no code needed.'
      + '<span class="tp-h">Build steps</span><ul>'
      + '<li>Add a List component to a page → pick the table + one or more views; enable search and column filters.</li>'
      + '<li>Add a Form bound to a Dataverse form (basic for single-step, multistep for wizards); use form metadata for extra field behaviour.</li>'
      + '<li>Wire the success action: redirect, confirmation message or next step.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Lists and forms show exactly what <b>table permissions</b> allow — nothing more.</li>'
      + '<li>The page mirrors the Dataverse form layout — keep that form tidy.</li></ul>',
      v: { i: '1w_PUX-aocQ', t: 'Power Pages - Create Forms to capture data & Add Lists' } }
  ];

  PAGES.push(
    { tag: 'Pro-code', n: 5, t: 'Power Pages Web API',
      a: 'The <b>Web API</b> exposes Dataverse CRUD over REST (<code>/_api</code> endpoints) so pages can deliver fully custom, JavaScript-driven data experiences.'
      + '<span class="tp-h">Build steps</span><ul>'
      + '<li>Enable the Web API per table in Set up → Web API, and scope the allowed columns explicitly.</li>'
      + '<li>Query: <code>GET /_api/accounts?$select=name&amp;$top=10</code>; write with POST/PATCH/DELETE and JSON bodies.</li>'
      + '<li>Always wrap calls with the anti-forgery token helper (<code>shell.ajaxSafeAjax</code>) and honour table permissions in your UI.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>The Web API enforces table permissions exactly like lists — test as a real portal user.</li>'
      + '<li>Only whitelisted columns are readable/writable; <code>$select</code> cannot widen it.</li>'
      + '<li>Debounce chatty client-side calls; there is no server batching for free.</li></ul>',
      v: { i: '5PwLZd_HE30', t: 'Power Pages WEB API | Perform CRUD Operations in Dataverse' } },
    { tag: 'Security', n: 6, t: 'Table permissions & web roles',
      a: 'The security model: <b>table permissions</b> (what data) + <b>web roles</b> (which users) mapped to contacts. Scopes — Global, Contact, Account, Self, Parent — control row visibility.'
      + '<span class="tp-h">Build steps</span><ul>'
      + '<li>Create a table permission with the tightest scope that works (Self/Contact for "my records").</li>'
      + '<li>Grant privileges: Read / Create / Write / Delete / Append / Append To.</li>'
      + '<li>Assign the permission to a web role; web roles attach to contacts. Test as anonymous AND authenticated users.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Default-deny: nothing renders until explicitly permitted.</li>'
      + '<li>Mis-scoped Global permissions are the #1 Pages data-leak bug — audit before go-live.</li></ul>',
      v: { i: 'AhHe-yRdU_I', t: 'Introduction to Table Permissions, Web Roles, User Identity' } },
    { tag: 'Identity', n: 7, t: 'Authentication & identity providers',
      a: 'Pages authenticate external users with local contact accounts or federated providers: <b>Microsoft Entra ID</b>, <b>Azure AD B2C</b>, Google, LinkedIn, and generic OAuth2 / OIDC / SAML.'
      + '<span class="tp-h">Build steps</span><ul>'
      + '<li>Configure providers in Set up → Identity providers; decide local sign-in vs external-only.</li>'
      + '<li>Map each external identity to a contact record; enable invitations/redemption for closed portals.</li>'
      + '<li>Let users manage profiles and linked identities on the profile page.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Azure AD B2C is the recommended route for public-facing scale.</li>'
      + '<li>One contact can link several identities — plan the merge story.</li>'
      + '<li>Registration settings control who can self-sign-up; lock it down for workforce portals.</li></ul>',
      v: { i: 'tQFGMH7RrMI', t: 'Configure Azure AD B2C Authentication for Power Pages' } },
    { tag: 'ALM', n: 8, t: 'Deployment, ALM & go-live',
      a: 'Move sites between environments with solutions (enhanced data model) or the <b>Power Platform CLI</b> (<code>pac paportal download/upload</code>), then go live with a custom domain and CDN.'
      + '<span class="tp-h">Build steps</span><ul>'
      + '<li>Develop in dev, then migrate to test/prod via solutions or the CLI (<code>pac auth create</code> → <code>pac paportal download/upload</code>).</li>'
      + '<li>Go-live checklist: custom domain + SSL, CDN, site visibility = public, analytics wired, maintenance page off.</li>'
      + '<li>Warm the site after deploy — first hits recompile templates.</li></ul>'
      + '<span class="tp-h">Gotchas</span><ul>'
      + '<li>Standard vs enhanced data model have different migration paths — do not mix them.</li>'
      + '<li>Re-test table permissions and identity providers after every migration.</li></ul>',
      v: { i: '4D1wcMneq4U', t: 'How to migrate a Power Pages site between environments' } }
  );

  /* ================= 5. POWER PAGES QUICK REFERENCE ================= */
  var PAGES_REF = [
    { g: 'Liquid objects', items: [
      ['entities', 'Read any Dataverse row: entities.account[\'guid\'].name'],
      ['page', 'Current page metadata: page.title, page.id'],
      ['user', 'Signed-in contact (null when anonymous): user.fullname'],
      ['request', 'Query string + form data: request.params[\'id\']'],
      ['website', 'Site settings & URLs: website.sign_in_url'],
      ['sitemap', 'Navigation tree for custom menus']
    ]},
    { g: 'Liquid filters', items: [
      ['| date: "%b %d, %Y"', 'Format dates server-side'],
      ['| default: "\u2014"', 'Fallback when the value is null'],
      ['| size', 'Length of a string or array'],
      ['| join: ", "', 'Array \u2192 delimited string'],
      ['| where: "state", "Active"', 'Filter an array by property value'],
      ['| order_by: "name"', 'Sort an array by property'],
      ['| h', 'HTML-escape untrusted text (XSS guard)'],
      ['| truncate: 120', 'Shorten text with an ellipsis'],
      ['| url_encode', 'Make a value safe for query strings'],
      ['| replace: "a", "b"', 'String substitution']
    ]},
    { g: 'Liquid tags', items: [
      ['{% fetchxml %}', 'Run a FetchXML query and loop the results'],
      ['{% if %} / {% unless %}', 'Server-side conditionals'],
      ['{% for x in collection %}', 'Loop any collection'],
      ['{% include \'partial\' %}', 'Reusable web-template partials'],
      ['{% editable %}', 'In-place editable CMS regions'],
      ['{% block %}', 'Template-inheritance slots']
    ]},
    { g: 'Power Pages Web API', items: [
      ['GET /_api/accounts?$select=name', 'Query records with OData options'],
      ['POST /_api/accounts', 'Create a record (JSON body)'],
      ['PATCH /_api/accounts(guid)', 'Update columns on a record'],
      ['DELETE /_api/accounts(guid)', 'Delete a record'],
      ['shell.ajaxSafeAjax({\u2026})', 'Always send the anti-forgery wrapper']
    ]}
  ];

  /* ================= 6. RENDER HELPERS ================= */
  function vid(v) {
    if (!v) return '';
    return '<span class="tp-h">\u25B6 Watch \u2014 best video for this topic</span>'
      + '<a class="tp-vid" href="https://www.youtube.com/watch?v=' + v.i + '" target="_blank" rel="noopener">'
      + '<span class="tp-vid-play" aria-hidden="true">\u25B6</span>'
      + '<span class="tp-vid-meta">' + v.t
      + '<span>Watch on YouTube <span class="tp-vid-host">\u00B7 youtube.com \u2197</span></span></span></a>';
  }

  function topicList(arr, color) {
    var h = '<div class="tp-list">';
    arr.forEach(function (t) {
      h += '<div class="tp" style="--tpc:' + color + '">'
        + '<button class="tp-q" aria-expanded="false"><span class="tp-n">' + t.n + '</span>'
        + '<span>' + t.t + '</span><span class="tp-tag">' + t.tag + '</span><span class="chev">\u25BC</span></button>'
        + '<div class="tp-a"><div class="tp-a-in">' + t.a + vid(t.v) + '</div></div></div>';
    });
    return h + '</div>';
  }

  function pagesRef() {
    var h = '<div class="ppref"><p class="ppref-t">Power Pages quick reference \u2014 Liquid &amp; Web API</p>'
      + '<p class="ppref-s">The everyday server-side toolkit for Pages: objects, filters, tags and the Web API endpoints. Everything here honours table permissions.</p>';
    PAGES_REF.forEach(function (grp) {
      h += '<p class="ppref-g">' + grp.g + '</p><div class="ppref-grid">';
      grp.items.forEach(function (it) {
        h += '<div class="ppref-item"><code>' + it[0] + '</code><span>' + it[1] + '</span></div>';
      });
      h += '</div>';
    });
    return h + '</div>';
  }

  function wireTopics(scope) {
    $$('.tp-q', scope).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tp = btn.closest('.tp'), a = tp.querySelector('.tp-a'), open = tp.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
        if (open) {
          a.style.maxHeight = a.scrollHeight + 'px';
          setTimeout(function () { if (tp.classList.contains('open')) a.style.maxHeight = 'none' }, 480);
        } else {
          a.style.maxHeight = a.scrollHeight + 'px';
          void a.offsetHeight;
          a.style.maxHeight = '0px';
        }
      });
    });
  }

  /* ================= 7. BUILD THE STUDY HUB ================= */
  function buildStudy() {
    if (document.getElementById('study')) return;
    var res = document.getElementById('resources');
    if (!res) return;

    /* pull hub-ai.js topic lists out of their standalone sections
       so ALL study material lives in one place (ids preserved) */
    var relocated = {};
    ['ai-builder', 'copilot'].forEach(function (sid) {
      var src = document.getElementById(sid);
      if (!src) return;
      var list = src.querySelector('.tp-list');
      if (list) relocated[sid] = list;
      src.remove();
    });

    var tabs = [
      { id: 'pa-study', label: 'Power Apps', color: 'var(--c-apps)', html: topicList(PA, 'var(--c-apps)') },
      { id: 'flow-study', label: 'Power Automate', color: 'var(--c-flow)', html: topicList(FLOW, 'var(--c-flow)') },
      { id: 'pages-study', label: 'Power Pages', color: 'var(--c-pages)', html: topicList(PAGES, 'var(--c-pages)') + pagesRef() },
      { id: 'ai-builder', label: 'AI Builder', color: 'var(--c-data)', node: relocated['ai-builder'] },
      { id: 'copilot', label: 'Copilot Studio', color: 'var(--c-copilot)', node: relocated['copilot'] }
    ].filter(function (tb) { return tb.html || tb.node });

    var sec = document.createElement('section');
    sec.id = 'study';
    var h = '<div class="wrap">'
      + '<div class="sec-tag"><b>08</b> Study Hub</div>'
      + '<h2 class="sec-title">One study hub. <span class="hl">Every product.</span></h2>'
      + '<p class="sec-sub">All deep-dive study material in one place — pick a product, open a topic for concepts, build steps, gotchas and a curated YouTube video (opens on YouTube — nothing is embedded here).</p>'
      + '<div class="study-tabs" role="tablist" aria-label="Study topics by product">';
    tabs.forEach(function (tb, i) {
      var n = tb.node ? tb.node.querySelectorAll('.tp').length : (tb.id === 'pages-study' ? PAGES.length : tb.id === 'flow-study' ? FLOW.length : PA.length);
      h += '<button class="study-tab' + (i === 0 ? ' on' : '') + '" role="tab" aria-selected="' + (i === 0) + '" '
        + 'data-panel="' + tb.id + '" style="--tc:' + tb.color + '">'
        + '<span class="dot"></span>' + tb.label + '<span class="cnt">' + n + '</span></button>';
    });
    h += '</div></div>';
    sec.innerHTML = h;
    var wrap = sec.firstChild;
    tabs.forEach(function (tb, i) {
      var p = document.createElement('div');
      p.className = 'study-panel'; p.id = tb.id; p.setAttribute('role', 'tabpanel');
      p.style.scrollMarginTop = '84px';
      if (i) p.hidden = true;
      if (tb.node) p.appendChild(tb.node); else p.innerHTML = tb.html;
      wrap.appendChild(p);
    });
    res.before(sec);
    wireTopics(sec);

    /* renumber Resources 08 → 09 so the Study Hub owns 08 */
    var rt = document.querySelector('#resources .sec-tag b');
    if (rt && rt.textContent.trim() === '08') rt.textContent = '09';

    function activate(id, scroll) {
      $$('.study-tab', sec).forEach(function (b) {
        var on = b.dataset.panel === id;
        b.classList.toggle('on', on); b.setAttribute('aria-selected', String(on));
      });
      $$('.study-panel', sec).forEach(function (p) { p.hidden = p.id !== id });
      if (scroll) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    $$('.study-tab', sec).forEach(function (b) {
      b.addEventListener('click', function () { activate(b.dataset.panel, false) });
    });

    /* deep links: #study, #pa-study, #flow-study, #pages-study,
       #ai-builder, #copilot (legacy links from the old sections) */
    var IDS = { 'study': 1, 'pa-study': 1, 'flow-study': 1, 'pages-study': 1, 'ai-builder': 1, 'copilot': 1 };
    function fromHash() {
      var hsh = (location.hash || '').replace('#', '').split('&')[0];
      if (!IDS[hsh]) return;
      activate(hsh === 'study' ? tabs[0].id : hsh, true);
    }
    window.addEventListener('hashchange', fromHash);
    fromHash();
  }

  /* ================= 8. NAV: consolidate + scroll affordance ================= */
  function fixNav() {
    var nav = document.getElementById('navLinks');
    if (!nav) return;

    /* two AI links → one Study Hub link (frees space, one home for study) */
    if (!nav.querySelector('a[href="#study"]')) {
      var aAI = nav.querySelector('a[href="#ai-builder"]');
      var aCP = nav.querySelector('a[href="#copilot"]');
      if (aAI) { aAI.setAttribute('href', '#study'); aAI.textContent = 'Study Hub'; }
      if (aCP) aCP.remove();
    }

    /* overflow affordance: edge fades + a one-time auto-scroll hint so
       users can tell the top nav is horizontally scrollable */
    function update() {
      var over = nav.scrollWidth > nav.clientWidth + 4;
      nav.classList.toggle('can-scroll', over);
      nav.classList.toggle('at-start', over && nav.scrollLeft <= 4);
      nav.classList.toggle('at-end', over && nav.scrollLeft + nav.clientWidth >= nav.scrollWidth - 4);
    }
    nav.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    if (window.__pvNavHintDone) return;
    window.__pvNavHintDone = true;
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var touched = false;
    ['pointerdown', 'wheel', 'touchstart', 'keydown'].forEach(function (ev) {
      window.addEventListener(ev, function () { touched = true }, { once: true, passive: true });
    });
    setTimeout(function () {
      if (touched || !nav.classList.contains('can-scroll')) return;
      nav.scrollTo({ left: nav.scrollWidth, behavior: 'smooth' });
      setTimeout(function () { if (!touched) nav.scrollTo({ left: 0, behavior: 'smooth' }) }, 1200);
    }, 1800);
  }

  /* ================= 9. HERO STATS: sync with real counts ================= */
  function syncStats() {
    function setStat(re, n) {
      if (!n) return;
      $$('.hero-stats .stat').forEach(function (box) {
        var lbl = box.querySelector('.lbl');
        if (!lbl || !re.test(lbl.textContent)) return;
        var num = box.querySelector('.num');
        if (!num) return;
        num.dataset.count = String(n);
        if (num.childNodes[0]) num.childNodes[0].nodeValue = n.toLocaleString('en-US');
      });
    }
    var fnN = 0;
    try { if (typeof FN !== 'undefined' && FN.length) fnN = FN.length } catch (e) {}
    setStat(/fx functions/i, fnN);
    setStat(/interview questions/i, $$('#iqList .iq').length);
    setStat(/real scenarios/i, $$('#scenarios .scen').length);
  }

  /* ================= INIT ================= */
  function init() {
    buildStudy();
    fixNav();
    syncStats();
    /* second pass: wins any race with the counter animation */
    setTimeout(syncStats, 2600);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
