const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto');
const {
  endianness
} = require('os');
const {
  exit
} = require('process');

const app = express();
app.use(express.static("public"));
const port = 3000;

var signature;

//Private and public keys
let keys = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

//STORAGE Files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploadFiles');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage
});

//STORAGE Signed files
const storageFiles = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './signedFiles');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const uploadFiles = multer({
  storageFiles
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/public/index.html')));

//UPLOAD FILES
app.route('/Files')
  .get((req, res) => {
    let files = []; //new array 
    fs.readdirSync(`${__dirname}/uploadFiles/`).forEach(file => {
      files.push(file); //array function push
    });
    res.json({
      'files': files
    })
  })
  .post(upload.single('file'), (req, res) => {
    res.redirect('/');
  });

//SIGN FILES
app.route('/signedFiles')
  .get((req, res) => {
    let signedfiles = []; //new array 
    fs.readdirSync(`${__dirname}/signedFiles/`).forEach(file => {
      signedfiles.push(file); //array function push
    });
    res.json({
      'signedfiles': signedfiles
    })
  })
  .post((req, res) => {
    let privateKey = keys.privateKey;

    let files = []; //new array 
    fs.readdirSync(`${__dirname}/uploadFiles/`).forEach(file => {
      files.push(file); //array function push
    });

    for (file of files) {
      let data = fs.readFileSync(`${__dirname}/uploadFiles/${file}`);
      signature = crypto.sign("sha256", Buffer.from(data), {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      })
      fs.writeFile(`${__dirname}/signedFiles/${file}`, signature, () => {});
    }
    res.redirect('/');
  });

//VERIFY FILES
app.route('/verifyFiles')
  .get((req, res) => {

    let files = []; //new array 
    fs.readdirSync(`${__dirname}/uploadFiles/`).forEach(file => {
      files.push(file); //array function push
    });

    let publicKey = keys.publicKey;

    for (file of files) {
      let data = fs.readFileSync(`${__dirname}/uploadFiles/${file}`);
      let sdata = fs.readFileSync(`${__dirname}/signedFiles/${file}`);

      const isVerified = crypto.verify(
        "sha256",
        Buffer.from(data), {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        },
        sdata
      )

      if (isVerified == false) {
        res.json({
          'message': `Verification failed for ${file}`
        })
        return;
      }
    }
    res.json({
      'message': "Verification is correct for all the files"
    });
  });

  //DOWNLOAD FILE
  app.get('/downloadFile/:file', function(req, res){
    const file = `${__dirname}/uploadFiles/${req.params.file}`;
    res.download(file); // Set disposition and send it.
  });

  app.get('/downloadSignedFile/:file', function(req, res){
    const file = `${__dirname}/signedFiles/${req.params.file}`;
    res.download(file); // Set disposition and send it.
  });

app.listen(port, () => console.log(`Example app listening on port ${port}!`));