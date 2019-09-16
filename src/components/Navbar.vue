<template>
  <div>
    <v-app-bar color="purple darken-3" dark>
      <v-toolbar-title class="font-weight-thin">Helix</v-toolbar-title>

      <div class="flex-grow-1"></div>

      <v-btn color="purple">
          Sign In
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-menu left bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-for="n in 5" :key="n" @click="() => {}">
            <v-list-item-title>Option {{ n }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>