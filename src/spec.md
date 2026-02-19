# Specification

## Summary
**Goal:** Protect the customer management page with Internet Identity authentication.

**Planned changes:**
- Add authentication check to the CustomersPage route to redirect unauthenticated users to the login page
- Update the sidebar navigation to conditionally show the Customers menu item only for authenticated users

**User-visible outcome:** Users must log in with Internet Identity to access the customer management tab. The Customers menu item appears in the sidebar only after successful login.
