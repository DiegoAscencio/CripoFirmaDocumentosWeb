localStorage.sessionId;
localStorage.sessionEmail;
localStorage.userId;
localStorage.token;

fetch('/FilesE')
    .then(response => response.json())
    .then(data => displayFiles(data.files));

function displayFiles(files) {
    for (file of files) {
        $("#files").append(`<div>${file}<a href="/downloadFileE/${file}"> Download</a></div>`);
    }
}

fetch('/encryptedFiles')
    .then(response => response.json())
    .then(data => displaySignedFiles(data.encryptedfiles));

function displaySignedFiles(files) {
    console.log(files);
    for (file of files) {
        $("#singedfiles").append(`<div>${file}<a href="/downloadEncryptedFile/${file}"> Download</a></div>`);
    }
}

let decrpytPassword = document.querySelector('#fdpassword');

function decrypt() {
    let xhr = new XMLHttpRequest();
    let endpoint = `https://localhost:3000/decryptFiles/`
    xhr.open('POST', endpoint);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        "password": decrpytPassword.value
    }));

    xhr.onload = () => {
        if (xhr.status == 200) {
            alert("Finish");
        } else if (xhr.status == 404) {
            alert("Error on process");
        }
    }
}

function onLoad() {
    if (localStorage.sessionId == undefined || localStorage.sessionId == "" || localStorage.token == "" || localStorage.token == undefined) {
        console.log("no hay usuario logueado");
        window.location.href = "login.html";
    } else {
        console.log("usuario logueado");
    }
}

let signout = document.querySelector("#signOut");

//SIGN OUT 
function signOut() {
    let xhr = new XMLHttpRequest();
    let endpoint = `https://localhost:3000/api/logs/`
    xhr.open('POST', endpoint);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        "name": 'name',
        "email": localStorage.sessionEmail.value,
        "type": 'LOGOUT',
    }));

    xhr.onload = () => {
        if (xhr.status == 200) {
            localStorage.clear();
            console.log("Created Log");
        } else if (xhr.status == 404) {
            alert("Error");
        }
    }
}

signout.addEventListener("click", signOut);