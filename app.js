const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
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

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/index.html')));

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
    let publicKey = keys.publicKey;

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
    let privateKey = keys.privateKey;

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
        res.write(`Attention: Verification failed for ${file}`, function () {
          res.end()
          return;
        });
      }
    }
    res.write('Verification passed for all files. Files are secure and integrity is preserved.');
    res.end();
  })

app.listen(port, () => console.log(`Example app listening on port ${port}!`));