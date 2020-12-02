localStorage.sessionId;
localStorage.sessionEmail;
localStorage.userId;
localStorage.token;

fetch('/api/logs/')
    .then(response => response.json())
    .then(data => displayFiles(data.data));

function displayFiles(files) {
    for (record of files) {
        $("#logs").append(`<div class="table-row"><span>${record.type}</span><span>${record.email}</span><span>${record.timeon}</span></div>`);
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