<template>
  <div>
    <v-app-bar color="purple darken-3" dark>
      <v-spacer></v-spacer>
      <v-toolbar-title class="font-weight-thin display-1">{{title}}</v-toolbar-title>
      <div class="flex-grow-1"></div>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  data: () => ({
    title: process.env.VUE_APP_TITLE
  })
};
</script>