# AETHER Frontend Repository Fix Plan

## Issues Found & Fix Status

### Phase 1: Missing Files That Are Imported

- [x] Create `frontend/src/shared/api.ts` 
- [x] Create `frontend/src/shared/theme.ts`
- [x] Rename `cards/index.ts` → verify exports match
- [x] Fix `components/modals/Index.ts` → `index.ts` casing
- [x] Fix `components/feedback/Index.ts` → `index.ts` casing
- [x] Fix `three/Index.ts` barrel exports (remove nonexistent: Camera, Controls, Loader, Models)

### Phase 2: Fix Import Casing in Barrel Files

- [x] `components/modals/index.ts` - update to lowercase filenames
- [x] `components/feedback/index.ts` - update to lowercase filenames  
- [x] `three/Index.ts` - update Environment export

### Phase 3: Fix Automation Module Imports

- [x] `automation/automationmoduleroot.tsx` - fix import paths to use kebab-case filenames
- [x] `knowledge/knowledge-base/KnowledgeBasePage.tsx` - fix import paths

### Phase 4: Run Build & Fix Remaining Errors

- [ ] Run `npm run build` and fix any remaining errors
- [ ] Run `npm run dev` and verify startup

