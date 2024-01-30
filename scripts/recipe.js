import { ele } from "./ui.js";

export default class Recipe {
  constructor() {
    this.info = {};

    this.likes = JSON.parse(localStorage.getItem("likes")) || [];

    this.renderLikeList();
  }

  async getRecipe(id) {
    //id y göre tarif detayı al
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/get?rId=${id}`
    );

    const data = await res.json();

    this.info = data.recipe;
  }

  renderRecipe(r) {
    ele.recipe_area.innerHTML = `
        <figure>
          <img
            src="${r.image_url}"
            alt=""
          />
          <h1>${r.title}</h1>
          <div class="like-area"><i id="like-btn" class="bi ${
            this.isRecipeLiked() ? "bi-heart-fill" : "bi-heart"
          }"></i></div>
        </figure>

        <div class="ingredients">
          <ul>
            ${this.creatIngredient()}
          </ul>

          <button id="add-to-cart" class="CartBtn">
            <span class="IconContainer">
              <i class="bi bi-cart-fill"></i>
            </span>
            <p class="text">Sepete Ekle</p>
          </button>
        </div>

        <div class="directions">
          <h2>Nasıl Pişirilir</h2>

          <p>
            Bu tarif dikkatlice
            <span>${r.publisher}</span> tarafından hazırlanmış ve test
            edilmiştir. Diğer detaylara onların websitesi üzerinden
            erişebilirsiniz.
          </p>

          <a href="${r.publisher_url}" target="_blank">Yönerge</a>
        </div>
    `;

    document
      .querySelector("#like-btn")
      .addEventListener("click", () => this.controlLike());
  }

  creatIngredient() {
    return this.info.ingredients
      .map(
        (i) => `
    <li>
        <i class="bi bi-check-circle"></i>
        <p>${i}</p>
    </li>
    `
      )
      .join(" ");
  }

  controlLike() {
    const newItem = {
      id: this.info.recipe_id,
      img: this.info.image_url,
      title: this.info.title,
    };

    if (this.isRecipeLiked()) {
      this.likes = this.likes.filter((i) => i.id !== newItem.id);
    } else {
      this.likes.push(newItem);
    }

    //locale yolla
    localStorage.setItem("likes", JSON.stringify(this.likes));
    //datay arayüzünü güncelle
    this.renderRecipe(this.info);
    //like list i güncelle
    this.renderLikeList();
  }

  isRecipeLiked() {
    return this.likes.find((i) => i.id === this.info.recipe_id);
  }

  renderLikeList() {
    ele.like_list.innerHTML = this.likes
      .map(
        (i) => `
            <a href="#${i.id}">
              <img
                src="${i.img}"
              />
              <span>${i.title}</span>
            </a>
    `
      )
      .join(" ");
  }
}
