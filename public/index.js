fetch('/Files')
    .then(response => response.json())
    .then(data => displayFiles(data.files));

function displayFiles(files) {
    for (file of files) {
        $("#files").append(`<div>${file}<a href="/downloadFile/${file}">Download</a></div>`);
    }
}

fetch('/signedFiles')
    .then(response => response.json())
    .then(data => displaySignedFiles(data.signedfiles));

function displaySignedFiles(files) {
    console.log(files);
    for (file of files) {
        $("#singedfiles").append(`<div>${file}<a href="/downloadSignedFile/${file}">Download</a></div>`);
    }
}

function verify() {
    fetch('/verifyFiles')
        .then(response => response.json())
        .then(data => alert(data.message));
}