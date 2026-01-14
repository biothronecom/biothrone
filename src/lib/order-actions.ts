
'use server';

import type { Order } from "@/types/order";

const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;
const SHEET_WEBHOOK_SECRET = process.env.SHEET_WEBHOOK_SECRET;

type ScriptAction = 'CREATE_ORDER' | 'UPDATE_STATUS';

function buildPayloadForScript(action: ScriptAction, payload: Order) {
  // Google Apps Script expects a shape of { secret, type, data }
  const type = action === 'CREATE_ORDER' ? 'order' : 'order';
  return {
    secret: SHEET_WEBHOOK_SECRET,
    type,
    data: {
      orderId: payload.id,
      shipping: {
        fullName: payload.shippingAddress.fullName,
        email: payload.email,
        address1: payload.shippingAddress.address1,
        address2: payload.shippingAddress.address2,
        city: payload.shippingAddress.city,
        state: payload.shippingAddress.state,
        zip: payload.shippingAddress.zip,
        country: payload.shippingAddress.country,
      },
      items: payload.items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      pricing: {
        subtotal: payload.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        savings: payload.discount || 0,
        shippingCost: 0,
        total: payload.total,
        itemCount: payload.items.length,
        productIds: payload.items.map(item => item.id),
        hasBundle: payload.items.some(item => item.id === '4'),
      },
      paypalId: payload.paypalId,
      status: payload.status,
      createdAt: payload.date,
      trackingNumber: payload.trackingNumber,
    },
  };
}

async function postToSheet(action: ScriptAction, payload: Order) {
  if (!APPS_SCRIPT_URL) {
    console.error("Apps Script URL is not configured. Skipping Google Sheet update.");
    // Return a success-like response to prevent the UI from blocking in demo mode
    return { success: true, message: "Demo mode: Skipped Google Sheet update." };
  }

  if (!SHEET_WEBHOOK_SECRET) {
    console.error("SHEET_WEBHOOK_SECRET is not configured. Skipping Google Sheet update.");
    return { success: false, error: "Server webhook secret is missing." };
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildPayloadForScript(action, payload)),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to post to Google Sheet. Status: ${response.status}. Body: ${errorBody}`);
    }

    const result = await response.json();
    if (result.status !== 'success') {
      throw new Error(`Apps Script returned an error: ${result.message}`);
    }

    return { success: true, data: result };
  } catch (error) {
    console.error('Error posting to Google Sheet:', error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: errorMessage };
  }
}

export async function createOrderInSheet(order: Order) {
  return postToSheet('CREATE_ORDER', order);
}

export async function updateOrderStatusInSheet(order: Order) {
  return postToSheet('UPDATE_STATUS', order);
}
