<template>
  <v-app>
    <Navbar/>
    <v-container >
    <!-- <v-row align="center" justify="center">
      <v-col lg10 xs10> -->
        <router-view/>
      <!-- </v-col>
    </v-row> -->
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
