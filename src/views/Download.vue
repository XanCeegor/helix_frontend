<template>
  <div class="Download">
    <v-row>
        <v-col class="display-1">
            <div class="text-center display-3">
                <span class="font-weight-thin">Helix</span>
            </div>
        </v-col>
    </v-row>
    <v-row>
        <v-col class="headline">
            <div class="text-center">
                <span class="font-weight-thin">
                    Uploaded: 21 Sept 2019 | Deleting: 28 Sept 2019
                </span> 
            </div>
        </v-col>
    </v-row>
    <v-row max-width="1280">
        <v-col cols="auto" class="display-1 font-weight-thin mr-auto">
            5 File(s) | 230.34 MB total
        </v-col>
        <v-col cols="auto" class="display-1 text-right">
            <v-btn large color="purple darken-3">Download All
            <v-icon right>archive</v-icon>
            </v-btn>
        </v-col>
    </v-row>
    <hr>
    <br>
    <v-row>
        <v-col align="center" justify="center">
            <v-banner max-width="1280" class="files">
                <v-avatar slot="icon" color="purple darken-3" size="40">
                    <v-icon color="white">insert_photo</v-icon>
                </v-avatar>
                    thisismyoriginalfilename.jpg
                    <br>
                    <span class="size" v-text="getFileSize()"></span>
                <template v-slot:actions>
                    <!-- download button -->
                    <v-tooltip top>
                        <template v-slot:activator="{on}">
                        <v-btn text icon v-on="on" large><v-icon >cloud_download</v-icon></v-btn>
                        </template>
                        <span>Download</span>
                    </v-tooltip>
                </template>
            </v-banner>
            
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
    props: ['id'],  //get the id of the upload
    data: () => ({
        
    }),
    methods: {
        getFileSize(){
            return '12.34 MB'
        }
    }
}
</script>

<style scoped>
a{
  text-decoration: none;
}
.download{
  background-color: #808080;
}
</style>