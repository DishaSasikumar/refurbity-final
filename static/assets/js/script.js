'use strict';
//chatbot
function toggleChat() {
  const chatbox = document.getElementById('chatbox');
  if (chatbox.style.display === 'none' || chatbox.style.display === '') {
      chatbox.style.display = 'block';
  } else {
      chatbox.style.display = 'none';
  }
}
async function sendMessage() {
  const input = document.getElementById('messageInput');
  const messageText = input.value
  const chatboxBody = document.getElementById("chatbox-body");

  addMessage(messageText,"User")
  
  if (messageText !== "") {
    input.value = "";
    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText })
      });
      const data = await response.json();
      addMessage(data.response, "Bot");
    } catch (err) {
      addMessage("Sorry, I couldn't reach the assistant right now.", "Bot");
    }
  }
}

// function addMessage(text, sender) {
//   const chatboxBody = document.getElementById('chatbox-body');
//   const messageElement = document.createElement('div');
//   const timestampElement = document.createElement('span');
  
//   messageElement.classList.add('message', sender);
//   messageElement.textContent = text;
  
//   // Create timestamp
//   const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   timestampElement.classList.add('timestamp');
//   timestampElement.textContent = currentTime;
  
//   // Append timestamp to the message
//   messageElement.appendChild(timestampElement);
  
//   chatboxBody.appendChild(messageElement);
//   chatboxBody.scrollTop = chatboxBody.scrollHeight; // Scroll to the bottom
// }

function addMessage(text, sender) {
  const chatboxBody = document.getElementById('chatbox-body');
  const messageElement = document.createElement('div');
  
  messageElement.classList.add('message', sender.toLowerCase());
  
  // Create a span for the message text
  const messageText = document.createElement('span');
  messageText.textContent = text;
  
  // Create a span for the timestamp
  const timestampElement = document.createElement('span');
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  timestampElement.classList.add('timestamp');
  timestampElement.textContent = currentTime;
  
  // Append message text and timestamp to the message element
  messageElement.appendChild(messageText);
  messageElement.appendChild(timestampElement);
  
  // Add the message to the chatbox body
  chatboxBody.appendChild(messageElement);
  
  // Scroll to the bottom to show the latest message
  chatboxBody.scrollTop = chatboxBody.scrollHeight;
}

// modal variables
const modal = document.querySelector('[data-modal]');
const modalCloseBtn = document.querySelector('[data-modal-close]');
const modalCloseOverlay = document.querySelector('[data-modal-overlay]');
const loginAnchor = document.querySelector('.login-btn');
// modal function
const modalCloseFunc = function () { 
  modal.classList.add('closed'); 
  modal.classList.remove('open'); }

// modal function to open the modal
const modalOpenFunc = function () {
  modal.classList.remove('closed');
  modal.classList.add('open'); 
}

// Event listeners for closing the modal
if (modalCloseOverlay) {
  modalCloseOverlay.addEventListener('click', modalCloseFunc);
}

if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', modalCloseFunc);
}

// Open modal when login anchor is clicked
if (loginAnchor) {
  loginAnchor.addEventListener('click', function(event) {
    event.preventDefault();  // Prevent default anchor behavior
    modalOpenFunc();         // Open the modal
  });
}


// notification toast variables
const notificationToast = document.querySelector('[data-toast]');
const toastCloseBtn = document.querySelector('[data-toast-close]');
function redirectToPage() {
  window.location.href = "loginpage.html"; // Replace with the actual file path
}
// notification toast eventListener
toastCloseBtn.addEventListener('click', function () {
  notificationToast.classList.add('closed');
});





// mobile menu variables
const mobileMenuOpenBtn = document.querySelectorAll('[data-mobile-menu-open-btn]');
const mobileMenu = document.querySelectorAll('[data-mobile-menu]');
const mobileMenuCloseBtn = document.querySelectorAll('[data-mobile-menu-close-btn]');
const overlay = document.querySelector('[data-overlay]');

for (let i = 0; i < mobileMenuOpenBtn.length; i++) {

  // mobile menu function
  const mobileMenuCloseFunc = function () {
    mobileMenu[i].classList.remove('active');
    overlay.classList.remove('active');
  }

  mobileMenuOpenBtn[i].addEventListener('click', function () {
    mobileMenu[i].classList.add('active');
    overlay.classList.add('active');
  });

  mobileMenuCloseBtn[i].addEventListener('click', mobileMenuCloseFunc);
  overlay.addEventListener('click', mobileMenuCloseFunc);

}




// accordion variables
const accordionBtn = document.querySelectorAll('[data-accordion-btn]');
const accordion = document.querySelectorAll('[data-accordion]');

for (let i = 0; i < accordionBtn.length; i++) {

  accordionBtn[i].addEventListener('click', function () {

    const clickedBtn = this.nextElementSibling.classList.contains('active');

    for (let i = 0; i < accordion.length; i++) {

      if (clickedBtn) break;

      if (accordion[i].classList.contains('active')) {

        accordion[i].classList.remove('active');
        accordionBtn[i].classList.remove('active');

      }

    }

    this.nextElementSibling.classList.toggle('active');
    this.classList.toggle('active');

  });

}