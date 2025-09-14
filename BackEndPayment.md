# 💳 Payment API Documentation

This document provides instructions for frontend developers on how to integrate with the backend payment API. The new process is designed to be robust, secure, and consistent across all payment methods.

## General Payment Flow

The payment process has been unified into a single, streamlined flow:

1.  **Create Order:** The user finalizes their cart and chooses a payment method. The frontend sends a request to the backend to create an order.
2.  **Receive Instructions:** The backend creates the order in a `pending` state, "locks in" the order items, and clears the user's cart. It then returns specific instructions based on the chosen payment method.
3.  **Handle Payment:** The frontend uses the instructions to process the payment (e.g., redirect to PayPal, use Stripe.js).
4.  **Backend Confirmation:** The backend confirms the payment automatically via secure channels (webhooks or callbacks). The frontend **does not** need to make a final confirmation call. The user can be redirected to a success/failure page, and the order status can be fetched from the `/api/orders/{id}` endpoint.

---

## 1. Create an Order

This is the first and most important step. It creates the order and returns the necessary information for the chosen payment method.

-   **Endpoint:** `POST /api/orders`
-   **Authentication:** Requires customer token (`customer_api` guard).
-   **Request Body:**

```json
{
  "payment_method": "stripe"
}
```

The `payment_method` can be one of three values:
-   `"cash_on_delivery"`
-   `"stripe"`
-   `"paypal"`

### Response Scenarios

The response will vary based on the `payment_method`.

---

### Scenario A: Cash on Delivery

If the user chooses `"cash_on_delivery"`, the order is created and immediately moved to a `processing` state. The frontend can redirect the user to a "Thank You" page.

-   **Example Response (`200 OK`):**

```json
{
  "data": {
    "id": 123,
    "total_price": "99.98",
    "status": "processing",
    "payment_method": "cash_on_delivery",
    "created_at": "2025-09-14T12:00:00.000000Z",
    "items": [
      {
        "id": 1,
        "quantity": 2,
        "price": "49.99",
        "book": {
          "id": 10,
          "title": "The Laravel Way"
        }
      }
    ]
  }
}
```

---

### Scenario B: Stripe

If the user chooses `"stripe"`, the backend creates a `pending` order and a Stripe Payment Intent. It returns a `client_secret` for the frontend to use with Stripe.js.

-   **Frontend Action:** Use the `client_secret` with the Stripe.js library to securely confirm the payment on the client side. You should use `stripe.confirmPayment()`. The backend will be notified of the payment's success or failure via a webhook.

-   **Example Response (`200 OK`):**

```json
{
  "client_secret": "pi_3Pj..._secret_ABC...",
  "order": {
    "data": {
      "id": 124,
      "total_price": "99.98",
      "status": "pending",
      "payment_method": "stripe",
      "created_at": "2025-09-14T12:05:00.000000Z",
      "items": [
        // ... items ...
      ]
    }
  }
}
```

---

### Scenario C: PayPal

If the user chooses `"paypal"`, the backend creates a `pending` order and gets an approval link from PayPal.

-   **Frontend Action:** Redirect the user to the `approval_link`. After the user approves or cancels the payment on PayPal's site, they will be redirected back to the `return_url` or `cancel_url` that was configured in the backend.

-   **Example Response (`200 OK`):**

```json
{
  "approval_link": "https://www.sandbox.paypal.com/checkoutnow?token=...",
  "order": {
    "data": {
      "id": 125,
      "total_price": "99.98",
      "status": "pending",
      "payment_method": "paypal",
      "created_at": "2025-09-14T12:10:00.000000Z",
      "items": [
        // ... items ...
      ]
    }
  }
}
```

---

## 2. Checking Order Status

After the payment process is initiated, the frontend can poll the order's status by fetching it from the standard `GET /api/orders/{id}` endpoint to know if the payment was successful (`paid`), failed (`failed`), or is still pending. This is useful for showing the final status to the user after they return from PayPal or after the Stripe payment completes.