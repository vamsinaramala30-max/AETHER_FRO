# AETHER Frontend Repository Fix Plan

## Issues Found & Fix Status — ALL COMPLETED ✅

### Phase 1: Critical CSS/Theme Fixes
- [x] Fix ThemeProvider to set `data-theme` attribute (was only setting class, but CSS uses `[data-theme]`)
- [x] Fix `src/contexts/ThemeContext.tsx` to also set `data-theme` attribute
- [x] Add missing layout utility CSS classes (`bg-background`, `text-foreground`, `bg-card`, `border-border`, etc.)
- [x] Fix `utilities.css` with proper CSS variable mappings

### Phase 2: Missing Providers
- [x] Add `VisualEffectsProvider` to `AppProviders` tree (was missing, causing Background3D to crash)
- [x] Install `react-ga4` dependency (was missing from package.json)

### Phase 3: Three.js / Canvas Fixes
- [x] Add error handling to `Background3D.tsx` with `onError` callback
- [x] Add ambient/directional lights to Canvas in `Background3D.tsx`

### Phase 4: Dev Server Verification
- [x] `npm install react-ga4` — completed (added 1 package)
- [x] `npm run dev` — Vite dev server running on http://localhost:5173/
- [x] No unresolved import errors
- [x] Server starts successfully
