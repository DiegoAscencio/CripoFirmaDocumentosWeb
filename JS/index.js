"use strict";

localStorage.sessionId;
localStorage.sessionEmail;
localStorage.userId;
localStorage.plantName;

//VALIDAR USUARIO LOGUEADO
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