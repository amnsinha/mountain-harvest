// Mountain Harvest - Google Apps Script Backend
// This script handles order processing, Google Sheets storage, and email notifications

// CONFIGURATION
const CONFIG = {
  yourEmail: 'sinha.amn@gmail.com',
  sheetName: 'Orders',
  customerEmailTemplate: true,
  adminEmailTemplate: true
};

// Initialize Sheet
function initializeSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.sheetName);
    sheet.appendRow([
      'Timestamp',
      'Order ID',
      'Customer Name',
      'Phone',
      'Email',
      'Address',
      'City',
      'PIN',
      'Items',
      'Total (Rs)',
      'Status',
      'Payment Screenshot',
      'Coupon Code'
    ]);
    sheet.getRange(1, 1, 1, 13).setFontWeight('bold').setBackground('#2A5E2E').setFontColor('#FFFFFF');
  }

  return sheet;
}

// Main POST Handler
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Store in Google Sheets
    const sheet = initializeSheet();
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    sheet.appendRow([
      timestamp,
      data.orderId,
      data.name,
      data.phone,
      data.email || '',
      data.address,
      data.city,
      data.pin,
      data.items,
      data.total,
      'Pending',
      'Screenshot uploaded',
      data.coupon || ''
    ]);

    // Send Emails
    sendAdminEmail(data);
    sendCustomerEmail(data);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      orderId: data.orderId
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function
function doGet() {
  return ContentService.createTextOutput('Mountain Harvest Backend is running!');
}

// Send Admin Email
function sendAdminEmail(data) {
  const subject = 'New Order: ' + data.orderId + ' - Rs.' + data.total;
  const htmlBody = '<h2>New Order Received</h2>' +
    '<p><strong>Order ID:</strong> ' + data.orderId + '</p>' +
    '<p><strong>Customer:</strong> ' + data.name + '</p>' +
    '<p><strong>Phone:</strong> ' + data.phone + '</p>' +
    '<p><strong>Address:</strong> ' + data.address + ', ' + data.city + ', ' + data.pin + '</p>' +
    '<p><strong>Items:</strong> ' + data.items + '</p>' +
    '<p><strong>Total:</strong> Rs.' + data.total + '</p>' +
    '<p><strong>Coupon:</strong> ' + (data.coupon || 'None') + '</p>' +
    '<p><strong>Payment Screenshot:</strong> Customer has uploaded payment proof. Please verify.</p>' +
    '<p><a href="' + SpreadsheetApp.getActiveSpreadsheet().getUrl() + '">View in Google Sheets</a></p>';

  MailApp.sendEmail({
    to: CONFIG.yourEmail,
    subject: subject,
    htmlBody: htmlBody
  });
}

// Send Customer Email
function sendCustomerEmail(data) {
  if (!data.email) return;

  const subject = 'Order Confirmed - ' + data.orderId + ' | Mountain Harvest';
  const htmlBody = '<h2>Thank You, ' + data.name + '!</h2>' +
    '<p>We have received your order and are verifying your payment screenshot.</p>' +
    '<p><strong>Order ID:</strong> ' + data.orderId + '</p>' +
    '<p><strong>Items:</strong> ' + data.items + '</p>' +
    '<p><strong>Total:</strong> Rs.' + data.total + '</p>' +
    '<p><strong>Delivery Address:</strong> ' + data.address + ', ' + data.city + ', ' + data.pin + '</p>' +
    '<p>Once your payment is verified, we will dispatch your order within 24 hours.</p>' +
    '<p>Thank you for choosing Mountain Harvest!</p>';

  MailApp.sendEmail({
    to: data.email,
    subject: subject,
    htmlBody: htmlBody
  });
}

// Update Order Status
function updateOrderStatus(orderId, newStatus) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.sheetName);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === orderId) {
      sheet.getRange(i + 1, 11).setValue(newStatus);
      break;
    }
  }
}
