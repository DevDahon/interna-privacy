# Interna Privacy Policy Site

Plain static privacy-policy website for Interna, independently maintained by Dahon.

## Files

- `index.html`
- `styles.css`
- `script.js`

## Before publishing

1. Update `script.js`:
   - `effectiveDate`
   - `contactEmail`
   - `developerName` if needed
2. Keep `index.html` aligned with the live app behavior, especially:
   - active AI providers
   - on-device fallback narrative behavior
   - rewarded-ad credit handling
   - anti-abuse / device-trust language
   - backup and restore limitations for AI credits
3. Host the folder on a public static host.
4. Copy the final public URL into Interna using `EXPO_PUBLIC_PRIVACY_POLICY_URL`.

## Local preview

Open `index.html` directly in a browser, or serve the folder with a simple static server.
