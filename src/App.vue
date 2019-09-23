<template>
  <v-app>
    <Navbar/>
    <v-container class="container">
      <router-view/>
    </v-container>
  </v-app>
</template>

<script>
import Navbar from './components/Navbar'
export default {
  name: 'App',
  components: {
    Navbar
  },
  data: () => ({
    //
  }),
};
</script>

<style >
.container{
  width: 85%;
}
</style>
