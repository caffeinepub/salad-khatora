# Specification

## Summary
**Goal:** Enforce authentication requirement and redirect unauthenticated users to the login page.

**Planned changes:**
- Update App.tsx router configuration to redirect unauthenticated users from protected routes to /login
- Update Layout component to check authentication state and redirect unauthenticated users to /login
- Document admin Internet Identity credentials and authentication instructions

**User-visible outcome:** Users attempting to access the application without authentication will be automatically redirected to the login page. After successful Internet Identity authentication, users will be redirected to the dashboard and can access all protected routes.
