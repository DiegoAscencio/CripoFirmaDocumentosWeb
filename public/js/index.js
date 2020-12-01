localStorage.sessionId;
localStorage.sessionEmail;
localStorage.userId;

fetch('/Files')
    .then(response => response.json())
    .then(data => displayFiles(data.files));

function displayFiles(files) {
    for (file of files) {
        $("#files").append(`<div>${file}<a href="/downloadFile/${file}"> Download</a></div>`);
    }
}

fetch('/signedFiles')
    .then(response => response.json())
    .then(data => displaySignedFiles(data.signedfiles));

function displaySignedFiles(files) {
    console.log(files);
    for (file of files) {
        $("#singedfiles").append(`<div>${file}<a href="/downloadSignedFile/${file}"> Download</a></div>`);
    }
}

function verify() {
    fetch('/verifyFiles')
        .then(response => response.json())
        .then(data => alert(data.message));
}

function onLoad() {
    if (localStorage.sessionId == undefined || localStorage.sessionId == "") {
        console.log("no hay usuario logueado");
        window.location.href="login.html";
    } else {
        console.log("usuario logueado");
    }
}

let signout = document.querySelector("#signOut");
//SIGN OUT 
function signOut() {
    localStorage.clear();
}

signout.addEventListener("click", signOut);