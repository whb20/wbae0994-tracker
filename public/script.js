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

  //Loop through the filmLog array and display each film object
  filmLog.forEach(film => {
    // Create a new list item element (LI)
    let item = document.createElement("li");

    // Set a data attribute on the list item to store the film's ID
    item.setAttribute("data-id", film.id);

    // Create the HTML content for the list item using template literals
    item.innerHTML = `<div class="film-item">
      <img src="${film.image}" alt="?">
      <div class="film-info">
        <h2>${film.title}</h2>
        <p>${film.genre}</p>
      </div>
      </div>
    `;

    // Add the list item to the film list element
    filmlist.appendChild(item);

    //Clear the input values of submission form
    form.reset();

    // Create a delete button element
    let delButton = document.createElement("button");
    let delButtonText = document.createTextNode("Delete");
    delButton.appendChild(delButtonText);

    // Add the delete button to the list item
    item.appendChild(delButton);

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

// Call the displayFilm function when the page loads
displayFilm();
