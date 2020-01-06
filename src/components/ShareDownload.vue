<template>
  <div class="ShareDownload">
    <v-row class="mt-5">
      <v-col lg12 align="center" justify="center">
        <v-card class="card" max-width="1280">
          <v-card-title class="justify-center">Files uploaded. Now share them!</v-card-title>
          <v-card-text>
            <v-row class="download mx-10 my-3">
              <v-col
                cols="auto"
                class="text-left display-1 ml-5 mr-auto"
              >https://helix.co/download/{{downloadID}}</v-col>
              <v-col cols="auto" class="text-right">
                <!-- copy button -->
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      text
                      icon
                      v-on="on"
                      v-clipboard:copy="downloadID"
                      @click="snackBar = true"
                    >
                      <v-icon>file_copy</v-icon>
                    </v-btn>
                  </template>
                  <span>Copy</span>
                </v-tooltip>
                <!-- Download button -->
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <router-link :to="{name: 'download', params: { id: downloadID}}">
                      <v-btn text icon v-on="on">
                        <v-icon>arrow_forward</v-icon>
                      </v-btn>
                    </router-link>
                  </template>
                  <span>Go to Download</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar top v-model="snackBar">
      Download link copied to clipboard!
      <v-btn color="pink" text @click="snackBar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  props: ["downloadID"],
  data: () => ({
    snackBar: false
  })
};
</script>

<style scoped>
a {
  text-decoration: none;
}
.download {
  background-color: #808080;
  border-radius: 10px;
  color: white;
}
.card {
  border-radius: 15px;
}
</style>