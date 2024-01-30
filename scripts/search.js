import { notify } from "./ui.js";

export default class Search {
  constructor() {
    // sonuçlar

    this.results = [];
  }

  //apiden arama sonuçlarını alır
  async fetchResults(query) {
    try {
      const res = await fetch(
        `https://forkify-api.herokuapp.com/api/search?q=${query}`
      );

      const data = await res.json();
      this.results = data;
    } catch (err) {
      console.log(err);
      notify("");
    }
  }
}
