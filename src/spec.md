# Specification

## Summary
**Goal:** Restructure the inventory page with four sub-tabs (Stock In, Stock Out, Write Off, Stock Status) to provide dedicated interfaces for different inventory management operations.

**Planned changes:**
- Replace single-view inventory page with tabbed interface containing Stock In, Stock Out, Write Off, and Stock Status tabs
- Implement Stock In tab with form to record incoming inventory (ingredient, quantity, supplier, date, cost) and update quantities
- Implement Stock Out tab with form to record inventory removal (ingredient, quantity, reason, date) and decrease quantities
- Implement Write Off tab with form to record damaged/expired inventory (ingredient, quantity, reason, date) and maintain separate write-off log
- Implement Stock Status tab displaying current inventory overview with quantities, cost prices, low-stock indicators, and total value
- Create backend transaction records for Stock In, Stock Out, and Write Off operations with full history tracking
- Display transaction history tables in each tab showing recent transactions with relevant details

**User-visible outcome:** Users can manage inventory through four organized tabs: record incoming stock, track stock removal, write off damaged items, and monitor current stock levels with comprehensive transaction history for each operation type.
