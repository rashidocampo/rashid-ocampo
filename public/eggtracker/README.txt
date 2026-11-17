5K AGRI SUPPLY | EGG TRACKER — OFFLINE PWA v1.0

INCLUDED
- 5 egg sizes, stock-in with batch-specific purchase costs
- FIFO inventory and cost-of-goods calculation
- Sales with cash, partial payment, and credit
- Edit finalized sale, with FIFO/inventory/credit validation and audit history
- Customer balances, collections, employees, expenses and stock loss
- JSON export and restore
- Uploaded 5K Agri Supply logo and red/green/gold branding

INSTALL ON ANDROID
This is a PWA web package, NOT an APK. Android PWA installation requires
hosting these files over HTTPS (or localhost during development).
1. Upload the CONTENTS of this folder to any HTTPS static website host.
2. Open the HTTPS address using Chrome on Android while online.
3. Choose 'Install app' or 'Add to Home screen' from Chrome's menu.
4. Open once online to cache the app, then use offline.

For preview only, open index.html in a browser that permits local files.
File:// preview may not persist storage or support installation.

LIMITATIONS
- Local storage is per device/browser; no cross-device synchronization.
- Export a backup DAILY and before clearing browser data or reinstalling.
- All stock quantities are WHOLE TRAYS, not individual eggs.
- FIFO cost is based on chronological purchases; changing a finalized sale
  is blocked if it would make historical stock negative.
- Customer credit is an aggregate balance, not invoice-by-invoice aging.
- Stock loss cost is included in net profit.
- No employee-specific custody/reconciliation or user authentication yet.
- Purchases, payments, and expenses do not yet have edit controls.
- Offline installation requires initial HTTPS hosting; this ZIP is not an APK.


VERSION 2 CHANGES
- Finalized sales can be edited or voided (cancelled) from Sales.
- Voided sales stay in history and audit, but no longer affect stock, credit or profit.
- Void is blocked if it would cause a customer overpayment or invalid chronological inventory.
- Backup tab now includes Reset All Data with multiple confirmations. Export backup before resetting.
- Existing version 1 local records are retained because the storage key is unchanged.
- Replace the app files in the existing /eggtracker/ web folder, not the website root.
- Refresh or reopen the installed PWA to receive updated cached files.
