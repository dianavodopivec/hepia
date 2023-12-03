const d = document;
const $table = d.querySelector(".content-characters");
const $form = d.querySelector(".crud-form");
const $title = d.querySelector(".crud-title");
const $sendButton = d.getElementById("send");
const $fragment = d.createDocumentFragment();

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
      res.forEach(personaje => {
        console.log(personaje)
      })
    },
    error: (err) => { 
      console.error(err)
    },
    data: null,
  })
}

d.addEventListener("DOMContentLoaded", getAll)