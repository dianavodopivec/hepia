const d = document;
const $table = d.querySelector(".content-characters");
const $form = d.querySelector(".crud-form");
const $title = d.querySelector(".crud-title");
const $sendButton = d.getElementById("send");
const $fragment = d.createDocumentFragment();

const printer = (array) => {
    array.forEach(character => {
        console.log(character)
    })
}

const consumeApi = async () => {
    try {
        const response = await fetch("http://localhost:5000/cyberpunk-characters")
        const data = await response.json()
        console.log(data)
        //Aquí se manejan los ERRORES\\
        if(!response.ok) {
            throw {
                message: response.statusText || "😢",
                status: response.status
            }
        }
        printer(data)
    } catch (error) {
        console.error(error)
    }
}

consumeApi()