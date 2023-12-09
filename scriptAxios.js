const d = document;
const $table = d.querySelector(".content-characters");
const $form = d.querySelector(".crud-form");
const $title = d.querySelector(".crud-title");
const $fragment = d.createDocumentFragment();
const $sendButton = d.getElementById("send");

const regex = {
  regexname: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/,
  regexinfo: /^(?![\s\d]+$).+$/,
  regexurl:
    /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/,
};

const globalStates = {
  isEditing: false,
  editingId: null,
}

//============== IMPRESORA ==============//
const printing = (array) => {
  if (array.length === 0) {
    return;
  }
  array.forEach((character) => {
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

//============== VALIDADOR ==============//

const validator = () => {
  if(!regex.regexname.test($form[0].value)){
    return false
  }
  if (!regex.regexinfo.test($form[1].value)) {
    return false;
  }
  if ($form[2].value === "") {
    return false;
  }
  if ($form[3].value === "") {
    return false;
  }
  if (!regex.regexurl.test($form[4].value)) {
    return false;
  }
}

//============ CRUD ============//
const POST_character = async () => {
  try {
    //Generar una nueva ID a través de la obtención de datos.
    const getCharacters = await axios.get(
      "http://localhost:5000/cyberpunk-characters"
    );
    const dataCharacters = getCharacters.data;
    const ids = dataCharacters.map((character) => {
      return character.id;
    });
    const newId = Math.max(...ids) + 1;

    const options = {
      method: "POST", //No es necesario porque se aclara en la línea 105.
      headers: { "Content-Type": "application/json" },
      body: {
        id: newId,
        name: $form[0].value,
        info: $form[1].value,
        isAlive: $form[2].value,
        hasCromo: $form[3].value,
        photo: $form[4].value,
      },
    };

    const response = await axios.post(
      `http://localhost:5000/cyberpunk-characters`,
      options.body,
      options.headers
    );

    const data = await response.data;
    console.log(data);
  } catch (error) {
    console.error(
      "Something went wrong, we couldn't post your character!",
      error
    );
  }
};

const PUT_character = async (id) => {
  try {
    const options = {
      method: "PUT",
      headers: { "Content-Type": "/aplication.js" },
      body: {
        name: $form[0].value,
        info: $form[1].value,
        isAlive: $form[2].value,
        hasCromo: $form[3].value,
        photo: $form[4].value,
      },
    };
    const response = await axios.put(
      `http://localhost:5000/cyberpunk-characters/${id}`,
      options.body,
      options.headers
    );
  } catch (error) {
    console.error(
      "Something went wrong, we couldn't modify your character!",
      error
    );
  }
};

const DELETE_character = async (id) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/cyberpunk-characters/${id}`
    );
  } catch (error) {
    console.error(
      "Something went wrong, we couldn't delete your character!",
      error
    );
  }
};

//============ SENDBUTTON ACTIONS ============//

const userPostActions = () => {
  $sendButton.addEventListener("click", (e) => {
    e.preventDefault();
    if(globalStates.isEditing === true){
      return
    }
    if(validator() === false){
      console.error("The character was not created, all fields are required.")
      return
    }
    POST_character();
  }); 
}

const userActivateEditModeActions = () => {
  $table.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit")) {
      const $editButtons = document.querySelectorAll(".edit")
      if (globalStates.isEditing === false) {
        globalStates.isEditing = true;
        globalStates.editingId = e.target.dataset.id;
        $form[0].value = e.target.dataset.name
        $form[1].value = e.target.dataset.info
        $form[2].value = e.target.dataset.isAlive
        $form[3].value = e.target.dataset.hasCromo
        $form[4].value = e.target.dataset.photo
        $title.innerText = `EDITING: ${e.target.dataset.name.toUpperCase()}`
        $sendButton.value = "CONFIRM CHANGES"
        $editButtons.forEach((button) =>{
          button.innerText = "CANCEL"
          button.classList.add("cancel-edit")
        })
      } else {
        globalStates.isEditing = false;
        globalStates.editingId = null;
        $form[0].value = ""
        $form[1].value = ""
        $form[2].value = ""
        $form[3].value = ""
        $form[4].value = ""
        $title.innerText = "ADD CHARACTER"
        $sendButton.value = "SEND"
        $editButtons.forEach((button) =>{
          button.innerText = "EDIT"
          button.classList.remove("cancel-edit")
        })
      }
    }
  });
}

const userPutActions = () => {
  $sendButton.addEventListener("click", e =>{
    e.preventDefault()
    if(globalStates.isEditing === false){
      return 
    }
    if(validator() === false){
      console.error("The character was not edited, all fields are required.")
      return
    }
    PUT_character(globalStates.editingId)
  })
}

const userDeleteActions = () => {
  $table.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
      DELETE_character(e.target.dataset.id);
    }
  });  
}

//============ API AXIOS ============//
const consumeApi = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/cyberpunk-characters"
    );
    const data = response.data;
    printing(data);
    userPostActions()
    userActivateEditModeActions()
    userPutActions()
    userDeleteActions()
  } catch (error) {
    console.error(
      `We're sorry! It seems that something went wrong ... ${error}`
    );
  }
};


consumeApi();

setInterval(() => {console.log(globalStates.isEditing)}, 1000);
