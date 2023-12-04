const d = document;
const $table = d.querySelector(".content-characters");
const $form = d.querySelector(".crud-form");
const $title = d.querySelector(".crud-title");
const $sendButton = d.getElementById("send");
const $fragment = d.createDocumentFragment();

const regex = {
  regexname: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/,
  regexinfo: /^(?![\s\d]+$).+$/,
  regexurl:
    /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/,
};

const printing = array => {
  if (array.length === 0) {
    return;
  }
  array.forEach(character => {
    const $card = d.createElement("div");
    $card.classList.add("card");
    $card.classList.add("card-help");
    const $overlay = d.createElement("div");

    const $image = d.createElement("img");
    $image.setAttribute("src", character.photo);
    $image.setAttribute("alt", `A photo of ${character.name}.`);
    $image.onerror = () => {
      console.warn(
        `${character.name} photo has a problem and is loading the default picture.`
      );
      $image.setAttribute("src", "/zCRUDAJAX/failedToLoad.jpg");
    };
    const $cardInfo = d.createElement("div");
    $cardInfo.classList.add("card-info");

    const $characterTitle = d.createElement("h2");
    $characterTitle.innerText = character.name;

    const $p1 = d.createElement("p");
    const $p2 = d.createElement("p");
    let cromo;
    let alive;
    character.hasCromo === "true" ? (cromo = "Yes") : (cromo = "No");
    character.isAlive === "true" ? (alive = "Yes") : (alive = "No");
    if (character.isAlive === "null") {
      alive = "Maybe...";
    }
    $p1.innerText = `Cromo: ${cromo} - Is Alive: ${alive}`;
    $p2.innerText = character.info;

    const $buttonsDiv = d.createElement("div");
    $buttonsDiv.classList.add("card-buttons");
    const $buttonEdit = d.createElement("button");
    const $buttonDelete = d.createElement("button");

    $buttonEdit.innerText = "EDIT";
    $buttonEdit.classList.add("edit");
    $buttonEdit.dataset.id = character.id;
    $buttonEdit.dataset.name = character.name;
    $buttonEdit.dataset.info = character.info;
    $buttonEdit.dataset.isAlive = character.isAlive;
    $buttonEdit.dataset.hasCromo = character.hasCromo;
    $buttonEdit.dataset.photo = character.photo;

    $buttonDelete.innerText = "DELETE";
    $buttonDelete.classList.add("delete");
    $buttonDelete.dataset.id = character.id;

    $card.appendChild($image);
    $card.appendChild($overlay);
    $cardInfo.appendChild($characterTitle);
    $cardInfo.appendChild($p1);
    $cardInfo.appendChild($p2);
    $card.appendChild($cardInfo);
    $buttonsDiv.appendChild($buttonEdit);
    $buttonsDiv.appendChild($buttonDelete);
    $card.appendChild($buttonsDiv);
    $fragment.appendChild($card);
  });
  $table.innerHTML = "";
  $table.appendChild($fragment);
};

const ajax = (options) => {
  let { url, method, success, error, data } = options;
  const request = new XMLHttpRequest();

  request.addEventListener("readystatechange", (e) => {
    if (request.readyState !== 4) return;
    if (request.status >= 200 && request.status < 300) {
      const json = JSON.parse(request.responseText);
      success(json);
    } else {
      const message = request.statusText || "Ocurrió un error";
      error((`🥲 ${message} ${request.status}`));
    }
  });

  request.open(method || "GET", url);
  request.setRequestHeader("Content-type", "application/json;charset=utf-8");
  request.send(JSON.stringify(data));
};

const getAll = () => {
  ajax({
    method: "GET",
    url: "http://localhost:5000/cyberpunk-characters",
    success: (res) => { 
      console.log(res)
      printing(res)
    },
    error: (err) => { 
      console.error(err)
      $table.insertAdjacentHTML("beforebegin", `<h3>${err}</h3>`)
    },
    data: null,
  })
}

d.addEventListener("DOMContentLoaded", getAll)

//FORMA DE MIRCHA 

$form.addEventListener("click", e => {
  if(e.target === $sendButton) {
    e.preventDefault()
    if(!regex.regexname.test($form[0].value)){
      return
    }
    if(!regex.regexinfo.test($form[1].value)){
      return
    }
    if(!regex.regexurl.test($form[4].value)){
      return
    }
    if(!e.target.id.value){
      //Si no existe tal valor, se realizará una petición POST (Create).
      ajax({
        method: "POST",
        url: "http://localhost:5000/cyberpunk-characters",
        success: (res) => location.reload(),  
        error: () => 
        $form.insertAdjacentHTML("beforebegin", `<h3>${err}</h3>`),
        data: {
          name: $form[0].value,
          info: $form[1].value,
          isAlive: $form[2].value,
          hasCromo: $form[3].value,
          photo: $form[4].value
        }
      })
    } else {
      //Si existe tal valor, se realizará una petición PUT (Update).
      ajax({
        method: "PUT",
        url: `http://localhost:5000/cyberpunk-characters/${e.target.id.value}`,
        success: (res) => location.reload(),  
        error: () => 
        $form.insertAdjacentHTML("beforebegin", `<h3>${err}</h3>`),
        data: {
          name: $form[0].value,
          info: $form[1].value,
          isAlive: $form[2].value,
          hasCromo: $form[3].value,
          photo: $form[4].value
        }
      })
    }
  }
})

d.addEventListener("click", e => {
  if(e.target.matches(".edit")){
    alert("Presionaste el botón EDIT")
    $title.textContent = "EDIT MODE"
    $form[0].value = e.target.dataset.name
    $form[1].value = e.target.dataset.info
    $form[2].value = e.target.dataset.isAlive
    $form[3].value = e.target.dataset.hasCromo
    $form[4].value = e.target.dataset.photo
  }
  if(e.target.matches(".delete")){
    alert("Presionaste el botón DELETE")
  }
})