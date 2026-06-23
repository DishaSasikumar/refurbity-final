window.onload = function () {
    const productList = document.getElementById('productList');
    let products = JSON.parse(localStorage.getItem('products')) || [];

    const renderProducts = () => {
        productList.innerHTML = '';
        if (products.length === 0) {
            productList.innerHTML = '<p>No products available.</p>';
        } else {
            products.forEach((product, index) => {
                const productHTML = `
                    <div class="cont">
                        <div class="cont-banner">
                            <img src="${product.image}" alt="${product.title}" class="showcase-img" height="100px" width="100px">
                        </div>
                        <div class="showcase-content">
                            <h3 class="showcase-title">${product.title}</h3>
                            <p class="showcase-desc">${product.description}</p>
                            <div class="price-box">
                                <p class="price">₹${product.price}</p>
                            </div>
                            <button class="remove-btn" onclick="removeProduct(${index})">Remove</button>
                        </div>
                    </div>
                `;
                productList.innerHTML += productHTML;
            });
        }
    };

    // Function to remove product
    window.removeProduct = (index) => {
        const confirmRemove = confirm("Are you sure you want to remove this product?");
        if (confirmRemove) {
            products.splice(index, 1); // Remove product from the array
            localStorage.setItem('products', JSON.stringify(products)); // Update localStorage
            renderProducts(); // Re-render the product list
        }
    };

    renderProducts();
};
