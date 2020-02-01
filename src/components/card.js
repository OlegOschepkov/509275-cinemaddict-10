import AbstractSmartComponent from "./abstract-smart-component";
import {getHumanRadableDuration} from "../utils/utils";
import debounce from 'lodash/debounce';

const DEBOUNCE_TIMEOUT = 300;
const MAX_TEXT_LENGTH = 140;
const MAX_STRIPPED_TEXT_LENGTH = 139;

const strippingDescription = (text) => {
  let newText;
  if (text.length >= MAX_TEXT_LENGTH) {
    newText = text.substring(0, MAX_STRIPPED_TEXT_LENGTH) + ` ...`;
  } else {
    newText = text;
  }
  return newText;
};


const getCardTemplate = (films) => {
  const {name, poster, description, rating, year, genre, duration, commentsQuantity, isFavorite, isWatched, isWatchList} = films;

  const strippedDescription = strippingDescription(description);
  const durationHumanReadable = getHumanRadableDuration(duration);

  return `<article class="film-card">
            <h3 class="film-card__title">${name}</h3>
            <p class="film-card__rating">${rating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${year}</span>
              <span class="film-card__duration">${durationHumanReadable}</span>
              <span class="film-card__genre">${genre}</span>
            </p>
            <img src="${poster}" alt="" class="film-card__poster">
            <p class="film-card__description">${strippedDescription}</p>
            <a class="film-card__comments">${commentsQuantity} comments</a>
            <form class="film-card__controls">
              <button type="button" class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${isWatchList ? `film-card__controls-item--active` : ``}">Add to watchlist</button>
              <button type="button" class="film-card__controls-item button film-card__controls-item--mark-as-watched ${isWatched ? `film-card__controls-item--active` : ``}">Mark as watched</button>
              <button type="button" class="film-card__controls-item button film-card__controls-item--favorite ${isFavorite ? `film-card__controls-item--active` : ``}">Mark as favorite</button>
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

  update(newData) {
    this._film = newData;
    this.rerender();
  }

  recoveryListeners() {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._onWatchListClick);
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._onFavoriteClick);
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._onWatchedClick);
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, this._onShowPopupClick);
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, this._onShowPopupClick);
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, this._onShowPopupClick);
  }

  onShowPopupClick(handler) {
    this._onShowPopupClick = handler;
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, this._onShowPopupClick);
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, this._onShowPopupClick);
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, this._onShowPopupClick);
  }

  onWatchListClick(handler) {
    this._onWatchListClick = handler;
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, debounce(handler, DEBOUNCE_TIMEOUT));
  }

  onFavoriteClick(handler) {
    this._onFavoriteClick = handler;
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, debounce(handler, DEBOUNCE_TIMEOUT));
  }

  onWatchedClick(handler) {
    this._onWatchedClick = handler;
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, debounce(handler, DEBOUNCE_TIMEOUT));
  }
}
