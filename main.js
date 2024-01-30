import Search from "./scripts/search.js";
import Recipe from "./scripts/recipe.js";
import { ele, notify } from "./scripts/ui.js";
import { rederLoader, renderResults } from "./scripts/ui.js";
import { categories } from "./scripts/constant.js";
//uuid kütüphanesi id oluşturma
import { v4 } from "https://jspm.dev//uuid";

const search = new Search();

const recipe = new Recipe();

//! Olay izleyicileri

document.addEventListener("DOMContentLoaded", () => {
  const index = Math.floor(Math.random() * categories.length);
  getResult(categories[index]);
});

ele.form.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = e.target[0].value;
  getResult(query);
});

//Sayfa yüklenme olayı

window.addEventListener("DOMContentLoaded", () => {
  controlUrl();
  renderBasketItems();
});

//url deki id yinin değişme olayını izle
window.addEventListener("hashchange", controlUrl);

ele.recipe_area.addEventListener("click", handleClick);

//!Fonksiyonlar
//arama sonuçlarını alıp ekrana basar

async function getResult(query) {
  if (!query.trim()) {
    return notify("Lütfen arama terimi giriniz");
  }

  rederLoader(ele.results_list);

  // apiden verileri al

  try {
    await search.fetchResults(query.trim());

    if (search.results.error) {
      notify("Aradığınız kriterlere uygun ürün bulunamadı");
      ele.results_list.innerHTML = "";
    } else {
      // console.log(search.results.recipes);
      renderResults(search.results.recipes);
    }
  } catch (err) {
    notify("Bir sorun oluştu");
    ele.results_list.innerHTML = "";
  }

  // sonuçları kerana bas

  //hata olursa bildir
}

//detay verilerini alır ekrana basasr

async function controlUrl() {
  const id = location.hash.slice(1);

  if (id) {
    rederLoader(ele.recipe_area);

    //tarif bilgilerini al
    await recipe.getRecipe(id);

    recipe.renderRecipe(recipe.info);
  }
}

let basket = JSON.parse(localStorage.getItem("basket")) || [];

function handleClick(e) {
  if (e.target.id === "add-to-cart") {
    // bütün malzemeleri sepete ekle
    recipe.info.ingredients.forEach((title) => {
      const newItem = {
        id: v4(),
        title,
      };

      basket.push(newItem);
    });

    //locali güncelle
    localStorage.setItem("basket", JSON.stringify(basket));

    renderBasketItems();
  }
}

function renderBasketItems() {
  ele.basket_list.innerHTML = basket
    .map(
      (i) =>
        `
    <li data-id="${i.id}"> 
      <i id="delete-item" class="bi bi-x"></i>
      <span>${i.title}</span>
    </li>
    `
    )
    .join(" ");
}

//tarif verileri ekrana bas

ele.clear_btn.addEventListener("click", () => {
  const res = confirm("Sepet temizlenecek emin misiniz");

  if (res) {
    //sepeti temizle
    basket = [];

    //
    localStorage.removeItem("basket");

    //arayüz temizleme
    ele.basket_list.innerHTML = "";
  }
});

//tek tek silme

ele.basket_list.addEventListener("click", (e) => {
  if (e.target.id == "delete-item") {
    //tıkladığım elemanın idsini alma
    const parent = e.target.parentElement;
    const id = parent.dataset.id;
    console.log(parent, id);

    // id sine göre diziden kaldırma
    basket = basket.filter((i) => i.id !== id);

    console.log(basket);

    //local e güncel diziyi ekle
    localStorage.setItem("basket", JSON.stringify(basket));

    //arayüzden ilgili elemanı kaldır
    parent.remove();
  }
});
