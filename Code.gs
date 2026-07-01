// Mountain Harvest - Google Apps Script Backend
// This script handles order processing, Google Sheets storage, and email notifications

// CONFIGURATION
const CONFIG = {
  yourEmail: 'sinha.amn@gmail.com', // Replace with your email
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
      'Total (₹)',
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

// Test function (optional)
function doGet() {
  return ContentService.createTextOutput('Mountain Harvest Backend is running!');
}

// Send Admin Email
function sendAdminEmail(data) {
  const subject = `🎉 New Order: ${data.orderId} - ₹${data.total}`;
  
  const htmlBody = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
      <div style="background: #2A5E2E; color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">🏔️ New Order Received</h1>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
        <h2 style="color: #2A5E2E; margin-top: 0;">Order #${data.orderId}</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background: #f0f4f0;">
            <td style="padding: 12px; border: 1px solid #e5e5e5; font-weight: 600;">Customer</td>
            <td style="padding: 12px; border: 1px solid #e5e5e5;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #e5e5e5; font-weight: 600;">Phone</td>
            <td style="padding: 12px; border: 1px solid #e5e5e5;">${data.phone}</td>
          </tr>
          <tr style="background: #f0f4f0;">
            <td style="padding: 12px; border: 1px solid #e5e5e5; font-weight: 600;">Address</td>
            <td style="padding: 12px; border: 1px solid #e5e5e5;">${data.address}, ${data.city}, ${data.pin}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #e5e5e5; font-weight: 600;">Items</td>
            <td style="padding: 12px; border: 1px solid #e5e5e5;">${data.items}</td>
          </tr>
          <tr style="background: #f0f4f0;">
            <td style="padding: 12px; border: 1px solid #e5e5e5; font-weight: 600;">Total</td>
            <td style="padding: 12px; border: 1px solid #e5e5e5; font-size: 20px; font-weight: 700; color: #2A5E2E;">₹${data.total}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #e5e5e5; font-weight: 600;">Coupon</td>
            <td style="padding: 12px; border: 1px solid #e5e5e5;">${data.coupon || 'None'}</td>
          </tr>
        </table>
        
        <div style="background: #fff9e6; border-left: 4px solid #C4A962; padding: 15px; margin: 20px 0;">
          <strong>📸 Payment Screenshot:</strong> Customer has uploaded payment proof. Please verify.
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${SpreadsheetApp.getActiveSpreadsheet().getUrl()}" 
             style="display: inline-block; background: #2A5E2E; color: white; padding: 14px 30px; 
                    text-decoration: none; border-radius: 8px; font-weight: 600;">
            View in Google Sheets →
          </a>
        </div>
        
        <p style="color: #6E6E73; font-size: 14px; margin-top: 30px; text-align: center;">
          Mountain Harvest | Order Management System
        </p>
      </div>
    </div>
  `;
  
  MailApp.sendEmail({
    to: CONFIG.yourEmail,
    subject: subject,
    htmlBody: htmlBody
  });
}

// Send Customer Email
function sendCustomerEmail(data) {
  // Only send if customer provided email in the form
  if (!data.email) return;
  
  const subject = `Order Confirmed - ${data.orderId} | Mountain Harvest`;
  
  const htmlBody = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
      <div style="background: linear-gradient(135deg, #2A5E2E 0%, #1e4621 100%); color: white; padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 32px;">🎉 Thank You!</h1>
        <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Your order has been received</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
        <div style="text-align: center; background: #f0f4f0; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
          <p style="margin: 0; color: #6E6E73; font-size: 14px;">ORDER ID</p>
          <h2 style="margin: 8px 0 0; color: #2A5E2E; font-family: 'Courier New', monospace; font-size: 28px;">${data.orderId}</h2>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6; color: #1D1D1F;">
          Hi ${data.name},
        </p>
        
        <p style="font-size: 16px; line-height: 1.6; color: #1D1D1F;">
          We've received your payment screenshot and are currently verifying it. 
          Once confirmed, we'll dispatch your order within <strong>24 hours</strong>.
        </p>
        
        <h3 style="color: #2A5E2E; margin-top: 30px; margin-bottom: 15px;">Order Summary</h3>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <p style="margin: 8px 0;"><strong>Items:</strong> ${data.items}</p>
          <p style="margin: 8px 0;"><strong>Total:</strong> ₹${data.total}</p>
          <p style="margin: 8px 0;"><strong>Delivery Address:</strong><br>${data.address}, ${data.city}, ${data.pin}</p>
        </div>
        
        <div style="background: #e8f0e8; border-left: 4px solid #2A5E2E; padding: 15px; margin: 25px 0;">
          <p style="margin: 0; color: #1D1D1F;">
            <strong>📦 What's Next?</strong><br>
            We'll send you a confirmation email once your payment is verified and your order is shipped.
          </p>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6; color: #1D1D1F;">
          Thank you for choosing Mountain Harvest! 🏔️
        </p>
        
        <p style="font-size: 14px; color: #6E6E73; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
          If you have any questions, reply to this email.<br>
          <strong>Mountain Harvest</strong><br>
          Nature's Finest from the Himalayas
        </p>
      </div>
    </div>
  `;
  
  MailApp.sendEmail({
    to: data.email,
    subject: subject,
    htmlBody: htmlBody
  });
}

// Update Order Status (can be triggered manually or via automation)
function updateOrderStatus(orderId, newStatus) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.sheetName);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === orderId) {
      sheet.getRange(i + 1, 11).setValue(newStatus);
      
      // If status changed to "Shipped", could send another email
      if (newStatus === 'Shipped') {
        // Optional: Send shipping notification
      }
      
      break;
    }
  }
}
