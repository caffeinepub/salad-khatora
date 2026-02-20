# Specification

## Summary
**Goal:** Redesign the login interface to match the uploaded design mockup while maintaining Internet Identity authentication.

**Planned changes:**
- Update LoginPage component to display centered card layout with "Welcome Back" heading and "Sign in to your Salad Khatora account" subtitle
- Add email input field with envelope icon and placeholder "you@example.com"
- Add password input field with lock icon and placeholder "Enter your password"
- Style Sign In button with green background (#4ade80) and white text
- Add footer with "Don't have an account? Sign up" text (Sign up in green) and "Back to Home" link
- Style card with white background and rounded corners matching the mockup
- Connect Sign In button to Internet Identity authentication flow (email/password fields are visual only)

**User-visible outcome:** Users see a modern, traditional-looking login interface with email and password fields, but clicking Sign In triggers Internet Identity authentication as before.
