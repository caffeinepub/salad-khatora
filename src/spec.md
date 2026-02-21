# Specification

## Summary
**Goal:** Restore the application to version 22 by removing customer reference fields, audible order notifications, UPI QR code generation, and restoring inventory navigation.

**Planned changes:**
- Remove customer reference field from database schema, backend API, and all frontend forms and displays
- Remove audible order notification system that plays alert sounds for new orders
- Remove UPI QR code generation functionality from the billing system
- Restore inventory navigation links and routes that were previously removed

**User-visible outcome:** Users will have a simpler customer management system without reference fields, no audio alerts for orders, no UPI QR codes in billing, and restored access to the inventory management page.
