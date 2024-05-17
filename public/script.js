// Film object class declaration
class Film {
  constructor(title, director, genre, year, userRating = 0, review = "", runtime, favorite = false) {
    this.title = title;
    this.director = director; 
    this.genre = genre;
    this.year = year; 
    //For image, use the genre to set the relative path to the corresponding icon
    this.image = `resources/${genre.toLowerCase()}.png`; 
    // Generate a unique ID for the film object using Date.now()
    this.id = Date.now();
    // Generate a timestamp for the creation date using new Date().toISOString()
    this.date = new Date().toISOString(); 
    this.userRating = userRating; 
    this.review = review; 
    this.runtime = runtime; 
    this.favorite = favorite; 
  }
}

// Set HTML elements to variables with DOM selection
const form = document.getElementById("filmform"); 
const filmlist = document.getElementById("filmlog"); 
const toggleFormButton = document.getElementById('toggleFormButton');

// Add an event listener to the toggle form button to show/hide the form
toggleFormButton.addEventListener('click', () => {
  if (form.style.display === 'none' || form.style.display === '') {
    form.style.display = 'block';
    toggleFormButton.textContent = 'Cancel';
  } else {
    form.style.display = 'none';
    toggleFormButton.textContent = 'Add New Film';
  }
});

// Add an event listener to handle form submission and create a new film object using input
form.addEventListener("submit", function(event) {
  // Prevent the default form submission behavior (reloading the page)
  event.preventDefault();

  // Call the addFilm function, creating a new film object using the extracted values from the form
  addFilm(form.elements.title.value, form.elements.director.value, form.elements.genre.value, form.elements.year.value, form.elements.rating.value, form.elements.review.value, form.elements.runtime.value, form.elements.favorite.checked);

  // Hide the form after submission
  form.style.display = 'none'; 
  toggleFormButton.textContent = 'Add New Film';

  //Reload the page
  location.reload();
  
});

// Default (desktop) function to display film objects as list items
function displayFilm() {
  //Clear the filmlist <ul> element's contents
  filmlist.innerHTML = "";

  // Fetch and parse filmLog array from localStorage
  let filmLog = JSON.parse(localStorage.getItem("log"));

  // If no films are logged, return to avoid errors
  if (!filmLog) return;

  //Loop through the filmLog array and display each film object
  filmLog.forEach(film => {
    // Create a new list item element (LI)
    let item = document.createElement("li");

    // Set a data attribute on the list item to store the film's ID
    item.setAttribute("data-id", film.id);

    // Create the HTML content for the list item using template literals
    item.innerHTML = 
    `<div class="film-item" data-id="${film.id}">
      <div class="film-summary">
        <img src="${film.image}" alt="${film.genre} icon" class="film-image">
        <h2 class="film-title">${film.title}</h2>
        <p class="user-rating"><span style='font-size: 1.5em;'>${getStarRating(film.userRating)}</span></p>
        <p class="favorite">${film.favorite ? "<span style='font-size: 2.5em;'>&#x2665;</span>" : ""}</p>
        <button class="delete-button">Delete</button>
      </div>
      <div class="film-details" style="display: none;">
        <p><strong>Director:</strong> ${film.director}</p>
        <p><strong>Genre:</strong> ${film.genre}</p>
        <p><strong>Year:</strong> ${film.year}</p>
        <p><strong>Runtime:</strong> ${film.runtime} minutes</p>
        <p><strong>Review:</strong> ${film.review}</p>
      </div>`;

    // Add click event listener to toggle display of additional details
    item.querySelector('.film-item').addEventListener('click', () => {
      const detailsContainer = item.querySelector('.film-details');
      detailsContainer.style.display = detailsContainer.style.display === 'none' ? 'block' : 'none';
    });

    // Add the list item to the film list element
    filmlist.appendChild(item);

    //Clear the input values of submission form
    form.reset();

    // Select the delete button within the film item
    let delButton = item.querySelector(".delete-button");

    // Add an event listener to the delete button for the "click" event
    delButton.addEventListener("click", function(event) {

      // Remove the intended film object from the filmLog array
      filmLog.forEach(function (film, filmIndex) {
        if (film.id == item.getAttribute("data-id")) {
          filmLog.splice(filmIndex, 1);
        }
      });

      // Update localStorage with the array (converted to a JSON string)
      localStorage.setItem("log", JSON.stringify(filmLog));

      // Remove the list item from the page
      item.remove();
    });
  });
};

// Modified function to display film objects as list items for mobile view
function displayFilmMobile() {
  filmlist.innerHTML = "";
  let filmLog = JSON.parse(localStorage.getItem("log"));
  if (!filmLog) return;

  filmLog.forEach(film => {
    let item = document.createElement("li");
    item.setAttribute("data-id", film.id);
    item.innerHTML = 
    `<div class="film-item" data-id="${film.id}" style="font-size: 0.5em;">
      <div class="film-summary">
        <img src="${film.image}" alt="${film.genre} icon" class="film-image" style="width: 50px; height: 50px;">
        <h2 class="film-title">${film.title}</h2>
        <p class="user-rating" style="font-size: 1.5em; margin-top: 20px; margin-left: 10px"> ★${film.userRating}</p>
        <p class="favorite">${film.favorite ? "<span style='font-size: 4em;'>&#x2665;</span>" : ""}</p>
        <button class="delete-button">Delete</button>
      </div>
      <div class="film-details" style="display: none;">
        <p><strong>Director:</strong> ${film.director}</p>
        <p><strong>Genre:</strong> ${film.genre}</p>
        <p><strong>Year:</strong> ${film.year}</p>
        <p><strong>Runtime:</strong> ${film.runtime} minutes</p>
        <p><strong>Review:</strong> ${film.review}</p>
      </div>`;

    item.querySelector('.film-item').addEventListener('click', () => {
      const detailsContainer = item.querySelector('.film-details');
      detailsContainer.style.display = detailsContainer.style.display === 'none' ? 'block' : 'none';
    });

    filmlist.appendChild(item);
    form.reset();
    let delButton = item.querySelector(".delete-button");
    delButton.addEventListener("click", function(event) {
      filmLog.forEach(function (film, filmIndex) {
        if (film.id == item.getAttribute("data-id")) {
          filmLog.splice(filmIndex, 1);
        }
      });
      localStorage.setItem("log", JSON.stringify(filmLog));
      item.remove();
    });
  });
}


// Function to add a new film object to the filmLog array
function addFilm(title, director, genre, year, userRating, review, runtime, favorite) {
  // Create a new film object using the provided parameters
  let film = new Film(title, director, genre, year, userRating, review, runtime, favorite);

  // Fetch and parse filmLog array from localStorage
  let filmLog = JSON.parse(localStorage.getItem("log"));

  // If no films are logged in local storage, create a new array with the current film
  if (filmLog == null) {
    filmLog = [film];
  } else {
    filmLog.push(film);
  }
  
  // Update localStorage with the array (converted to a JSON string)
  localStorage.setItem("log", JSON.stringify(filmLog));

  //Sort films by date
  sortFilms("date");
  // Display the films on the DOM
  updateDisplay();
}

// Function to sort films based on a given attribute
function sortFilms(attribute) {
  // Fetch and parse filmLog array from localStorage
  let filmLog = JSON.parse(localStorage.getItem("log"));

  // If no films are logged, return to avoid errors
  if (!filmLog) return;

  // Sort the filmLog array based on the provided attribute
  filmLog.sort((a, b) => {

    // Favorites should be sorted to the top
    if (attribute === "favorite") {
      console.log("sort by favorite");
      return (a.favorite === b.favorite)? 0 : a.favorite? -1 : 1;
    }

    // User rating should be sorted in descending order
    if (attribute === "userRating"){
      // Convert attribute values to numbers for numeric attributes
      const aValue = typeof a[attribute] === 'string' ? parseFloat(a[attribute]) : a[attribute];
      const bValue = typeof b[attribute] === 'string' ? parseFloat(b[attribute]) : b[attribute];

      if (aValue < bValue) {
        return 1;
      } else if (aValue > bValue) {
        return -1;
      } else {
        return 0;
      }
    }

    // Date and Release Year should be sorted with the most recent first
    if (attribute === "date" || attribute === "year"){
      if (a[attribute] < b[attribute]) {
        return 1;
      } else if (a[attribute] > b[attribute]) {
        return -1;
      } else {
        return 0;
      }
    }

    // All other attributes should be sorted in ascending order
    if (a[attribute] > b[attribute]) {
      return 1;
    } else if (a[attribute] < b[attribute]) {
      return -1;
    } else {
      return 0;
    }
  });

  // Update localStorage with the sorted array
  localStorage.setItem("log", JSON.stringify(filmLog));

  // Display the films on the DOM
  updateDisplay();
}

//Function that returns string of Star Rating based on the userRating
function getStarRating(rating) {
  const maxStars = 10;
  let stars = '';
  for (let i = 1; i <= maxStars; i++) {
    stars += i <= rating ? '★' : '☆';
  }
  return stars;
}


// Function to choose the correct display function based on screen width
function updateDisplay() {
  if (window.matchMedia("(max-width: 1200px)").matches) {
    displayFilmMobile();
  } else {
    displayFilm();
  }
}

// Add event listener to call updateDisplay on window resize
window.addEventListener('resize', updateDisplay);


// Display the films on the DOM (sorted by Date Added) when the page loads
sortFilms("date");
updateDisplay();
