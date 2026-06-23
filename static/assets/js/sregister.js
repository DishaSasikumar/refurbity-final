// Seller Sign-up function for sloginpage.html
function sellerSignUp(event) {
    event.preventDefault(); // Prevent form from submitting
    const companyName = document.querySelector('input[name="text"]').value;
    const gstin = document.querySelector('input[name="gstin"]').value;
    const email = document.querySelector('input[name="mail"]').value;
    const pan = document.querySelector('input[name="pan"]').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('cpassword').value;
    const phoneNo = document.querySelector('input[name="phnno"]').value;
    const role = "seller";
    // Password confirmation check
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Check if the email is already registered
    if (localStorage.getItem(email)) {
      alert("An account with this email already exists.");
      return;
    }

    // Save seller details in localStorage
    const seller = { companyName, gstin, email, pan, password, phoneNo, role };
    localStorage.setItem(email, JSON.stringify(seller));
    alert('Seller Sign-up successful!');
    window.location.href = 'sloginpage.html';  // Redirect after successful sign-up
}

// Seller Sign-in function for sloginpage.html
function sellerSignIn(event) {
    event.preventDefault(); // Prevent form from submitting
    const email = document.getElementById("mail").value;
    const password = document.getElementById("pwd").value;

    // Retrieve seller data from localStorage
    const storedSeller = JSON.parse(localStorage.getItem(email));

    if (storedSeller && storedSeller.password === password) {
      // Check if the user's role is "seller"
      if (storedSeller.role === "seller") {
          // Save active session in sessionStorage
          sessionStorage.setItem("activeSeller", email);
          alert("Login successful!");
          window.location.href = 'sprofile.html';  // Redirect to the seller profile page on successful login
      } else {
          alert("Access denied. This account is not registered as a seller.");
      }
  } else {
      alert("Invalid credentials. Please try again.");
  }
}
window.onload = function() {
    const activeSeller = sessionStorage.getItem("activeSeller");
    if (!activeSeller) {
        // Check if the current page is not the login page
        if (window.location.pathname !== '/sloginpage.html') {
            alert("Please log in first.");
            window.location.href = "sloginpage.html";
        }
        return;
    }


    // Retrieve seller data from localStorage
    const sellerData = JSON.parse(localStorage.getItem(activeSeller));
    if (sellerData) {
        document.getElementById('userGreeting').innerHTML = `<h3 style="color: black;">Hello!! <div style="color: hsl(353, 100%, 78%);">${sellerData.companyName} </div> </h3>`;
    }
}

// Logout function
function logout() {
    sessionStorage.removeItem("activeSeller");
    alert("Logged out successfully!");
    window.location.href = "sellindex.html";
}
