(function global() {
  const form = document.querySelector("form");
  const list = document.querySelector("#list-cadaster");
  const li = document.querySelectorAll("li");

  const phone = form.querySelector("#telephone");

  const lj = document.querySelector("#lj");
  const avangers = document.querySelector("#avangers");

  /*FUNCTIONS*/
  const leagueChecked = () => (avangers.checked = false);
  const avangersChecked = () => (lj.checked = false);

  /*ADDVENTLISTENERS*/
  form.addEventListener("submit", handleSubmit);

  lj.addEventListener("click", leagueChecked);
  avangers.addEventListener("click", avangersChecked);
  list.addEventListener("click", listUsers);

  phone.addEventListener("keypress", handleNumbers);
  /**********FUNCTION QUE SUBMETE FORMULARIO********* */

  function handleSubmit(event) {
    event.preventDefault();

    const form = document.querySelector("form");

    const name = form.querySelector("#name").value;
    const email = form.querySelector("#email").value;
    const telephone = form.querySelector("#telephone").value;

    const lj = form.querySelector("#lj");
    const avangers = form.querySelector("#avangers");

    const formatedNumbers = (telephone) => {
      const parte1 = telephone.slice(0, 2);
      const parte2 = telephone.slice(2, 6);
      const parte3 = telephone.slice(6, 11);

      const formated = `(${parte1})-${parte2}-${parte3}`;
      return formated;
    };

    const verify = () => {
      if (lj.checked) {
        group = "league of justice";
      }
      if (avangers.checked) {
        group = "avangers";
      }
    };

    let group;

    let validate = true;
    verify();

    if (name.length === 0) {
      validate = false;
    }

    if (email.length === 0) {
      validate = false;
    }

    if (telephone.length < 8) {
      hides({ telephone: true });
      validate = false;
    }

    if (group === undefined) {
      validate = false;
      hides({ group: true });
    }

    if (validate === true) {
      const user = {
        name: name,
        email: email,
        telephone: formatedNumbers(telephone),
        group: group,
        codiname: "",
      };

      //checa se o email ja existe, se não, pode continuar
      checkEmail(user);
    }
  }

  function handleNumbers(event) {
    var theEvent = event || window.event;

    // Handle paste
    if (theEvent.type === "paste") {
      key = event.clipboardData.getData("text/plain");
    } else {
      // Handle key press
      var key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode(key);
    }
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) theEvent.preventDefault();
    }
  }

  /**********FUNCTION QUE VERIFICA SE EMAIL JA FOI CADASTRADO********* */

  const checkEmail = (event) => {
    console.log("verificando email...");

    var xhttp = new XMLHttpRequest();

    xhttp.open("POST", "/getEmail", true);

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        if (JSON.parse(xhttp.responseText) == true) {
          console.log("email ja existe...");

          hides({ email: true });
        } else if (JSON.parse(xhttp.responseText) == false) {
          console.log("verificando o codiname...");
          getCodiname(event);

          //submitedAccount(event);
        }
        xhttp.abort();
      }
    };
    // Envia a informação do cabeçalho junto com a requisição.
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(JSON.stringify(event.email));
  };

  /**********EXIBI MENSAGENS DE ERRO NO FORMULARIO********* */

  function hides(event) {
    if (event.email) {
      document.querySelector(".my-email").classList.remove("hide");
    }
    if (event.group) {
      document.querySelector(".my-group").classList.remove("hide");
    }
    if (event.telephone) {
      document.querySelector(".my-telephone").classList.remove("hide");
    }
  }
  /**********FUNCTION QUE ENVIA FORMULARIO AUTENTICADO********* */
  function submitedAccount(event) {
    console.log(event);
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/store", true);
    xhttp.onreadystatechange = function () {
      console.log(xhttp.responseText);

      if (this.readyState == 4 && this.status == 200) {
        if (JSON.parse(xhttp.responseText) == true) {
          console.log(xhttp.responseText);
          messageSuccess();
          xhttp.abort();
        } else if (JSON.parse(xhttp.responseText) == false) {
          console.log("falha no registro");
          xhttp.abort();
        }
      }
    };
    // Envia a informação do cabeçalho junto com a requisição.
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(JSON.stringify(event));
  }
  /**********FUNCTION QUE EXIBI MENSSAGEM DE SUCCESSO********* */

  function messageSuccess() {
    const form = document.querySelector("form");

    while (form.firstChild) {
      form.removeChild(form.firstChild);
    }

    form.classList.add("form-success");

    const h4 = document.createElement("h4");
    h4.classList.add("h4-success");
    h4.innerHTML = "Registro efetuado com sucesso";
    form.insertBefore(h4, form.childNodes[0]);
  }

  function getCodiname(event) {
    console.log("pegando o codiname...");
    var xhttp = new XMLHttpRequest();

    xhttp.open("POST", "/getCodiname", true);

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        event.codiname = xhttp.responseText;
        submitedAccount(event);
        //template(JSON.parse(xhttp.responseText));
        xhttp.abort();
      }
    };
    // Envia a informação do cabeçalho junto com a requisição.
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(JSON.stringify(event.group));
  }
  /**********FUNCTION QUE EXIBI TODOS OS USUARIOS********* */

  function listUsers() {
    const form = document.querySelector("form");

    while (form.firstChild) {
      form.removeChild(form.firstChild);
    }

    form.classList.add("form-success");

    httpRequest();
  }

  function httpRequest() {
    var xhttp = new XMLHttpRequest();

    xhttp.open("POST", "/list", true);

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        template(JSON.parse(xhttp.responseText));
        xhttp.abort();
      }
    };
    // Envia a informação do cabeçalho junto com a requisição.
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send();
  }

  function template(event) {
    document.querySelector("form").remove();

    const myDiv = document.createElement("div");
    myDiv.classList.add("div-show");
    document.querySelector("body").append(myDiv);

    let output1 = `
    <span>Name</span>
    <span>Email</span>
    <span>Telephone</span>
    <span>Hero_group</span>
    <span>Codiname</span>`;

    let output2 = event
      .map((i) => {
        return `
          <div>
            <span>${i.name}</span>
             <span>${i.email}</span>
             <span>${i.telephone}</span>
             <span>${i.hero_group}</span>
             <span>${i.codiname}</span>
             </div>
             `;
      })
      .join("");

    const primary = document.createElement("div");
    const second = document.createElement("div");
    const button = document.createElement("button");

    primary.classList.add("title-div");
    second.classList.add("div-map");

    primary.innerHTML = output1;
    second.innerHTML = output2;

    document.querySelector(".div-show").appendChild(primary);
    document.querySelector(".div-show").appendChild(second);

    const customBtn = (button) => {
      button.classList.add("waves-effect");
      button.classList.add("#4fc3f7");
      button.classList.add("light-blue");
      button.classList.add("lighten-2");
      button.classList.add("btn-large");
      button.classList.add("btn-back");

      button.innerText = "Voltar";
      return button;
    };

    document.querySelector(".div-show").appendChild(customBtn(button));
    document.querySelector(".btn-back").addEventListener("click", btnBack);
  }

  function btnBack() {
    location.reload();
  }
})();
