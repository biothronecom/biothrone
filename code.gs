/**
 * @fileoverview Google Apps Script to handle incoming POST requests for logging
 * Bio-Throne orders and subscriptions to separate Google Sheets.
 *
 * @version 2.0
 * @author Firebase Studio
 */

// =================================================================
// SCRIPT CONFIGURATION
// =================================================================
// In this version, we use PropertiesService for configuration.
// To set your configuration, run the `setup` function once from the
// Apps Script editor, filling in your actual values below.

/**
 * Run this function once to set up your script properties.
 * 1. Fill in the values below.
 * 2. In the Apps Script Editor, select "setup" from the function dropdown and click "Run".
 * 3. You can then remove your sensitive IDs from the code.
 */
function setup() {
  const properties = {
    // IMPORTANT: Generate a strong, random secret token.
    // This token must be included in the POST requests from your application for security.
    'SECRET_TOKEN': 'YOUR_SUPER_SECRET_TOKEN',
    'ORDER_SHEET_ID': 'YOUR_ORDER_SHEET_ID',
    'SUBSCRIPTION_SHEET_ID': 'YOUR_SUBSCRIPTION_SHEET_ID'
  };
  PropertiesService.getScriptProperties().setProperties(properties);
  Logger.log('✅ Script properties set successfully!');
}


// =================================================================
// MAIN WEB APP ENTRY POINT
// =================================================================

/**
 * Handles HTTP POST requests. This is the main entry point for the web app.
 * It validates the request and routes it to the appropriate handler.
 * @param {object} e The event parameter for a POST request.
 * @returns {ContentService.TextOutput} A JSON response indicating success or failure.
 */
function doPost(e) {
  const scriptProperties = PropertiesService.getScriptProperties();
  const SECRET_TOKEN = scriptProperties.getProperty('SECRET_TOKEN');

  // Use a lock to prevent concurrent execution issues
  const lock = LockService.getScriptLock();
  lock.waitLock(30000); // Wait up to 30 seconds for the lock

  let response;
  try {
    const payload = JSON.parse(e.postData.contents);

    // Security check: Validate the secret token
    if (!payload.secret || payload.secret !== SECRET_TOKEN) {
      throw new Error('Invalid or missing secret token.');
    }

    // Route based on the data type
    if (payload.type === 'order') {
      response = handleOrder(payload.data);
    } else if (payload.type === 'subscription') {
      response = handleSubscription(payload.data);
    } else {
      throw new Error('Invalid data type specified.');
    }
  } catch (error) {
    Logger.log(`Error: ${error.message}\nStack: ${error.stack}`);
    response = createJsonResponse({
      'status': 'error',
      'message': `Failed to process request. Reason: ${error.message}`
    });
  } finally {
    lock.releaseLock();
  }

  return response;
}


// =================================================================
// DATA HANDLERS
// =================================================================

/**
 * Handles new one-time order data.
 * @param {object} data The order data from the payload.
 * @returns {ContentService.TextOutput} A JSON response.
 */
function handleOrder(data) {
  const ORDER_SHEET_ID = PropertiesService.getScriptProperties().getProperty('ORDER_SHEET_ID');
  if (!ORDER_SHEET_ID) throw new Error('Order Sheet ID is not configured.');

  const sheet = SpreadsheetApp.openById(ORDER_SHEET_ID).getSheets()[0];
  const headers = [
    'Order ID', 'Order Date', 'Customer Name', 'Customer Email', 'Shipping Address',
    'Subtotal', 'Discount', 'Shipping', 'Total', 'Item Count', 'Product IDs', 'Is Bundle'
  ];
  
  ensureHeaders(sheet, headers);

  const shippingAddress = `${data.shipping.address1}, ${data.shipping.address2 || ''}, ${data.shipping.city}, ${data.shipping.state} ${data.shipping.zip}, ${data.shipping.country}`;
  const itemSummary = data.items.map(item => `${item.name} (Qty: ${item.quantity})`).join('; ');

  const newRow = [
    data.orderId,
    new Date(),
    data.shipping.fullName,
    data.shipping.email,
    shippingAddress,
    data.pricing.subtotal,
    data.pricing.savings,
    data.pricing.shippingCost,
    data.pricing.total,
    data.pricing.itemCount,
    data.pricing.productIds.join(', '),
    data.pricing.hasBundle
  ];

  sheet.appendRow(newRow);
  return createJsonResponse({ 'status': 'success', 'message': 'Order logged successfully.' });
}

/**
 * Handles new subscription data.
 * @param {object} data The subscription data from the payload.
 * @returns {ContentService.TextOutput} A JSON response.
 */
function handleSubscription(data) {
  const SUBSCRIPTION_SHEET_ID = PropertiesService.getScriptProperties().getProperty('SUBSCRIPTION_SHEET_ID');
   if (!SUBSCRIPTION_SHEET_ID) throw new Error('Subscription Sheet ID is not configured.');

  const sheet = SpreadsheetApp.openById(SUBSCRIPTION_SHEET_ID).getSheets()[0];
  const headers = [
    'Subscription ID', 'PayPal Plan ID', 'Start Date', 'Customer Name',
    'Customer Email', 'Shipping Address'
  ];

  ensureHeaders(sheet, headers);

  const shippingAddress = `${data.shipping.address1}, ${data.shipping.address2 || ''}, ${data.shipping.city}, ${data.shipping.state} ${data.shipping.zip}, ${data.shipping.country}`;

  const newRow = [
    data.subscriptionId,
    data.planId,
    new Date(),
    data.shipping.fullName,
    data.shipping.email,
    shippingAddress,
  ];

  sheet.appendRow(newRow);
  return createJsonResponse({ 'status': 'success', 'message': 'Subscription logged successfully.' });
}


// =================================================================
// HELPER FUNCTIONS
// =================================================================

/**
 * Creates a JSON response object for the web app.
 * @param {object} obj The JavaScript object to stringify.
 * @returns {ContentService.TextOutput} The response object.
 */
function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Ensures that the first row of a sheet contains the specified headers.
 * If the sheet is empty, it appends the headers.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet The sheet to check.
 * @param {string[]} headers An array of header strings.
 */
function ensureHeaders(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
}