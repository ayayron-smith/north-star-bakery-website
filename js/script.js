// North Star Bakery
// This file has two features:
// 1. A favorites list on the Products page (saved with localStorage)
// 2. Form validation on the Contact page

// ---------------------------------------------------
// Product data
// This array holds one object for each product we sell.
// Each object has the id of its list item in products.html,
// the product name, and the price range.
// ---------------------------------------------------
const products = [
  { id: "prod-sourdough", name: "Signature Sourdough", price: "$7 to $9" },
  { id: "prod-wheat-loaf", name: "Whole Wheat Country Loaf", price: "$7 to $9" },
  { id: "prod-olive-loaf", name: "Rosemary Olive Oil Loaf", price: "$8 to $10" },
  { id: "prod-baguette", name: "Baguette", price: "$4 to $5" },
  { id: "prod-croissant", name: "Butter Croissant", price: "$4 to $5" },
  { id: "prod-hand-pie", name: "Seasonal Fruit Hand Pie", price: "$5 to $6" },
  { id: "prod-morning-bun", name: "Cinnamon Morning Bun", price: "$4 to $6" },
  { id: "prod-scone", name: "Scone", price: "$3 to $5" },
  { id: "prod-layer-cake", name: "Classic Layer Cake", price: "$35 to $85" },
  { id: "prod-custom-cake", name: "Custom Celebration Cake", price: "$60 to $150" },
  { id: "prod-cupcakes", name: "Dozen Cupcakes", price: "$28 to $40" }
];

const FAVORITES_KEY = "northStarBakeryFavorites";

// ---------------------------------------------------
// Favorites feature (Products page)
// The favorites array below is loaded from localStorage
// and updated every time the user clicks a button.
// ---------------------------------------------------

function getFavorites() {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    // If storage is not available, just start with an empty list
    return [];
  }
}

function saveFavorites(favorites) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (e) {
    // If storage is not available, the favorites just will not be saved
  }
}

function isFavorite(productId, favorites) {
  return favorites.some(function (item) {
    return item.id === productId;
  });
}

function addFavorite(product, favorites) {
  const updated = favorites.concat([product]);
  saveFavorites(updated);
  return updated;
}

function removeFavorite(productId, favorites) {
  const updated = favorites.filter(function (item) {
    return item.id !== productId;
  });
  saveFavorites(updated);
  return updated;
}

function updateButtonLabel(button, isSaved) {
  button.textContent = isSaved ? "Remove from Favorites" : "Save to Favorites";
}

function createFavoriteButton(product) {
  const button = document.createElement("button");
  button.type = "button";
  button.id = product.id + "-button";

  const startingFavorites = getFavorites();
  updateButtonLabel(button, isFavorite(product.id, startingFavorites));

  button.addEventListener("click", function () {
    let currentFavorites = getFavorites();

    if (isFavorite(product.id, currentFavorites)) {
      currentFavorites = removeFavorite(product.id, currentFavorites);
    } else {
      currentFavorites = addFavorite(product, currentFavorites);
    }

    updateButtonLabel(button, isFavorite(product.id, currentFavorites));
    renderFavoritesList(currentFavorites);
  });

  return button;
}

function addButtonsToProductList() {
  products.forEach(function (product) {
    const listItem = document.getElementById(product.id);
    if (listItem) {
      listItem.appendChild(document.createTextNode(" "));
      listItem.appendChild(createFavoriteButton(product));
    }
  });
}

function renderFavoritesList(favorites) {
  const list = document.getElementById("favorites-list");
  const emptyMessage = document.getElementById("favorites-empty-message");
  if (!list || !emptyMessage) {
    return;
  }

  list.innerHTML = "";

  if (favorites.length === 0) {
    emptyMessage.style.display = "block";
    return;
  }

  emptyMessage.style.display = "none";

  favorites.forEach(function (product) {
    const item = document.createElement("li");
    item.appendChild(document.createTextNode(product.name + ", " + product.price + " "));

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", function () {
      const updated = removeFavorite(product.id, getFavorites());
      const productButton = document.getElementById(product.id + "-button");
      if (productButton) {
        updateButtonLabel(productButton, false);
      }
      renderFavoritesList(updated);
    });

    item.appendChild(removeButton);
    list.appendChild(item);
  });
}

function initFavorites() {
  // Only run this on the Products page
  if (!document.getElementById("favorites-list")) {
    return;
  }
  addButtonsToProductList();
  renderFavoritesList(getFavorites());
}

// ---------------------------------------------------
// Contact form validation (Contact page)
// ---------------------------------------------------

function validateRequired(value) {
  return value.trim().length > 0;
}

function validateEmail(value) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(value.trim());
}

function validateMinLength(value, minLength) {
  return value.trim().length >= minLength;
}

function showError(fieldId, message) {
  const errorElement = document.getElementById(fieldId + "-error");
  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearError(fieldId) {
  showError(fieldId, "");
}

function validateContactForm(event) {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const detailsInput = document.getElementById("details");
  const successMessage = document.getElementById("form-success");

  clearError("name");
  clearError("email");
  clearError("details");
  if (successMessage) {
    successMessage.textContent = "";
  }

  let isValid = true;

  if (!validateRequired(nameInput.value)) {
    showError("name", "Please enter your full name.");
    isValid = false;
  }

  if (!validateEmail(emailInput.value)) {
    showError("email", "Please enter a valid email address, like name@example.com.");
    isValid = false;
  }

  if (!validateMinLength(detailsInput.value, 10)) {
    showError("details", "Please add at least 10 characters so we know what you need.");
    isValid = false;
  }

  // There is no server to send this form to, so once the form is
  // valid we show a confirmation message instead of submitting it.
  event.preventDefault();

  if (isValid && successMessage) {
    successMessage.textContent = "Thanks! Your request looks good. We will get back to you soon.";
    event.target.reset();
  }
}

function initLiveValidationClearing() {
  ["name", "email", "details"].forEach(function (fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener("input", function () {
        clearError(fieldId);
      });
    }
  });
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) {
    return;
  }
  form.addEventListener("submit", validateContactForm);
  initLiveValidationClearing();
}

initFavorites();
initContactForm();
