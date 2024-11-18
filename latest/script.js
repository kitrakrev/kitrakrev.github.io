// Function to toggle light/dark mode
const toggleMode = () => {
    const isDarkMode = document.body.classList.contains('dark-mode');
  
    // Toggle classes for light and dark mode
    document.body.classList.toggle('dark-mode', !isDarkMode);
    document.body.classList.toggle('light-mode', isDarkMode);
  
    // Update icon based on mode
    document.getElementById('mode-toggle').textContent = isDarkMode ? '🌙' : '🌞';
  
    // Store the mode in localStorage
    localStorage.setItem('mode', isDarkMode ? 'light-mode' : 'dark-mode');
};

// Apply stored mode from localStorage or default to light mode
const storedMode = localStorage.getItem('mode') || 'light-mode';
document.body.classList.add(storedMode);
document.getElementById('mode-toggle').textContent = storedMode === 'dark-mode' ? '🌞' : '🌙';

// Add event listener for the light/dark mode toggle
document.getElementById('mode-toggle').addEventListener('click', toggleMode);

// Hamburger Menu Toggle Functionality
const toggleMenu = () => {
    const menu = document.getElementById('menu');
    const menuIcon = document.getElementById('menu-icon');

    // Toggle menu visibility and icon state
    menu.classList.toggle('show');
    menuIcon.classList.toggle('active');
};

// Add event listener for the hamburger menu toggle
document.getElementById('menu-icon').addEventListener('click', toggleMenu);

// Close menu when a menu item is clicked (on mobile)
document.querySelectorAll('.menu li a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            document.getElementById('menu').classList.remove('show');
            document.getElementById('menu-icon').classList.remove('active');
        }
    });
});

// Optional: Add active class to the clicked menu item
// document.querySelectorAll('.navbar .menu li a').forEach(link => {
//     link.addEventListener('click', function () {
//         // Remove 'active' class from all links
//         document.querySelectorAll('.navbar .menu li a').forEach(a => a.classList.remove('active'));
//         // Add 'active' class to the clicked link
//         this.classList.add('active');
        
//         // Close the mobile menu when a link is clicked
//         if (window.innerWidth <= 768) {
//             document.getElementById('menu').classList.remove('show');
//             document.getElementById('menu-icon').classList.remove('active');
//         }
//     });
// });
