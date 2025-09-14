أنت خبير Frontend (Vue.js / React.js) ومتخصص في ربط الواجهات مع REST APIs.
طرق الدفع strip و Cod تعمل بنجاح ماعدى بايبال من خلال توثيق هذا اصلح المشكلة : 

هذا هو توثيق المسلم من الباك أند :
# توثيق OrdersController API

## 1. نظرة عامة (Conceptual Overview)

`OrdersController` هو المسؤول عن إدارة عمليات الطلبات في النظام. يسمح للعملاء بإنشاء طلبات جديدة من خلال سلة المشتريات الخاصة بهم، تتبع حالة طلباتهم، وإتمام عمليات الدفع.

- **علاقة الطلبات:**
  - **العملاء (Customers):** كل طلب يرتبط بعميل واحد.
  - **المنتجات (Books):** الطلب يحتوي على عدة منتجات (كتب) من خلال جدول `order_items`.
  - **طرق الدفع (Payment Methods):** كل طلب له طريقة دفع محددة (مثل Stripe, PayPal, Cash on Delivery).

## 2. جداول قاعدة البيانات (Database Schema)

### جدول `orders`

| العمود (Column)      | النوع (Data Type)                                       | الوصف (Description)                                       |
| -------------------- | -------------------------------------------------------- | --------------------------------------------------------- |
| `id`                 | `bigint` (unsigned)                                      | المعرف الرئيسي للطلب.                                     |
| `customer_id`        | `bigint` (unsigned)                                      | مفتاح خارجي يرتبط بجدول `customers`.                      |
| `total_price`        | `decimal(8, 2)`                                          | السعر الإجمالي للطلب.                                     |
| `status`             | `enum('pending', 'paid', 'shipped', 'completed', 'canceled')` | حالة الطلب الحالية. القيمة الافتراضية `pending`.          |
| `payment_method`     | `string`                                                 | طريقة الدفع المستخدمة (e.g., 'stripe', 'cod', 'paypal').            |
| `delivered_at`       | `timestamp` (nullable)                                   | تاريخ توصيل الطلب.                                        |
| `created_at`         | `timestamp`                                              | تاريخ إنشاء الطلب.                                        |
| `updated_at`         | `timestamp`                                              | تاريخ آخر تحديث للطلب.                                    |

### جدول `order_items`

| العمود (Column) | النوع (Data Type)   | الوصف (Description)                                  |
| ---------------- | ------------------- | --------------------------------------------------- |
| `id`             | `bigint` (unsigned) | المعرف الرئيسي.                                      |
| `order_id`       | `bigint` (unsigned) | مفتاح خارجي يرتبط بجدول `orders`.                   |
| `book_id`        | `bigint` (unsigned) | مفتاح خارجي يرتبط بجدول `books`.                    |
| `quantity`       | `integer`           | كمية الكتاب المطلوب.                                 |
| `price`          | `decimal(8, 2)`     | سعر الوحدة من الكتاب وقت الطلب.                      |
| `created_at`     | `timestamp`         | تاريخ الإنشاء.                                       |
| `updated_at`     | `timestamp`         | تاريخ آخر تحديث.                                     |

## 3. طرق الدفع (Payment Methods)

النظام يدعم طرق الدفع التالية:

- **Cash on Delivery (COD):** الدفع عند الاستلام.
- **Stripe:** الدفع عبر بطاقات الائتمان.
- **PayPal:** الدفع عبر PayPal.

## 4. Endpoints الخاصة بالـ OrdersController

### [GET] /api/orders

- **الوصف:** جلب قائمة الطلبات الخاصة بالعميل المسجل دخوله.
- **الباراميترات:** لا يوجد.
- **مثال الطلب:**
  ```bash
  curl -X GET "http://localhost:8000/api/orders" \
  -H "Authorization: Bearer {customer_token}" \
  -H "Accept: application/json"
  ```
- **الرد المتوقع (Response Example):**
  ```json
  {
      "data": [
          {
              "id": 1,
              "total_price": "150.00",
              "status": "pending",
              "payment_method": "cod",
              "created_at": "2025-09-13T12:00:00.000000Z",
              "items": [
                  {
                      "id": 1,
                      "quantity": 2,
                      "price": "75.00",
                      "book": {
                          "id": 10,
                          "title": "The Art of Programming",
                          "cover": "path/to/cover.jpg"
                      }
                  }
              ]
          }
      ]
  }
  ```

### [POST] /api/orders

- **الوصف:** إنشاء طلب جديد بناءً على محتويات سلة المشتريات.
- **الباراميترات:**
  - `payment_method` (string, required): طريقة الدفع. القيم المتاحة: `cod`, `stripe`, `paypal`.
- **مثال الطلب (COD):**
  ```bash
  curl -X POST "http://localhost:8000/api/orders" \
  -H "Authorization: Bearer {customer_token}" \
  -H "Content-Type: application/json" \
  -d '{
      "payment_method": "cod"
  }'
  ```
- **الرد المتوقع (COD):**
  ```json
  {
      "data": {
          "id": 2,
          "total_price": "120.00",
          "status": "pending",
          "payment_method": "cod",
          "created_at": "2025-09-13T14:30:00.000000Z",
          "items": [
              {
                  "id": 2,
                  "quantity": 1,
                  "price": "120.00",
                  "book": {
                      "id": 15,
                      "title": "Database Design Basics",
                      "cover": "path/to/another-cover.jpg"
                  }
              }
          ]
      }
  }
  ```
- **مثال الطلب (Stripe):**
  ```bash
  curl -X POST "http://localhost:8000/api/orders" \
  -H "Authorization: Bearer {customer_token}" \
  -H "Content-Type: application/json" \
  -d '{
      "payment_method": "stripe"
  }'
  ```
- **الرد المتوقع (Stripe):**
  ```json
  {
      "client_secret": "pi_..._secret_...",
      "order_total": 120.00
  }
  ```

- **مثال الطلب (PayPal):**
  ```bash
  curl -X POST "http://localhost:8000/api/orders" \
  -H "Authorization: Bearer {customer_token}" \
  -H "Content-Type: application/json" \
  -d '{
      "payment_method": "paypal"
  }'
  ```
- **الرد المتوقع (PayPal):**
  ```json
  {
      "approval_link": "https://www.sandbox.paypal.com/checkoutnow?token=..."
  }
  ```

### [POST] /api/orders/confirm-stripe

- **الوصف:** تأكيد طلب تم إنشاؤه بواسطة Stripe بعد نجاح الدفع في الفرونت-إند.
- **الباراميترات:**
  - `payment_intent_id` (string, required): معرف `PaymentIntent` الذي تم الحصول عليه من Stripe.
- **مثال الطلب:**
  ```bash
  curl -X POST "http://localhost:8000/api/orders/confirm-stripe" \
  -H "Authorization: Bearer {customer_token}" \
  -H "Content-Type: application/json" \
  -d '{
      "payment_intent_id": "pi_..."
  }'
  ```
- **الرد المتوقع:**
  ```json
  {
      "data": {
          "id": 3,
          "total_price": "120.00",
          "status": "paid",
          "payment_method": "stripe",
          "created_at": "2025-09-13T15:00:00.000000Z",
          "items": [
              {
                  "id": 3,
                  "quantity": 1,
                  "price": "120.00",
                  "book": {
                      "id": 15,
                      "title": "Database Design Basics",
                      "cover": "path/to/another-cover.jpg"
                  }
              }
          ]
      }
  }
  ```

### [GET] /paypal/success

- **الوصف:** معالجة الدفع الناجح من PayPal. يتم استدعاء هذا الرابط تلقائيًا من PayPal بعد موافقة المستخدم على الدفع.
- **الباراميترات:**
  - `token` (string, required): توكن يتم إرساله من PayPal.
  - `PayerID` (string, required): معرف الدافع يتم إرساله من PayPal.
- **الرد المتوقع:**
  - في حالة النجاح، يتم إنشاء الطلب في قاعدة البيانات وإرجاع بيانات الطلب بصيغة `OrderResource`.
  - في حالة الفشل، يتم إرجاع رسالة خطأ.

### [GET] /paypal/cancel

- **الوصف:** معالجة إلغاء الدفع من PayPal. يتم استدعاء هذا الرابط تلقائيًا من PayPal إذا قام المستخدم بإلغاء عملية الدفع.
- **الباراميترات:** لا يوجد.
- **الرد المتوقع:**
  ```json
  {
      "message": "PayPal payment cancelled."
  }
  ```

## 5. حالات الاستخدام (Use Cases)

### سيناريو شراء منتج (COD)

1. العميل يضيف منتجات إلى سلة المشتريات.
2. العميل ينتقل إلى صفحة الدفع ويختار "الدفع عند الاستلام".
3. الفرونت-إند يرسل طلب `POST /api/orders` مع `payment_method: "cod"`.
4. الباك-إند يقوم بإنشاء الطلب في قاعدة البيانات بحالة `pending` ويفرغ سلة المشتريات.
5. يتم عرض صفحة نجاح الطلب للعميل.

### سيناريو شراء منتج (Stripe)

1. العميل يضيف منتجات إلى سلة المشتريات.
2. العميل ينتقل إلى صفحة الدفع ويختار "الدفع ببطاقة بنكية".
3. الفرونت-إند يرسل طلب `POST /api/orders` مع `payment_method: "stripe"`.
4. الباك-إند يتصل بـ Stripe لإنشاء `PaymentIntent` ويعيد `client_secret` إلى الفرونت-إند.
5. الفرونت-إند يستخدم `client_secret` مع مكتبة Stripe.js لعرض نموذج الدفع وتأكيد الدفع من جانب العميل.
6. بعد نجاح الدفع، يرسل الفرونت-إند طلب `POST /api/orders/confirm-stripe` مع `payment_intent_id`.
7. الباك-إند يتحقق من حالة الدفع مع Stripe، وإذا كان ناجحًا، يقوم بإنشاء الطلب بحالة `paid` ويفرغ سلة المشتريات.

### سيناريو شراء منتج (PayPal)

1. العميل يضيف منتجات إلى سلة المشتريات.
2. العميل ينتقل إلى صفحة الدفع ويختار "الدفع عبر PayPal".
3. الفرونت-إند يرسل طلب `POST /api/orders` مع `payment_method: "paypal"`.
4. الباك-إند يعيد `approval_link`.
5. الفرونت-إند يقوم بتوجيه المستخدم إلى `approval_link`.
6. المستخدم يوافق على الدفع في صفحة PayPal.
7. PayPal يقوم بتوجيه المستخدم إلى `GET /paypal/success`.
8. الباك-إند يقوم بالتحقق من الدفع، إنشاء الطلب، وتفريغ سلة المشتريات.

### سيناريو فشل الدفع

- إذا فشلت عملية الدفع عبر Stripe، لن يتم استدعاء `confirm-stripe`. يجب على الفرونت-إند عرض رسالة خطأ للعميل.
- إذا قام المستخدم بإلغاء الدفع عبر PayPal، سيتم توجيهه إلى `GET /paypal/cancel`.
- إذا كانت سلة المشتريات فارغة عند محاولة إنشاء طلب، سيعود الباك-إند برمز `400 Bad Request`.

## 6. ملاحظات خاصة للفرونت-إند (Frontend Notes)

- **المصادقة (Authentication):** يجب إرسال `customer_token` في `Authorization` header لجميع الطلبات.
- **التعامل مع الأخطاء:**
  - `401 Unauthorized`: التوكن غير صالح أو مفقود.
  - `400 Bad Request`: سلة المشتريات فارغة أو خطأ في الطلب.
  - `422 Unprocessable Entity`: خطأ في الـ validation (مثلاً `payment_method` غير موجود).
- **Stripe Integration:**
  1. عند طلب `POST /api/orders` بطريقة `stripe`، استقبل `client_secret`.
  2. استخدم `stripe.confirmCardPayment(client_secret, ...)` في الفرونت-إند.
  3. عند النجاح، أرسل `paymentIntent.id` إلى `POST /api/orders/confirm-stripe`.
- **PayPal Integration:**
  1. عند طلب `POST /api/orders` بطريقة `paypal`، استقبل `approval_link`.
  2. قم بتوجيه المستخدم إلى `approval_link`.
