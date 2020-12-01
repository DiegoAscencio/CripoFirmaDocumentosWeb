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

    let endpoint = `https://localhost:3000/api/login/`
    xhr.open('POST', endpoint);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        "email": data.email.value,
        "password": data.password.value
    }));
    xhr.onload = () => {
        if (xhr.status == 200) {
            let user = JSON.parse(xhr.response);
            console.log(JSON.parse(xhr.response));
            alert(`Bienvenido ${data.email.value}`);
            localStorage.sessionId = "TOKEN";
            localStorage.sessionEmail = user.email;

            if (xhr.status == 200) {
                endpoint = `https://localhost:3000/api/logs/`

                xhr.open('POST', endpoint);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({
                    "name": 'name',
                    "email": data.email.value,
                    "type": 'LOGIN',
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

//CLIC REGISTER
function register() {
    window.location.href = "register.html";
}