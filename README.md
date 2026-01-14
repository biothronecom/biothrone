# Bio-Throne™: Enhanced PWA for Sustainable E-commerce

This repository contains the source code for the Bio-Throne™ progressive web application (PWA), an advanced e-commerce platform built with a focus on sustainability, performance, and a modern user experience.

The application is a fully functional online store that allows users to purchase eco-friendly toilet cleaning products, manage their cart, and complete transactions securely via PayPal. It features an administrative backend for order management and leverages AI for dynamic content generation and environmental impact analysis.

## Core Features

- **PWA Capabilities**: The application is installable on users' devices and offers offline support via a service worker for enhanced reliability.
- **Secure Shopping Cart**: Users can add products, view their cart, and proceed to a secure checkout. It supports individual product purchases, bundle deals with discounts, and subscription-based orders.
- **PayPal Integration**: Securely processes both one-time payments and recurring subscriptions using the PayPal API.
- **AI-Powered Carbon Footprint Tool**: An integrated AI tool estimates and visualizes the carbon footprint (CO2 emissions) and plastic waste of products, comparing them against industry averages.
- **AI Product Importer**: A feature that allows an administrator to generate new products for the store—including descriptions, pricing, and images—simply by providing a list of product names.
- **Admin Dashboard**: A comprehensive dashboard for administrators to view and manage customer orders, update order statuses (e.g., Pending, Processing, Shipped), and add tracking information.
- **Google Sheets Backend**: A Google Apps Script acts as a lightweight backend, automatically logging all transaction and order details to a designated Google Sheet for easy tracking.
- **Automated Email Notifications**: The backend script sends automated confirmation and shipping notification emails to customers upon status changes.

## Technology Stack

This project is built with a modern, server-centric, and AI-first technology stack:

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI Library**: [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit) for running generative AI flows.
- **Payments**: [PayPal React SDK](https://www.npmjs.com/package/@paypal/react-paypal-js)
- **Backend/Database**: [Google Apps Script](https://developers.google.com/apps-script) connected to a Google Sheet.

## Getting Started

### 1. Environment Configuration

To run the application locally, you need to configure your environment variables. Copy the contents of `.env.example` into a new file named `.env` and fill in the required values.

**File: `.env`**
```
# Google AI API Key (for Genkit)
NEXT_PUBLIC_GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# PayPal API Credentials
NEXT_PUBLIC_PAYPAL_CLIENT_ID="YOUR_PAYPAL_CLIENT_ID"
NEXT_PUBLIC_PAYPAL_PLAN_ID="YOUR_PAYPAL_SUBSCRIPTION_PLAN_ID" # Required for bundle subscriptions

# Google Apps Script Web App URL
# Deploy the code in `code.gs` as a web app to get this URL.
NEXT_PUBLIC_APPS_SCRIPT_URL="YOUR_GOOGLE_APPS_SCRIPT_URL"

# Private Secret (server-only)
# Must match the SECRET_TOKEN set via the Apps Script `setup` function.
SHEET_WEBHOOK_SECRET="YOUR_SUPER_SECRET_TOKEN"
```

### 2. Install Dependencies

Install the project dependencies using npm:

```bash
npm install
```

### 3. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

## Project Structure

- `src/app/`: Contains all pages and layouts for the application (using the Next.js App Router).
- `src/app/admin/`: Admin-facing pages for order and asset management.
- `src/components/`: Shared React components used across the application.
- `src/lib/`: Core application logic, constants (products, pricing), and server actions.
- `src/ai/`: Contains all Genkit AI flows for features like product generation and carbon footprint analysis.
- `src/hooks/`: Custom React hooks.
- `code.gs`: The Google Apps Script code to be deployed as the application's backend.
- `public/`: Static assets, including the service worker and web manifest.
