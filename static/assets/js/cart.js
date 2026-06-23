// Retrieve cartItems from localStorage or initialize an empty object
const cartItems = JSON.parse(localStorage.getItem('cartItems')) || {};

// Function to update the total item count in the cart badge
function updateItemNumber() {
    const itemCount = document.getElementById('item-count');
    let totalQuantity = 0;

    // Loop through cart items to calculate the total quantity
    Object.values(cartItems).forEach(item => {
        totalQuantity += item.quantity;
    });

    if (itemCount) {
        itemCount.textContent = totalQuantity;
    }
}

// Function to update the button state based on cart items
function updateButtonState() {
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');

    addToCartButtons.forEach(button => {
        const itemName = button.getAttribute('data-name');

        // Check if the item is already in the cart
        if (cartItems[itemName]) {
            button.textContent = "Added";
            button.classList.add('added'); // Optional class for styling
        } else {
            button.textContent = "Add to Cart";
            button.classList.remove('added');
        }
    });
}

// Event listener for 'Add to Cart' buttons
document.addEventListener('click', function (event) {
    const clickedElement = event.target.closest('.btn-add-cart');

    if (clickedElement) {
        const itemName = clickedElement.getAttribute('data-name');
        const itemPrice = parseFloat(clickedElement.getAttribute('data-price'));
        const itemImage = clickedElement.getAttribute('data-img');

        // Toggle the item in cartItems: add if not present, remove if already present
        if (cartItems[itemName]) {
            delete cartItems[itemName];
            clickedElement.textContent = "Add to Cart"; 
            clickedElement.classList.remove('added'); 
        } else {
            cartItems[itemName] = {
                price: itemPrice,
                quantity: 1,
                img: itemImage
            };
            clickedElement.textContent = "Added"; 
            clickedElement.classList.add('added'); 
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateItemNumber();
    }
});

// On cart button click, save cartItems and redirect to cart page
const cartButton = document.getElementById('cart');
if (cartButton) {
    cartButton.addEventListener('click', function () {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        window.location.href = 'Cart.html'; 
    });
}

// Call updateItemNumber on page load to update the cart badge
updateItemNumber();

// Call updateButtonState on page load to ensure button states reflect the cart
updateButtonState();

// Cart Page Logic (cart.html)
window.onload = function() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || {};
    const checkoutItems = document.getElementById("checkout-items");
    const bill = document.getElementById("total-amount");
    let amountTotal = 0;

    // Function to render cart items and calculate total
    function renderCartItems() {
        checkoutItems.innerHTML = ''; // Clear existing content
        amountTotal = 0;

        for (const [itemTitle, itemInfo] of Object.entries(cartItems)) {
            const itemTotal = itemInfo.price * itemInfo.quantity;
            amountTotal += itemTotal;

            checkoutItems.innerHTML += `
                <div class="cart-item">
                    <img src="${itemInfo.img}" alt="${itemTitle}" class="cart-item-img" />
                    <div class="cart-item-details">
                    <div class="items-cont">
                        <p>${itemTitle}</p>
                        <p>Price: ₹${itemInfo.price}</p>
                        <div class="quantity-controls">
                            <button class="decrement-btn" data-name="${itemTitle}">-</button>
                            <span>${itemInfo.quantity}</span>
                            <button class="increment-btn" data-name="${itemTitle}">+</button>
                        </div>
                        <p>Total: ₹<span class="item-total">${itemTotal}</span></p>
                        <div class="remove-prod">
                            <button class="remove-btn" data-name="${itemTitle}">Remove</button>
                        </div>
                    </div>
                    </div>
                </div>
            `;
        }
        bill.textContent = amountTotal;
        addQuantityEventListeners(); 
        addRemoveEventListeners();
    }

    // Function to add event listeners to quantity buttons
    function addQuantityEventListeners() {
        const incrementButtons = document.querySelectorAll('.increment-btn');
        const decrementButtons = document.querySelectorAll('.decrement-btn');

        incrementButtons.forEach(button => {
            button.addEventListener('click', function() {
                const itemName = this.getAttribute('data-name');
                cartItems[itemName].quantity += 1;
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                renderCartItems();
            });
        });

        decrementButtons.forEach(button => {
            button.addEventListener('click', function() {
                const itemName = this.getAttribute('data-name');
                if (cartItems[itemName].quantity > 1) {
                    cartItems[itemName].quantity -= 1;
                    localStorage.setItem('cartItems', JSON.stringify(cartItems));
                    renderCartItems();
                }
            });
        });
    }
     // Function to add event listeners to remove buttons
     function addRemoveEventListeners() {
        const removeButtons = document.querySelectorAll('.remove-btn');

        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const itemName = this.getAttribute('data-name');
                const confirmRemove = confirm("Are you sure you want to remove this item from the cart?");
                if (confirmRemove) {
                    delete cartItems[itemName]; // Remove item from cartItems object
                    localStorage.setItem('cartItems', JSON.stringify(cartItems));
                    renderCartItems(); // Re-render the cart items
                }
            });
        });
    }


    renderCartItems(); 

    // WhatsApp API link creation
   
    function whatsappApi() {
        let whatsappLink = "https://api.whatsapp.com/send?phone=919843224420&text=Order%20details"; 
        for (const [itemTitle, itemInfo] of Object.entries(cartItems)) {
            whatsappLink += `%0A${itemTitle}: ₹${itemInfo.price} (Quantity: ${itemInfo.quantity})`;
        }
        whatsappLink += `%0AThe total amount is ₹${amountTotal}`;

    return whatsappLink;
    }

    // Add event listener to the checkout button
    const checkout = document.getElementById("checkout");
    checkout.addEventListener("click", () => {
        const link=whatsappApi();
        window.open(link, "_blank"); 
    });
};

//whatsapp buy now
function sendToWhatsApp(productName, productPrice) {
    const phoneNumber = "919843224420"; // The target WhatsApp number, include country code

    // Construct message with full encoding
    const message = `Hello, I'm interested in purchasing the ${productName}. Price: ₹${productPrice}.`;
    const encodedMessage = encodeURIComponent(message);

    // Create WhatsApp link with double encoding
    const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

    // Open the link in a new tab
    window.open(whatsappLink, "_blank");
}
