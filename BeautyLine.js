if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    // Remove item buttons
    var removeCartItemsButtons = document.getElementsByClassName('btn-danger')
    for (var i = 0; i < removeCartItemsButtons.length; i++) {
        var button = removeCartItemsButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    // Add to cart buttons
    var addToCartButtons = document.getElementsByClassName("addCart")
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    // Purchase button
    var purchaseButton = document.getElementsByClassName('btn-purchase')[0]
    if (purchaseButton) {
        purchaseButton.addEventListener('click', purchaseClicked)
    }

    // Send mail button (optional)
    var submitForm = document.getElementsByClassName('btn-primary')[0]
    if (submitForm) {
        submitForm.addEventListener('click', sendMail)
    }

    // Quantity inputs
    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        quantityInputs[i].addEventListener('change', quantityChanged)
    }
}

/* PURCHASE BUTTON CLICKED */
function purchaseClicked() {
    alert('Thank you for your purchase!');

    var cartItems = document.getElementsByClassName('cart-items')[0];
    var cartRows = cartItems.getElementsByClassName('cart-row');

    // Build array with cart items data
    var cartArray = [];
    for (var i = 0; i < cartRows.length; i++) {
        var row = cartRows[i];
        var title = row.getElementsByClassName('cart-item-title')[0].innerText;
        var price = row.getElementsByClassName('cart-price')[0].innerText;
        var quantity = row.getElementsByClassName('cart-quantity-input')[0].value;
        cartArray.push({
            title: title,
            price: price,
            quantity: quantity
        });
    }

    // Set cart data in hidden input as JSON string
    document.getElementById('cartData').value = JSON.stringify(cartArray);

    // Set total price in hidden input (remove any text)
    var totalText = document.getElementsByClassName('cart-total-price')[0].innerText;
    var totalValue = totalText.replace('Before discount:  $', '').replace('After discount of', '').replace(/[^\d.]/g, '');
    document.getElementById('total').value = totalValue;

    // Clear cart UI
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild);
    }

    // Update total after clearing cart
    updateCartTotal();

    // Submit the purchase form
    document.getElementById('purchaseForm').submit();
}

/* REMOVE ITEM FROM CART */
function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
}

/* QUANTITY CHANGED */
function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateCartTotal();
}

/* UPDATE CART TOTAL */
function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0];
    var cartRows = cartItemContainer.getElementsByClassName('cart-row');
    var total = 0;
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i];
        var priceElement = cartRow.getElementsByClassName('cart-price')[0];
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
        var price = parseFloat(priceElement.innerText.replace('$', ''));
        var quantity = quantityElement.value;
        total += (price * quantity);
    }
    total = Math.round(total * 100) / 100;
    discount(total);
}

/* DISCOUNT FUNCTION */
function discount(total) {
    var discountPercent;
    var discountedTotal;

    if (total < 100) {
        document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total;
        document.getElementsByClassName('cart-total-dis')[0].innerText = 'No discount';
    } else {
        if (total >= 100 && total < 250) {
            discountPercent = 15;
        } else if (total >= 250 && total < 500) {
            discountPercent = 40;
        } else if (total >= 500) {
            discountPercent = 55;
        }
        var discountAmount = Math.round(discountPercent * total) / 100;
        discountedTotal = Math.round(total - discountAmount);

        document.getElementsByClassName('cart-total-price')[0].innerText = 'Before discount:  $' + total;
        document.getElementsByClassName('cart-total-dis')[0].innerText = 'After discount of ' + discountPercent + '% : $' + discountedTotal;
    }
}

/* ADD TO CART BUTTON CLICKED */
function addToCartClicked(event) {
    var button = event.target;
    var shopItem = button.parentElement.parentElement;
    var title = shopItem.getElementsByClassName('item-name')[0].innerText;
    var price = shopItem.getElementsByClassName('item-price')[0].innerText;

    addItemToCart(title, price);
    updateCartTotal();
}

/* ADD ITEM TO CART */
function addItemToCart(title, price) {
    var cartItems = document.getElementsByClassName('cart-items')[0];
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title');
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText === title) {
            alert('This item is already added to the cart');
            return;
        }
    }

    var cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');

    var cartRowContents = `
        <div class="cart-item cart-column">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1" min="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`;
    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);

    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged);
}

/* SEND EMAIL (Using EmailJS) */
function sendMail(event) {
    event.preventDefault();

    emailjs.send("service_l3blc1i", "template_l1kvz73", {
        name: document.getElementsByClassName('name')[0].value,
        email: document.getElementsByClassName('email')[0].value,
        message: document.getElementsByClassName('message')[0].value
    })
    .then(function(response) {
        alert('Message sent successfully!');
    }, function(error) {
        alert('Failed to send message. Please try again.');
    });
}
