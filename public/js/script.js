document.addEventListener('DOMContentLoaded', function(){
  // Select elements 
  const allButtons = document.querySelectorAll('.searchBtn');
  const searchBar = document.querySelector('.searchBar');
  const searchInput = document.getElementById('searchInput');
  const searchClose = document.getElementById('searchClose');

  // Check if search bar was previously open
  const isSearchBarOpen = localStorage.getItem('isSearchBarOpen') === 'true';
  if (isSearchBarOpen) {
    searchBar.style.visibility = 'visible';
    searchBar.classList.add('open');
    searchInput.focus();
  }

  // Event listener for search buttons
  for (var i = 0; i < allButtons.length; i++) {
    allButtons[i].addEventListener('click', function() {
      // Show search bar
      searchBar.style.visibility = 'visible';
      searchBar.classList.add('open');
      // Focus on search input
      searchInput.focus();
      // Store state in localStorage
      localStorage.setItem('isSearchBarOpen', 'true');
    });
  }

  // Event listener for close button
  searchClose.addEventListener('click', function() {
    // Hide search bar
    searchBar.style.visibility = 'hidden';
    searchBar.classList.remove('open');
    // Remove state from localStorage
    localStorage.removeItem('isSearchBarOpen');
  });
});
