# ⚡ POWERVERSE

### The Microsoft Power Platform Learning Hub

A single-page, dependency-free learning hub for Microsoft Power Platform — with a live Power Fx playground, a searchable function reference, a code library, real-life scenarios, and interview preparation.

**🔗 Live site: https://lellasriharsha.github.io/power-platform-hub/**

![License: MIT](https://img.shields.io/badge/license-MIT-green)
![Dependencies: none](https://img.shields.io/badge/dependencies-none-blue)
![Built with](https://img.shields.io/badge/built%20with-HTML%20%7C%20CSS%20%7C%20JS-orange)

---

## ✨ Features

| Section | What you get |
| --- | --- |
| 🎮 Live Playground | Write Power Fx formulas and JavaScript, run them instantly against sample data |
| 📚 Fx Functions | 98 Power Fx functions, searchable and filtered by category |
| 🧩 Code Library | Ready-to-use snippets for Power Apps, Power Automate and Dataverse |
| 🏗️ Scenarios | 6 real-life architecture walkthroughs |
| 🎯 Interview Prep | 25 questions with detailed answers |
| 🌗 Light & Dark Mode | Remembers your choice, follows your system theme by default |

## 🚀 Run locally

No build step is required — the site is one static page.

```sh
# simplest: just open it
open docs/index.html

# or serve it
npx serve .
```

Working inside the app shell (requires [Bun](https://bun.sh/)):

```sh
bun install
bun run dev
```

## 🌐 Deployment

In the repository, open **Settings → Pages** and set the source to **Deploy from a branch → main → /docs**. The site lives in the `docs/` folder; any push to the default branch then updates the live site.

## 🔒 Security model

- Power Fx formulas are evaluated by a limited local interpreter against generated sample data.
- JavaScript examples run in a dedicated Web Worker, not the page context, and are stopped after two seconds.
- All dynamic playground output is escaped before display.
- A restrictive Content Security Policy limits scripts, connections, objects, and embedding.
- No user data is collected or sent to a server.

The JavaScript playground is educational, not a production sandbox. Do not paste secrets or untrusted code into it. See [SECURITY.md](SECURITY.md) for reporting guidance.

## 🤝 Contributing

Bug fixes, accessibility improvements, content corrections, and new verified examples are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## 📎 Third-party services

The page loads fonts from Google Fonts and links to Microsoft Learn and other public Power Platform resources. Those services have their own terms and privacy policies.

## ⚖️ Trademark notice

POWERVERSE is an unofficial learning resource and is not affiliated with or endorsed by Microsoft. Microsoft, Power Platform, Power Apps, Power Automate, Power BI, Power Pages, Copilot Studio, and Dataverse are trademarks of the Microsoft group of companies.

## 📄 License

[MIT](LICENSE) © Lella Sri Harsha
