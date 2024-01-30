import Search from "./search.js";

export const ele = {
  form: document.querySelector("form"),
  results_list: document.querySelector("#result"),
  recipe_area: document.querySelector("#recipe"),
  like_list: document.querySelector(".dropdown"),
  basket_list: document.querySelector("#basket"),
  clear_btn: document.querySelector("#clear"),
  clear_icon: document.querySelector("#clear-icon"),
};

//bildirim gönderir
export function notify(text) {
  Toastify({
    text,
    duration: 3000,
    close: true,
    gravity: "bottom",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #ff5acd, #fbda61)",
    },
  }).showToast();
}

// yükleniyor u ekrana bas

export const rederLoader = (outlet) => {
  outlet.innerHTML = `
    <div class="wrapper">
        <div class="loader">
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
        </div>
    <div/>

    `;
};

//arama sonuçları ekrana basılır

export const renderResults = (results) => {
  ele.results_list.innerHTML = results
    .map(
      (rescipe) =>
        `
        <a href="#${rescipe.recipe_id}">
          <div class="img-wrapper">
            <img src="${rescipe.image_url}" alt="" />
          </div>
          <div class="info">
            <h4>${rescipe.title}</h4>
            <p>${rescipe.publisher}</p>
          </div>
        </a>
        `
    )
    .join(" ");
};
