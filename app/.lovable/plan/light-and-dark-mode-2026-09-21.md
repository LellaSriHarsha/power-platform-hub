# Light and dark mode

## What I’ll add
- Add a compact light/dark mode control in the top navigation, with an accessible label and clear sun/moon state.
- Create a polished light palette while preserving POWERVERSE’s existing colorful identity and dark theme.
- Apply the selected theme across navigation, sections, cards, playground, function browser, modals, and footer.
- Remember the visitor’s choice and otherwise follow their device preference.
- Prevent a theme flash while the page loads, and verify both modes on desktop and mobile.

## Technical details
- Use CSS theme variables so existing components inherit the correct colors without duplicating layouts.
- Store only the theme preference in browser storage; no account or backend is needed.
- Keep keyboard focus, labels, contrast, reduced-motion behavior, and the existing security policy intact.
