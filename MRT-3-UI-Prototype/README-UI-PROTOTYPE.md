# MRT-3 UI-only website

This folder is the frontend-only version for UI work. It contains static HTML, CSS, and JavaScript. It does not connect to PHP, MySQL, an API server, or a payment service.

## Open the website

Open `index.html` in a browser. Use the navigation to explore the home page, station directory, line map, fares and ticketing, and account pages. No XAMPP or database setup is needed.

## Demo interactions

- Register and sign in with demo details in this browser tab.
- Browse all thirteen MRT-3 stations and use the route map.
- Calculate a station-to-station fare and create an unpaid counter booking voucher or a prepaid demo reservation.
- Order a Beep stored-value pass for pickup at any MRT-3 station, with counter payment or a simulated online payment choice.
- Choose Demo Wallet Balance or the clearly labeled simulated GCash option for prepaid reservations.
- View and manage tickets from either Fares & Ticketing or Account Details; cancellations refund the demo wallet.
- Download each digital pass as a high-resolution PNG with its QR code and journey details.
- Select mock ID images to preview the concessionary verification interface.

Demo account, wallet, and ticket data are kept in this browser's `localStorage` so same-origin pages and tabs can stay in sync. Clear this site's browser storage to reset the demo. Ticket QR codes are generated in the browser and encode the reference, route, validity date, fare category, total, and status; they are not valid for travel or payment. QR generation loads QRCode.js from cdnjs, so an internet connection is needed to display scannable codes. ID files are never uploaded. Do not enter real passwords or identity documents.
