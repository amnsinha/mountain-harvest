# 🏔️ Mountain Harvest

**Nature's Finest from the Himalayas** — A complete, free e-commerce order system with UPI payment, Google Sheets backend, and email notifications.

## ✨ Features

- **Beautiful Landing Page** — Premium Apple-meets-Himalayan design
- **Product Catalog** — Display products with images, prices, and descriptions
- **Shopping Cart** — Add/remove items with quantity management
- **Checkout Flow** — Customer details + delivery information
- **Dynamic UPI QR** — Auto-generated QR codes based on order total
- **Payment Screenshot Upload** — Customers upload proof of payment
- **Google Sheets Database** — All orders stored automatically
- **Email Notifications** — Automated emails to admin & customer
- **Order Management** — Track order status in Google Sheets
- **100% Free** — No hosting costs, no payment gateway fees

## 🚀 Live Demo

**Website:** [https://amnsinha.github.io/mountain-harvest](https://amnsinha.github.io/mountain-harvest)

## 📋 Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Hosting:** GitHub Pages (Free)
- **Backend:** Google Apps Script
- **Database:** Google Sheets
- **Payments:** UPI (via QR code)
- **Emails:** Gmail (via Google Apps Script)

## 🛠️ Setup & Deployment

### Step 1: Fork or Clone Repository

```bash
git clone https://github.com/amnsinha/mountain-harvest.git
cd mountain-harvest
```

### Step 2: Enable GitHub Pages

1. Go to **Settings** → **Pages**
2. Select **Source:** `main` branch, `/ (root)`
3. Click **Save**
4. Your site will be live at: `https://YOUR-USERNAME.github.io/mountain-harvest`

### Step 3: Set Up Google Apps Script Backend

#### 3.1 Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it **"Mountain Harvest Orders"**
4. The script will automatically create the "Orders" sheet with headers

#### 3.2 Set Up Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any existing code
3. Copy the entire content from `Code.gs` and paste it
4. Update the configuration:
   ```javascript
   const CONFIG = {
     yourEmail: 'your-email@gmail.com', // Replace with your email
     sheetName: 'Orders',
     customerEmailTemplate: true,
     adminEmailTemplate: true
   };
   ```
5. Click **Save** (💾 icon)

#### 3.3 Deploy as Web App

1. Click **Deploy → New deployment**
2. Click gear icon (⚙️) → Select **"Web app"**
3. Fill in:
   - **Description:** Mountain Harvest Backend
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**
5. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/...../exec`)

#### 3.4 Connect Frontend to Backend

1. Open `app.js` in your repository
2. Find line 6:
   ```javascript
   appsScriptUrl: 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'
   ```
3. Replace with your copied Web App URL
4. Commit the changes

### Step 4: Customize Your Store

#### Update Products

Edit `app.js` — lines 10-40:

```javascript
const products = [
  {
    id: 1,
    name: 'Your Product Name',
    price: 999,
    image: 'https://your-image-url.com/product.jpg',
    description: 'Your product description'
  },
  // Add more products...
];
```

#### Update UPI Details

Edit `app.js` — lines 3-5:

```javascript
const CONFIG = {
  upiId: 'yourname@bank', // Your UPI ID
  upiName: 'Your Business Name',
  appsScriptUrl: '...'
};
```

#### Update Branding

Edit `index.html` to change:
- Business name (currently "Mountain Harvest")
- Hero section text
- Features
- Footer information

## 📧 Email Notifications

### Admin Email

You'll receive:
- 🎉 New order notification
- Customer details
- Order items and total
- Payment screenshot notice
- Direct link to Google Sheet

### Customer Email

(Optional — if customer provides email in form)
- ✅ Order confirmation
- Order ID
- Order summary
- Dispatch timeline (24 hours)
- Contact information

## 📊 Order Management

### Google Sheets Dashboard

All orders are stored in Google Sheets with:

| Column | Data |
|--------|------|
| Timestamp | Order date/time |
| Order ID | Unique ID (e.g., MH000001) |
| Customer Name | Full name |
| Phone | Contact number |
| Email | Email address (optional) |
| Address | Delivery address |
| City | City |
| PIN | PIN code |
| Items | Product list |
| Total | Order total |
| Status | Pending / Confirmed / Shipped |
| Payment Screenshot | Upload confirmation |
| Coupon Code | Applied coupon (if any) |

### Update Order Status

Manually change "Status" column:
- **Pending** → Order received, payment pending verification
- **Confirmed** → Payment verified
- **Shipped** → Order dispatched

## 🎨 Design System

### Colors

- **Primary:** `#2A5E2E` (Forest Green)
- **Secondary:** `#C4A962` (Gold)
- **Background:** `#FFFFFF` (White)
- **Off-white:** `#F9F9F9`
- **Text:** `#1D1D1F` (Dark)
- **Text Gray:** `#6E6E73`

### Typography

- **Headings:** Playfair Display
- **Body:** Inter

## 🔒 Security

- No credit card data is handled
- Payment happens directly via UPI
- Payment screenshot uploaded for manual verification
- Google Apps Script runs server-side (secure)
- No sensitive data exposed in frontend code

## 💡 Future Enhancements

Easy to add:
- ✅ Discount coupons (already has field)
- ✅ Referral codes
- ✅ Cash on Delivery option
- ✅ Stock management
- ✅ WhatsApp notifications (via WhatsApp Business API)
- ✅ Invoice PDF generation
- ✅ Shipping labels
- ✅ Delhivery / Shiprocket API integration

## 📝 License

MIT License — Feel free to use for your own business!

## 🙋 Support

If you encounter any issues:
1. Check if GitHub Pages is enabled
2. Verify Google Apps Script deployment URL is correct
3. Ensure Apps Script has permissions (run `initializeSheet()` manually first time)
4. Check browser console for errors

## 🌟 Credits

Built with ❤️ for small businesses and startups who want to sell online without monthly fees.

---

**Mountain Harvest** — Start your online store today, completely free! 🏔️
