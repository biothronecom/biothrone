# Project Blueprint: Enhanced PWA for Sustainable E-commerce

This document outlines the architecture, features, and structure of the Bio-Throne™ e-commerce application.

## 1. Core Mission

The application is an enhanced Progressive Web App (PWA) designed for a sustainable e-commerce brand, "Bio-Throne™". Its primary goals are to provide a seamless shopping experience, integrate powerful admin tools for order management, and leverage AI to highlight the brand's commitment to environmental sustainability.

## 2. Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI**: React, ShadCN UI Components
- **Styling**: Tailwind CSS
- **AI Integration**: Genkit (with Google's Gemini models)
- **Payments**: PayPal (via `@paypal/react-paypal-js`)
- **Backend Logic**: Google Apps Script (for Google Sheets integration)
- **State Management**: React Context API (`useCart`)
- **Form Management**: React Hook Form with Zod for validation

## 3. Core Features

### 3.1. User-Facing Application

- **Progressive Web App (PWA)**: The application is installable, supports offline browsing via a service worker, and is optimized for mobile devices.
- **Dynamic Product Catalog**: Displays products with details, pricing, and images. Includes special promotions for bundles.
- **Interactive Shopping Cart**: Users can add/remove items, see dynamic calculations for subtotals, savings, and shipping, and proceed to checkout.
- **Secure PayPal Checkout**: Integrates PayPal for both one-time purchases and recurring subscriptions (for the product bundle).
- **AI-Powered Carbon Analysis**: Users can trigger an AI-powered analysis on the product detail page to see an estimated carbon footprint and plastic waste comparison.
- **Accessibility Features**: Includes ARIA labels and a Text-to-Speech feature on the admin dashboard for enhanced usability.
- **AI Product Importer**: A tool that allows admins to generate new products for the store by simply providing a list of names.

### 3.2. Admin Panel (`/admin`)

- **Orders Dashboard**: A central hub for viewing and managing all customer orders. Features include:
    - At-a-glance summary cards for order statuses (Pending, Processing, Shipped, Canceled).
    - Color-coded status badges for quick visual identification.
    - A real-time search filter for orders by ID, customer name, or PayPal ID.
    - Actions to confirm, ship, or cancel orders, with animated visual feedback.
    - Expandable rows to view detailed order information.
- **Settings Page**: A UI for managing application-level configurations. It generates a snippet for updating `.env` and `config.ts` files.
- **Asset Management**: A (currently disabled) page for managing image assets used throughout the application.

### 3.3. AI & Backend

- **Genkit Flows**:
    - `product-description.ts`: Generates compelling product descriptions from basic info.
    - `product-footprint-analysis.ts`: Analyzes a product's environmental impact.
- **Google Sheets Integration**:
    - A Google Apps Script (`code.gs`) acts as a simple backend API.
    - It logs new orders and updates order statuses in a designated Google Sheet, triggered by actions from the admin dashboard and cart.

## 4. Project Structure Overview

```
/
├── .env                  # Environment variables (PayPal keys, API keys, etc.)
├── .gitignore            # Specifies intentionally untracked files to ignore
├── apphosting.yaml       # Firebase App Hosting configuration
├── components.json       # ShadCN UI configuration
├── next.config.mjs       # Next.js configuration (e.g., image domains)
├── package.json          # Project dependencies and scripts
├── public/               # Static assets (images, manifest.json, service-worker.js)
├── src/                  # Main application source code
│   ├── ai/               # Genkit AI integration
│   │   ├── flows/        # AI-powered logic for specific tasks
│   │   └── genkit.ts     # Genkit global configuration
│   ├── app/              # Next.js App Router (pages and layouts)
│   │   ├── admin/        # Admin panel section
│   │   ├── cart/         # Shopping cart page
│   │   ├── import/       # AI product importer page
│   │   ├── (root)/       # Home, terms, and layout files
│   │   └── offline/      # Offline fallback page for the PWA
│   ├── components/       # Reusable React components
│   │   ├── carbon/       # Carbon footprint analysis UI
│   │   ├── cart/         # Cart-related components (Sheet, Shipping Form, etc.)
│   │   ├── import/       # Product import form
│   │   ├── layout/       # Global layout components (Header, Footer, etc.)
│   │   ├── legal/        # Terms and Conditions content
│   │   ├── products/     # Product display components (Card, List, Dialog)
│   │   ├── shared/       # General-purpose shared components
│   │   └── ui/           # ShadCN UI library components
│   ├── context/          # React context providers (Cart, etc.)
│   ├── hooks/            # Custom React hooks (use-cart, use-toast, etc.)
│   ├── lib/              # Core logic, configuration, and utilities
│   │   ├── actions.ts    # Server-side actions for forms and AI calls
│   │   ├── config.ts     # Site-wide configuration
│   │   ├── image-assets.ts # Centralized image asset paths
│   │   ├── order-actions.ts# Functions for interacting with Google Sheets
│   │   ├── pricing.ts    # Centralized product pricing
│   │   ├── products.ts   # Static product data
│   │   ├── types.ts      # TypeScript type definitions
│   │   └── utils.ts      # Utility functions (e.g., `cn` for classnames)
│   ├── types/            # Type definitions (e.g., Order type)
│   └── tailwind.config.ts # Tailwind CSS configuration
└── tsconfig.json         # TypeScript compiler configuration
```

## 5. Data Flow: Order Creation

1.  **Cart (`/cart`)**: User completes the shipping form and finalizes the purchase via the PayPal button.
2.  **Order Success**: On successful payment, `handleSuccessfulOrder` is called.
3.  **Client-Side**: A new `Order` object is created using shipping data and cart contents.
4.  **Server Action (`createOrderInSheet`)**: The `Order` object is passed to this server action in `src/lib/order-actions.ts`.
5.  **Google Apps Script**: The server action sends a `POST` request to the deployed Google Apps Script URL with the action `CREATE_ORDER`.
6.  **Google Sheet**: The script's `doPost` function receives the data, formats it into a row, and appends it to the "Orders" sheet.
