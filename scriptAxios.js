const d = document;
const $table = d.querySelector(".content-characters");
const $form = d.querySelector(".crud-form");
const $title = d.querySelector(".crud-title");
const $fragment = d.createDocumentFragment();
const $sendButton = d.getElementById("send");

//============ API AXIOS ============//

const consumeApi = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/cyberpunk-characters"
    );
    const data = response.data;
    console.log(data);
    if (!response.ok) {
      throw {
        message: response.statusText || `We're sorry! It seems that something went wrong 🫠`,
        status: response.status,
      };
    }
  } catch (error) {
    console.error(error);
  }
};

consumeApi();
