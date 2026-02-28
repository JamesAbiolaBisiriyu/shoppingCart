// ================= SELECTORS =================
// DOM element references for cart functionality
const openShopping = document.querySelector(".shopping");     // Shopping cart icon to open cart
const closeShopping = document.querySelector(".closeshopping"); // Close button in cart panel
const list = document.querySelector(".list");                 // Product listing container
const listCart = document.querySelector(".listCart");         // Cart items container
const body = document.querySelector("body");                   // Body element (for toggling 'active' class)
const total = document.querySelector(".total");               // Total price display
const quantityDisplay = document.querySelector(".quantity");   // Cart item count badge
const cartPanel = document.querySelector(".cart");            // Cart panel container
const clearCartBtn = document.querySelector(".clear-cart-btn"); // Clear cart button

// ================= OPEN / CLOSE CART =================
// Event listener to open cart panel
openShopping.addEventListener("click", () => {
  body.classList.add("active");  // Adds 'active' class to trigger CSS cart animation
});

// Event listener to close cart panel
closeShopping.addEventListener("click", (e) => {
  e.preventDefault();  // Prevent any default button behavior
  body.classList.remove("active");  // Removes 'active' class to hide cart
});

// ================= PRODUCTS =================
// Product catalog - array of available items
const products = [
  {
    id: 1,
    name: "Nike Air Zoom Pegasus",
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&auto=format&fit=crop",
    price: 119.99,
  },
  {
    id: 2,
    name: "Adidas Ultraboost",
    image:
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop",
    price: 179.99,
  },
  {
    id: 3,
    name: "Puma Running Shoes",
    image:
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&auto=format&fit=crop",
    price: 89.99,
  },
  {
    id: 4,
    name: "New Balance Fresh Foam",
    image:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop",
    price: 129.99,
  },  
  {
    id: 5,
    name: "Nike SuperRep Go",
    image:
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 109.99,
  },
  {
    id: 6,
    name: "Asics Gel-Kayano",
    image:
      "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=500&auto=format&fit=crop",
    price: 149.99,
  },
];

// ================= CART =================
// Shopping cart array - stores items added by user
// Each item will have product properties + quantity
let cart = [];

// ================= LOCAL STORAGE FUNCTIONS =================
// Save cart to localStorage
function saveCartToStorage() {
  localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromStorage() {
  const savedCart = localStorage.getItem('shoppingCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCart();
  }
}

// ================= INITIALIZE PRODUCTS =================
// Function to dynamically render products on page load
function initApp() {
  products.forEach((product, index) => {
    // Create product card element
    const item = document.createElement("div");
    item.classList.add("item");

    // Populate product card with image, name, price, and buttons
    item.innerHTML = `
      <img src="${product.image}">
      <div class="title">${product.name}</div>
      <div class="price">$${product.price.toFixed(2)}</div>
      <button class="add-btn">Add To Cart</button>
      <i class="fa fa-heart like-btn"></i>
    `;

    // Add to cart event listener with preventDefault
    item.querySelector(".add-btn").addEventListener("click", (e) => {
      e.preventDefault();  // Prevent any default button behavior
      addToCart(index);  // Pass product index to add function
    });

    // Like button event listener (toggle favorite)
    item.querySelector(".like-btn").addEventListener("click", function (e) {
      e.preventDefault();  // Prevent any default behavior
      this.classList.toggle("liked");  // Toggle red heart class
    });

    // Append product card to the list container
    list.appendChild(item);
  });
  
  // Load cart from localStorage after products are initialized
  loadCartFromStorage();
}

// Initialize the app by rendering all products
initApp();

// ================= ADD TO CART =================
// Adds selected product to cart or increments quantity if already present
function addToCart(index) {
  const product = products[index];
  
  // Check if product already exists in cart
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    // Increment quantity if product already in cart
    existingItem.quantity++;
  } else {
    // Add new product with quantity 1
    cart.push({ ...product, quantity: 1 });
  }

  // Save to localStorage
  saveCartToStorage();
  
  // Refresh cart display
  updateCart();
}

// ================= UPDATE CART =================
// Re-renders cart items, updates totals and quantity badge
function updateCart() {
  // Clear current cart display
  listCart.innerHTML = "";

  let totalPrice = 0;
  let totalQuantity = 0;

  // Check if cart is empty
  if (cart.length === 0) {
    // Display empty cart message
    const emptyMessage = document.createElement("li");
    emptyMessage.style.textAlign = "center";
    emptyMessage.style.padding = "40px 20px";
    emptyMessage.style.color = "#999";
    emptyMessage.style.listStyle = "none";
    emptyMessage.style.justifyContent = "center";
    emptyMessage.innerHTML = `
      <i class="fa fa-shopping-cart" style="font-size: 48px; margin-bottom: 15px; opacity: 0.3;"></i>
      <div style="font-size: 18px;">Your cart is empty</div>
      <div style="font-size: 14px; margin-top: 10px;">Add some items to get started!</div>
    `;
    listCart.appendChild(emptyMessage);
  } else {
    // Loop through cart items and generate HTML
    cart.forEach((item, index) => {
      // Calculate running totals
      totalPrice += item.price * item.quantity;
      totalQuantity += item.quantity;

      // Create cart item element
      const li = document.createElement("li");

      li.innerHTML = `
        <div>
          <strong>${item.name}</strong><br>
          $${item.price.toFixed(2)} × ${item.quantity}
        </div>
        <div>
          <button class="minus">-</button>
          <button class="plus">+</button>
          <button class="delete">Delete</button>
        </div>
      `;

      // Quantity decrease button with preventDefault
      li.querySelector(".minus").addEventListener("click", (e) => {
        e.preventDefault();
        changeQuantity(index, item.quantity - 1);  // Decrease by 1
      });

      // Quantity increase button with preventDefault
      li.querySelector(".plus").addEventListener("click", (e) => {
        e.preventDefault();
        changeQuantity(index, item.quantity + 1);  // Increase by 1
      });

      // Delete item button with preventDefault
      li.querySelector(".delete").addEventListener("click", (e) => {
        e.preventDefault();
        removeItem(index);  // Remove entire item from cart
      });

      // Add item to cart display
      listCart.appendChild(li);
    });
  }

  // Update total price display
  total.innerText = "$" + totalPrice.toFixed(2);
  
  // Update cart quantity badge
  quantityDisplay.innerText = totalQuantity;
  
  // Save to localStorage whenever cart is updated
  saveCartToStorage();
}

// ================= CHANGE QUANTITY =================
// Modifies quantity of a specific cart item
function changeQuantity(index, newQuantity) {
  if (newQuantity <= 0) {
    // Remove item if quantity becomes zero or negative
    removeItem(index);
  } else {
    // Update quantity to new value
    cart[index].quantity = newQuantity;
  }
  
  // Refresh cart display (saveCartToStorage is called inside updateCart)
  updateCart();
}

// ================= REMOVE ITEM =================
// Completely removes an item from the cart
function removeItem(index) {
  cart.splice(index, 1);  // Remove item at specified index
  // updateCart will handle saveCartToStorage
  updateCart();  // Refresh cart display
}

// ================= CLEAR CART FUNCTION =================
// Completely empties the cart and removes from localStorage
function clearCart() {
  if (confirm('Are you sure you want to clear your entire cart?')) {
    cart = [];  // Empty the cart array
    localStorage.removeItem('shoppingCart');  // Remove from localStorage
    updateCart();  // Refresh cart display
    
    // Optional: Show success message
    const message = document.createElement('div');
    message.textContent = 'Cart cleared!';
    message.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 2000);
  }
}

// ================= CLEAR CART BUTTON EVENT LISTENER =================
if (clearCartBtn) {
  clearCartBtn.addEventListener("click", (e) => {
    e.preventDefault();  // Prevent any default button behavior
    clearCart();  // Call clear cart function
  });
}