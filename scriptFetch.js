const d = document;
const $table = d.querySelector(".content-characters");
const $form = d.querySelector(".crud-form");
const $title = d.querySelector(".crud-title");
const $sendButton = d.getElementById("send");
const $fragment = d.createDocumentFragment();
let isEditing = false
let idToEdit 

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

const POST_character = async (id) => {
  try {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
        name: $form[0].value,
        info: $form[1].value,
        isAlive: $form[2].value,
        hasCromo: $form[3].value,
        photo: $form[4].value,
      }),
    };
    const response = await fetch("http://localhost:5000/cyberpunk-characters", options)
    if (!response.ok) {
      throw {
        message: response.statusText || `Oops something went wrong!`,
        status: response.status,
      };
    }
  } catch (error) {
    console.error(error)
  }
};

const PUT_character = async (id) => {
  try {
    const options = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
        name: $form[0].value,
        info: $form[1].value,
        isAlive: $form[2].value,
        hasCromo: $form[3].value,
        photo: $form[4].value,
      }),
    };
    const response = await fetch(`http://localhost:5000/cyberpunk-characters/${id}`, options)
    if (!response.ok) {
      throw {
        message: response.statusText || `Oops something went wrong!`,
        status: response.status,
      };
    }
  } catch (error) {
    console.error(error)
  }
}

$table.addEventListener("click", e => {
  if(e.target.classList.contains("edit")){
    if(isEditing === false){
      isEditing = true
      idToEdit = e.target.dataset.id
      $form[0].value = e.target.dataset.name
      $form[1].value = e.target.dataset.info
      $form[2].value = e.target.dataset.isAlive
      $form[3].value = e.target.dataset.hasCromo
      $form[4].value = e.target.dataset.photo
      $title.innerText = `EDITING: ${e.target.dataset.name.toUpperCase()}`
      const $allEditButtons = document.querySelectorAll(".edit")
      $allEditButtons.forEach((button) => {
        button.innerText = "CANCEL"
      })
    } else {
      isEditing = false
      idToEdit = null
      $form[0].value = ""
      $form[1].value = ""
      $form[2].value = ""
      $form[3].value = ""
      $form[4].value = ""
      $title.innerText = "ADD CHARACTER"
      const $allEditButtons = document.querySelectorAll(".edit")
      $allEditButtons.forEach((button) => {
        button.innerText = "EDIT"
      })
    }
  }
})

$sendButton.addEventListener("click", e => {
e.preventDefault()
if(isEditing === true){
  return
}
const $editButtons = document.querySelectorAll(".edit") 
const arrayButtons = [...$editButtons]
const arrayId = arrayButtons.map((button) => {
 return button.dataset.id
})
const newId = Math.max(...arrayId) + 1
POST_character(newId)
})

$sendButton.addEventListener("click", e => {
if(isEditing === false){
    return
  }
PUT_character(idToEdit)
})


const consumeApi = async () => {
  try {
    const response = await fetch("http://localhost:5000/cyberpunk-characters");
    const data = await response.json();
    if (!response.ok) {
      throw {
        message: response.statusText || `Oops something went wrong!`,
        status: response.status,
      };
    }
    printing(data);
  } catch (error) {
    console.error(error);
  }
};

consumeApi();
