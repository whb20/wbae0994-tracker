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

// Add an event listener to handle form submission and create a new film object using input
form.addEventListener("submit", function(event) {
  // Prevent the default form submission behavior (reloading the page)
  event.preventDefault();

  // Call the addFilm function, creating a new film object using the extracted values from the form
  addFilm(form.elements.title.value, form.elements.director.value, form.elements.genre.value, form.elements.year.value, form.elements.rating.value, form.elements.review.value, form.elements.runtime.value, form.elements.favorite.checked);
});

// Function to display film objects as list items
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
    `<div class="film-item">
      <img src="${film.image}" alt="${film.genre} icon">
      <div class="film-info">
        <h2>${film.title}</h2>
        <p><strong>Director:</strong> ${film.director}</p>
        <p><strong>Genre:</strong> ${film.genre}</p>
        <p><strong>Year:</strong> ${film.year}</p>
        <p><strong>Rating:</strong> ${film.userRating}</p>
        <p><strong>Review:</strong> ${film.review}</p>
        <p><strong>Runtime:</strong> ${film.runtime} minutes</p>
        <p><strong>Favorite:</strong> ${film.favorite ? "Yes" : "No"}</p>
        <p><strong>Date Added:</strong> ${new Date(film.date).toLocaleDateString()}</p>
      </div>
      <button class="delete-button">Delete</button>
    </div>`;

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

  // Display the films on the DOM
  displayFilm();
}

// Function to sort films based on a given attribute
function sortFilms(attribute) {
  // Fetch and parse filmLog array from localStorage
  let filmLog = JSON.parse(localStorage.getItem("log"));

  // If no films are logged, return to avoid errors
  if (!filmLog) return;

  // Sort the filmLog array based on the provided attribute
  filmLog.sort((a, b) => {
    if (attribute === "favorite") {
      console.log("sort by favorite");
      return (a.favorite === b.favorite)? 0 : a.favorite? -1 : 1;
    }

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

    if (attribute === "date" || attribute === "year"){
      if (a[attribute] < b[attribute]) {
        return 1;
      } else if (a[attribute] > b[attribute]) {
        return -1;
      } else {
        return 0;
      }
    }

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
  displayFilm();
}

// Display the films on the DOM (sorted by Date Added) when the page loads
sortFilms("date");
displayFilm();
