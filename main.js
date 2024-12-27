// Wait for the DOM to load before executing code
document.addEventListener("DOMContentLoaded", () => {
  const addToListButton = document.getElementById("add-to-list");
  const wishListDiv = document.getElementById("wish-list");
  const sortOptions = document.getElementById("sort-options");

  //Save the wishlist to localStorage
  function saveWishlistToStorage() {
    const items = Array.from(wishListDiv.children).map((item) => {
      const link =
        item.children[0].tagName === "A" ? item.children[0].href : "";
      return {
        wish: item.children[0].textContent,
        price: item.children[1].textContent,
        link: link,
        date: item.children[2].textContent,
      };
    });
    localStorage.setItem("wishlist", JSON.stringify(items));
  }

  //Load the wishlist from localStorage
  function loadWishlistFromStorage() {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlist.forEach((item) => {
      const newItem = createWishlistItem(
        item.wish,
        item.price,
        item.link,
        item.date
      );
      wishListDiv.appendChild(newItem);
    });
  }

  //function for wishlist
  function createWishlistItem(wish, price, link, date) {
    const newItem = document.createElement("div");
    newItem.classList.add("test-div");

    // Wish element (with or without link)
    const wishElement = document.createElement(link ? "a" : "p");
    wishElement.textContent = wish;
    if (link) {
      wishElement.href = link;
      wishElement.target = "_blank";
      wishElement.rel = "noopener noreferrer";
    }

    // Price and Date elements
    const priceElement = document.createElement("p");
    priceElement.textContent = price;

    const dateElement = document.createElement("p");
    dateElement.textContent = date;

    // Buttons for edit and delete
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

    // Append all elements
    newItem.appendChild(wishElement);
    newItem.appendChild(priceElement);
    newItem.appendChild(dateElement);
    newItem.appendChild(buttonDiv);

    return newItem;
  }

  //Clear input fields
  function clearInputs() {
    document.getElementById("Your-wish").value = "";
    document.getElementById("Price").value = "";
    document.getElementById("Link").value = "";
  }

  //Display a message if required fields are missing

  function displayMessage(message) {
    const messageDiv =
      document.getElementById("error-message") || document.createElement("div");
    messageDiv.id = "error-message";
    messageDiv.style.color = "red";
    messageDiv.textContent = message;
    document.querySelector(".main-box").prepend(messageDiv);
  }

  // Handle adding a new wishlist item
  addToListButton.addEventListener("click", () => {
    const wish = document.getElementById("Your-wish").value.trim();
    const price = document.getElementById("Price").value.trim();
    const link = document.getElementById("Link").value.trim();

    if (!wish || !price) {
      // Display error message if required fields are empty
      displayMessage("Please fill in both the wish and price.");
      return;
    }

    // Clear any existing error message
    const existingMessage = document.getElementById("error-message");
    if (existingMessage) existingMessage.remove();

    const newItem = createWishlistItem(
      wish,
      price,
      link,
      new Date().toLocaleDateString()
    );
    wishListDiv.appendChild(newItem);
    saveWishlistToStorage();
    clearInputs();
  });

  //Handle edit and delete actions
  wishListDiv.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
      e.target.closest(".test-div").remove();
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

  //Handle sorting wishlist items
  sortOptions.addEventListener("change", () => {
    const items = Array.from(wishListDiv.children);
    const sortBy = sortOptions.value;

    items.sort((a, b) => {
      if (sortBy === "low-to-high") {
        return (
          parseFloat(a.children[1].textContent) -
          parseFloat(b.children[1].textContent)
        );
      }
      if (sortBy === "high-to-low") {
        return (
          parseFloat(b.children[1].textContent) -
          parseFloat(a.children[1].textContent)
        );
      }
      if (sortBy === "a-z") {
        return a.children[0].textContent.localeCompare(
          b.children[0].textContent,
          "no"
        );
      }
      if (sortBy === "z-a") {
        return b.children[0].textContent.localeCompare(
          a.children[0].textContent,
          "no"
        );
      }
      if (sortBy === "newest") {
        return (
          new Date(b.children[2].textContent) -
          new Date(a.children[2].textContent)
        );
      }
      if (sortBy === "oldest") {
        return (
          new Date(a.children[2].textContent) -
          new Date(b.children[2].textContent)
        );
      }
      return 0;
    });

    wishListDiv.innerHTML = "";
    items.forEach((item) => wishListDiv.appendChild(item));
    saveWishlistToStorage();
  });

  // Load the wishlist when the page loads
  loadWishlistFromStorage();
});
//To do:

//Debugg saving to local storage
//Fix norwegian alphabet on sorting
//Fix category bar over the wish list/below the hamburger sorting menue
//Make the category bar move together with the categories so that [price number] is always beneath price etc.
//Clean up comments to make it look more serious/profesional lol lol
//-
