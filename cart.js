// Wait for the page to load
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    // Remove cart item buttons
    var removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    // Quantity inputs change
    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    // Add to cart buttons
    var addToCartButtons = document.getElementsByClassName('addCart')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    // Purchase form submit
    var purchaseForm = document.getElementById('purchaseForm')
    if (purchaseForm) {
        purchaseForm.addEventListener('submit', prepareCartData)
    }
}

// Remove item from cart
function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.closest('.cart-row').remove()
    updateCartTotal()
}

// Quantity input changed
function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

// Add to cart button clicked
function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.closest('.card-body')
    var title = shopItem.getElementsByClassName('item-name')[0].innerText
    var price = shopItem.getElementsByClassName('item-price')[0].innerText
    var imageSrc = shopItem.parentElement.getElementsByClassName('card-img-top')[0].src

    addItemToCart(title, price, imageSrc)
    updateCartTotal()
}

// Add a new item to cart
function addItemToCart(title, price, imageSrc) {
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')

    // Check if item already exists
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('This item is already added to the cart')
            return
        }
    }

    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="50" height="50">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1" min="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)

    // Add events to the new buttons
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

// Update total price
function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
    var totalInput = document.getElementById('total')
    if (totalInput) totalInput.value = total
}

// Prepare cart data for PHP
function prepareCartData() {
    var items = []
    var cartRows = document.querySelectorAll('.cart-items .cart-row')
    cartRows.forEach(row => {
        const title = row.querySelector('.cart-item-title').innerText
        const price = row.querySelector('.cart-price').innerText
        const quantity = row.querySelector('.cart-quantity-input').value
        items.push({ title, price, quantity })
    })

    // Send to hidden input
    document.getElementById('cartData').value = JSON.stringify(items)
}

  // Example cart items stored in localStorage or JavaScript object
  // This depends on how you manage your cart on your site
  let cart = JSON.parse(localStorage.getItem('cartItems')) || [];

  function updateFormData() {
    let total = 0;
    cart.forEach(item => {
      total += item.price * item.quantity;
    });

    document.getElementById('totalInput').value = total.toFixed(2);
    document.getElementById('cartDataInput').value = JSON.stringify(cart);
  }

  // Update form fields before submitting
  document.getElementById('purchaseForm').addEventListener('submit', function(e) {
    updateFormData();
  });

