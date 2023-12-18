<template>
  <q-page padding>
    <input
      v-model="message"
      @keyup.esc="message = 'Esc'"
      @keyup.enter="message = 'Enter'"
      :class="{'error' : message.length > 10}"
    />

    <button @click="clearMessage">Clear</button>

    <h5>{{ messageLowerTest(message) }}</h5>

  </q-page>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({

  data() {
    return {
      message: '',

    };
  },

  computed: {
    messageLowerTest (){
      return (value) => value.toLocaleLowerCase()
    },

  },

  methods: {
    clearMessage() {
      this.message = '';
    },
  },

});
</script>

<style>

.error{
  color: red;
  background-color: pink;
}

</style>
