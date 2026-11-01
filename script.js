
// ==========================================
// 1. GET HTML ELEMENTS
// ==========================================

// Restaurant dashboard elements
const foodForm = document.getElementById("foodForm");
const foodList = document.getElementById("foodList");

// NGO dashboard element
const ngoFoodList = document.getElementById("ngoFoodList");
const volunteerPickupList = document.getElementById("volunteerPickupList");


// ==========================================
// 2. GET SAVED FOOD LISTINGS
// ==========================================

let foodListings = JSON.parse(
    localStorage.getItem("foodListings")
) || [];


// Give older food listings an ID and a status
foodListings.forEach(function(food) {

    if (!food.id) {
        food.id = Date.now() + Math.random();
    }

    if (!food.status) {
        food.status = "available";
    }

});


// Save the updated listings
function saveFoodListings() {

    localStorage.setItem(
        "foodListings",
        JSON.stringify(foodListings)
    );

}


// ==========================================
// 3. CREATE A FOOD CARD
// ==========================================

function displayFood(food, container) {

    const foodCard = document.createElement("div");

    foodCard.className = "food-card";


    const heading = document.createElement("h3");
    heading.textContent = food.name;


    const quantity = document.createElement("p");
    quantity.textContent = "Meals: " + food.quantity;


    const time = document.createElement("p");
    time.textContent = "Available until: " + food.time;


    const location = document.createElement("p");
    location.textContent = "Location: " + food.location;


    const description = document.createElement("p");
    description.textContent = food.description;


    foodCard.appendChild(heading);
    foodCard.appendChild(quantity);
    foodCard.appendChild(time);
    foodCard.appendChild(location);
    foodCard.appendChild(description);


    // Show the status on the Restaurant Dashboard
    if (container.id === "foodList") {

        const status = document.createElement("p");
        status.textContent = "Status: " + food.status;

        foodCard.appendChild(status);

    }


    // Add Claim Food button on the NGO Dashboard
    if (
        container.id === "ngoFoodList" &&
        food.status === "available"
    ) {

        const claimButton = document.createElement("button");

        claimButton.textContent = "Claim Food";


        claimButton.addEventListener("click", function() {

            // Change the food status
            food.status = "claimed";

            // Save the updated information
            saveFoodListings();

            // Refresh the NGO food list
            renderNGOFood();

            alert("Food claimed successfully!");

        });


        foodCard.appendChild(claimButton);

    }

// Add Confirm Pickup button on Volunteer Dashboard
if (
    container.id === "volunteerPickupList" &&
    food.status === "claimed"
) {

    const pickupButton = document.createElement("button");

    pickupButton.textContent = "Confirm Pickup";

    pickupButton.addEventListener("click", function() {

        food.status = "collected";

        saveFoodListings();

        renderVolunteerPickups();

        alert("Food collection confirmed!");

    });

    foodCard.appendChild(pickupButton);

}
    container.appendChild(foodCard);

}


// ==========================================
// 4. DISPLAY RESTAURANT FOOD LISTINGS
// ==========================================

function renderRestaurantFood() {

    if (!foodList) {
        return;
    }

    foodList.innerHTML = "";

    if (foodListings.length === 0) {

        foodList.innerHTML = "<p>You haven't posted any food yet.</p>";

        return;

    }

    foodListings.forEach(function(food) {

        displayFood(food, foodList);

    });

}


// ==========================================
// 5. DISPLAY AVAILABLE FOOD FOR NGOs
// ==========================================

function renderNGOFood() {

    if (!ngoFoodList) {
        return;
    }

    ngoFoodList.innerHTML = "";

    const availableFood = foodListings.filter(function(food) {

        return food.status === "available";

    });


    if (availableFood.length === 0) {

        ngoFoodList.innerHTML = "<p>No food is currently available.</p>";

        return;

    } 


    availableFood.forEach(function(food) {

        displayFood(food, ngoFoodList);

    });

}
// DISPLAY CLAIMED FOOD FOR VOLUNTEERS

function renderVolunteerPickups() {

    if (!volunteerPickupList) {
        return;
    }

    volunteerPickupList.innerHTML = "";

    const claimedFood = foodListings.filter(function(food) {

        return food.status === "claimed";

    });

    if (claimedFood.length === 0) {

        volunteerPickupList.innerHTML =
            "<p>No pickups are currently available.</p>";

        return;

    }

    claimedFood.forEach(function(food) {

        displayFood(food, volunteerPickupList);

    });

}


// ==========================================
// 6. DISPLAY FOOD WHEN PAGE OPENS
// ==========================================

renderRestaurantFood();
renderNGOFood();
renderVolunteerPickups();


// ==========================================
// 7. HANDLE RESTAURANT FORM SUBMISSION
// ==========================================

if (foodForm) {

    foodForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const food = {

            id: Date.now() + Math.random(),

            name: document.getElementById("foodName").value,

            quantity: document.getElementById("quantity").value,

            time: document.getElementById("availableUntil").value,

            location: document.getElementById("location").value,

            description: document.getElementById("description").value,

            status: "available"

        };


        // Add the new food to the array
        foodListings.push(food);


        // Save the array
        saveFoodListings();


        // Update the restaurant dashboard
        renderRestaurantFood();


        // Clear the form
        foodForm.reset();


        alert("Food posted successfully!");

    });

}

