<template>
  <div>
    <!-- <v-row>
      <v-col class="display-1">
        <div class="text-center display-3">
          Welcome to
          <span class="font-weight-thin">Helix</span>
        </div>
      </v-col>
    </v-row>
    <br />-->

    <v-row v-if="isUploading === false && doneUploading === false">
      <v-col>
        <div
          id="file-drag-drop"
          class="uploader"
          @dragenter="onDragEnter"
          @dragleave="onDragLeave"
          @dragover.prevent
          @drop="onDrop"
          :class="{dragging: isDragging}"
        >
          <div>
            <v-icon size="85">backup</v-icon>
            <br />
            <p>Drag & drop your files here</p>
            <div>OR</div>
            <div class="file-input">
              <label for="file">Select a file</label>
              <input type="file" id="file" @change="onInputChange" multiple />
            </div>
            <div class="font-weight-light body-2 mt-2">
              Max file size:
              <span class="font-weight-regular">250MB</span>
            </div>
            <div class="font-weight-light body-2">Larger files will be ignored</div>
            <div class="font-weight-light body-2">
              Max total upload size:
              <span class="font-weight-regular">500MB</span>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <div v-show="files.length > 0">
      <v-row>
        <v-col lg4 class="display-1 font-weight-thin">Files to Upload</v-col>
        <v-col
          class="display-1 text-center font-weight-thin"
        >{{files.length}} File(s) | {{totalSize}} total</v-col>
        <v-col lg4 class="display-1 text-right">
          <v-btn
            v-if="(!isUploading) && (totalBytes < maxUploadSize) && (exeFiles.length === 0)"
            large
            @click="upload()"
            color="purple darken-3"
          >
            Upload
            <v-icon right>cloud_upload</v-icon>
          </v-btn>

          <!-- Warnings -->
          <div
            style="color: #c62828;"
            class="font-weight-thin"
            v-if="totalBytes >= maxUploadSize"
          >Max upload size is 500MB</div>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <div
                v-on="on"
                style="color: #c62828;"
                class="font-weight-thin"
                v-if="exeFiles.length > 0"
              >.exe files are not allowed</div>
            </template>
            <span>But you can add .exe files to an archive file (ZIP, 7Z, etc) and then upload them.</span>
          </v-tooltip>
        </v-col>
      </v-row>
      <hr />

      <v-row v-if="isUploading">
        <v-col lg12>
          <div
            v-if="uploadPercentage < 100"
            class="display-1 text-center font-weight-thin my-2"
          >Uploading... {{uploadPercentage}}%</div>
          <div v-if="uploadPercentage == 100" class="display-1 text-center font-weight-thin my-2">
            Processing files...
            <v-progress-circular class="ml-1" indeterminate :width="2" :size="30" color="purple"></v-progress-circular>
          </div>
          <v-progress-linear
            rounded
            height="10"
            color="purple darken-3"
            max="100"
            :value="uploadPercentage"
          ></v-progress-linear>
        </v-col>
      </v-row>
    </div>

    <!-- File list -->
    <div v-for="(file, index) in files" :key="index">
      <v-banner class="files" v-bind:class="{ exe: file.name.includes('.exe') }" two-line>
        <v-avatar slot="icon" color="purple darken-3" size="40">
          <v-icon color="white">insert_drive_file</v-icon>
        </v-avatar>
        {{file.name}}
        <br />
        <span class="size" v-text="getFileSize(files[index].size)"></span>
        <template v-slot:actions>
          <v-btn
            class="ma-2"
            color="red darken-3"
            v-if="!isUploading"
            dark
            @click="removeFile(index)"
          >
            Remove
            <v-icon dark right>delete</v-icon>
          </v-btn>
        </template>
      </v-banner>
    </div>
    <!-- ShareDownload component -->
    <transition name="fade">
      <ShareDownload :downloadID="downloadID" v-if="doneUploading" />
    </transition>
  </div>
</template>

<script>
import axios from "axios";
import ShareDownload from "./ShareDownload";
export default {
  components: {
    ShareDownload
  },
  data: () => ({
    isDragging: false,
    dragCount: 0,
    files: [],
    exeFiles: [],
    uploadPercentage: 0,
    isUploading: false,
    totalBytes: 0,
    maxUploadSize: 524288000, //Max 500mb upload size
    downloadID: "",
    doneUploading: false,
    url: process.env.VUE_APP_API_URL
  }),
  computed: {
    totalSize: function() {
      return this.getFileSize(this.totalBytes);
    }
  },
  methods: {
    onDragEnter(e) {
      e.preventDefault();
      this.dragCount++;
      this.isDragging = true;
    },
    onDragLeave(e) {
      e.preventDefault();
      this.dragCount--;
      if (this.dragCount <= 0) {
        this.isDragging = false;
      }
    },
    onDrop(e) {
      e.preventDefault();
      e.stopPropagation();
      this.isDragging = false;
      const files = e.dataTransfer.files;
      Array.from(files).forEach(file => {
        if (file.size < 260144000) {
          this.checkFileForExe(file); //.exe files are not allowed
          this.files.push(file);
          this.totalBytes += file.size;
        }
      });
      this.$emit("filesAdded", this.files.length);
    },
    onInputChange(e) {
      const files = e.target.files;
      Array.from(files).forEach(file => {
        if (file.size < 260144000) {
          this.checkFileForExe(file); //.exe files are not allowed
          this.totalBytes += file.size;
          this.files.push(file);
        }
      });
      this.$emit("filesAdded", this.files.length);
    },
    removeFile(index) {
      if (this.files[index].name.includes(".exe")) {
        const i = this.exeFiles.indexOf(this.files[index].name);
        this.exeFiles.splice(i, 1);
      }
      this.totalBytes -= this.files[index].size;
      this.files.splice(index, 1);
      this.$emit("filesAdded", this.files.length);
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
    upload() {
      this.isUploading = true;
      const formData = new FormData();
      this.files.forEach(file => {
        formData.append("files[]", file, file.name);
      });
      axios
        .post(`${this.url}/api/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: function(progressEvent) {
            this.uploadPercentage = parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            );
          }.bind(this)
        })
        .then(response => {
          this.downloadID = response.data["success"];
          this.files = [];
          this.uploadPercentage = 0;
          this.totalBytes = 0;
          this.isUploading = false;
          this.doneUploading = true;
        })
        .catch(function(error) {
          // handle error
          alert(error);
        });
    },
    checkFileForExe(file) {
      if (file.name.includes(".exe")) {
        this.exeFiles.push(file.name);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.exe {
  background-color: #781a1a;
}
.uploader {
  width: 100%;
  background: #444444;
  color: #fff;
  padding: 40px 15px;
  margin-top: 15px;
  margin-bottom: 10px;
  text-align: center;
  border-radius: 10px;
  font-size: 20px;
  position: relative;
  &.dragging {
    background: #555555;
  }
  .file-input {
    width: 200px;
    margin: auto;
    height: 68px;
    position: relative;
    label,
    input {
      background: #fff;
      color: #5a5a5a;
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      padding: 10px;
      border-radius: 4px;
      margin-top: 7px;
      cursor: pointer;
    }
    input {
      opacity: 0;
      z-index: -2;
    }
  }
}

// Transitions
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>