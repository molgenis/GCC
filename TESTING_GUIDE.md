# Testing Guide for Refs Empty Lookup Fix

## Overview
This fix changes the message displayed when a ref (reference) input has no options to show.

## Test Scenarios

### Scenario 1: Empty Lookup Table
**Setup:** A ref input field that references a lookup table with zero records.

**Before Fix:**
- User sees: "No results found"
- This is confusing because it implies a search was performed

**After Fix:**
- User sees: "No options available"
- This correctly indicates that the lookup table is empty

**How to Test:**
1. Create or use a form with a ref field
2. Ensure the referenced table is empty (has no records)
3. Open the form
4. Observe the message displayed for the ref field

**Expected Result:** Should display "No options available"

### Scenario 2: Search with No Results
**Setup:** A ref input field with a populated lookup table, but user performs a search that returns no matches.

**Before Fix:**
- User sees: "No results found"
- This is correct for a failed search

**After Fix:**
- User sees: "No results found"
- This remains the same (correct behavior)

**How to Test:**
1. Create or use a form with a ref field
2. Ensure the referenced table has records
3. Open the form
4. Type a search term that doesn't match any records
5. Observe the message displayed

**Expected Result:** Should display "No results found"

### Scenario 3: Normal Operation with Results
**Setup:** A ref input field with a populated lookup table, either initially or after search.

**Before Fix:**
- Displays options in checkbox/radio format

**After Fix:**
- Same behavior - displays options in checkbox/radio format

**How to Test:**
1. Create or use a form with a ref field
2. Ensure the referenced table has records
3. Open the form
4. Observe the options are displayed

**Expected Result:** Options should be displayed as checkboxes (if array) or radio buttons (if single select)

## Technical Details

### Changed Component
- File: `apps/tailwind-components/app/components/input/Ref.vue`
- Line: 319
- Change: Conditional message based on `searchTerms` value

### Logic
```vue
<!-- Before -->
<ButtonText v-else>No results found</ButtonText>

<!-- After -->
<ButtonText v-else>{{ searchTerms ? 'No results found' : 'No options available' }}</ButtonText>
```

The component checks if `searchTerms` has a value:
- If yes → user performed a search → "No results found"
- If no → initial load with empty table → "No options available"

## Regression Testing

Ensure the following still work correctly:
1. ✓ Single-select refs (radio buttons)
2. ✓ Multi-select refs (checkboxes)
3. ✓ Search functionality
4. ✓ Load more functionality (pagination)
5. ✓ Clear selection functionality
6. ✓ Initial selection display when form has existing values

## Browser Compatibility

Test in the same browsers that molgenis-emx2 officially supports.

## Accessibility

The change maintains the same component structure:
- Uses `ButtonText` component which should have proper ARIA attributes
- Screen readers will announce the new text correctly
- No change to keyboard navigation or focus management
