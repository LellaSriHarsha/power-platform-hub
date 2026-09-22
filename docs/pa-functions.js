/* ============================================================
   POWERVERSE pa-functions.js — Power Automate expression library
   ------------------------------------------------------------
   Adds a "Power Automate" tab to the Functions section with the
   workflow expression language (the @{...} functions) documented
   the same way as the Power Fx functions: syntax, description,
   real example, copy + share (#pfn=name deep links).
   Repo-owned; script tag re-injected by scripts/apply-growth-patches.sh
   ============================================================ */
(function () {
  'use strict';

  /* categories → reuse the site's palette */
  var PA_CATS = {
    'String': 'var(--c-apps)',
    'Collection': 'var(--c-pages)',
    'Logic': 'var(--c-copilot)',
    'Conversion': 'var(--c-data)',
    'Math': 'var(--c-bi)',
    'Date & Time': 'var(--c-flow)',
    'Workflow': '#64D2FF'
  };

  /* {n:name, c:category, s:signature, d:description, x:example} */
  var PA = [
    /* ---- STRING ---- */
    {n:'concat',c:'String',s:"concat('<text1>', '<text2>', …)",d:'Combines two or more strings into one. The PA equivalent of Power Fx Concatenate / &.',x:"concat('Order ', triggerBody()?['id'], ' has been received')"},
    {n:'substring',c:'String',s:"substring('<text>', <startIndex>, <length>)",d:'Returns part of a string starting at a 0-based index. Indexes are 0-based here, 1-based in Power Fx!',x:"substring('Power Automate', 6, 8)  → 'Automate'"},
    {n:'replace',c:'String',s:"replace('<text>', '<old>', '<new>')",d:'Replaces every occurrence of a substring — great for cleaning file names or IDs.',x:"replace(outputs('Get_file')?['name'], '.csv', '')"},
    {n:'toLower',c:'String',s:"toLower('<text>')",d:'Converts a string to lowercase. Use on both sides for case-insensitive comparisons.',x:"toLower(triggerBody()?['email'])  → 'ava.singh@contoso.com'"},
    {n:'toUpper',c:'String',s:"toUpper('<text>')",d:'Converts a string to uppercase.',x:"toUpper('pending')  → 'PENDING'"},
    {n:'trim',c:'String',s:"trim('<text>')",d:'Removes leading and trailing whitespace — essential for user-entered data.',x:"trim('  Contoso Ltd  ')  → 'Contoso Ltd'"},
    {n:'split',c:'String',s:"split('<text>', '<delimiter>')",d:'Splits a string into an array. Pair with first()/last() or an Apply to each.',x:"split('a;b;c', ';')  → ['a','b','c']"},
    {n:'join',c:'String',s:"join(<array>, '<delimiter>')",d:'Joins array items into one string — the inverse of split. Perfect for email recipient lists.',x:"join(variables('approverEmails'), ';')"},
    {n:'startsWith',c:'String',s:"startsWith('<text>', '<prefix>')",d:'True if the string begins with the prefix. Common in trigger conditions.',x:"startsWith(triggerBody()?['Title'], 'URGENT')"},
    {n:'endsWith',c:'String',s:"endsWith('<text>', '<suffix>')",d:'True if the string ends with the suffix — e.g. filter attachments by extension.',x:"endsWith(item()?['Name'], '.pdf')"},
    {n:'contains',c:'String',s:"contains('<text>', '<search>')",d:'True if the string contains the substring. Case-sensitive — wrap both sides in toLower() if needed.',x:"contains(toLower(body('Get_response')?['text']), 'approved')"},
    {n:'indexOf',c:'String',s:"indexOf('<text>', '<search>')",d:'0-based position of the first occurrence, or -1. Combine with substring() to parse emails, IDs…',x:"substring(triggerBody()?['email'], add(indexOf(triggerBody()?['email'], '@'), 1))"},
    {n:'lastIndexOf',c:'String',s:"lastIndexOf('<text>', '<search>')",d:'0-based position of the last occurrence — handy to strip a file extension.',x:"substring(item()?['Name'], 0, lastIndexOf(item()?['Name'], '.'))"},
    {n:'length',c:'String',s:"length(<text or array>)",d:'Length of a string OR count of array items. For SharePoint lists use length(body(\'Get_items\')?[\'value\']).',x:"if(greater(length(body('Get_items')?['value']), 0), 'rows found', 'nothing')"},
    {n:'formatNumber',c:'String',s:"formatNumber(<number>, '<format>', '<locale>')",d:'Formats numbers as currency, percents, grouped digits — like Power Fx Text().',x:"formatNumber(1234567.89, 'C2', 'en-us')  → '$1,234,567.89'"},
    {n:'encodeUriComponent',c:'String',s:"encodeUriComponent('<text>')",d:'URL-encodes a value so it is safe inside a query string or HTTP call.',x:"encodeUriComponent(triggerBody()?['searchText'])"},
    {n:'base64ToString',c:'String',s:"base64ToString('<base64>')",d:'Decodes base64 content — e.g. file content returned by some connectors.',x:"base64ToString(outputs('Get_file_content')?['body'])"},
    /* ---- COLLECTION ---- */
    {n:'first',c:'Collection',s:'first(<array>)',d:'Returns the first item of an array (or first character of a string).',x:"first(body('Get_items')?['value'])?['Title']"},
    {n:'last',c:'Collection',s:'last(<array>)',d:'Returns the last item of an array.',x:"last(sort(variables('scores')))  → highest value"},
    {n:'take',c:'Collection',s:'take(<array>, <count>)',d:'Returns the first N items — top-N lists without a loop.',x:"take(body('List_rows')?['value'], 5)"},
    {n:'skip',c:'Collection',s:'skip(<array>, <count>)',d:'Drops the first N items. take()+skip() = client-side paging.',x:"skip(body('List_rows')?['value'], 20)"},
    {n:'union',c:'Collection',s:'union(<array1>, <array2>, …)',d:'Merges arrays and removes duplicates.',x:"union(variables('teamA'), variables('teamB'))"},
    {n:'intersection',c:'Collection',s:'intersection(<array1>, <array2>)',d:'Only the items present in BOTH arrays.',x:"intersection(variables('required'), variables('approved'))"},
    {n:'createArray',c:'Collection',s:'createArray(<item1>, <item2>, …)',d:'Builds an array from literal values — the PA equivalent of a Power Fx table literal.',x:"createArray('Low','Normal','High','Critical')"},
    {n:'empty',c:'Collection',s:'empty(<value>)',d:'True when a string, array or object is empty/null. The safe way to test did the query return nothing.',x:"if(empty(body('Get_items')?['value']), 'nothing found', 'process')"},
    {n:'reverse',c:'Collection',s:'reverse(<array>)',d:'Reverses array order.',x:"first(reverse(sort(body('Get_items')?['value'], 'desc')))"},
    {n:'sort',c:'Collection',s:"sort(<array> [, 'asc'|'desc'])",d:'Sorts a simple array of numbers/text. For records, sort in the source query (Order by).',x:'sort(createArray(3,1,2))  → [1,2,3]'},
    {n:'chunk',c:'Collection',s:'chunk(<array>, <size>)',d:'Splits an array into batches — perfect for processing huge lists in batches of 100.',x:'chunk(range(1, 5000), 100)  → 50 batches'},
    {n:'item',c:'Collection',s:"item()?['<field>']",d:'Inside an Apply to each / Select: the CURRENT item. The PA version of Power Fx ThisItem.',x:"item()?['Email']"},
    {n:'items',c:'Collection',s:"items('<loopName>')?['<field>']",d:'In NESTED loops item() means the innermost one — items(\'name\') reaches a specific outer loop.',x:"items('Apply_to_each_Manager')?['Department']"},
    {n:'range',c:'Collection',s:'range(<startIndex>, <count>)',d:'Generates an integer array — loop N times without a Do until.',x:'range(0, 10)  → [0,1,2,…,9]'},
    /* ---- LOGIC ---- */
    {n:'if',c:'Logic',s:'if(<condition>, <ifTrue>, <ifFalse>)',d:'Inline conditional — like Power Fx If() but always an expression, never a statement.',x:"if(equals(item()?['Priority'], 'High'), '🔴 escalate', '⚪ standard')"},
    {n:'equals',c:'Logic',s:'equals(<a>, <b>)',d:'Equality test. PA has NO = operator inside expressions — always equals().',x:"equals(triggerBody()?['Status'], 'Approved')"},
    {n:'and',c:'Logic',s:'and(<cond1>, <cond2>, …)',d:'True when all conditions are true.',x:"and(equals(item()?['Active'], true), greater(item()?['Amount'], 1000))"},
    {n:'or',c:'Logic',s:'or(<cond1>, <cond2>, …)',d:'True when any condition is true.',x:"or(equals(item()?['Priority'], 'High'), equals(item()?['Priority'], 'Critical'))"},
    {n:'not',c:'Logic',s:'not(<condition>)',d:'Negates a boolean.',x:"not(empty(variables('approvers')))"},
    {n:'greater',c:'Logic',s:'greater(<a>, <b>)',d:'a > b. Works on numbers, strings and dates. Sibling: greaterOrEquals().',x:"greater(item()?['Amount'], 5000)"},
    {n:'less',c:'Logic',s:'less(<a>, <b>)',d:'a < b. Sibling: lessOrEquals().',x:"less(addDays(utcNow(), 0), item()?['DueDate'])"},
    {n:'coalesce',c:'Logic',s:'coalesce(<a>, <b>, …)',d:'First non-null value — the PA answer to null-safe defaults (like Power Fx Coalesce).',x:"coalesce(triggerBody()?['middleName'], '')"},
    /* ---- CONVERSION ---- */
    {n:'string',c:'Conversion',s:'string(<value>)',d:'Converts any value to text.',x:"concat('Total: ', string(variables('total')))"},
    {n:'int',c:'Conversion',s:'int(<text>)',d:'Parses text to an integer. Throws on bad input — validate first.',x:"int(triggerBody()?['quantity'])"},
    {n:'float',c:'Conversion',s:'float(<text>)',d:'Parses text to a decimal number.',x:"float(item()?['Price'])"},
    {n:'bool',c:'Conversion',s:'bool(<text>)',d:'Converts \'true\'/\'false\' text to a real boolean.',x:"bool(triggerBody()?['optIn'])"},
    {n:'json',c:'Conversion',s:'json(<text>)',d:'Parses a JSON string into an object/array you can navigate with ?[\'field\'].',x:"json(outputs('HTTP_call')?['body'])?['data'][0]"},
    {n:'xml',c:'Conversion',s:'xml(<text>)',d:'Parses XML text so you can query it with xpath().',x:"xpath(xml(body('Get_SOAP_response')), 'string(/root/status)')"},
    {n:'array',c:'Conversion',s:'array(<value>)',d:'Wraps a single value in a one-item array.',x:"array(triggerBody()?['email'])"},
    {n:'base64',c:'Conversion',s:'base64(<text or binary>)',d:'Encodes content to base64 — required by some file connectors.',x:"base64(outputs('Compose_CSV'))"},
    /* ---- MATH ---- */
    {n:'add',c:'Math',s:'add(<a>, <b>)',d:'Addition (also concatenates numbers as strings if given text). PA expressions have no + operator.',x:"add(variables('total'), item()?['Amount'])"},
    {n:'sub',c:'Math',s:'sub(<a>, <b>)',d:'Subtraction.',x:"sub(variables('budget'), item()?['Cost'])"},
    {n:'mul',c:'Math',s:'mul(<a>, <b>)',d:'Multiplication.',x:"mul(item()?['Qty'], item()?['UnitPrice'])"},
    {n:'div',c:'Math',s:'div(<a>, <b>)',d:'Division. Returns float — guard divide-by-zero with if(equals(b,0),…).',x:"div(variables('total'), length(body('Get_items')?['value']))"},
    {n:'mod',c:'Math',s:'mod(<a>, <b>)',d:'Remainder — alternate-row logic, batching, round-robin assignment.',x:"mod(add(iterationIndexes('Apply_to_each'), 1), 2)"},
    {n:'min',c:'Math',s:'min(<n1>, <n2>, … | <array>)',d:'Smallest number.',x:"min(item()?['QuoteA'], item()?['QuoteB'], item()?['QuoteC'])"},
    {n:'max',c:'Math',s:'max(<n1>, <n2>, … | <array>)',d:'Largest number.',x:"max(variables('scoreA'), variables('scoreB'))"},
    {n:'rand',c:'Math',s:'rand(<min>, <max>)',d:'Random integer, min inclusive / max exclusive.',x:'rand(100000, 999999)  → 6-digit code'},
    /* ---- DATE & TIME ---- */
    {n:'utcNow',c:'Date & Time',s:"utcNow(['<format>'])",d:'Current UTC timestamp. Flows run in UTC — always convert before showing users.',x:"utcNow('yyyy-MM-ddTHH:mm:ss')  → '2026-09-22T14:30:00'"},
    {n:'addDays',c:'Date & Time',s:"addDays('<timestamp>', <days> [, '<format>'])",d:'Adds (or subtracts, with negative) days.',x:"addDays(utcNow(), 7, 'dd MMM yyyy')  → due next week"},
    {n:'addHours',c:'Date & Time',s:"addHours('<timestamp>', <hours> [, '<format>'])",d:'Adds hours. Siblings: addMinutes(), addSeconds().',x:"addHours(triggerBody()?['created'], -8)  → SLA window"},
    {n:'addToTime',c:'Date & Time',s:"addToTime('<timestamp>', <n>, '<unit>' [, '<format>'])",d:'Adds any unit: Second, Minute, Hour, Day, Week, Month, Year.',x:"addToTime(utcNow(), 1, 'Month')  → renewal reminder"},
    {n:'subtractFromTime',c:'Date & Time',s:"subtractFromTime('<timestamp>', <n>, '<unit>' [, '<format>'])",d:'The inverse of addToTime — clean way to look backwards.',x:"subtractFromTime(utcNow(), 30, 'Day', 'yyyy-MM-dd')  → created last month"},
    {n:'convertFromUtc',c:'Date & Time',s:"convertFromUtc('<ts>', '<timeZone>' [, '<format>'])",d:'UTC → local time. Time zone names are Windows IDs like \'India Standard Time\'.',x:"convertFromUtc(utcNow(), 'India Standard Time', 'dd MMM yyyy hh:mm tt')"},
    {n:'convertToUtc',c:'Date & Time',s:"convertToUtc('<ts>', '<sourceTimeZone>' [, '<format>'])",d:'Local → UTC before storing in Dataverse/SharePoint.',x:"convertToUtc(triggerBody()?['meetingTime'], 'Pacific Standard Time')"},
    {n:'convertTimeZone',c:'Date & Time',s:"convertTimeZone('<ts>', '<from>', '<to>' [, '<format>'])",d:'Between any two time zones in one call.',x:"convertTimeZone(utcNow(), 'UTC', 'Eastern Standard Time', 'hh:mm tt')"},
    {n:'formatDateTime',c:'Date & Time',s:"formatDateTime('<ts>', '<format>')",d:'Formats a timestamp. yyyy-MM-dd, dd MMM yyyy, dddd = weekday name…',x:"formatDateTime(utcNow(), 'dddd, dd MMMM yyyy')  → 'Tuesday, 22 September 2026'"},
    {n:'getFutureTime',c:'Date & Time',s:"getFutureTime(<n>, '<unit>' [, '<format>'])",d:'Now + interval. Sibling: getPastTime().',x:"getFutureTime(1, 'Hour', 'o')  → token expiry"},
    {n:'getPastTime',c:'Date & Time',s:"getPastTime(<n>, '<unit>' [, '<format>'])",d:'Now − interval — daily digests: getPastTime(24, \'Hour\').',x:"getPastTime(7, 'Day', 'yyyy-MM-dd')"},
    {n:'startOfMonth',c:'Date & Time',s:"startOfMonth('<ts>' [, '<format>'])",d:'First instant of the month — monthly report windows. Sibling: startOfDay().',x:"startOfMonth(utcNow(), 'yyyy-MM-dd')"},
    {n:'dayOfWeek',c:'Date & Time',s:"dayOfWeek('<ts>')",d:'0 (Sunday) to 6 (Saturday) — skip weekends in approval flows.',x:"if(or(equals(dayOfWeek(utcNow()),0), equals(dayOfWeek(utcNow()),6)), 'weekend', 'business day')"},
    {n:'ticks',c:'Date & Time',s:"ticks('<ts>')",d:'100-nanosecond ticks since 0001-01-01. Great for unique file names and measuring duration.',x:"concat('export-', ticks(utcNow()), '.csv')"},
    /* ---- WORKFLOW ---- */
    {n:'triggerBody',c:'Workflow',s:"triggerBody()?['<field>']",d:'The payload that started the flow — form responses, Dataverse rows, HTTP bodies. ? makes it null-safe.',x:"concat('Submitted by ', triggerBody()?['responder'])"},
    {n:'triggerOutputs',c:'Workflow',s:"triggerOutputs()?['body/<field>']",d:'Full trigger output including headers — triggerBody() is the shortcut to its body.',x:"triggerOutputs()?['body/ID']"},
    {n:'body',c:'Workflow',s:"body('<actionName>')?['<field>']",d:'The body of a previous action. Action names use underscores for spaces: body(\'Get_items\').',x:"body('Get_items')?['value']"},
    {n:'outputs',c:'Workflow',s:"outputs('<actionName>')?['body/<field>']",d:'Full outputs of a previous action (statusCode, headers, body).',x:"outputs('HTTP_call')?['statusCode']"},
    {n:'actions',c:'Workflow',s:"actions('<actionName>')['status']",d:'Action metadata — read its status to build try/catch with scopes.',x:"equals(actions('Scope_Try')['status'], 'Failed')"},
    {n:'result',c:'Workflow',s:"result('<scopeName>')",d:'Array of every action result inside a scope — the classic try/catch/finally pattern.',x:"result('Scope_Try')[0]['message']"},
    {n:'variables',c:'Workflow',s:"variables('<name>')",d:'Reads a variable. Must be initialized first with an Initialize variable action.',x:"add(variables('counter'), 1)"},
    {n:'parameters',c:'Workflow',s:"parameters('<name>')",d:'Reads a flow/environment parameter.',x:"parameters('EnvironmentURL')"},
    {n:'workflow',c:'Workflow',s:'workflow().name | .id | .run.id',d:'Metadata about the current flow and run — log run IDs for support tickets.',x:"workflow().run.id  → link to the run history"},
    {n:'guid',c:'Workflow',s:"guid(['<format>'])",d:'New unique ID — correlation IDs, temp file names, idempotency keys.',x:"guid('D')  → 'a1b2c3d4-…'"},
    {n:'xpath',c:'Workflow',s:"xpath(<xml>, '<expression>')",d:'Queries XML (SOAP responses, older APIs).',x:"xpath(xml(body('SOAP_call')), 'string(/Envelope/Body/Result)')"},
    {n:'iterationIndexes',c:'Workflow',s:"iterationIndexes('<loopName>')",d:'Current 0-based loop index — pair with mod() for alternate rows.',x:"iterationIndexes('Apply_to_each')"}
  ];

  /* ---------------- UI ---------------- */
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
  var $=function(s){return document.querySelector(s)},$$=function(s,p){return Array.prototype.slice.call((p||document).querySelectorAll(s))};
  var paCat='All';

  function cardHTML(f){
    return '<div class="fn-card pa-card" style="--fcc:'+PA_CATS[f.c]+'">'
      +'<div class="f-top"><span class="f-name">'+esc(f.n)+'</span><span class="f-cat">'+esc(f.c)+'</span></div>'
      +'<div class="f-sig">'+esc(f.s)+'</div>'
      +'<div class="f-desc">'+esc(f.d)+'</div>'
      +'<div class="f-ex">'+esc(f.x)+'</div>'
      +'<div class="f-acts">'
      +'<button class="f-btn pa-copy" data-n="'+esc(f.n)+'">copy</button>'
      +'<button class="f-btn pa-copyat" data-n="'+esc(f.n)+'" title="Copy wrapped as a designer expression">copy @{…}</button>'
      +'<button class="hp-share" data-n="'+esc(f.n)+'" title="Copy link to this function">↗ share</button>'
      +'</div></div>';
  }

  function renderPA(){
    var grid=$('#paGrid');if(!grid)return;
    var q=($('#fnSearch')?$('#fnSearch').value:'').trim().toLowerCase();
    var list=PA.filter(function(f){return (paCat==='All'||f.c===paCat)&&(!q||(f.n+' '+f.s+' '+f.d).toLowerCase().indexOf(q)>-1)});
    grid.innerHTML=list.length?list.map(cardHTML).join(''):'<div class="fn-empty">No Power Automate functions match — try “date”, “json”, “trigger”…</div>';
    var cnt=$('#fnCount');if(cnt)cnt.textContent=list.length+' / '+PA.length+' expressions';
    $$('.pa-copy',grid).forEach(function(b){b.addEventListener('click',function(){
      var f=PA.filter(function(x){return x.n===b.dataset.n})[0];
      (window.copyText||navigator.clipboard.writeText.bind(navigator.clipboard))(f.x).then(function(){b.textContent='copied ✓';setTimeout(function(){b.textContent='copy'},1500)});
    })});
    $$('.pa-copyat',grid).forEach(function(b){b.addEventListener('click',function(){
      var f=PA.filter(function(x){return x.n===b.dataset.n})[0];
      (window.copyText||navigator.clipboard.writeText.bind(navigator.clipboard))('@{'+f.x+'}').then(function(){b.textContent='copied ✓';setTimeout(function(){b.textContent='copy @{…}'},1500)});
    })});
    $$('.hp-share',grid).forEach(function(b){b.addEventListener('click',function(){
      var u=location.origin+location.pathname+'#pfn='+encodeURIComponent(b.dataset.n);
      (window.copyText||navigator.clipboard.writeText.bind(navigator.clipboard))(u).then(function(){b.textContent='link copied ✓';setTimeout(function(){b.textContent='↗ share'},1500)});
    })});
  }

  function renderPAChips(){
    var box=$('#paChips');if(!box)return;
    box.innerHTML=['All'].concat(Object.keys(PA_CATS)).map(function(c,i){
      return '<button class="fn-chip'+(paCat===c?' on':'')+'" data-c="'+c+'">'+c+'</button>';
    }).join('');
    $$('.fn-chip',box).forEach(function(b){b.addEventListener('click',function(){paCat=b.dataset.c;renderPAChips();renderPA()})});
  }

  function setMode(pa){
    var fxTabs=$('#paTabFx'),paTabs=$('#paTabPa');
    if(fxTabs)fxTabs.classList.toggle('on',!pa);
    if(paTabs)paTabs.classList.toggle('on',pa);
    var fxChips=$('#fnChips'),fxGrid=$('#fnGrid'),paChips=$('#paChips'),paGrid=$('#paGrid'),guide=$('#paGuide');
    if(fxChips)fxChips.style.display=pa?'none':'';
    if(fxGrid)fxGrid.closest('.fn-browser').style.display=pa?'none':'';
    if(paChips)paChips.style.display=pa?'':'none';
    if(paGrid)paGrid.closest('.fn-browser').style.display=pa?'':'none';
    if(guide)guide.style.display=pa?'':'none';
    if(pa){renderPAChips();renderPA()}else{
      var cnt=$('#fnCount'),g=$('#fnGrid');
      if(cnt&&g)cnt.textContent=g.querySelectorAll('.fn-card').length+' / 98 functions';
    }
  }

  window.__paSetMode=setMode; /* used by hub-plus / deep links */

  var GUIDE_HTML=''
    +'<div class="pa-guide-in"><b>How Power Automate expressions are written</b>'
    +'<ol>'
    +'<li>Everything lives inside <code>@{ … }</code> in the designer (the expression editor adds the @ for you).</li>'
    +'<li>Strings use <code>\'single quotes\'</code> — not double quotes like Power Fx.</li>'
    +'<li>No <code>=</code>, <code>+</code>, <code>&gt;</code> operators — use <code>equals()</code>, <code>add()</code>, <code>greater()</code>…</li>'
    +'<li>Current loop item is <code>item()</code> (Power Fx: <code>ThisItem</code>). Nested loops: <code>items(\'Apply_to_each\')</code>.</li>'
    +'<li>Read dynamic content with <code>triggerBody()?[\'field\']</code>, <code>body(\'Action_name\')?[\'field\']</code>, <code>variables(\'name\')</code> — the <code>?</code> makes it null-safe.</li>'
    +'<li>Action names with spaces become underscores: <code>Get items</code> → <code>body(\'Get_items\')</code>.</li>'
    +'<li>Function names are case-insensitive; indexes are <b>0-based</b> (Power Fx is 1-based).</li>'
    +'</ol></div>';

  function init(){
    var tools=document.querySelector('.fn-tools');
    var grid=document.getElementById('fnGrid');
    if(!tools||!grid||document.getElementById('paTabPa'))return;

    /* tab toggle above the search row */
    var tabs=document.createElement('div');
    tabs.className='pa-tabs';
    tabs.innerHTML='<button class="pa-tab on" id="paTabFx">⚡ Power Fx <span class="pa-tab-n">98</span></button>'
      +'<button class="pa-tab" id="paTabPa">🌊 Power Automate <span class="pa-tab-n">'+PA.length+'</span></button>';
    tools.parentNode.insertBefore(tabs,tools);

    /* PA chips + guide + grid (siblings of the Fx ones) */
    var fxChips=document.getElementById('fnChips');
    var paChips=document.createElement('div');
    paChips.className='fn-chips rv';paChips.id='paChips';paChips.style.display='none';
    fxChips.parentNode.insertBefore(paChips,fxChips.nextSibling);

    var guide=document.createElement('div');
    guide.id='paGuide';guide.className='pa-guide';guide.style.display='none';
    guide.innerHTML=GUIDE_HTML;
    paChips.parentNode.insertBefore(guide,paChips.nextSibling);

    var paBrowser=document.createElement('div');
    paBrowser.className='fn-browser';paBrowser.style.display='none';
    paBrowser.innerHTML='<div class="fn-grid" id="paGrid" tabindex="0" aria-label="Power Automate expression results"></div>';
    var fxBrowser=grid.closest('.fn-browser');
    fxBrowser.parentNode.insertBefore(paBrowser,fxBrowser.nextSibling);

    tabs.querySelector('#paTabFx').addEventListener('click',function(){setMode(false)});
    tabs.querySelector('#paTabPa').addEventListener('click',function(){setMode(true)});

    /* search box drives whichever tab is visible (our listener runs after the site's) */
    var search=document.getElementById('fnSearch');
    if(search)search.addEventListener('input',function(){if($('#paTabPa')&&$('#paTabPa').classList.contains('on'))renderPA()});

    /* minimal styling that reuses the site look */
    var st=document.createElement('style');
    st.textContent='.pa-tabs{display:flex;gap:8px;margin:0 0 14px}.pa-tab{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);color:inherit;padding:8px 16px;border-radius:10px;cursor:pointer;font:600 13px inherit;letter-spacing:.02em}.pa-tab.on{border-color:var(--c-flow);background:rgba(89,212,255,.12);box-shadow:0 0 0 1px var(--c-flow) inset}.pa-tab-n{opacity:.55;font-weight:400;margin-left:4px}.pa-guide{margin:0 0 16px}.pa-guide-in{border:1px solid rgba(89,212,255,.25);background:rgba(89,212,255,.06);border-radius:12px;padding:14px 18px;font-size:13px;line-height:1.75}.pa-guide-in b{color:var(--c-flow)}.pa-guide-in ol{margin:8px 0 0;padding-left:20px}.pa-guide-in code{background:rgba(255,255,255,.08);border-radius:4px;padding:1px 5px;font-size:12px}';
    document.head.appendChild(st);

    /* #pfn= deep link */
    function routePA(){
      var m=location.hash.match(/(?:^|[#&])pfn=([^&]+)/);
      if(!m)return;
      var name=decodeURIComponent(m[1]);
      setMode(true);
      var card=$$('.pa-card .f-name').filter(function(e){return e.textContent.toLowerCase()===name.toLowerCase()})[0];
      if(card){
        var c=card.closest('.fn-card');
        setTimeout(function(){c.scrollIntoView({behavior:'smooth',block:'center'});c.classList.add('hp-flash');setTimeout(function(){c.classList.remove('hp-flash')},2400)},250);
      }
    }
    window.addEventListener('hashchange',routePA);
    routePA();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
