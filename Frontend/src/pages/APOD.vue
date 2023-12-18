<template>

    <q-layout view="lHh Lpr lFf" class="all-container">

      <q-header reveal elevated class="header shadow-4">
        <q-toolbar>

          <q-btn flat @click="drawer = !drawer" round dense icon="menu"></q-btn>

          <q-toolbar-title class=" row items-center q-pa-md text-bold header-title">
            <img src="../assets/NASA_logo.svg.png" alt="nasa_logo" class="nasa_logo" />
            A.P.O.D API
          </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="drawer"
        elevated
        :width="200"
        style="background: rgb(234, 234, 234)"
      >

      <div>
        <q-toolbar-title style="margin-top: 5px; margin-left: 12px; font-size: 30px; font-family: Oswald; font-weight: bold; color: rgb(0, 0, 0);">
            A.P.O.D Menu
        </q-toolbar-title>
      </div>

      <div style="height: 11px; background: linear-gradient(90deg, rgba(0, 0, 0, 0.91) 14%, rgba(154, 46, 216, 0.506) 100%);"></div>

      <q-list>
          <q-item clickable v-close-popup>
            <q-item-section>
              <q-item-label>
                <q-icon name="build" size="20px" style="margin-right: 8px;"></q-icon>
                <a href="https://www.nasa.gov/" target="_blank">Check out NASA</a>
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section>
              <q-item-label>
                <q-icon name="info" size="20px" style="margin-right: 8px;"></q-icon>
                <a href="https://api.nasa.gov/" target="_blank">About API</a>
              </q-item-label>
            </q-item-section>
          </q-item>
      </q-list>


      </q-drawer>

      <q-page-container>

          <div class="row justify-center search-bar q-gutter-md">

              <!--Input Search-->
              <div class="input-container">
                <q-input
                  @keyup.enter="triggerDateSearch"
                  class="custom-outlined-input rounded shadow-3 "
                  v-model="textDateSearch"
                  outlined
                  filled
                  style="width: 300px;"
                  :class="{ 'error': textDateSearch.length > 10, 'default' : textDateSearch.length < 9}"
                  color="purple"
                  dark
                  bg-color="black"
                >

                  <template v-slot:prepend>
                    <q-btn flat @click="triggerDateSearch" round dense icon="search" color="white"></q-btn>
                  </template>
                  <template v-slot:append>
                    <q-btn @click="toggleDatePicker" rounded color="accent" label="Date Picker"></q-btn>
                  </template>

                </q-input>

              </div>

              <!--Date Picker-->
              <div :class="{ 'date-picker-wrapper': showDatePicker }">

                <q-date
                  v-show="showDatePicker"
                  v-model="textDateSearch"
                  mask="YYYY-MM-DD"
                  style="margin-top: 10px; margin-left: 10px;"
                  @input="onDateChange"
                  color="purple"
                />

              </div>


              <!--Range Slider-->
              <div class="row day-range shadow-3">

                <p style="font-size: 23px; margin: 0; margin-right: 20px; font-family: Oswald;">Day Range</p>

                <q-slider
                  v-model="sliderValue"
                  :min="minValue"
                  :max="maxValue"
                  :step="stepValue"
                  :label="true"
                  label-always
                  color="purple"
                  style="width: 150px;"
                  @change="onSliderChange"
                  switch-label-side
                  track-color="white"
                />

              </div>
          </div>

          <div class="body-container row">
            <h1 id="body-title" class="text-bold">{{ getBodyTitle() }}</h1>
          </div>

          <q-list class="tile-container row q-gutter-sm q-pa-md justify-center">

            <q-item v-for="day in apod" :key="day.date">

              <q-card class="image-tile shadow-7 rounded">

                <div class="apod-img-container">

                  <img
                    :src="getImageUrl(day.date)"
                    style="width: 100%; height: 300px; object-fit: cover; color: azure;"
                    class="apod-img"
                    alt="NASA APOD Picture (Not Available)"

                  />

                </div>

                <q-card-section class="apod-title">{{ getImageTitle(day.date) }}</q-card-section>
                <q-card-section class="apod-date">{{ day.date }}</q-card-section>
                <q-card-section class="apod-description">{{ getImageDescription(day.date) }}</q-card-section>

              </q-card>
            </q-item>
          </q-list>

      </q-page-container>

      <q-footer reveal elevated class="footer row" style="padding: 0;">

        <q-toolbar>

          <q-toolbar-title class="text-subtitle1" style="font-family: Oswald;">
            © CPR 2K23 | ITWM101 | VUE X QUASAR
          </q-toolbar-title>

          <div class="footer-icons-container">

            <a href="https://github.com/CPR03/ITWM101_SEMIFINALS_API_ROSALES" target="_blank"><img class="footer-icons" src="../assets/Icons/github-logo_icon.png" alt=""></a>
            <img class="footer-icons" id="javaScriptLogo" src="../assets/Icons/javascript_logo_icon.png" alt="">
            <img class="footer-icons" src="../assets/Icons/html_logo_icon.png" alt="">
            <img class="footer-icons" src="../assets/Icons/css3-02_icon.png" alt="">

          </div>
        </q-toolbar>
      </q-footer>

      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>

</template>

<script setup>
import { ref, onBeforeMount } from 'vue';

const apiKey = 'sNm6IyDodvc4td89Y8nSy6qn3nmf5MserXhb8bc2'; //API KEY

const apod = ref([]); // APOD Data List (Image, Title, Date, and Description)
const textDateSearch = ref('');
const selectedDate = ref(null);
const showDatePicker = ref(false);
const drawer = ref(false);

const sliderValue = ref([1]); // Initial values for the range slider
const minValue = ref(0); // Minimum value of the slider
const maxValue = ref(50); // Maximum value of the slider
const stepValue = ref(1); // Step value for the slider

//Slider Function
function onSliderChange() {

  textDateSearch.value = "" //Reset Text Input if Slider is used

  // Clear previous search results
  apod.value = [];

  // Fetch APOD images for the selected date range
  const today = new Date();
  const endDate = new Date(); // Today's date
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - sliderValue.value); // Adjust the date based on the slider value

  const fetchPromises = [];

  if(sliderValue.value){

    while (startDate < endDate) {
    const formattedDate = formatDate(startDate);
    fetchPromises.push(getNASA(formattedDate));
    startDate.setDate(startDate.getDate() + 1); // Move to the next day
    }

  }

  else{
    triggerDateSearch(); //If slider value is 0
  }

  // Wait for all fetch requests to complete before updating apod
  Promise.all(fetchPromises).then(() => {
    // Sort the apod list by date in descending order
    apod.value.sort((a, b) => new Date(b.date) - new Date(a.date));
  });
}

function toggleDatePicker() {
  showDatePicker.value = !showDatePicker.value;
}

async function getNASA(day) {
  try {
    const response = await fetch(`https://api.nasa.gov/planetary/apod?date=${day}&api_key=${apiKey}`);
    const myJSON = await response.json();
    apod.value.push(myJSON);
  } catch (error) {
    console.error('Error fetching data from NASA API:', error);
  }
}

//Get APOD Image URL
function getImageUrl(day) {
  const imageData = getImageData(day);
  return imageData ? imageData.url : '';
}

//Get APOD Title
function getImageTitle(day) {
  const imageData = getImageData(day);
  return imageData ? imageData.title : '';
}

//Get APOD Image Description
function getImageDescription(day) {
  const imageData = getImageData(day);
  return imageData ? imageData.explanation : '';
}

//Get APOD Image Date
function getImageData(day) {
  return apod.value.find(image => image.date === day);
}

//APOD Date Search with Date Picker
function triggerDateSearch() {

  sliderValue.value = 0; //Reset Slider Value if Text Input is used
  apod.value = []; // Clear previous search results

  if (textDateSearch.value) {

    // Check if the value is in the format "YYYY-MM-DD"
    if (!isValidDateFormat(textDateSearch.value)) {
      alert('Please enter a valid date format (YYYY-MM-DD).');
      return;
    }

    // If there is a value in textDateSearch and it's in the correct format, fetch data for that date
    getNASA(textDateSearch.value);

  } else {
    // Otherwise, fetch data for the last three days
    const today = new Date();
    const fetchPromises = [];

    for (let i = 1; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const formattedDate = formatDate(date);
      fetchPromises.push(getNASA(formattedDate));
    }

    // Wait for all fetch requests to complete before updating apod
    Promise.all(fetchPromises).then(() => {
      // Sort the apod list by date in descending order
      apod.value.sort((a, b) => new Date(b.date) - new Date(a.date));
    });
  }
}

//Date Format Checker
function isValidDateFormat(date) {
  const regex = /^\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[01])$/;
  if (!regex.test(date)) {
    return false;
  }

  const [year, month, day] = date.split('-').map(Number);

  // Check if month is between 1 and 12
  if (month < 1 || month > 12) {
    return false;
  }

  // Check if day is valid for the given month
  const lastDayOfMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > lastDayOfMonth) {
    return false;
  }

  return true;
}

//Format the Date Picker
function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

//Body Title Dynamic Update
function getBodyTitle() {

  //TextDateSearch is not null
  if(textDateSearch.value){

    if (!isValidDateFormat(textDateSearch.value))
    //Input date format is invalid
    return `Picture from ${textDateSearch.value} (Invalid Date)`;

    else if (isValidDateFormat(textDateSearch.value))
      return `Picture from ${textDateSearch.value}`;

  }

  //Slider Body Title
  else if (sliderValue.value)
    return `Picture/s from the last ${sliderValue.value} day/s`;

  //Default Body Title
  else {
    return `Pictures from the last 3 days`;
  }

}

//Format textInput Date
function onDateChange() {
  if (selectedDate.value) {
    textDateSearch.value = formatDate(selectedDate.value);
  } else {
    textDateSearch.value = '';
  }
}

//Run triggerDateSearch by default
onBeforeMount(() => {
  triggerDateSearch();
});

</script>

<style scoped>

a{
  text-decoration: none;
  color: rgb(0, 0, 0);
  font-size: 15px;
  font-weight: 500;
}

.all-container {
  background-image: url('../assets/space_background_img.jpg');
  background-size: cover;
  background-position: center;
}

.image-tile{
  background-color: rgba(254, 254, 254, 0.092);
  transition: transform 0.3s ease;
  width: 480px;
  @media (max-width: 600px) {
    width: 380px;
  }
}

.image-tile:hover{
  transform: scale(1.05);
}

@media (max-width: 700px) {
  .image-tile:hover {
    transform: none;
  }
}

.rounded {
  border-radius: 20px;
  overflow: hidden;
}

.header,
.footer {
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.91) 14%, rgba(154, 46, 216, 0.506) 100%);
}

.header-title {
  padding: 10px;
  font-size: 30px;
  font-family: Oswald;
  @media (max-width: 600px) {
      font-size: 20px;
  }
}

.nasa_logo {
  width: 75px;
  @media (max-width: 600px) {
      width: 50px;
  }
}

.apod-title, .apod-date, .apod-description{
  color: azure;
}

.apod-title {
  margin: 0;
  font-size: 37px;
  font-family: Oswald;
  font-weight: bold;
}

.apod-date{
  font-size: 22px;
}

.apod-description{
  text-align: justify;
  text-indent: 20px;
  padding: 24px;
  font-size: 15px;
}

.body-container{
  margin-top: 40px;
    @media (max-width: 900px) {
      align-items: center;
      justify-content: center;
  }
}

#body-title{
  margin: 0;
  font-size: 50px;
  font-family: Oswald;
  margin-left: 15px;
  color: azure;
  margin-bottom: 20px;
  @media (max-width: 600px) {
      margin-left: 0px;
      font-size: 35px;
  }
}

.error{
  color: rgb(255, 0, 0);
  background-color: pink;
}

.default{
  color: rgb(0, 0, 0);
  background-color: rgb(255, 255, 255);
}

.search-bar {
  padding-top: 50px;
  align-items: center;
}

.date-picker-wrapper {
  position: absolute;
  top: 160px;
  z-index: 999;
}

.day-range{
  background-color: rgb(0, 0, 0);
  padding-bottom: 10px;
  border-radius: 15px;
  align-items: center;
  padding: 11.5px;
  color: azure;
  @media (max-width: 800px) {
    margin-right: 13px;
  }
}

.input-container, .day-range{
  border: solid white;
  border-radius: 20px;
}

.footer-icons{
  width: 30px;
  filter: invert(100%);
}

</style>
