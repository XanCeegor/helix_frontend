<template>
<div>
  <!-- <v-row>
    <v-col class="display-1">
      <div class="text-center display-3">
        Welcome to <span class="font-weight-thin">Helix</span>
      </div>
    </v-col>
  </v-row> -->
  <br>
  <transition name="fade slide">
    <v-row v-if="isUploading === false && doneUploading === false">
      <v-col>
        <div id="file-drag-drop" class="uploader"
        @dragenter="onDragEnter"
        @dragleave="onDragLeave"
        @dragover.prevent
        @drop="onDrop"
        :class="{dragging: isDragging}">
          <div>
            <v-icon size="85">backup</v-icon><br>
            <p>Drag & drop your files here</p>
            <div>OR</div>
            <div class="file-input">
                <label for="file">Select a file</label>
                <input type="file" id="file" @change="onInputChange" multiple>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </transition>
  <div v-show="files.length > 0">
    <v-row>
      <v-col lg4 class="display-1 font-weight-thin">
        Files to Upload
      </v-col>
      <v-col class="display-1 text-center font-weight-thin">
        {{files.length}} File(s) | {{totalSize}} total
      </v-col>
      <v-col lg4 class="display-1 text-right">
        <v-btn v-if="!isUploading" large @click="upload()" color="purple darken-3">Upload
          <v-icon right>cloud_upload</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <hr>
    <br>
    <v-row v-if="isUploading">
      <v-col lg12>
        <div class="text-center mb-2">
          Uploading... {{uploadPercentage}}%
        </div>
        <v-progress-linear rounded height="10" color="purple darken-3" max="100" :value="uploadPercentage"></v-progress-linear>
      </v-col>
    </v-row>
  </div>
  <div v-for="(file, index) in files" :key="index" >
    <v-banner class="files" two-line >
      <v-avatar slot="icon" color="purple darken-3" size="40">
        <v-icon color="white">insert_photo</v-icon>
      </v-avatar>
        {{file.name}}
        <br>
        <span class="size" v-text="getFileSize(files[index].size)"></span>
      <template v-slot:actions>
        <v-btn class="ma-2" color="red darken-3" v-if="!isUploading" dark @click="removeFile(index)">Remove
          <v-icon dark right>delete</v-icon>
        </v-btn>
      </template>
    </v-banner>
  </div>
  <!-- ShareDownload component -->
  <transition name="fade">
    <ShareDownload :downloadID="downloadID" v-if="doneUploading"/>
  </transition>
</div>
</template>

<script>
import axios from 'axios';
import ShareDownload from "./ShareDownload";
  export default {
    components: {
      ShareDownload
    },
    data: () => ({
        isDragging: false,
        dragCount: 0,
        files: [],
        uploadPercentage: 0,
        isUploading: false,
        totalBytes: 0,
        downloadID: '',
        doneUploading: false,
        
    }),
    computed: {
      totalSize: function(){
        return this.getFileSize(this.totalBytes);
      }
    },
    methods: {
      onDragEnter(e){
        e.preventDefault();
        this.dragCount++;
        this.isDragging = true;
      },
      onDragLeave(e){
        e.preventDefault();
        this.dragCount--;
        if (this.dragCount <= 0)
          this.isDragging = false;
      },
      onDrop(e){
        e.preventDefault();
        e.stopPropagation();
        this.isDragging = false;
        const types = ['application/x-tar'];
        const files = e.dataTransfer.files;
        Array.from(files).forEach(file => {
          console.log(file.type);
          this.files.push(file);
          this.totalBytes += file.size;
        })
      },
      onInputChange(e) {
        const files = e.target.files;
        Array.from(files).forEach(file => {
          this.totalBytes += file.size;
          this.files.push(file);
        });
      },
      removeFile(index){
        this.totalBytes -= this.files[index].size;
        this.files.splice(index, 1);
      },
      getFileSize(size){
        const fSExt = ['Bytes', 'KB', 'MB', 'GB'];
        let i = 0;
        while(size > 900) {
          size /= 1024;
          i++;
        }
        return `${(Math.round(size * 100) / 100)} ${fSExt[i]}`;
      },
      upload(){
        this.isUploading = true;
        const formData = new FormData();
        
        this.files.forEach(file => {
            formData.append('files[]', file, file.name);
        });
        axios.post('http://127.0.0.1:8000/api/upload', formData,
          {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: function( progressEvent ) {
              this.uploadPercentage = parseInt( Math.round( ( progressEvent.loaded * 100 ) / progressEvent.total ) );
            }.bind(this)
          })
          .then(response => {
              this.downloadID = response.data['success'];
              this.files = [];
              this.uploadPercentage = 0;
              this.totalBytes = 0;
              this.isUploading = false;
              this.doneUploading = true;
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
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
.slide-fade-enter-active {
  transition: all .6s ease;
}
.slide-fade-leave-active {
  transition: all .6s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .8s
}

.fade-enter,
.fade-leave-to {
    opacity: 0
}
</style>