# HSRP Booking — Assistance Website

A responsive React + Vite + Tailwind CSS website for a vehicle number-plate booking assistance service.

## Features
- Two-wheeler assistance fee: ₹699
- Four-wheeler assistance fee: ₹1,099
- Dynamic UPI QR code and UPI payment deep link
- Vehicle and customer form validation
- Manual payment confirmation with transaction reference field
- WhatsApp handoff with a prefilled booking message
- Clear notice that this is an independent assistance service, not a government website or payment portal

## Run locally
1. Install Node.js (LTS).
2. Extract this project.
3. Open a terminal in the project folder.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local URL shown by Vite.

## Build for hosting
```bash
npm run build
```
Upload the generated `dist/` folder to a static host such as Vercel, Netlify, or a compatible hosting provider.

## Business configuration
The current details are set in `src/App.jsx`:
- Business: HSRP Booking
- UPI ID: `8554012976@kotakbank`
- WhatsApp: `8554012976` (India country code is added automatically for the WhatsApp link)
- Two-wheeler: ₹699
- Four-wheeler: ₹1,099

## Important payment notes
- The QR code encodes a UPI payment request for the selected amount. UPI apps and banks may show their own confirmation screens.
- This static website cannot independently verify that money has reached your bank account. Confirm payment in your UPI/bank app before treating a booking as paid.
- The website does not collect or store form submissions on a server. When the customer clicks the WhatsApp button, WhatsApp opens with a prefilled message; the customer must press Send.
- Do not ask customers to share UPI PINs, OTPs, card PINs, or passwords.
- Keep the service description accurate. This site is an independent assistance service and is not an official government portal or an HSRP manufacturer website. Customers should complete official booking/fitment steps through the authorized channel applicable to their vehicle and state.
- Before charging customers, ensure your assistance fee, cancellation/refund terms, privacy notice, and service scope are clearly disclosed.

## Suggested production improvements
For online storage, admin dashboard, automated payment verification, or booking status notifications, add a secure backend and a payment gateway/webhook. Never trust a browser checkbox as proof of payment.
