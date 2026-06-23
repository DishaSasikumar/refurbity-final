function signUp(event) {
    event.preventDefault(); // Prevent form from submitting
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = "buyer"; 
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

    // Save user details in localStorage
    const user = { username, email, password, role, cart: [] };
    localStorage.setItem(email, JSON.stringify(user));
    alert('Sign-up successful!');
    window.location.href = 'bloginpage.html';  // Redirect after successful sign-up
  }

  // Sign-in function
  function signIn(event) {
    event.preventDefault(); // Prevent form from submitting
    const email = document.getElementById("mail").value;
    const password = document.getElementById("pwd").value;

    // Retrieve user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem(email));
    if (storedUser && storedUser.password === password) {
      // Check if the user's role is "buyer"
      if (storedUser.role === "buyer") {
          // Save active session in sessionStorage
          sessionStorage.setItem("activeUser", email);
          alert("Login successful!");
          window.location.href = 'profile.html';  // Redirect to the profile page on successful login
      } else {
          alert("Access denied. This account is not registered as a buyer.");
      }
  } else {
      alert("Invalid credentials. Please try again.");
  }
}