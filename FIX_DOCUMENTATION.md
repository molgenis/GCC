# Fix for Issue: refs give 'No results found' when lookup is empty

## Issue Description
The 'refs' component in tw-forms (tailwind-components) shows 'No results found' when the lookup table is empty. This message should be changed to 'no options available' to better indicate that there are no options in the lookup table, as opposed to a search that returned no results.

## Root Cause
The component in `apps/tailwind-components/app/components/input/Ref.vue` did not distinguish between:
1. An empty lookup table (no options available)
2. A search that returns no results

Both cases showed the same message: "No results found"

## Solution
Modified the template to check if `searchTerms` is active:
- If `searchTerms` has a value: show "No results found" (search returned nothing)
- If `searchTerms` is empty: show "No options available" (lookup table is empty)

## File Changed
- `apps/tailwind-components/app/components/input/Ref.vue` (line 319)

## Change Details
**Before:**
```vue
<ButtonText v-else>No results found</ButtonText>
```

**After:**
```vue
<ButtonText v-else>{{ searchTerms ? 'No results found' : 'No options available' }}</ButtonText>
```

## Implementation Notes
The fix uses a conditional expression in the template to dynamically select the appropriate message based on whether a search is active (`searchTerms` has a value) or not.

## Testing Recommendations
1. Test with an empty lookup table (no options) - should show "No options available"
2. Test with a populated lookup table but search term that returns no results - should show "No results found"
3. Test with a populated lookup table and valid search - should show results
4. Test both single-select (radio) and multi-select (checkbox) modes

## Repository
This fix needs to be applied to the `molgenis/molgenis-emx2` repository.
The patch file is included: `fix-refs-empty-message.patch`
