document.getElementById("add-to-list").addEventListener("click", function () {
  const wish = document.getElementById("Your-wish").value;
  const price = document.getElementById("Price").value;
  const link = document.getElementById("Link").value;

  // Function to create a wishlist item
  function createWishlistItem(wish, price, link, date) {
    const newItem = document.createElement("div");
    newItem.classList.add("test-div");

    // Create wish with or without link
    const wishElement = document.createElement(link ? "a" : "p");
    wishElement.textContent = wish;

    if (link) {
      wishElement.href = link; // makes sure it's a valid link
      wishElement.target = "_blank"; // Apparently this makes you open it in new window
      wishElement.rel = "noopener noreferrer"; // Adds security
    }

    // Create price element
    const priceElement = document.createElement("p");
    priceElement.textContent = price;

    // Create date element
    const dateElement = document.createElement("p");
    dateElement.textContent = date;

    // Create button div for buttons
    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("button-div");

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit");

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete");

    buttonDiv.appendChild(editButton);
    buttonDiv.appendChild(deleteButton);

    // Add all the stuff to the new div
    newItem.appendChild(wishElement);
    newItem.appendChild(priceElement);
    newItem.appendChild(dateElement);
    newItem.appendChild(buttonDiv);

    return newItem;
  }

  //Letse gooo
  if (wish && price) {
    const wishlist = document.getElementById("wish-list");

    // Create a div for the items
    const newItem = createWishlistItem(
      wish,
      price,
      link,
      new Date().toLocaleDateString()
    );

    // Add to wishlist
    wishlist.appendChild(newItem);

    // Save the wishlist to local storage
    saveWishlistToStorage();

    // Clear input fields
    clearInputs();
  } else {
    alert("Please fill in both the wish and price fields.");
  }
});

// Function to clear your input fields
function clearInputs() {
  document.getElementById("Your-wish").value = "";
  document.getElementById("Price").value = "";
  document.getElementById("Link").value = "";
}

// Add event listener buttons
document.getElementById("wish-list").addEventListener("click", function (e) {
  if (e.target.classList.contains("delete")) {
    e.target.closest(".test-div").remove();

    // Save the updated list to local storage
    saveWishlistToStorage();
  } else if (e.target.classList.contains("edit")) {
    const item = e.target.closest(".test-div").children;
    document.getElementById("Your-wish").value = item[0].textContent;
    document.getElementById("Price").value = item[1].textContent;
    document.getElementById("Link").value =
      item[0].tagName === "A" ? item[0].href : "";
    e.target.closest(".test-div").remove();

    saveWishlistToStorage();
  }
});

// Sort items
document
  .getElementById("sort-options")
  .addEventListener("change", function (e) {
    const sortBy = e.target.value;
    const wishlist = document.getElementById("wish-list");
    const items = Array.from(wishlist.children);

    //Sort by price low-high
    items.sort((a, b) => {
      if (sortBy === "low-to-high") {
        return (
          parseFloat(a.children[1].textContent) -
          parseFloat(b.children[1].textContent)
        );
      }
      //sort by price high-low
      if (sortBy === "high-to-low") {
        return (
          parseFloat(b.children[1].textContent) -
          parseFloat(a.children[1].textContent)
        );
      }
      //sort by alphabet a-å, what does it not work with norwegian letters?
      if (sortBy === "a-z") {
        return a.children[0].textContent.localeCompare(
          b.children[0].textContent
        );
      }
      //sort by alphabet å-a, guess we do it without æøå...
      if (sortBy === "z-a") {
        return b.children[0].textContent.localeCompare(
          a.children[0].textContent
        );
      }
      // sort by date new (how do i test if this works lol, idk how to change the dates)
      if (sortBy === "newest") {
        return (
          new Date(b.children[2].textContent) -
          new Date(a.children[2].textContent)
        );
      }
      //sort by date old
      if (sortBy === "oldest") {
        return (
          new Date(a.children[2].textContent) -
          new Date(b.children[2].textContent)
        );
      }
      return 0;
    });

    // Delete and re-upload the wishlist items?
    while (wishlist.firstChild) {
      wishlist.removeChild(wishlist.firstChild);
    }

    items.forEach((item) => wishlist.appendChild(item));

    // Save the wishlist after being sorted
    saveWishlistToStorage();
  });

// Save wishlist to local storage, needs to be debugged, does not work...
function saveWishlistToStorage() {
  const wishlist = document.getElementById("wish-list");
  const items = Array.from(wishlist.children).map((item) => {
    const link = item.children[0].tagName === "A" ? item.children[0].href : "";
    return {
      wish: item.children[0].textContent,
      price: item.children[1].textContent,
      link: link,
      date: item.children[2].textContent,
    };
  });
  localStorage.setItem("wishlist", JSON.stringify(items));
}

// Get from local storage
function loadWishlistFromStorage() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const wishlistContainer = document.getElementById("wish-list");

  // Loop the saved wishlist
  wishlist.forEach((item) => {
    const newItem = createWishlistItem(
      item.wish,
      item.price,
      item.link,
      item.date
    );
    wishlistContainer.appendChild(newItem);
  });
}

// Load when the page loads
window.onload = loadWishlistFromStorage;

//To do:

//Debugg saving to local storage
//Fix norwegian alphabet on sorting
//Fix category bar over the wish list/below the hamburger sorting menue
//Make the category bar move together with the categories so that [price number] is always beneath price etc.
//Clean up comments to make it look more serious/profesional lol lol
//-
