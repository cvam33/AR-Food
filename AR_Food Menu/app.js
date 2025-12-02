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
let cartCount = 0;

// ------- DOM -------
const categoryButtons = document.querySelectorAll(".category-item");
const itemsListEl = document.getElementById("itemsList");
const cartCountEl = document.getElementById("cartCount");

// AR modal DOM refs
const arModal = document.getElementById("arModal");
const arCloseBtn = document.getElementById("arCloseBtn");
const arModelViewer = document.getElementById("arModelViewer");
const arItemTitle = document.getElementById("arItemTitle");

// ------- RENDER ITEMS -------
function renderItems() {
  const filtered = menuItems.filter(
    (item) => item.category === currentCategory
  );

  itemsListEl.innerHTML = "";

  filtered.forEach((item) => {
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
            <button class="add-btn" data-id="${item.id}">Add to Cart</button>
          </div>
        </div>
      </div>
    `;

    itemsListEl.appendChild(card);
  });

  attachAddHandlers();
  attachArHandlers();
}

// ------- CART HANDLERS -------
function attachAddHandlers() {
  const addButtons = document.querySelectorAll(".add-btn");
  addButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      cartCount++;
      cartCountEl.textContent = cartCount;
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

  // attach model paths (only GLB is required, USDZ for iOS floor AR)
  arModelViewer.setAttribute("src", item.modelGlbUrl);
  arModelViewer.setAttribute("ios-src", item.modelUsdzUrl);

  arModal.classList.add("open");
}

function closeArModal() {
  arModal.classList.remove("open");
}

// close button + click on backdrop
arCloseBtn.addEventListener("click", closeArModal);
arModal.addEventListener("click", (e) => {
  if (e.target === arModal || e.target.classList.contains("ar-modal-backdrop")) {
    closeArModal();
  }
});

// ------- CATEGORY CLICK -------
categoryButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    renderItems();
  });
});

// ------- INITIAL -------
renderItems();
