localStorage.sessionId;
localStorage.sessionEmail;
localStorage.userId;


fetch('/api/qr/')
    .then(response => response.json())
    .then(data => displayFiles(data.data));

function displayFiles(files) {
    $("#tokenDiv").append(`<img src=${files}></img>`);
}

//VARIABLES FROM INPUT TEXTS
let secretToken = document.querySelector('#secretToken');

//CLICK LOGIN
function verifyToken() {
    let xhr = new XMLHttpRequest();
    let data = {};

    data.token = secretToken;

    let endpoint = `https://localhost:3000/api/verify/`
    xhr.open('POST', endpoint);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        "token": data.token.value,
    }));
    xhr.onload = () => {
        if (xhr.status == 200) {
            alert(`Token Correcto`);
            if (xhr.status == 200) {
                endpoint = `https://localhost:3000/api/logs/`

                xhr.open('POST', endpoint);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({
                    "name": 'name',
                    "email": localStorage.sessionEmail,
                    "type": 'CORRECT_TOKEN',
                }));
                xhr.onload = () => {
                    if (xhr.status == 200) {
                        console.log("Created Log");
                        window.location.href = "index.html";
                    } else if (xhr.status == 404) {
                        console.log("Error Log");
                    }
                }

            } else if (xhr.status == 404) {
                alert("Error al registrar usuario");
            }

        } else if (xhr.status == 404) {
            alert("Usuario o contraseña incorrectos");
        }
    }
}