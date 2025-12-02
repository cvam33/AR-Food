// ------- DATA -------
const menuItems = [
  {
    id: 1,
    name: "Classic Cheeseburger",
    category: "Burgers",
    description: "Juicy beef patty with cheese, lettuce and tomatoes.",
    price: 3.0,
    imageUrl: "assets/images/burger.jpg",
    modelGlbUrl: "assets/models/burger.glb",
    modelUsdzUrl: "assets/models/burger.usdz"
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    category: "Pizza",
    description: "Crispy crust with spicy pepperoni and cheese.",
    price: 2.0,
    imageUrl: "assets/images/pizza.jpg",
    modelGlbUrl: "assets/models/pizza.glb",
    modelUsdzUrl: "assets/models/pizza.usdz"
  },
  {
    id: 3,
    name: "California Roll",
    category: "Sushi",
    description: "Crab, avocado and cucumber classic sushi roll.",
    price: 1.0,
    imageUrl: "assets/images/sushi.jpg",
    modelGlbUrl: "assets/models/sushi.glb",
    modelUsdzUrl: "assets/models/sushi.usdz"
  },
  {
    id: 4,
    name: "Caesar Salad",
    category: "Salads",
    description: "Fresh lettuce, parmesan and croutons with Caesar dressing.",
    price: 2.5,
    imageUrl: "assets/images/salad.jpg",
    modelGlbUrl: "assets/models/salad.glb",
    modelUsdzUrl: "assets/models/salad.usdz"
  },
  {
    id: 5,
    name: "Chocolate Cupcake",
    category: "Desserts",
    description: "Moist chocolate sponge with rich frosting on top.",
    price: 1.2,
    imageUrl: "assets/images/dessert.jpg",
    modelGlbUrl: "assets/models/cupcake.glb",
    modelUsdzUrl: "assets/models/cupcake.usdz"
  },
  {
    id: 6,
    name: "Strawberry Shake",
    category: "Drinks",
    description: "Creamy strawberry milkshake topped with whipped cream.",
    price: 1.8,
    imageUrl: "assets/images/drink.jpg",
    modelGlbUrl: "assets/models/drink.glb",
    modelUsdzUrl: "assets/models/drink.usdz"
  }
];

let currentCategory = "Burgers";
let searchQuery = "";

// cartItems: { [id]: quantity }
let cartItems = {};

// ------- DOM -------
const categoryButtons = document.querySelectorAll(".category-item");
const itemsListEl = document.getElementById("itemsList");
const cartCountEl = document.getElementById("cartCount");

// AR modal DOM refs
const arModal = document.getElementById("arModal");
const arCloseBtn = document.getElementById("arCloseBtn");
const arModelViewer = document.getElementById("arModelViewer");
const arItemTitle = document.getElementById("arItemTitle");

// Cart drawer DOM
const cartDrawer = document.getElementById("cartDrawer");
const cartItemsList = document.getElementById("cartItemsList");
const cartCloseBtn = document.getElementById("cartCloseBtn");
const cartBtn = document.querySelector(".cart-btn");
const cartTotalItemsEl = document.getElementById("cartTotalItems");
const cartTotalPriceEl = document.getElementById("cartTotalPrice");

// Checkout modal DOM
const checkoutModal = document.getElementById("checkoutModal");
const checkoutCloseBtn = document.getElementById("checkoutCloseBtn");
const checkoutTotalPriceEl = document.getElementById("checkoutTotalPrice");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutPayBtn = document.getElementById("checkoutPayBtn");

// Search DOM
const searchBtn = document.getElementById("searchBtn");
const searchBar = document.getElementById("searchBar");
const searchInput = document.getElementById("searchInput");

// ------- CART UTILITIES -------
function getCartTotalCount() {
  return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
}

function getCartTotalAmount() {
  return Object.entries(cartItems).reduce((sum, [id, qty]) => {
    const item = menuItems.find((i) => i.id === Number(id));
    if (!item) return sum;
    return sum + item.price * qty;
  }, 0);
}

function updateCartBadge() {
  const totalCount = getCartTotalCount();
  cartCountEl.textContent = totalCount;
}

// ------- MENU RENDER -------
// IMPORTANT: Search now works on ALL items, not just current category
function renderItems() {
  const q = searchQuery.trim().toLowerCase();

  const filtered = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q);

    // If search is active -> ignore category filter
    if (q.length > 0) {
      return matchesSearch;
    }

    // If no search -> filter by current category
    return item.category === currentCategory;
  });

  itemsListEl.innerHTML = "";

  if (filtered.length === 0) {
    itemsListEl.innerHTML = `<p>No items found. Try a different search.</p>`;
    return;
  }

  filtered.forEach((item) => {
    const qtyInCart = cartItems[item.id] || 0;

    const card = document.createElement("article");
    card.className = "item-card";

    card.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.name}" class="item-image" />
      <div class="item-info">
        <div>
          <h3 class="item-title">${item.name}</h3>
          <p class="item-description">${item.description}</p>
        </div>
        <div class="item-bottom">
          <span class="item-price">$${item.price.toFixed(2)}</span>
          <div class="item-actions">
            <button class="ar-btn" data-id="${item.id}">View in AR</button>
            <button class="add-btn" data-id="${item.id}">
              ${qtyInCart > 0 ? `+${qtyInCart}` : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    `;

    itemsListEl.appendChild(card);
  });

  attachAddHandlers();
  attachArHandlers();
}

// Keep buttons text in sync with cart quantities
function syncButtonsWithCart() {
  const addButtons = document.querySelectorAll(".add-btn");
  addButtons.forEach((btn) => {
    const id = Number(btn.getAttribute("data-id"));
    const qty = cartItems[id] || 0;
    btn.textContent = qty > 0 ? `+${qty}` : "Add to Cart";
  });
}

// ------- ADD TO CART HANDLERS -------
function attachAddHandlers() {
  const addButtons = document.querySelectorAll(".add-btn");

  addButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-id"));

      cartItems[id] = (cartItems[id] || 0) + 1;

      updateCartBadge();
      btn.textContent = `+${cartItems[id]}`;
      renderCartDrawer();
    });
  });
}

// ------- AR HANDLERS -------
function attachArHandlers() {
  const arButtons = document.querySelectorAll(".ar-btn");
  arButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-id"));
      const item = menuItems.find((m) => m.id === id);
      if (!item) return;
      openArModal(item);
    });
  });
}

function openArModal(item) {
  arItemTitle.textContent = item.name;
  arModelViewer.setAttribute("src", item.modelGlbUrl);
  arModelViewer.setAttribute("ios-src", item.modelUsdzUrl);
  arModal.classList.add("open");
}

function closeArModal() {
  arModal.classList.remove("open");
}

// close AR modal by button / backdrop
arCloseBtn.addEventListener("click", closeArModal);
arModal.addEventListener("click", (e) => {
  if (e.target === arModal || e.target.classList.contains("ar-modal-backdrop")) {
    closeArModal();
  }
});

// ------- CART DRAWER RENDER -------
function renderCartDrawer() {
  cartItemsList.innerHTML = "";

  const entries = Object.entries(cartItems);

  if (entries.length === 0) {
    cartItemsList.innerHTML = `<li>No items in cart yet.</li>`;
  } else {
    entries.forEach(([id, qty]) => {
      const item = menuItems.find((i) => i.id === Number(id));
      if (!item) return;

      const li = document.createElement("li");
      li.className = "cart-item";

      const subtotal = item.price * qty;

      li.innerHTML = `
        <div class="cart-item-main">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-price">$${item.price.toFixed(2)}</span>
        </div>
        <div class="cart-item-controls">
          <div class="qty-controls">
            <button class="qty-btn minus" data-id="${item.id}">-</button>
            <span class="cart-item-qty">x${qty}</span>
            <button class="qty-btn plus" data-id="${item.id}">+</button>
          </div>
          <span class="cart-item-subtotal">$${subtotal.toFixed(2)}</span>
          <button class="remove-btn" data-id="${item.id}">✕</button>
        </div>
      `;

      cartItemsList.appendChild(li);
    });
  }

  const totalCount = getCartTotalCount();
  const totalAmount = getCartTotalAmount();
  cartTotalItemsEl.textContent = totalCount;
  cartTotalPriceEl.textContent = `$${totalAmount.toFixed(2)}`;

  attachCartItemHandlers();
  syncButtonsWithCart();
}

function attachCartItemHandlers() {
  const plusButtons = cartItemsList.querySelectorAll(".qty-btn.plus");
  const minusButtons = cartItemsList.querySelectorAll(".qty-btn.minus");
  const removeButtons = cartItemsList.querySelectorAll(".remove-btn");

  plusButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-id"));
      cartItems[id] = (cartItems[id] || 0) + 1;
      updateCartBadge();
      renderCartDrawer();
    });
  });

  minusButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-id"));
      if (!cartItems[id]) return;

      if (cartItems[id] > 1) {
        cartItems[id] -= 1;
      } else {
        delete cartItems[id];
      }

      updateCartBadge();
      renderCartDrawer();
    });
  });

  removeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-id"));
      if (cartItems[id]) {
        delete cartItems[id];
        updateCartBadge();
        renderCartDrawer();
      }
    });
  });
}

// ------- CART DRAWER OPEN/CLOSE -------
cartBtn.addEventListener("click", () => {
  cartDrawer.classList.add("open");
  renderCartDrawer();
});

cartCloseBtn.addEventListener("click", () => {
  cartDrawer.classList.remove("open");
});

// ------- CHECKOUT FLOW -------
checkoutBtn.addEventListener("click", () => {
  const totalCount = getCartTotalCount();

  if (totalCount === 0) {
    alert("Your cart is empty!");
    return;
  }

  const totalAmount = getCartTotalAmount();
  checkoutTotalPriceEl.textContent = `$${totalAmount.toFixed(2)}`;
  checkoutModal.classList.add("open");
});

checkoutCloseBtn.addEventListener("click", () => {
  checkoutModal.classList.remove("open");
});

checkoutModal.addEventListener("click", (e) => {
  if (
    e.target === checkoutModal ||
    e.target.classList.contains("checkout-backdrop")
  ) {
    checkoutModal.classList.remove("open");
  }
});

checkoutPayBtn.addEventListener("click", () => {
  const totalAmount = getCartTotalAmount();
  alert(
    `Payment flow (demo): charging $${totalAmount.toFixed(
      2
    )}. Integrate real gateway later.`
  );
  checkoutModal.classList.remove("open");
  cartDrawer.classList.remove("open");
});

// ------- CATEGORY CLICK -------
categoryButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.category;

    // If search is active, keep global search; category only affects when no search
    renderItems();
    syncButtonsWithCart();
  });
});

// ------- SEARCH HANDLERS -------
// Toggle search bar on icon click
searchBtn.addEventListener("click", () => {
  const isOpen = searchBar.classList.contains("open");
  if (!isOpen) {
    searchBar.classList.add("open");
    setTimeout(() => searchInput.focus(), 50);
  } else {
    searchBar.classList.remove("open");
    searchQuery = "";
    searchInput.value = "";
    renderItems();
    syncButtonsWithCart();
  }
});

// Search as user types (GLOBAL search)
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  renderItems();
  syncButtonsWithCart();
});

// ------- INITIAL -------
renderItems();
updateCartBadge();
renderCartDrawer();
