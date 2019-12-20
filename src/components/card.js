import AbstractSmartComponent from "./abstract-smart-component";

const getCardTemplate = (films) => {
  const {name, poster, description, rating, year, duration, genre, comments, isFavorite, isWatched, isWatchList} = films;

  return `<article class="film-card">
            <h3 class="film-card__title">${name}</h3>
            <p class="film-card__rating">${rating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${year}</span>
              <span class="film-card__duration">${duration}</span>
              <span class="film-card__genre">${genre}</span>
            </p>
            <img src="${poster}" alt="" class="film-card__poster">
            <p class="film-card__description">${description}</p>
            <a class="film-card__comments">${comments}</a>
            <form class="film-card__controls">
              <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${isWatchList ? `film-card__controls-item--active` : ``}">Add to watchlist</button>
              <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${isWatched ? `film-card__controls-item--active` : ``}">Mark as watched</button>
              <button class="film-card__controls-item button film-card__controls-item--favorite ${isFavorite ? `film-card__controls-item--active` : ``}">Mark as favorite</button>
            </form>
          </article>`;
};

export default class Card extends AbstractSmartComponent {
  constructor(film) {
    super();
    this._film = film;
  }

  getTemplate() {
    return getCardTemplate(this._film);
  }

  update(newdata) {
    // не работает, так как подменяем _onDataChange в Moviecontroller на onDataChange из boardcontroller
    this._film = newdata;
    this.rerender();
    // меняем старые данныена newdata
  }

  recoveryListeners() {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._onWatchListClick);
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._onFavoriteClick);
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._onWatchedClick);
    // console.log(`recovered`);
  }

  onShowPopupClick(handler) {
    const poster = this.getElement().querySelector(`.film-card__poster`);
    const title = this.getElement().querySelector(`.film-card__title`);
    const commentsBtn = this.getElement().querySelector(`.film-card__comments`);
    const popupButtons = [poster, title, commentsBtn];
    popupButtons.forEach((it) => {
      it.addEventListener(`click`, handler);
    });
  }

  onWatchListClick(handler) {
    this._onWatchListClick = handler;
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, handler);
  }

  onFavoriteClick(handler) {
    this._onFavoriteClick = handler;
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, handler);
  }

  onWatchedClick(handler) {
    this._onWatchedClick = handler;
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, handler);
  }
}
