/* ============================================================
   POWERVERSE hub-data.js — Dataverse & SharePoint deep-dive (P2)
   ------------------------------------------------------------
   • +14 Power Fx functions for Dataverse/SharePoint work, pushed
     into the site's FN array so search/intellisense/deep links
     all work on them
   • New "Dataverse · SharePoint" snippets pane (6 copy-ready
     production patterns)
   • +6 interview questions (dv/sp) + a "SharePoint" filter chip
   Repo-owned; tag re-injected by scripts/apply-growth-patches.sh
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s) };
  var $$ = function (s, p) { return Array.prototype.slice.call((p || document).querySelectorAll(s)) };

  /* ================= 1) FUNCTION REFERENCE ADDITIONS ================= */
  var NEW_FN = [
    { n: 'Relate', c: 'Table', s: 'Relate( RelatedTable, Record )',
      d: 'Links two Dataverse records through a many-to-many or one-to-many relationship — no junction table code needed.',
      x: 'Relate( LookUp(Accounts, \'Account Name\' = "Contoso").Contacts, ThisItem )' },
    { n: 'Unrelate', c: 'Table', s: 'Unrelate( RelatedTable, Record )',
      d: 'Removes the link between two related Dataverse records without deleting either record.',
      x: 'Unrelate( ThisItem.Contacts, ddContact.Selected )' },
    { n: 'AsType', c: 'Logic', s: 'AsType( RecordReference, TableType )',
      d: 'Casts a polymorphic Dataverse reference (Owner, Customer, Regarding) to a concrete table type so you can read its columns.',
      x: 'AsType( ThisItem.Owner, Users ).\'Full Name\'' },
    { n: 'IsType', c: 'Logic', s: 'IsType( RecordReference, TableType )',
      d: 'Tests which table a polymorphic Dataverse reference actually points to — pair with AsType for safe casting.',
      x: 'If( IsType(ThisItem.Owner, Teams), "Team-owned", "User-owned" )' },
    { n: 'Choices', c: 'Table', s: 'Choices( ChoiceColumn )',
      d: 'Returns the allowed values of a Dataverse choice/lookup column — the correct Items source for dropdowns & comboboxes.',
      x: 'Choices( Tasks.Priority )' },
    { n: 'GUID', c: 'Text', s: 'GUID( String )',
      d: 'Converts a GUID string into a real GUID value — required when comparing or filtering Dataverse primary keys.',
      x: 'LookUp( Accounts, Account = GUID("6f9c2b10-....-....") ).\'Account Name\'' },
    { n: 'Validate', c: 'Behavior', s: 'Validate( DataSource, Record [, Column ] )',
      d: 'Checks whether a record or single column passes the data source\'s validation rules before you Patch it.',
      x: 'Validate( Employees, { Name: "" }, "Name" )' },
    { n: 'JSON', c: 'Text', s: 'JSON( Value [, Format ] )',
      d: 'Serializes a record or table to JSON text — perfect for sending collections to flows or storing state.',
      x: 'JSON( First(Employees), JSONFormat.IgnoreBinaryData )' },
    { n: 'ParseJSON', c: 'Table', s: 'ParseJSON( JSONString )',
      d: 'Parses JSON text into an untyped object you can navigate — the standard way to consume flow/API responses.',
      x: 'Value( ParseJSON( varResponse ).total )' },
    { n: 'User', c: 'Behavior', s: 'User()',
      d: 'Returns the signed-in user\'s Email, FullName and Image — the starting point for personalization and row filtering.',
      x: 'User().Email' },
    { n: 'Param', c: 'Behavior', s: 'Param( Name )',
      d: 'Reads query-string / launch parameters passed to a canvas app — deep links, record ids, modes.',
      x: 'Param("recordId")' },
    { n: 'Self', c: 'Behavior', s: 'Self.Property',
      d: 'References the current control or property being evaluated — keeps formulas copy-pasteable across controls.',
      x: 'Fill: If( Self.Value > 50000, Color.Green, Color.Red )' },
    { n: 'Parent', c: 'Behavior', s: 'Parent.Property',
      d: 'References the parent container of a control — responsive sizing and relative positioning inside galleries & cards.',
      x: 'Width: Parent.Width * 0.9' },
    { n: 'PlainText', c: 'Text', s: 'PlainText( HtmlOrRichText )',
      d: 'Strips HTML markup and returns clean readable text — essential for SharePoint rich-text and email body columns.',
      x: 'PlainText( ThisItem.Description )' }
  ];

  function addFunctions() {
    if (typeof FN === 'undefined' || typeof renderFns !== 'function') return;
    var have = {}; FN.forEach(function (f) { have[f.n] = 1 });
    var added = NEW_FN.filter(function (f) { return !have[f.n] });
    if (!added.length) return;
    added.forEach(function (f) { FN.push(f) });
    renderFns();
  }

  /* ================= 2) SNIPPETS PANE ================= */
  var SNIPS = [
    { lang: 'POWER FX', title: 'Patch SharePoint choice, person & lookup columns', c: 'var(--c-data)',
      code: `<span class="cm">// SharePoint complex columns need records, not text</span>
<span class="fn">Patch</span>('IT Tickets', <span class="fn">Defaults</span>('IT Tickets'),
  { Title: txtTitle.Text,
    <span class="cm">// Choice column → { Value: ... }</span>
    Status: { Value: ddStatus.Selected.Value },
    <span class="cm">// Person column → full claims record</span>
    AssignedTo: { Claims: <span class="st">"i:0#.f|membership|"</span> &amp; <span class="fn">User</span>().Email,
                  DisplayName: <span class="fn">User</span>().FullName,
                  Email: <span class="fn">User</span>().Email,
                  Department: <span class="st">""</span>, JobTitle: <span class="st">""</span>, Picture: <span class="st">""</span> },
    <span class="cm">// Lookup column → { Id, Value } of the related item</span>
    Project: { Id: ddProject.Selected.ID, Value: ddProject.Selected.Title } })` },
    { lang: 'POWER FX', title: 'Delegation-safe SharePoint queries', c: 'var(--c-flow)',
      code: `<span class="cm">// SharePoint only delegates = and StartsWith (plus And/Or/Not).</span>
<span class="cm">// Anything else silently reads just the first 2,000 rows.</span>

<span class="cm">// ✅ Delegates — filtered on the server, no row cap:</span>
<span class="fn">ClearCollect</span>(colOpen,
  <span class="fn">Filter</span>('Service Requests',
    Status.Value = <span class="st">"Open"</span> &amp;&amp; <span class="fn">StartsWith</span>(Title, txtSearch.Text)))

<span class="cm">// ❌ Does NOT delegate on SharePoint: in, &lt;&gt;, IsBlank, Date math</span>
<span class="cm">// Fix: pre-filter with a delegable indexed column, then refine locally.</span>
<span class="cm">// Big data? Move the table to Dataverse or SQL — far more delegates.</span>` },
    { lang: 'POWER FX', title: 'Dataverse Relate / Unrelate (many-to-many)', c: 'var(--c-data)',
      code: `<span class="cm">// Link the selected contact to this account (M:M relationship)</span>
<span class="fn">Relate</span>( ThisItem.Contacts, ddContacts.Selected )

<span class="cm">// ...and remove the link again (records are NOT deleted)</span>
<span class="fn">Unrelate</span>( ThisItem.Contacts, ddContacts.Selected )

<span class="cm">// One-to-many instead? Just Patch the lookup column:</span>
<span class="fn">Patch</span>( Contacts, ddContacts.Selected, { 'Parent Account': ThisItem } )` },
    { lang: 'AUTOMATE', title: 'Dataverse lookups & choice labels in flows', c: 'var(--c-flow)',
      code: `<span class="cm">// A lookup column comes back as _&lt;column&gt;_value (the GUID)</span>
@triggerOutputs()?['body/_primarycontactid_value']

<span class="cm">// Its display name lives in the formatted-values annotation</span>
@triggerOutputs()?['body/_primarycontactid_value@OData.Community.Display.V1.FormattedValue']

<span class="cm">// Same trick for the label of a choice column</span>
@outputs('Get_account')?['body/statuscode@OData.Community.Display.V1.FormattedValue']

<span class="cm">// List rows → Expand Query pulls related columns in one call:</span>
<span class="cm">//   primarycontactid($select=fullname,emailaddress1)</span>` },
    { lang: 'REST API', title: 'SharePoint REST — CRUD on a list', c: 'var(--c-pages)',
      code: `<span class="cm">// CREATE — POST to the items endpoint</span>
POST https://tenant.sharepoint.com/sites/hr/_api/web/lists/getbytitle('Requests')/items
Accept: application/json;odata=nometadata
X-RequestDigest: {form digest}
Content-Type: application/json;odata=nometadata

{ <span class="st">"__metadata"</span>: { <span class="st">"type"</span>: <span class="st">"SP.Data.RequestsListItem"</span> },
  <span class="st">"Title"</span>: <span class="st">"New laptop"</span>, <span class="st">"Status"</span>: <span class="st">"Open"</span> }

<span class="cm">// UPDATE → POST .../items(7) with headers:</span>
<span class="cm">//   IF-MATCH: *      X-HTTP-Method: MERGE</span>
<span class="cm">// DELETE → same URL with X-HTTP-Method: DELETE</span>` },
    { lang: 'AUTOMATE', title: 'SharePoint — trigger only on real changes', c: 'var(--c-pages)',
      code: `<span class="cm">// Trigger: "When an item is created or modified" fires on EVERY save.</span>
<span class="cm">// 1) Add "Get changes for an item or file (properties only)"</span>
<span class="cm">//    → Since = Trigger Window Start Token</span>
<span class="cm">// 2) Condition: Has Column Changed: Status = true</span>
<span class="cm">// 3) Only then run the expensive work</span>

<span class="cm">// Even better — stop the run before it starts with a trigger condition:</span>
@equals(triggerOutputs()?['body/Status/Value'], 'Approved')` }
  ];

  function addSnippets() {
    var nav = $('.snip-nav'), panes = $('#snippets .wrap');
    if (!nav || !panes || $('#pane-data')) return;
    var tab = document.createElement('button');
    tab.className = 'snip-tab'; tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', 'false');
    tab.setAttribute('aria-controls', 'pane-data');
    tab.dataset.pane = 'data';
    tab.style.cssText = '--stc:var(--c-data);--stg:rgba(139,157,255,.3)';
    tab.textContent = 'Dataverse · SharePoint';
    tab.addEventListener('click', function () {
      $$('.snip-tab').forEach(function (x) { x.classList.remove('on'); x.setAttribute('aria-selected', 'false') });
      tab.classList.add('on'); tab.setAttribute('aria-selected', 'true');
      $$('.snip-pane').forEach(function (p) { p.classList.toggle('on', p.id === 'pane-data') });
    });
    nav.appendChild(tab);

    var pane = document.createElement('div');
    pane.className = 'snip-pane'; pane.id = 'pane-data';
    pane.innerHTML = SNIPS.map(function (s) {
      return '<div class="snip" style="--slc:' + s.c + '">'
        + '<div class="snip-h"><span class="lang">' + s.lang + '</span><h5>' + s.title + '</h5><button class="copy-btn">copy</button></div>'
        + '<pre>' + s.code + '</pre></div>';
    }).join('');
    var lastPane = $$('.snip-pane').pop();
    lastPane.parentNode.insertBefore(pane, lastPane.nextSibling);
    $$('.copy-btn', pane).forEach(function (b) {
      b.addEventListener('click', function () {
        var code = b.closest('.snip').querySelector('pre').innerText;
        copyText(code).then(function () {
          b.textContent = 'copied ✓'; b.classList.add('ok');
          setTimeout(function () { b.textContent = 'copy'; b.classList.remove('ok') }, 1500);
        });
      });
    });
  }

  /* ================= 3) INTERVIEW ADDITIONS ================= */
  var NEW_IQ = [
    { cat: 'sp', d: 'med', q: 'Your gallery only shows 2,000 SharePoint rows. Why — and how do you fix it?',
      a: `That is the <b>delegation limit</b>. Non-delegable operations are pulled to the device, which only fetches the first 2,000 rows. On SharePoint only <code>=</code> and <code>StartsWith</code> (with And/Or/Not) delegate. Fix it: filter on <b>indexed columns</b> with delegable operators, pre-filter then refine locally, or move the data to <b>Dataverse or SQL</b> where far more operations delegate. The limit can be raised to 2,000 max — it is not a paging strategy.` },
    { cat: 'sp', d: 'hard', q: 'How do you Patch a SharePoint person or lookup column from Power Apps?',
      a: `Complex columns take <b>records, not text</b>. Person: <code>{ Claims: "i:0#.f|membership|" & User().Email, DisplayName: …, Email: …, Department: "", JobTitle: "", Picture: "" }</code>. Lookup: <code>{ Id: relatedItem.ID, Value: relatedItem.Title }</code>. Single choice: <code>{ Value: "Open" }</code>; multi-choice: a table of <code>{Value: …}</code> records.` },
    { cat: 'dv', d: 'med', q: 'Choice column vs lookup in Dataverse — how do you decide?',
      a: `<b>Choice</b>: small, closed, rarely-changing lists (Priority, Status) — stored as integers with labels, fast, filterable, and <b>global choices</b> are reusable across tables. <b>Lookup</b>: when the list is data-driven, needs its own columns, security, or relationships (Account, Project). Rule of thumb: if users will ask to report on it or secure it, it is a table, not a choice.` },
    { cat: 'dv', d: 'hard', q: 'What are elastic tables and when would you use one?',
      a: `<b>Elastic tables</b> are Cosmos DB-backed Dataverse tables for <b>high-volume, high-throughput, loosely-structured</b> data — IoT telemetry, audit logs, sensor streams. They auto-scale horizontally and handle millions of writes, but sacrifice relationships, most business logic, and strong transactions. Keep relational business data in standard tables; send the firehose to elastic.` },
    { cat: 'dv', d: 'med', q: 'How is Dataverse search different from per-view quick find?',
      a: `<b>Dataverse search</b> is an indexed, relevance-ranked search across multiple tables and columns at once (the search box in model-driven apps, <code>search/query</code> API) — fast, typo-tolerant, with facets. <b>Quick find</b> is a per-view "contains" filter over the columns an admin configured. Enable Dataverse search at the environment level and choose which tables/columns are indexed.` },
    { cat: 'dv', d: 'easy', q: 'Schema name vs display name of a column — why does it matter?',
      a: `The <b>schema name</b> (e.g. <code>cr8d9_projectid</code>) is the stable API identifier used by code, flows, and integrations — it never changes. The <b>display name</b> is the UI label and can be renamed freely. Reference schema/logical names in anything you automate so a label rename never breaks your solution.` }
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
    if (!list || $('#iqList .iq[data-pv="data"]')) return;
    var base = $$('.iq', list).length;
    NEW_IQ.forEach(function (it, i) {
      var d = document.createElement('div');
      d.className = 'iq'; d.dataset.cat = it.cat; d.dataset.pv = 'data';
      d.innerHTML = '<button class="iq-q" aria-expanded="false">'
        + '<span class="qn">Q' + String(base + i + 1).padStart(2, '0') + '</span>'
        + '<span>' + it.q + '</span>'
        + '<span class="diff ' + it.d + '">' + (it.d === 'easy' ? 'Easy' : it.d === 'med' ? 'Medium' : 'Hard') + '</span>'
        + '<span class="chev">\u25BC</span></button>'
        + '<div class="iq-a"><div class="iq-a-in">' + it.a + '</div></div>';
      wireIQCard(d);
      list.appendChild(d);
    });
    /* SharePoint filter chip — hub-journey (loaded after us) adds the
       combined difficulty filtering on top of this */
    var row = $('.iq-filters');
    if (row && !row.querySelector('[data-cat="sp"]')) {
      var b = document.createElement('button');
      b.className = 'iq-f'; b.dataset.cat = 'sp'; b.textContent = 'SharePoint';
      b.addEventListener('click', function () {
        $$('.iq-f:not(.iq-fd)', row).forEach(function (x) { x.classList.remove('on') });
        b.classList.add('on');
        setTimeout(function () {
          $$('.iq').forEach(function (el) { el.classList.toggle('hide', el.dataset.cat !== 'sp') });
        }, 0);
      });
      row.appendChild(b);
    }
  }

  /* ================= INIT ================= */
  function init() { addFunctions(); addSnippets(); addInterview() }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
