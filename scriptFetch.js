const d = document;
const $table = d.querySelector(".content-characters");
const $form = d.querySelector(".crud-form");
const $title = d.querySelector(".crud-title");
const $sendButton = d.getElementById("send");
const $fragment = d.createDocumentFragment();

//Impresión de personajes con sus respectivas cards, informacion y botones.
const printer = (array) => {
  array.forEach((character) => {
    //Crear una carta para cada personaje.
    const $card = d.createElement("div");
    $card.classList.add("card");
    $card.classList.add("card-auxiliar");
    //Crear una imagen para cada personaje.
    const $image = d.createElement("img");
    $image.setAttribute("src", character.photo);
    $image.setAttribute("alt", character.name);
    //Crear una carta con la información del personaje.
    const $cardInfo = d.createElement("article");
    $cardInfo.classList.add("card-info");
    //Crear titulo y otros.
    const $h2 = d.createElement("h2");
    $h2.innerText = character.name;
    const $p1 = d.createElement("p");
    const $p2 = d.createElement("p");
    let cromo;
    JSON.parse(character.hasCromo) === true ? (cromo = "Yes") : (cromo = "No");
    let alive 
    if(character.isAlive === "true") {
      alive = "Yes"
    }
    if(character.isAlive === "false") {
      alive = "No"
    }
    if(character.isAlive === "null") {
      alive = "We don't know..."
    }
    $p1.innerText = `Cromo: ${cromo} - Is Alive: ${alive}`;
    $p2.innerText = character.info;
    //Crear botones de EDITAR y ELIMINAR.
    const $buttonContainer = d.createElement("div");
    $buttonContainer.classList.add("card-buttons");
    //BOTON EDITAR
    const $editButton = d.createElement("button");
    $editButton.classList.add("edit");
    $editButton.innerText = "EDIT";
    $editButton.dataset.id = character.id;
    $editButton.dataset.name = character.name;
    $editButton.dataset.info = character.info;
    $editButton.dataset.isAlive = character.isAlive;
    $editButton.dataset.hasCromo = character.hasCromo;
    $editButton.dataset.photo = character.photo;
    //BOTON ELIMINAR
    const $deleteButton = d.createElement("button");
    $deleteButton.classList.add("delete");
    $deleteButton.innerText = "DELETE";
    $deleteButton.dataset.id = character.id;

    //Vincular las cosas para que no esten flotando :D
    $card.appendChild($image);
    $cardInfo.appendChild($h2);
    $cardInfo.appendChild($p1);
    $cardInfo.appendChild($p2);
    $card.appendChild($cardInfo);
    $buttonContainer.appendChild($editButton);
    $buttonContainer.appendChild($deleteButton);
    $card.appendChild($buttonContainer);
    $fragment.appendChild($card);
  });
  $table.appendChild($fragment);
};

//Personaje al que queremos eliminar
const characterDELETE = async (id) => {
  try {
    const options = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };
    const response = await fetch(
      `http://localhost:5000/cyberpunk-characters/${id}`,
      options
    );
    if (!response.ok) {
      throw {
        status: response.status,
        message: `😢 The character with the ID: "${id}" was not deleted`,
      };
    }
  } catch (error) {
    console.error(error);
  }
};
//Función del botón DELETE que se vincula con la función characterDELETE.
const actionsDeleteBtn = () => {
  $table.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
      const deleteId = e.target.dataset.id;
      characterDELETE(deleteId);
    }
  });
};

//Consumo de la API de dichos personajes a través de FETCH.
const consumeApi = async () => {
  try {
    const response = await fetch("http://localhost:5000/cyberpunk-characters");
    const data = await response.json();
    console.log(data);
    //Aquí se manejan los ERRORES\\
    if (!response.ok) {
      throw {
        message: response.statusText || "😢",
        status: response.status,
      };
    }
    printer(data);
  } catch (error) {
    console.error(error);
  }
};

actionsDeleteBtn();
consumeApi();
