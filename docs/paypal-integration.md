# PayPal Integration Guide

This guide provides step-by-step instructions for setting up your PayPal account to handle both one-time purchases (for individual products and donations) and recurring subscriptions (for the product bundle).

## Step 1: Create a PayPal Developer Account & Application

First, you need a REST API application to get your **Client ID**. This ID is used for all types of transactions.

1.  **Go to the PayPal Developer Dashboard**:
    *   Navigate to [https://developer.paypal.com/](https://developer.paypal.com/) and log in. If you don't have an account, you'll need to create one.

2.  **Switch to Live Mode**:
    *   By default, you are in "Sandbox" mode. For real transactions, click the toggle to switch to the **Live** environment.

    

3.  **Create a New Application**:
    *   Go to the "Apps & Credentials" section.
    *   Click the "**Create App**" button.
    *   Give your app a name (e.g., "Bio-Throne Checkout") and click "**Create App**".

4.  **Get Your Client ID**:
    *   Once the app is created, you will see your **Client ID**. This is the first credential you need.

    

## Step 2: Create a Subscription Plan for the Bundle

Next, you need to create a subscription product and plan. This is only for the "Bio-Throne™ Bundle," which is sold as a recurring subscription.

1.  **Navigate to Subscription Products**:
    *   In the left-hand menu of the Developer Dashboard, under "Products & Services", click on "**Subscriptions**".

2.  **Create a Product**:
    *   Before creating a plan, you must create a product to associate it with.
    *   Click on "**Create Product**".
    *   Fill in the details:
        *   **Product Name**: `Bio-Throne™ Bundle`
        *   **Product Type**: `Service` (or `Digital`, as it's a recurring service)
        *   **Category**: Choose an appropriate category (e.g., `Software`)
    *   Click **Create Product**.

3.  **Create the Subscription Plan**:
    *   After creating the product, go to "**Subscription Plans**" in the left menu.
    *   Click "**Create Plan**".
    *   Associate the plan with the `Bio-Throne™ Bundle` product you just created.
    *   Set up the pricing and billing cycle:
        *   **Pricing**: Fixed Price.
        *   **Billing Cycles**: Set it to bill **every 3 months**. This matches the quarterly delivery schedule mentioned in the Terms of Service.
        *   Set the price to match the bundle price in the app (e.g., $39.98).
    *   Save the plan.

4.  **Get Your Plan ID**:
    *   After the plan is created, you will see its **Plan ID**. It will start with `P-`. This is the second credential you need.

    

## Step 3: Update Your Application's Environment File

The final step is to add these credentials to your project's `.env` file.

1.  **Open the `.env` file** in the root of your project.
2.  **Add the following lines**, replacing the placeholder text with the actual IDs you copied from PayPal:

    ```env
    # .env

    # PayPal API Credentials
    # Found in your PayPal Developer Dashboard under Apps & Credentials
    NEXT_PUBLIC_PAYPAL_CLIENT_ID="YOUR_LIVE_CLIENT_ID_HERE"

    # Found in your PayPal Developer Dashboard under Subscriptions > Subscription Plans
    NEXT_PUBLIC_PAYPAL_PLAN_ID="YOUR_LIVE_PLAN_ID_HERE"

    # ... other variables
    ```

3.  **Restart your application server** for the changes to take effect.

That's it! Your application is now configured to securely process both one-time payments and recurring subscriptions through PayPal.
