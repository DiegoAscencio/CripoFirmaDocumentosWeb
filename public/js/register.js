
//VARIABLES FROM INPUT TEXTS
let userName = document.querySelector('#userName');
let userEmail = document.querySelector('#userEmail');
let userPassword = document.querySelector('#userPassword');

//CLICK REGISTER
function register() {
    let xhr = new XMLHttpRequest();
    let data = {};

    data.name = userName;
    data.email = userEmail;
    data.password = userPassword;

    let endpoint = `https://localhost:3000/api/user/`
    xhr.open('POST', endpoint);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        "name":data.name.value,
        "email":data.email.value,
        "password":data.password.value
      }));
    xhr.onload = () => {
        if (xhr.status == 200) {
            let user = JSON.parse(xhr.response);
            console.log(JSON.parse(xhr.response));
            alert(`Usurio ${data.name.value} con el email ${data.email.value} registrado con exito`);
            window.location.href="login.html";
        } else if (xhr.status == 404) {
            alert("Error al registrar usuario");
        }
    }
}

//CLIC GO BACK
function goBack() {
    window.location.href="login.html";
}