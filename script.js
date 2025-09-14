

function goToLogin() {
    window.location.href = "login.html";
}

let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.addEventListener('click', () => {
  menuIcon.classList.toggle('fa-times'); // change icon
  navbar.classList.toggle('active');     // toggle menu
});

let darkModeBtn = document.getElementById('dark-mode-btn');

const enableDarkMode = () => {
  document.body.classList.add("dark-mode");
  localStorage.setItem("darkMode", "active");
};

const disableDarkMode = () => {
  document.body.classList.remove("dark-mode");
  localStorage.setItem("darkMode", "inactive");
};

// Check the saved dark mode preference on page load
if (localStorage.getItem("darkMode") === "active") {
  enableDarkMode();
}

// Toggle dark mode on button click
darkModeBtn.addEventListener('click', () => {
  if (localStorage.getItem("darkMode") === "active") {
    disableDarkMode();
  } else {
    enableDarkMode();
  }
});

function scrollToSlide(index) {
  const box = document.querySelector('.certificate-box');
  const width = box.clientWidth;
  box.scrollTo({ left: width * index, behavior: 'smooth' });
}


// Section scroll active link + sticky header
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
  sections.forEach(section => {
    let top = window.scrollY;
    let offset = section.offsetTop - 150;
    let height = section.offsetHeight;
    let id = section.getAttribute('id');

    if (top >= offset && top < offset + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        document
          .querySelector('header nav a[href*=' + id + ']')
          .classList.add('active');
      });
    }
  });

  // sticky header
  let header = document.querySelector('header');
  header.classList.toggle('sticky', window.scrollY > 100);

  // auto remove toggle when scrolling
  menuIcon.classList.remove('fa-times');
  navbar.classList.remove('active');
};
