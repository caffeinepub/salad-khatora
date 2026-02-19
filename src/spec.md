# Specification

## Summary
**Goal:** Add edit and delete functionality for inventory items in the inventory tab.

**Planned changes:**
- Add edit button/icon for each ingredient that opens a dialog with pre-populated fields for modification
- Add delete button/icon for each ingredient with confirmation dialog to prevent accidental deletion
- Implement backend update and delete methods for ingredient records
- Use React Query invalidation to update UI immediately after successful operations
- Display confirmation feedback for successful edits and deletions
- Auto-recalculate total inventory value after deletion

**User-visible outcome:** Users can edit ingredient details (name, quantity, unit type, cost price, supplier, low stock threshold) and delete ingredients from the inventory list with confirmation dialogs and immediate feedback.
