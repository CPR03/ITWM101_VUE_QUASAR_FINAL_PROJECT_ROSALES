<template>
  <q-layout view="lHh Lpr lFf" class="all-container">
    <div class="title-container">
      <h1 class="title q-mb-md q-pt-md q-mt-0 text-h2 text-h4-md">
        A.P.O.D. API
      </h1>
      <p class="para q-mb-md text-body1 text-h6-md">
        Powered by Vue and Quasar
      </p>
    </div>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.title-container {
  padding-left: 50px;
  display: flex;
  flex-direction: column;
}

.title {
  margin-bottom: 100px;
  padding-top: 100px;
  margin-top: 0;
  font-family: Oswald;
  font-size: 15rem;
  color: white;
}

.para {
  font-size: 2rem;
  color: white;
}

.all-container {
  background-image: url('../assets/quasar-gif.gif');
  background-size: cover;
  background-position: center;
}

.video {
  padding: 100px;
}
</style>
