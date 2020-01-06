<template>
  <transition name="fade slide">
    <div class="Download">
      <v-row>
        <v-col class="headline">
          <div class="text-center">
            <span
              class="font-weight-thin"
            >Uploaded: {{formatUploadDate(files[0].created_at)}} | Deleting: {{formatDeleteDate(files[0].created_at)}}</span>
          </div>
        </v-col>
      </v-row>
      <v-row max-width="1280">
        <v-col
          class="display-1 font-weight-thin mr-auto"
        >{{files.length}} File(s) | {{getFileSize(totalBytes)}} total</v-col>
        <v-col v-if="isCompressing" class="display-1 text-center font-weight-thin">
          Compressing files...
          <v-progress-circular indeterminate color="purple" :width="2" :size="30" />
        </v-col>
        <v-col v-if="isGettingDownload" class="display-1 text-center font-weight-thin">
          Preparing download
          <v-progress-circular indeterminate color="purple" :width="2" :size="30" />
        </v-col>
        <v-col v-if="files.length > 1" class="display-1 text-right">
          <v-btn v-if="!isCompressing" large color="purple darken-3" @click="downloadZIP">
            Download All
            <v-icon right>archive</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <hr />
      <br />
      <v-row>
        <v-col align="center" justify="center">
          <v-banner max-width="1280" class="files" v-for="file in files" :key="file.id">
            <v-avatar slot="icon" color="purple darken-3" size="40">
              <v-icon color="white">insert_photo</v-icon>
            </v-avatar>
            {{file.originalName}}
            <!-- <br /> -->
            <div class="text-left" text v-text="getFileSize(file.size)"></div>
            <!-- download button -->
            <template v-slot:actions>
              <v-tooltip top>
                <template v-slot:activator="{on}">
                  <v-btn text icon v-on="on" large @click="downloadFile(file)">
                    <v-icon>cloud_download</v-icon>
                  </v-btn>
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
  </transition>
</template>

<script>
import axios from "axios";
export default {
  props: ["id"], //get the id of the upload
  data: () => ({
    files: [],
    totalBytes: 0,
    isCompressing: false,
    isGettingDownload: false
  }),
  created: function() {
    this.getFiles();
  },
  methods: {
    formatUploadDate(date) {
      var options = { year: "numeric", month: "long", day: "numeric" };
      var newDate = new Date(date);
      return newDate.toLocaleDateString("en-US", options);
    },
    formatDeleteDate(date) {
      var options = { year: "numeric", month: "long", day: "numeric" };
      var newDate = new Date(date);
      newDate.setDate(newDate.getDate() + 2);
      return newDate.toLocaleDateString("en-US", options);
    },
    getTotalUploadSize() {
      this.files.forEach(file => {
        this.totalBytes += file.size;
      });
    },
    getFileSize(size) {
      const fSExt = ["Bytes", "KB", "MB", "GB"];
      let i = 0;
      while (size > 900) {
        size /= 1024;
        i++;
      }
      return `${Math.round(size * 100) / 100} ${fSExt[i]}`;
    },
    getFiles() {
      fetch(`http://test.test/api/upload/${this.id}`)
        .then(res => res.json())
        .then(res => {
          this.files = res.data;
          this.getTotalUploadSize();
        });
    },
    downloadFile(file) {
      this.isGettingDownload = true;
      axios({
        url: `http://test.test/api/downloadfile/${file.id}`,
        method: "GET",
        responseType: "blob"
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", file.originalName);
        document.body.appendChild(fileLink);
        fileLink.click();
        this.isGettingDownload = false;
      });
    },
    downloadZIP() {
      this.isCompressing = true;
      axios({
        url: `http://test.test/api/downloadzip/${this.id}`,
        method: "GET",
        responseType: "blob"
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", "download.zip");
        document.body.appendChild(fileLink);
        fileLink.click();
        this.isCompressing = false;
      });
    }
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
}
.download {
  background-color: #808080;
}

/* Transitions */
.slide-fade-enter-active {
  transition: all 0.1s ease;
}
.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>