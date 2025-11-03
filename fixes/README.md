# Fixes Directory

This directory contains the fixed files for issues tracked in this repository.

## Structure
The directory structure mirrors the structure in the `molgenis/molgenis-emx2` repository.

## How to Apply

### For the refs empty message fix:
1. Navigate to your local clone of `molgenis/molgenis-emx2`
2. Copy `fixes/tailwind-components/app/components/input/Ref.vue` to `apps/tailwind-components/app/components/input/Ref.vue`

Or use the patch file:
```bash
cd /path/to/molgenis-emx2
git apply /path/to/GCC/fix-refs-empty-message.patch
```

## Files
- `tailwind-components/app/components/input/Ref.vue` - Fixed version of the Ref component that shows 'No options available' when lookup is empty instead of 'No results found'
