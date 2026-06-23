document.getElementById('productForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const productTitle = document.getElementById('productTitle').value;
    const productPrice = parseFloat(document.getElementById('productPrice').value);
    const productDescription = document.getElementById('productDescription').value;
    const productImageInput = document.getElementById('productImage').files[0];

    if (!productImageInput) return;

    const reader = new FileReader();
    reader.onload = function () {
        const productImage = reader.result;

        // Create the product preview
        const previewBox = document.getElementById('productPreview');
        const previewContainer = document.getElementById('previewContainer');
        previewBox.style.display = 'block';
        previewContainer.innerHTML = `
            <div class="preview-item">
                <img src="${productImage}" alt="${productTitle}">
                <div class="preview-item-details">
                    <p class="title">${productTitle}</p>
                    <p>Price: ₹${productPrice}</p>
                    <p>${productDescription}</p>
                </div>
            </div>
        `;

        // Store product data in localStorage
        const productData = {
            title: productTitle,
            price: productPrice,
            description: productDescription,
            image: productImage
        };

        let products = JSON.parse(localStorage.getItem('products')) || [];
        products.push(productData);
        localStorage.setItem('products', JSON.stringify(products));

        // Reveal the "view all products" button now that at least one exists
        const goToListBtn = document.getElementById('goToProductList');
        if (goToListBtn) {
            goToListBtn.style.display = 'inline-block';
        }

        // Reset the form
        document.getElementById('productForm').reset();
    };

    reader.readAsDataURL(productImageInput);
});

const goToListBtn = document.getElementById('goToProductList');
if (goToListBtn) {
    goToListBtn.addEventListener('click', function () {
        window.location.href = 'sellerprodlist.html';
    });
    // Show button immediately if products already exist from a previous session
    const existingProducts = JSON.parse(localStorage.getItem('products')) || [];
    if (existingProducts.length > 0) {
        goToListBtn.style.display = 'inline-block';
    }
}
