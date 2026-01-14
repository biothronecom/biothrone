# Google Sheets & Apps Script Integration Guide

This guide will walk you through setting up a Google Sheet to store your application's order data and deploying a Google Apps Script to act as a simple, secure backend.

## Step 1: Create the Google Sheet

1.  **Create a New Sheet**:
    *   Go to [sheets.new](https://sheets.new) to create a new, blank Google Sheet.
    *   Name the sheet something descriptive, like "Bio-Throne Orders".

2.  **Set Up the Headers**:
    *   In the first row of the sheet (Row 1), you **must** add the following headers in the exact order shown. The script relies on this order.

| A         | B    | C        | D      | E      | F       | G          | H              | I                | J                  |
| :-------- | :--- | :------- | :----- | :----- | :------ | :--------- | :------------- | :--------------- | :----------------- |
| **OrderID** | **Date** | **Customer** | **Email** | **Status** | **Total** | **PayPalID** | **TrackingNumber** | **ShippingAddress** | **Items**          |



## Step 2: Create and Configure the Google Apps Script

1.  **Open the Apps Script Editor**:
    *   In your Google Sheet, go to **Extensions > Apps Script**.
    *   This will open a new browser tab with the script editor.

2.  **Paste the Code**:
    *   Delete any boilerplate code in the `Code.gs` file.
    *   Copy the entire contents of the `code.gs` file from this project's repository.
    *   Paste the copied code into the Apps Script editor.

3.  **Save the Script**:
    *   Click the floppy disk icon (Save project) in the toolbar.
    *   Give the project a name, like "Bio-Throne Order Manager".

## Step 3: Deploy the Script as a Web App

Deploying the script makes it accessible via a URL, which your application will use to send data.

1.  **Open the Deployment Dialog**:
    *   At the top right, click the blue **Deploy** button and select **New deployment**.

2.  **Configure the Deployment**:
    *   Click the gear icon next to "Select type" and choose **Web app**.
    *   In the "New deployment" configuration screen, fill in the following:
        *   **Description**: `Bio-Throne Order Management API`
        *   **Execute as**: `Me (your@email.com)`
        *   **Who has access**: **Anyone**
            *   **CRITICAL:** You must select **Anyone**. Do not select "Anyone within your organization" or "Only myself", as this will block requests from your application.

    

3.  **Authorize and Deploy**:
    *   Click **Deploy**.
    *   Google will prompt you to authorize the script's permissions. Click **Authorize access**.
    *   Choose your Google account.
    *   You may see a "Google hasn't verified this app" screen. This is normal for your own scripts. Click **Advanced**, and then click **Go to [Your Script Name] (unsafe)**.
    *   Review the permissions and click **Allow**.

4.  **Copy the Web App URL**:
    *   After deployment, a modal will appear with your **Web app URL**. This is the URL your application needs. Click **Copy**.

    

## Step 4: Update Your Application's Environment File

The final step is to add the Web App URL to your project's `.env` file.

1.  **Open the `.env` file** in the root of your project.
2.  **Add the following line**, pasting the URL you just copied:

    ```env
    # .env

    # Google Apps Script Web App URL for order management
    NEXT_PUBLIC_APPS_SCRIPT_URL="YOUR_DEPLOYED_WEB_APP_URL_HERE"

    # ... other variables
    ```

3.  **Restart your application server** for the changes to take effect.

Your application is now fully configured to log new orders and update their status directly in your Google Sheet.
