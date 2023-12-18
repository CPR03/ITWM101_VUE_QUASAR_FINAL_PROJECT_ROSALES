function toggleMenu() {
    const headerContainer = document.querySelector(".header-container");
    headerContainer.classList.toggle("active");
}

//Formate the Date input to correct format (yyyy-mm-dd)
function formatDate() {
    const dateInput = document.getElementById("apod-date-input");

    const selectedDate = dateInput.value;

    const dateObject = new Date(selectedDate);

    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(dateObject.getDate()).padStart(2, "0");

    // Formatted date in yyyy-mm-dd format
    const formattedDate = `${year}-${month}-${day}`;

    //disable dateSearch text input when date input is used
    const textInput = document.getElementById("dateSearch");
    textInput.disabled = dateInput.value !== "";

    return formattedDate;
}

//Format the text date input format
function textFormatDate(input) {
    // Remove non-numeric characters (Allowing only numbers to be entered)
    let cleanedInput = input.value.replace(/[^0-9]/g, "");

    // Format as yyyy-mm-dd
    if (cleanedInput.length >= 4) {
        cleanedInput = cleanedInput.substring(0, 4) + "-" + cleanedInput.substring(4);
    }
    if (cleanedInput.length >= 7) {
        cleanedInput = cleanedInput.substring(0, 7) + "-" + cleanedInput.substring(7);
    }

    //disable date input when text dateSearch input is used
    const dateInput = document.getElementById("apod-date-input");
    dateInput.disabled = cleanedInput !== "";

    // Update the input value
    input.value = cleanedInput;
}

//Function for getting date
function getDate() {
    let textDate = document.getElementById("dateSearch").value;
    let inputDate = document.getElementById("apod-date-input");

    //tell where the date is inputted (dateSearch or apod-date-input)
    if (textDate !== "") {
        inputDate.value = "";
        return textDate;
    } else textDate.value = "";
    return formatDate();
}

const apiKey = "sNm6IyDodvc4td89Y8nSy6qn3nmf5MserXhb8bc2";

// Return Only Specific Date
async function getNASA() {
    
    const container = document.getElementById("apod-container");
    const titleContainer = document.getElementById("tiles-title");

    // Clear previous content in the image container
    container.innerHTML = "";

    // Get the values from text and date input
    const textDate = document.getElementById("dateSearch").value;
    const dateInput = document.getElementById("apod-date-input").value;

    // Check if both inputs are empty
    if (!textDate && !dateInput) {
        // Reload the page if both inputs are empty
        location.reload();
        return;
    }

    // Use the selected date or formatted date from the inputs
    const selectedDate = textDate || formatDate();

    let request = `https://api.nasa.gov/planetary/apod?date=${selectedDate}&api_key=${apiKey}`;

    try {

        const response = await fetch(request);
        const myJSON = await response.json();
        
        //Create elements
        const image = document.createElement("img");
        image.classList.add("apod-img");
        image.src = myJSON.url;

        const imageTitle = document.createElement("p");
        imageTitle.classList.add("apod-title");
        imageTitle.innerHTML = myJSON.title;

        const imageDate = document.createElement("p");
        imageDate.classList.add("apod-date");
        imageDate.innerHTML = myJSON.date;

        const description = document.createElement("p");
        description.classList.add("apod-description");
        description.innerHTML = myJSON.explanation;

        //Append elements
        const tile = document.createElement("div");
        tile.classList.add("image-tile");

        tile.appendChild(image);
        tile.appendChild(imageTitle);
        tile.appendChild(imageDate);
        tile.appendChild(description);

        container.appendChild(tile);

        // Update the title
        titleContainer.textContent = `Search Result for ${selectedDate}`;

    } catch (error) {
        console.error("Error fetching data from NASA API:", error);
    }
}

// Return Range of Days From yesterday's Date
async function getNASARange() {

    const container = document.getElementById("apod-container");
    const slider = document.getElementById("myRange");
    const sliderValueElement = document.getElementById("sliderValue");
    const titleContainer = document.getElementById("tiles-title");

    try {

        const dates = []; //range of dates array
        const today = new Date();
        const numberOfImages = slider.value;

        
        sliderValueElement.textContent = `Days: ${numberOfImages}`;
        titleContainer.textContent = `Pictures from the last ${numberOfImages} day/s.`;

        for (let i = 1; i <= numberOfImages; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            dates.push(date.toISOString().split("T")[0]);
        }

        // Clear previous content in the image container
        container.innerHTML = "";

        for (const date of dates) {

            const request = `https://api.nasa.gov/planetary/apod?date=${date}&api_key=${apiKey}`;
            const response = await fetch(request);
            const myJSON = await response.json();
            
            //Create elements
            const image = document.createElement("img");
            image.classList.add("apod-img");
            image.src = myJSON.url;

            const imageTitle = document.createElement("p");
            imageTitle.classList.add("apod-title");
            imageTitle.innerHTML = myJSON.title;

            const imageDate = document.createElement("p");
            imageDate.classList.add("apod-date");
            imageDate.innerHTML = myJSON.date;

            const description = document.createElement("p");
            description.classList.add("apod-description");
            description.innerHTML = myJSON.explanation;
            
            //Append elements
            const tile = document.createElement("div");
            tile.classList.add("image-tile");
            
            tile.appendChild(image);
            tile.appendChild(imageTitle);
            tile.appendChild(imageDate);
            tile.appendChild(description);

            container.appendChild(tile);
        }
    } catch (error) {
        console.error("Error fetching data from NASA API:", error);
    }
}

//Slider Configuration
const slider = document.getElementById("myRange");
const sliderValueElement = document.getElementById("sliderValue");

//Update slider real-time
slider.oninput = function () {
    sliderValueElement.innerHTML = "Days: " + this.value;
};

//Listener then call getNASARange
slider.addEventListener("change", getNASARange);

//Display getNASARange by default
document.addEventListener("DOMContentLoaded", function () {
    getNASARange();
});
