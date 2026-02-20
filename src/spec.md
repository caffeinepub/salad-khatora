# Specification

## Summary
**Goal:** Fix the continuous flickering and auto-reloading issue on the admin page.

**Planned changes:**
- Debug and resolve infinite re-render loops in the Layout component (frontend/src/components/Layout.tsx)
- Verify that useInternetIdentity hook does not cause repeated authentication state changes
- Check router configuration in App.tsx for redirect loops or repeated navigation attempts on admin routes
- Examine useEffect hooks in Layout.tsx for proper dependency arrays and cleanup functions to prevent infinite loops

**User-visible outcome:** Admin page loads smoothly without flickering or continuous reloading, allowing stable access to admin panel features.
