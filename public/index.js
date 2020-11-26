let list_element_in_html = document.getElementById('files');

    fetch('/Files')
      .then(response => response.json())
      .then(data => displayFiles(data.files));


    function displayFiles(files) {
      for (file of files) {
        let tr = document.createElement("tr");
        tr.appendChild(document.createTextNode(file));
        list_element_in_html.appendChild(tr);
      }
    }

    let list_element_in_html_signed = document.getElementById('singedfiles');

    fetch('/signedFiles')
      .then(response => response.json())
      .then(data => displaySignedFiles(data.signedfiles));

    function displaySignedFiles(files) {
      console.log(files);
      for (file of files) {
        let tr = document.createElement("tr");
        tr.appendChild(document.createTextNode(file));
        list_element_in_html_signed.appendChild(tr);
      }
    }

    function verify() {
      fetch('/verifyFiles')
        .then(response => response.json())
        .then(data => alert(data.message));
    }