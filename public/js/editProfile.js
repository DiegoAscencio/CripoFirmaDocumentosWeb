const e = require("express");

localStorage.sessionId;
localStorage.sessionEmail;
localStorage.userId;

function onLoad() {
    if (localStorage.sessionId == undefined || localStorage.sessionId == "") {
        console.log("no hay usuario logueado");
        window.location.href="login.html";
    } else {
        console.log("usuario logueado");
        console.log(localStorage.sessionEmail);
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
        "email": localStorage.sessionEmail,
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

//CLICK SAVE CHANGES
function saveChanges() {
    let xhr = new XMLHttpRequest();
    let data = {};

    //VARIABLES FROM INPUT TEXTS
    let userName = document.querySelector('#userName');
    let userPassword = document.querySelector('#userPassword');

    data.name = userName;
    data.password = userPassword;
    
    let email = localStorage.sessionEmail;

    let endpoint = `https://localhost:3000/api/user/`
    xhr.open('PUT', endpoint);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        "name": data.name.value,
        "email": email,
        "password": data.password.value
    }));
    xhr.onload = () => {
        if (xhr.status == 200) {
            let user = JSON.parse(xhr.response);
            console.log(JSON.parse(xhr.response));
            alert(`Registrados los cambios del usuario ${data.name.value}`);
            endpoint = `https://localhost:3000/api/logs/`

            xhr.open('POST', endpoint);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                "name": data.name.value,
                "email": email,
                "type": 'CHANGE',
            }));
            xhr.onload = () => {
                if (xhr.status == 200) {
                    console.log("Created Log");
                    window.location.href = "login.html";
                } else if (xhr.status == 404) {
                    console.log("Error Log");
                }
            }

        } else if (xhr.status == 404) {
            alert("Error al realizar cambios usuario");
        }
    }
}
