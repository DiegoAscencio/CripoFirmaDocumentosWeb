"use strict";
localStorage.sessionId;
localStorage.sessionEmail;
localStorage.userId;

//VARIABLES FROM INPUT TEXTS
let userEmail = document.querySelector('#userEmail');
let userPassword = document.querySelector('#userPassword');

//CLICK LOGIN
function logIn() {
    let xhr = new XMLHttpRequest();
    let data = {};

    data.email = userEmail;
    data.password = userPassword;

    let endpoint = `http://localhost:3000/api/login`
    xhr.open('POST', endpoint);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        "email":data.email.value,
        "password":data.password.value
      }));
    xhr.onload = () => {
        if (xhr.status == 200) {
            let user = JSON.parse(xhr.response);
            console.log(JSON.parse(xhr.response));
            alert(`Bienvenido ${user.email}`);
            localStorage.sessionId = "TOKEN";
            localStorage.sessionEmail = user.email;
            window.location.href="index.html";
        } else if (xhr.status == 404) {
            alert("Usuario o contraseña incorrectos");
        }
    }
}