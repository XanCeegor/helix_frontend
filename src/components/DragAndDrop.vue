<template>      
    <v-layout row wrap>
     <v-row justify="center" align="center">
      <div id="file-drag-drop">
        <v-card max-width="750px">
          <v-card-title class="justify-center">Dump your files below</v-card-title>
          <v-card-text>
            <v-form id="fileform">
              <span class="drop-files">Drop the files here!</span>
            </v-form>
            <div v-for="(file) in files" :key="file.name">
              <v-banner two-line>
                <v-avatar slot="icon" color="purple darken-3" size="40">
                  <v-icon color="white">insert_photo</v-icon>
                </v-avatar>
                  {{file.name}}
                  <br>
                  {{file.size/100}} KB
                <template v-slot:actions>
                  <v-btn class="ma-2" color="red darken-3" dark @click="removeFile(key)">Remove
                    <v-icon dark right>delete</v-icon>
                  </v-btn>
                </template>
              </v-banner>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="submitFiles()" v-show="files.length > 0" color="purple darken-3">Upload
              <v-icon right>cloud_upload</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-progress-linear rounded indeterminate color="purple darken-3" v-if="uploadPercentage > 0 && files.length > 0" max="100" :value.prop="uploadPercentage"></v-progress-linear>
      </div>
    </v-row>
  </v-layout>
</template>

<script>
import axios from 'axios';
  export default {
    data(){
      return {
        dragAndDropCapable: false,
        files: [],
        uploadPercentage: 0,
      }
    },
    mounted(){
      this.dragAndDropCapable = this.determineDragAndDropCapable();
      if( this.dragAndDropCapable ){
        ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach( function(event) {
          document.querySelector('#fileform').addEventListener(event, function(e){
            e.preventDefault();
            e.stopPropagation();
          }.bind(this), false);
        }.bind(this));
        document.querySelector('#fileform').addEventListener('drop', function(e){
          for(let i = 0; i < e.dataTransfer.files.length; i++){
            // let n = e.dataTransfer.files[i].type;
            if(e.dataTransfer.files[i].type.includes("image")){
              this.icon = 'insert_photo';
            }
            else if(e.dataTransfer.files[i].type.includes("compressed") || e.dataTransfer.files[i].type.includes("zip")){
              this.icon = 'folder';
            }
            
            this.files.push(e.dataTransfer.files[i]);
            this.getImagePreviews();
          }
        }.bind(this));
        document.querySelector('#fileform').on('drop')
      }
    },
    methods: {
      // Alerts
      successAlert() {
        this.$swal("Files successfully uploaded!", "", "success");
      },
      determineDragAndDropCapable(){
        var div = document.createElement('div');
        return ( ( 'draggable' in div )
                || ( 'ondragstart' in div && 'ondrop' in div ) )
                && 'FormData' in window
                && 'FileReader' in window;
      },
      //gets the image preview for the file.
      getImagePreviews(){
        for(let i = 0; i < this.files.length; i++){
          if(/\.(jpe?g|png|gif)$/i.test(this.files[i].name)){
            let reader = new FileReader();
            reader.addEventListener("load", function(){
              this.$refs['preview'+parseInt( i )][0].src = reader.result;
            }.bind(this), false);
            reader.readAsDataURL( this.files[i] );
          }else{
            this.$nextTick(function(){
              this.$refs['preview'+parseInt( i )][0].src = '/images/file.png';
            });
          }
        }
      },
      submitFiles(){
        let formData = new FormData();
        for(var i = 0; i < this.files.length; i++){
          let file = this.files[i];
          formData.append('files[' + i + ']', file);
        }
        axios.post( '/file-drag-drop',
          formData,
          {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: function(progressEvent) {
                this.uploadPercentage = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total));
            }.bind(this)
          }
        ).then(function(){
          this.successAlert();
        })
        .catch(function(){
        });
      },
      removeFile( key ){
        this.files.splice( key, 1 );
      }
    }
  }
</script>

<style>
  form{
    display: block;
    height: 400px;
    width: 450px;
    background: #424242;
    margin: auto;
    margin-top: 40px;
    text-align: center;
    line-height: 400px;
    border-radius: 4px;
  }

  div.file-listing{
    width: 400px;
    margin: auto;
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }

  a.submit-button{
    display: block;
    margin: auto;
    text-align: center;
    width: 200px;
    padding: 10px;
    text-transform: uppercase;
    background-color: #CCC;
    color: white;
    font-weight: bold;
    margin-top: 20px;
  }
</style>