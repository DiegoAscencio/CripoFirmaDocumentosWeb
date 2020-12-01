const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto');
var md5 = require('md5')

var db = require("./database.js")
var https = require('https');
const {
  endianness
} = require('os');
const {
  exit
} = require('process');

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.use(express.static("public"));

const port = 3000;

var signature;

/*************************************
 *  RSA
 *************************************/


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

/*************************************
 *  STORAGE
 *************************************/

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
      files.push(file);
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
    let signedfiles = [];
    fs.readdirSync(`${__dirname}/signedFiles/`).forEach(file => {
      signedfiles.push(file);
    });
    res.json({
      'signedfiles': signedfiles
    })
  })
  .post((req, res) => {
    let privateKey = keys.privateKey;

    let files = [];
    fs.readdirSync(`${__dirname}/uploadFiles/`).forEach(file => {
      files.push(file);
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

    let files = [];
    fs.readdirSync(`${__dirname}/uploadFiles/`).forEach(file => {
      files.push(file);
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
app.get('/downloadFile/:file', function (req, res) {
  const file = `${__dirname}/uploadFiles/${req.params.file}`;
  res.download(file); // Set disposition and send it.
});

app.get('/downloadSignedFile/:file', function (req, res) {
  const file = `${__dirname}/signedFiles/${req.params.file}`;
  res.download(file); // Set disposition and send it.
});


/*************************************
 *  SQL LITE
 ************************** ***********/
//GET List of users
app.get("/api/users", (req, res, next) => {
  var sql = "select * from user"
  var params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({
        "error": err.message
      });
      return;
    }
    res.json({
      "message": "success",
      "data": rows
    })
  });
});

//USERS BY ID
app.route('/api/user/:id')
  .get((req, res) => {
    var sql = "select * from user where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({
          "error": err.message
        });
        return;
      }
      res.json({
        "message": "success",
        "data": row
      })
    });
  })


//POST NEW USER, UPDATE DATA FROM USER
app.route('/api/user/')
  .post((req, res) => {
    var errors = []
    if (!req.body.password) {
      errors.push("No password specified");
    }
    if (!req.body.email) {
      errors.push("No email specified");
    }
    if (errors.length) {
      res.status(400).json({
        "error": errors.join(",")
      });
      return;
    }
    var data = {
      name: req.body.name,
      email: req.body.email,
      password: md5(req.body.password)
    }
    var sql = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
    var params = [data.name, data.email, data.password]
    db.run(sql, params, function (err, result) {
      if (err) {
        res.status(400).json({
          "error": err.message
        })
        return;
      }
      res.status(200).json({
        "message": "success",
        "data": data,
        "id": this.lastID
      })
    });
  })
  .put((req, res) => {
    var sql = "update user set password = ?, name = ? where email = ?"
    var params = [md5(req.body.password), req.body.name, req.body.email]
    db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({
          "error": err.message
        });
        return;
      }
      res.json({
        "message": "success",
        "data": row
      })
    });
  });

//LOGIN
app.route('/api/login/')
  .post((req, res) => {
    var errors = []
    if (!req.body.password) {
      errors.push("No password specified");
    }
    if (!req.body.email) {
      errors.push("No email specified");
    }
    if (errors.length) {
      res.status(400).json({
        "error": errors.join(",")
      });
      return;
    }
    var sql = 'SELECT 1 FROM user where email = ? and password = ?'
    var params = [req.body.email, md5(req.body.password)]
    db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({
          "error": err.message
        });
        return;
      }
      if (row !== undefined && row["1"] == 1) {
        res.status(200).json({
          "message": "Datos correctos"
        });
      } else {
        res.status(404).json({
          "error": "User or password incorrect"
        });
        return;
      }
    });
  })
  .put((req, res) => {
    //
  });

//POST LOGS, GET LOGS
app.route('/api/logs/')
  .get((req, res) => {
    var sql = "select * from logs"
    var params = []
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({
          "error": err.message
        });
        return;
      }
      res.json({
        "message": "success",
        "data": rows
      })
    });
  })
  .post((req, res) => {
    var errors = []
    if (!req.body.name) {
      errors.push("No name specified");
    }
    if (!req.body.email) {
      errors.push("No email specified");
    }
    if (!req.body.type) {
      errors.push("No type specified");
    }
    if (errors.length) {
      res.status(400).json({
        "error": errors.join(",")
      });
      return;
    }
    var data = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.type
    }
    var sql = 'INSERT INTO logs (name, email, type) VALUES (?,?,?)'
    var params = [data.name, data.email, data.type]
    db.run(sql, params, function (err, result) {
      if (err) {
        res.status(400).json({
          "error": err.message
        })
        return;
      }
      res.status(200).json({
        "message": "success",
        "data": data,
        "id": this.lastID
      })
    });
  });

https.createServer({
    key: fs.readFileSync(__dirname + '/certificates/server.key'),
    cert: fs.readFileSync(__dirname + '/certificates/server.cert')
  }, app)
  .listen(port, function () {
    console.log('Running on port 3000. Go to https://localhost:3000/')
  })