// Get the profile form element
const profileForm = document.getElementById('profile-form');
// Get the result element
const calorieResult = document.getElementById('calorie-result');

document.getElementById('age').value = 30;
document.getElementById('gender').value = 'male';
document.getElementById('weight').value = 75;
document.getElementById('height').value = 175;
document.getElementById('activity').value = 'running';
document.getElementById('food-intake').value = 2500;
document.getElementById('diet').value = 'balanced';
document.getElementById('protein-intake').value = 100;
document.getElementById('duration').value = 60;

// Function to calculate calorie burn
function calculateCalorieBurn(userProfile, activity, foodIntake, diet, proteinIntake, duration) {
    // Calculate Basal Metabolic Rate (BMR) using Harris-Benedict Equation
    let bmr;
    if (userProfile.gender === 'male') {
        bmr = 88.362 + (13.397 * userProfile.weight) + (4.799 * userProfile.height) - (5.677 * userProfile.age);
    } else if (userProfile.gender === 'female') {
        bmr = 447.593 + (9.247 * userProfile.weight) + (3.098 * userProfile.height) - (4.330 * userProfile.age);
    } else {
        // Handle other gender options
    }

    // Adjust diet and protein factors as needed
    let dietFactor;
    if (diet === 'balanced') {
        dietFactor = 80; // Adjust this value for a balanced diet
    } else if (diet === 'low-carb') {
        dietFactor = 90; // Adjust for a low-carb diet
        // Add more diet options as needed
    }

    const proteinFactor = 4; // Calories per gram of protein
    console.log(foodIntake * (dietFactor / 100))
    // Calculate total calories burned based on BMR, MET values for activity, food intake, diet, protein intake, and duration
    const calorieBurn = (bmr + (activity.met * userProfile.weight * duration / 60)) - (foodIntake * (dietFactor / 100)) + (proteinIntake * proteinFactor);

    return calorieBurn;
}

// Function to update the progress bar
function updateProgress(caloriesBurned, goalCalories) {
    const progressIndicator = document.getElementById('progress-indicator');
    
    // Calculate the percentage of progress
    const progressPercentage = (caloriesBurned / goalCalories) * 100;

    // Update the width of the progress indicator
    progressIndicator.style.width = progressPercentage + '%';
}

// Function to update the "Analysis" section based on calculations
function updateAnalysis(userProfile, activity, foodIntake, diet, proteinIntake, duration) {
    const analysisContent = document.getElementById('analysis-content');
    
    // Example: Analyze the impact of diet or protein intake on calorie expenditure
    let analysisText = '';
    
    if (diet === 'balanced') {
        analysisText += "Your balanced diet is supporting your activity levels.";
    } else if (diet === 'low-carb') {
        analysisText += "A low-carb diet may provide less immediate energy for workouts.";
    }
    
    if (proteinIntake >= 80) {
        analysisText += "Your protein intake is sufficient to support muscle recovery.";
    } else {
        analysisText += "Consider increasing your protein intake for better recovery.";
    }
    
    // You can add more analysis based on your specific criteria.
    
    analysisContent.textContent = analysisText;
}

// Event listener for the profile form submission
profileForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const selectedActivity = document.getElementById('activity').value;

    const foodIntake = parseFloat(document.getElementById('food-intake').value);
    const diet = document.getElementById('diet').value;
    const proteinIntake = parseFloat(document.getElementById('protein-intake').value);
    const duration = parseFloat(document.getElementById('duration').value);

    const currentDate = new Date();
    const dateString = currentDate.toISOString().split('T')[0]; // Format date as "YYYY-MM-DD"

    // Create an object for user profile
    const userProfile = {
        age: age,
        gender: gender,
        weight: weight,
        height: height,
    };

    // Create an object for activity with MET values
    const activities = {
        walking: { met: 3.9 },
        running: { met: 9.8 },
        // Add more activity options with appropriate MET values
    };
    console.log("selectedActivity",selectedActivity)
    const calorieBurn = calculateCalorieBurn(userProfile, activities[selectedActivity], foodIntake, diet, proteinIntake, duration);
    calorieResult.textContent = calorieBurn.toFixed(2) + " calories";

    // Update the progress bar with the calculated calories and the user's goal
    updateProgress(calorieBurn, 2000);

    // Create an object to save in localStorage
    const dataToSave = {
        age: age,
        gender: capitalizeFirstLetter(gender),
        weight: weight,
        height: height,
        selectedActivity: capitalizeFirstLetter(selectedActivity),
        foodIntake: foodIntake,
        diet: diet,
        proteinIntake: proteinIntake,
        duration: duration,
        caloriesBurned: calorieBurn.toFixed(2)
    };

    // Save the data with the current date as the key
    saveDataToLocalStorage(dateString, dataToSave);

    updateAnalysis(userProfile, activities[selectedActivity], foodIntake, diet, proteinIntake, duration);
});

function capitalizeFirstLetter(str) {
    if (str.length === 0) {
        return str; // Return the original string if it's empty
    }
    return str[0].toUpperCase() + str.slice(1);
}

// Retrieve data when a date is selected from the calendar
// const calendarInput = document.getElementById('calendar');
// const dataDisplay = document.getElementById('data-display'); // Get the data display div

// calendarInput.addEventListener('change', function () {
//     const selectedDate = calendarInput.value;
//     const savedData = getDataFromLocalStorage(selectedDate);

//     if (savedData) {
//         // Create HTML content based on the retrieved data
//         const htmlContent = `
//             <h2>Data for ${selectedDate}</h2>
//             <p>Age: ${savedData.age}</p>
//             <p>Gender: ${savedData.gender}</p>
//             <p>Weight: ${savedData.weight} kg</p>
//             <p>Height: ${savedData.height} cm</p>
//             <p>Physical Activity: ${savedData.activity}</p>
//             <p>Food Intake: ${savedData.foodIntake} calories</p>
//             <p>Diet Type: ${savedData.diet}</p>
//             <p>Protein Intake: ${savedData.proteinIntake} grams</p>
//             <p>Duration: ${savedData.duration} minutes</p>
//             <p>Calories Burned: ${savedData.caloriesBurned} calories</p>
//             <!-- You can add more properties here -->
//         `;

//         // Set the content of the data display div
//         dataDisplay.innerHTML = htmlContent;
//     } else {
//         // Display a message if data is not available
//         dataDisplay.innerHTML = '<p>Data for the selected date is not available.</p>';
//     }
// });

const calendarInput = document.getElementById('calendar');
const modal = document.getElementById('myModal');
const closeModalButton = document.getElementById('closeModal');
const modalContent = document.getElementById('modalContent');

// Add an event listener to open the modal
// calendarInput.addEventListener('click', function () {
//     // Populate the modal content with your data
//     const selectedDate = calendarInput.value;
//     const savedData = getDataFromLocalStorage(selectedDate);
//     // console.log(selectedDate, savedData)
//     const formattedDate = formatDate(selectedDate);
// // console.log(formattedDate);
//     if (savedData) {
//         const htmlContent = `
//             <h2>Data for ${formattedDate}</h2>
//             <p>Age: ${savedData.age}</p>
//             <p>Gender: ${savedData.gender}</p>
//             <p>Weight: ${savedData.weight} kg</p>
//             <p>Height: ${savedData.height} cm</p>
//             <p>Physical Activity: ${savedData.selectedActivity}</p>
//             <p>Food Intake: ${savedData.foodIntake} calories</p>
//             <p>Diet Type: ${savedData.diet}</p>
//             <p>Protein Intake: ${savedData.proteinIntake} grams</p>
//             <p>Duration: ${savedData.duration} minutes</p>
//             <p>Calories Burned: ${savedData.caloriesBurned} calories</p>
//         `;
//         modalContent.innerHTML = htmlContent;
//     } else {
//         modalContent.innerHTML = '<p>Data for the selected date is not available.</p>';
//     }

//     modal.style.display = 'block';
// });

// Add an event listener to the calendar input to detect when a date is selected
calendarInput.addEventListener('change', function () {
    console.log("calendar")
    // Check if a valid date is selected
    if (calendarInput.value) {
        // Populate the modal content with your data
        const selectedDate = calendarInput.value;
        const savedData = getDataFromLocalStorage(selectedDate);
        const formattedDate = formatDate(selectedDate);

        if (savedData) {
            const htmlContent = `
                <h2>Data for ${formattedDate}</h2>
                <p>Age: ${savedData.age}</p>
                <p>Gender: ${savedData.gender}</p>
                <p>Weight: ${savedData.weight} kg</p>
                <p>Height: ${savedData.height} cm</p>
                <p>Physical Activity: ${savedData.selectedActivity}</p>
                <p>Food Intake: ${savedData.foodIntake} calories</p>
                <p>Diet Type: ${savedData.diet}</p>
                <p>Protein Intake: ${savedData.proteinIntake} grams</p>
                <p>Duration: ${savedData.duration} minutes</p>
                <p>Calories Burned: ${savedData.caloriesBurned} calories</p>
            `;
            modalContent.innerHTML = htmlContent;
        } else {
            modalContent.innerHTML = '<p>Data for the selected date is not available.</p>';
        }

        modal.style.display = 'block'; // Show the modal
    }
});


function formatDate(inputDate) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(inputDate).toLocaleDateString(undefined, options);
}

// Add an event listener to close the modal
closeModalButton.addEventListener('click', function () {
    modal.style.display = 'none';
    calendarInput.value = ''; // Reset the calendar input
});

// Close the modal if the user clicks outside of it
window.addEventListener('click', function (event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Function to save data to localStorage
function saveDataToLocalStorage(date, data) {
    console.log("data",data)
    // Check if localStorage is available
    if (typeof(Storage) !== "undefined") {
        // Convert the data to a JSON string before saving
        const dataString = JSON.stringify(data);
        localStorage.setItem(date, dataString);
        // alert('Data saved successfully!');
    } else {
        // alert('LocalStorage is not available in this browser.');
    }
}

// Function to retrieve data from localStorage
function getDataFromLocalStorage(date) {
    // Check if localStorage is available
    if (typeof(Storage) !== "undefined") {
        // Retrieve the data as a JSON string and parse it back to an object
        const dataString = localStorage.getItem(date);
        console.log("dataString",dataString)
        if (dataString) {
            return JSON.parse(dataString);
        }
    } else {
        alert('LocalStorage is not available in this browser.');
    }
    return null;
}

// Implement functionality for other sections
