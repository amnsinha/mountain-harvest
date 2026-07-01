// Mountain Harvest - E-commerce JavaScript
// Configuration
const CONFIG = {
  upiId: 'PureHimalaya@ptyes',
  upiName: 'Pure Himalaya',
  appsScriptUrl: 'https://github.com/amnsinha/mountain-harvest/blob/main/Code.gs' // Will be updated after deployment
};

// Product Catalog
const products = [
  {
    id: 1,
    name: 'Sea Buckthorn Juice',
    price: 799,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
    description: 'Rich in Vitamin C and antioxidants, sourced from Ladakh'
  },
  {
    id: 2,
    name: 'Gucchi Mushrooms (50g)',
    price: 3999,
    image: 'https://images.unsplash.com/photo-1590137876181-2d85a3d483d6?w=400',
    description: 'Premium dried morels from Himachal Pradesh'
  },
  {
    id: 3,
    name: 'Wild Himalayan Honey',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784386?w=400',
    description: 'Raw, unprocessed honey from mountain wildflowers'
  },
  {
    id: 4,
    name: 'Apricot Kernel Oil',
    price: 899,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400',
    description: 'Cold-pressed oil from Hunza apricots'
  }
];

// State
let cart = [];
let currentOrderData = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  loadCart();
  updateCartUI();
});

// Products
function loadProducts() {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = products.map(product => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        <div class="product-footer">
          <div class="product-price">&#8377;${product.price}</div>
          <div class="product-quantity">
            <button class="qty-btn" onclick="updateQuantity(${product.id}, -1)">-</button>
            <span class="qty-display" id="qty-${product.id}">${getQuantityInCart(product.id)}</span>
            <button class="qty-btn" onclick="updateQuantity(${product.id}, 1)">+</button>
          </div>
        </div>
        <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    </div>
  `).join('');
}

function getQuantityInCart(productId) {
  const item = cart.find(i => i.id === productId);
  return item ? item.quantity : 0;
}

function updateQuantity(productId, change) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== productId);
    }
  } else if (change > 0) {
    const product = products.find(p => p.id === productId);
    cart.push({ ...product, quantity: change });
  }
  saveCart();
  updateCartUI();
  document.getElementById(`qty-${productId}`).textContent = getQuantityInCart(productId);
}

function addToCart(productId) {
  updateQuantity(productId, 1);
}

// Cart Management
function loadCart() {
  const saved = localStorage.getItem('mountainHarvestCart');
  if (saved) cart = JSON.parse(saved);
}

function saveCart() {
  localStorage.setItem('mountainHarvestCart', JSON.stringify(cart));
}

function updateCartUI() {
  const badge = document.getElementById('cartBadge');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = totalItems;
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    cartTotal.textContent = '₹0';
    return;
  }
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" class="cart-item-image" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price} × ${item.quantity}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
          <span class="qty-display">${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
        </div>
      </div>
    </div>
  `).join('');
  
  cartTotal.textContent = `₹${total}`;
}

function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('active');
  document.getElementById('cartOverlay').classList.toggle('active');
}

// Checkout Flow
function proceedToCheckout() {
  if (cart.length === 0) {
    alert('Your cart is empty');
    return;
  }
  toggleCart();
  showModal('checkoutModal');
  renderOrderSummary();
}

function renderOrderSummary() {
  const summary = document.getElementById('orderSummaryCheckout');
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  summary.innerHTML = `
    <h4>Order Summary</h4>
    ${cart.map(item => `
      <div class="order-item">
        <span>${item.name} × ${item.quantity}</span>
        <span>₹${item.price * item.quantity}</span>
      </div>
    `).join('')}
    <div class="order-total">
      <span>Total</span>
      <span>₹${total}</span>
    </div>
  `;
}

function goToPayment() {
  const name = document.getElementById('custName').value;
  const phone = document.getElementById('custPhone').value;
  const address = document.getElementById('custAddress').value;
  const city = document.getElementById('custCity').value;
  const pin = document.getElementById('custPin').value;
  
  if (!name || !phone || !address || !city || !pin) {
    alert('Please fill all required fields');
    return;
  }
  
  if (phone.length !== 10) {
    alert('Please enter a valid 10-digit phone number');
    return;
  }
  
  if (pin.length !== 6) {
    alert('Please enter a valid 6-digit PIN code');
    return;
  }
  
  currentOrderData = {
    name,
    phone,
    address,
    city,
    pin,
    coupon: document.getElementById('couponCode').value
  };
  
  goToStep(2);
  generatePaymentQR();
}

function generatePaymentQR() {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  document.getElementById('paymentAmount').innerHTML = `
    <h3>Pay ₹${total}</h3>
    <p style="color: var(--text-gray); margin-top: 0.5rem;">Scan QR or use UPI ID below</p>
  `;
  
  // Generate UPI payment string
  const upiString = `upi://pay?pa=${CONFIG.upiId}&pn=${encodeURIComponent(CONFIG.upiName)}&am=${total}&cu=INR&tn=${encodeURIComponent('Mountain Harvest Order')}`;
  
  // Generate QR using Google Charts API
  const qrUrl = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(upiString)}&choe=UTF-8`;
  
  document.getElementById('qrContainer').innerHTML = `<img src="${qrUrl}" alt="Payment QR Code">`;
  document.getElementById('upiIdDisplay').textContent = CONFIG.upiId;
}

function copyUPI() {
  navigator.clipboard.writeText(CONFIG.upiId);
  alert('UPI ID copied to clipboard!');
}

function handleFileUpload(input) {
  if (input.files && input.files[0]) {
    const fileName = input.files[0].name;
    document.getElementById('fileUploadText').textContent = fileName;
  }
}

function submitOrder() {
  const screenshot = document.getElementById('paymentScreenshot').files[0];
  
  if (!screenshot) {
    alert('Please upload payment screenshot');
    return;
  }
  
  // Generate Order ID
  const orderId = 'MH' + Date.now().toString().slice(-6);
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Prepare order data
  const orderData = {
    orderId,
    ...currentOrderData,
    items: cart.map(item => `${item.name} x${item.quantity}`).join(', '),
    total,
    timestamp: new Date().toISOString()
  };
  
  // Convert screenshot to base64
  const reader = new FileReader();
  reader.onloadend = function() {
    orderData.paymentScreenshot = reader.result;
    sendOrderToBackend(orderData);
  };
  reader.readAsDataURL(screenshot);
}

function sendOrderToBackend(orderData) {
  // Show loading state
  const submitBtn = event.target;
  submitBtn.textContent = 'Submitting...';
  submitBtn.disabled = true;
  
  // Send to Google Apps Script
  fetch(CONFIG.appsScriptUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  })
  .then(() => {
    // Show success
    document.getElementById('displayOrderId').textContent = orderData.orderId;
    goToStep(3);
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartUI();
    
    submitBtn.textContent = 'Submit Order ✓';
    submitBtn.disabled = false;
  })
  .catch(error => {
    console.error('Error:', error);
    // Still show success (no-cors mode)
    document.getElementById('displayOrderId').textContent = orderData.orderId;
    goToStep(3);
    cart = [];
    saveCart();
    updateCartUI();
  });
}

// Modal & Steps
function showModal(modalId) {
  document.getElementById(modalId).classList.add('active');
  goToStep(1);
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

function goToStep(stepNum) {
  document.querySelectorAll('.step').forEach(step => step.classList.add('hidden'));
  document.getElementById(`step${stepNum}`).classList.remove('hidden');
}

function resetOrder() {
  currentOrderData = null;
  document.getElementById('checkoutForm').reset();
  document.getElementById('paymentScreenshot').value = '';
  document.getElementById('fileUploadText').textContent = 'Click to upload payment screenshot';
}
