// Select the form element with the ID "filmform" and store it in a variable
const form = document.getElementById("filmform");

// Select the list element with the ID "filmLog" and store it in a variable
const filmlist = document.getElementById("filmLog");

// Add an event listener to the form for the "submit" event
form.addEventListener("submit", function(event) {
  // Prevent the default form submission behavior (reloading the page)
  event.preventDefault();

  // Extract values from form elements
  const title = form.elements.title.value;
  const director = form.elements.director.value;
  const genre = form.elements.genre.value;
  const year = form.elements.year.value;
  const image = form.elements.image.value;
  const userRating = form.elements.rating.value;
  const review = form.elements.review.value;
  const runtime = form.elements.runtime.value;
  const favorite = form.elements.favorite.checked;

  // Create a new film object using the extracted values and call the addFilm function
  addFilm(title, director, genre, year, image, userRating, review, runtime, favorite);

  // Log the current state of the filmLog array to the console for debugging purposes
  console.log(filmLog);
});

// Function to display a film object as a list item
function displayFilm(film) {
  // Create a new list item element (LI)
  let item = document.createElement("li");

  // Set a data attribute on the list item to store the film's ID
  item.setAttribute("data-id", film.id);

  // Create the HTML content for the list item using template literals
  item.innerHTML = `
    <p><strong>${film.title}</strong><br>${film.genre}</p>
  `;

  // Add the list item to the film list element
  filmlist.appendChild(item);

  // Reset the form to clear the input fields
  form.reset();

  // Create a delete button element
  let delButton = document.createElement("button");

  // Create the text for the delete button
  let delButtonText = document.createTextNode("Delete");

  // Add the text to the delete button
  delButton.appendChild(delButtonText);

  // Add the delete button to the list item
  item.appendChild(delButton);

  // Add an event listener to the delete button for the "click" event
  delButton.addEventListener("click", function(event) {
    // Remove the list item from the page
    item.remove();

    // Filter the filmLog array to remove the film object corresponding to the deleted list item
    filmLog = filmLog.filter(film => film.id !== item.getAttribute('data-id'));

    // Log the updated filmLog array to the console
    console.log(filmLog);
  });
}

// Class representing a film object
class Film {
  constructor(title, director, genre, year, image, userRating = 0, review = "", runtime, favorite = false) {
    this.title = title;
    this.director = director;
    this.genre = genre;
    this.year = year;
    this.image = image;
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

// Create an empty array to store film objects
let filmLog = [];

// Function to add a new film object to the filmLog array and display it
function addFilm(title, director, genre, year, image, userRating, review, runtime, favorite) {
  // Create a new film object using the provided parameters
  let film = new Film(title, director, genre, year, image, userRating, review, runtime, favorite);

  // Add the new film object to the filmLog array
  filmLog.push(film);

  // Display the newly added film object using the displayFilm function
  displayFilm(film);
}
