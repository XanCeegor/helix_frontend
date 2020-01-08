<template>
  <div>
    <DragAndDrop @filesAdded="updateFileCount" />

    <v-container v-if="fileCount == 0">
      <hr />
      <br />
      <v-row justify="center" class="text-center">
        <div class="display-2">
          What is
          <span class="font-weight-thin">Helix</span>
        </div>
      </v-row>
      <br />
      <v-row justify="center" class="text-center">
        <div>
          <span class="font-weight-thin">Helix</span> is a simple, anonymous and free temporary file hosting and sharing site for small files. Uploads are deleted after 48 hours.
          <div>File sizes are capped at 250MB per file and the number of files per upload can be up to 50 files. Total upload size of all files is capped at 500MB.</div>
        </div>
      </v-row>
      <br />
      <v-row class="text-center mt-5">
        <v-col>
          <v-avatar color="grey darken-2" size="100">
            <v-icon size="64">mdi-incognito</v-icon>
          </v-avatar>
          <div class="display-1 font-weight-light mt-3">Anonymous</div>
          <div
            class="body-1 font-weight-light mt-2"
          >We don't keep any logs of your computer or you uploaded files. We only store meta-data related to the files you upload, but we do not store any personal information related to you.</div>
        </v-col>
        <v-col>
          <v-avatar color="grey darken-2" size="100">
            <v-icon size="64">mdi-lock</v-icon>
          </v-avatar>
          <div class="display-1 font-weight-light mt-3">Secure</div>
          <div
            class="body-1 font-weight-light mt-2"
          >All uploaded files are encrypted. Meaning that no one will be able to access your files unless you provide them with the download link. Your files are decrypted before being downloaded.</div>
        </v-col>
        <v-col>
          <v-avatar color="grey darken-2" size="100">
            <v-icon size="64">mdi-timer</v-icon>
          </v-avatar>
          <div class="display-1 font-weight-light mt-3">Temporary</div>
          <div class="body-1 font-weight-light mt-2">
            All files stored on
            <span class="font-weight-thin">Helix</span> are temporary. Files are permanently deleted from our servers 48 hours after being uploaded.
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import DragAndDrop from "../components/DragAndDrop";

export default {
  components: {
    DragAndDrop
  },
  data: () => ({
    fileCount: 0
  }),
  methods: {
    updateFileCount(e) {
      this.fileCount = e;
    }
  }
};
</script>
