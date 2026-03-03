# How to Convert this App to Cordova

This guide explains how to wrap your existing React/Vite application into a Cordova app for Android and iOS.

## Prerequisites

1.  **Node.js & npm**: Ensure you have Node.js installed.
2.  **Cordova CLI**: Install global Cordova tools.
    ```bash
    npm install -g cordova
    ```
3.  **Android Studio / Xcode**:
    *   For Android: Install Android Studio and set up the Android SDK.
    *   For iOS: Install Xcode (macOS only).

## Step 1: Create the Cordova Project

Run this command in the parent directory of your project (or alongside it):

```bash
cordova create sarya-mobile com.sarya.app "Sarya Ecommerce"
cd sarya-mobile
```

## Step 2: Add Platforms

Add the platforms you want to support:

```bash
cordova platform add android
cordova platform add ios
```

## Step 3: Prepare the React App

We have already configured the React app for Cordova compatibility:
1.  **`vite.config.ts`**: Set `base: './'` to support relative file paths.
2.  **`src/App.tsx`**: Switched to `HashRouter` to handle routing without a server.

## Step 4: Build the React App

In your React project directory (this folder), run:

```bash
npm run build
```

This will create a `dist` folder with your compiled application.

## Step 5: Copy Files to Cordova

Clear the default Cordova `www` folder and copy your build artifacts:

**Manual Method:**
1.  Delete everything inside `sarya-mobile/www`.
2.  Copy the contents of `dist/` into `sarya-mobile/www/`.

**Automated Script (Recommended):**
You can add a script to your `package.json` to automate this.

## Step 6: Configure Cordova

In `sarya-mobile/config.xml`, add the following to allow navigation and API requests:

```xml
<allow-navigation href="*" />
<access origin="*" />
<allow-intent href="http://*/*" />
<allow-intent href="https://*/*" />
```

## Step 7: Build and Run

Inside the `sarya-mobile` directory:

**For Android:**
```bash
cordova run android
```

**For iOS:**
```bash
cordova run ios
```

## Troubleshooting

*   **White Screen**: If you see a white screen, check the console (Chrome DevTools for Android, Safari for iOS). It's usually a path issue (ensure `base: './'` is set).
*   **Navigation Issues**: Ensure you are using `HashRouter` in `App.tsx`.
*   **API Errors**: Ensure your API endpoints (Supabase) allow requests from `file://` or `localhost` origins, or configure CORS properly.
