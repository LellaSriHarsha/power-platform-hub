# Security Policy

## Reporting a vulnerability

Please do not disclose vulnerabilities in a public issue. Use GitHub's **Security** tab to submit a private vulnerability report to the repository maintainers.

Include the affected page or feature, reproduction steps, impact, and a minimal proof of concept. Do not include real credentials or personal data.

## Scope

The Power Fx playground uses a purpose-built local interpreter. JavaScript examples execute in a dedicated Web Worker with a two-second limit, but this remains an educational feature rather than a hardened multi-tenant code sandbox. The app stores no accounts or user data.