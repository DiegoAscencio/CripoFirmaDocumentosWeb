localStorage.sessionId;
localStorage.sessionEmail;
localStorage.userId;

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