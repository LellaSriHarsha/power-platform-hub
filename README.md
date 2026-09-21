# POWERVERSE — The Microsoft Power Platform Learning Hub

An open, single-file learning hub for **Microsoft Power Platform** — built for makers, analysts and pro developers who want to *learn by doing*.

> **Live demo:** https://lellasriharsha.github.io/power-platform-hub/

---

## ✨ What's inside

| Section | What it gives you |
|---|---|
| **The Platform (01)** | All six products — Power Apps, Power Automate, Power BI, Power Pages, Copilot Studio, Dataverse. Click any tile for capabilities, languages, certification mapping and official docs links. |
| **Learning Path (02)** | A 5-step route from beginner to solution architect, mapped to **current 2026 certifications**. |
| **Live Playground (03)** | A real **Power Fx engine written from scratch in vanilla JS** — tokenizer → parser → evaluator. IntelliSense autocomplete, syntax highlighting, line numbers, function help and a data viewer. |
| **Code Library (04)** | Copy-ready snippets: Power Fx, Power Automate expressions/OData, DAX, Power Query M, Dataverse Web API, JS form scripts and Liquid. |
| **Fx Function Reference (05)** | **99 Power Fx functions** with syntax, description and a **runnable example** for each — searchable and filterable by category. |
| **Real-Life Scenarios (06)** | 6 production architectures across HR, Finance, Retail, Public Sector, Manufacturing and Legal — with expandable build breakdowns. |
| **Interview Prep (07)** | 25 real interview questions with model answers, difficulty tags and topic filters. |
| **Resources (08)** | Official docs, community links, tooling and the current certification ladder. |

### Playground capabilities

- **99 functions** across Text, Math, Date & Time, Logic, Table and Behavior categories
- **Two 100-record datasets** (`Employees`, `Orders`) generated with a seeded RNG — dates, decimals, booleans and blank cells included
- **IntelliSense** popup with signatures (↑↓ navigate, `Tab`/`Enter` accept, `Esc` dismiss)
- **? help** — explains the function at your cursor with a copy-ready, runnable example
- **🗄 data** — browse both datasets, including `Blank()` cells
- **Structured code view** — line numbers + syntax highlighting
- Newline-delimited **statement chaining** with `;`, records `{a: 1}`, tables `[1, 2, 3]`
- `Ctrl/Cmd + Enter` to run

---

## 🚀 Quick start

No build step, no dependencies, no npm install.

```bash
git clone https://github.com/LellaSriHarsha/power-platform-hub.git
cd power-platform-hub
open index.html          # macOS
# or: xdg-open index.html  (Linux)  |  start index.html (Windows)
```

Prefer a local server (recommended so clipboard + fonts behave identically to production):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

---

## 🧱 Project structure

```
power-platform-hub/
└── index.html      # the entire app: markup, hand-rolled CSS, Power Fx engine and UI logic
```

Everything ships in one file by design — easy to host, easy to fork, easy to embed.

### Architecture notes

| Layer | Details |
|---|---|
| **Rendering** | Semantic HTML + hand-rolled CSS (custom properties, grid, no framework). Fonts: Chakra Petch (display), Instrument Sans (body), JetBrains Mono (code). |
| **Power Fx engine** | `fxTok()` tokenizer → `fxParse()` precedence-climbing parser → `fxEval()` tree-walking evaluator → `fxShow()` formatter. ~350 lines of dependency-free JS. |
| **Functions** | `FN[]` array drives the reference grid, IntelliSense and the help modal from a single source of truth. |
| **Datasets** | `FX_DATASETS` — 100 Employees + 100 Orders, deterministic (mulberry32-style seeded PRNG). |
| **Modals** | One reusable overlay used by tool tiles, function help, and the data viewer. |

---

## 📜 Certifications (verified for 2026)

| Exam | Status | Notes |
|---|---|---|
| **PL-900** | ✅ Live | Power Platform Fundamentals — never expires |
| **AB-900** | ✅ Live (new) | Copilot & Agent Administration Fundamentals — the AI track |
| **PL-300** | ✅ Live | Power BI Data Analyst Associate |
| **PL-400** | ✅ Live | Power Platform Developer Expert |
| **PL-500** | ⚠️ Retires 30 Jun 2026 | Power Automate RPA Developer |
| **PL-600** | ⚠️ Retires 30 Jun 2026 | Power Platform Solution Architect Expert |
| **PL-200** | ⚠️ Retires 31 Aug 2026 | Power Platform Functional Consultant |
| PL-100 | ❌ Retired (2024) | Replaced by Applied Skills credentials |
| MS-900 · MB-910 · MB-920 | ❌ Retired | Fundamentals layer reshaped around the AB family |

Associate/expert certifications renew free each year via an online assessment; fundamentals do not expire.

---

## 🌐 Deploy to GitHub Pages (optional)

This repo is a single static `index.html`, so Pages works with zero configuration:

1. Push the repo (steps below).
2. On GitHub: **Settings → Pages**.
3. Under *Build and deployment*, set **Source = Deploy from a branch**, **Branch = `main`**, folder **`/ (root)`** → **Save**.
4. Your site goes live at `https://<your-username>.github.io/power-platform-hub/` within ~1 minute.

---

## 🤝 Contributing

Issues and PRs are welcome — especially:

- Additional Power Fx functions (add an entry to `FN[]` **and** the matching `case` in `fxEval()`)
- More real-life scenarios or interview questions
- Engine parity improvements (delegation warnings, collections persistence, `JSON()`, `Choices()`)

Please keep it dependency-free: no frameworks, no build tooling, no CDN scripts beyond Google Fonts.

---

## ⚖️ Disclaimer

This is an **unofficial, community-built** learning resource. Microsoft, Power Platform, Power Apps, Power Automate, Power BI, Power Pages, Copilot Studio and Dataverse are trademarks of Microsoft Corporation. Certification details reflect publicly available information as of 2026 — always confirm on Microsoft Learn before booking an exam.

---

## 📄 License

MIT — free to use, fork, teach with and remix.
