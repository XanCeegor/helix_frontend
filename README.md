# Helix - Frontend
Helix is a simple, anonymous and free temporary file hosting and sharing site for small files. Uploads are deleted after 48 hours.
File sizes are capped at 250MB per file and the number of files per upload can be up to 50 files. Total upload size of all files is capped at 500MB. However you can change the file size restrictions to whatever you want by editting the included .env file. 
The frontend of Helix is designed to connect to an API backend to send and retrieve data. For the backend part of this project go to [Helix Backend](https://github.com/XanCeegor/helix_backend).

A beta version of the site can be found here: [Helix](https://helix.xanceegor.dev/)
Note: The backend of the Helix demo is hosted on a home server by myself. Due to fiber connection problems the backend is down for now and the demo does not function properly.

## Project setup
### clone the repo
```
git clone https://github.com/XanCeegor/helix_frontend.git
```

### Install dependencies
```
npm install
```

### Update .env file
```
VUE_APP_TITLE=Helix
VUE_APP_FRONTEND_URL=https://yourfrontend.url
VUE_APP_API_URL=http://yourapi.url
VUE_APP_MAX_FILE_SIZE=262144000   //250mb per file
VUE_APP_MAX_UPLOAD_SIZE=524288000   //500mb per total upload
```

### Start development server
```
npm run serve
```

### Compile and minify for production
```
npm run build
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
