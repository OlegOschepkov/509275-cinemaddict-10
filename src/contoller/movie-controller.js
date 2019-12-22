import CardComponent from "../components/card";
import {generateComments} from "../mock/comments";
import {generatePopup} from "../mock/popup";
import CardPopupComponent from "../components/card-popup";
import {placeElement, RenderPosition} from "../utils/render";
import {replace} from "../utils/utils";

const Mode = {
  DEFAULT: `default`,
  OPENED: `opened`
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._cardComponent = null;
    this._cardPopupComponent = null;
    this._mode = Mode.DEFAULT;
    this._popupData = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this.comments = null;
    this.film = null;
  }

  renderCard(film) {
    this.film = film;
    const oldCard = this._cardComponent;
    const oldPopup = this._cardPopupComponent;

    const container = this._container;

    this._cardComponent = new CardComponent(this.film);
    this.comments = generateComments(this.film.comments);
    this._popupData = generatePopup();
    this._cardPopupComponent = new CardPopupComponent(this._popupData, this.comments, this.film);

    this._cardComponent.onShowPopupClick(() => {
      this._openPopup();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._cardComponent.onWatchListClick((evt) => {
      evt.preventDefault();
      this._onDataChange(this, this.film, Object.assign({}, this.film, {
        isWatchList: !this.film.isWatchList,
      }));
    });

    this._cardComponent.onFavoriteClick((evt) => {
      evt.preventDefault();
      this._onDataChange(this, this.film, Object.assign({}, this.film, {
        isFavorite: !this.film.isFavorite,
      }));
    });

    this._cardComponent.onWatchedClick((evt) => {
      evt.preventDefault();
      this._onDataChange(this, this.film, Object.assign({}, this.film, {
        isWatched: !this.film.isWatched,
      }));
    });

    // связываю клик на карточке и на попапе
    this._cardPopupComponent.onWatchListClick((evt) => {
      // console.log("this._cardPopupComponent.onWatchListClick");
      evt.preventDefault();
      this._onDataChange(this, this.film, Object.assign({}, this.film, {
        isWatchList: !this.film.isWatchList,
      }));
    });

    this._cardPopupComponent.onFavoriteClick((evt) => {
      evt.preventDefault();
      this._onDataChange(this, this.film, Object.assign({}, this.film, {
        isFavorite: !this.film.isFavorite,
      }));
    });

    this._cardPopupComponent.onWatchedClick((evt) => {
      evt.preventDefault();
      this._onDataChange(this, this.film, Object.assign({}, this.film, {
        isWatched: !this.film.isWatched,
        yourRating: null
      }));
    });

    this._cardPopupComponent.onYourRatingClick((evt) => {
      if (evt.target.classList.contains(`film-details__user-rating-label`)) {
        this._onDataChange(this, this.film, Object.assign({}, this.film, {
          yourRating: document.getElementById(evt.target.htmlFor).value,
        }));
      }
    });

    this._cardPopupComponent.onEmojiClick((evt) => {
      const target = evt.target;
      if (target.tagName === `IMG`) {
        const emojiSrc = target.getAttribute(`src`);
        this._onDataChange(this, this.film, Object.assign({}, this.film, {
          yourEmoji: `<img src="${emojiSrc}" width="30" height="30" alt="emoji">`,
        }));
      }
    });

    if (oldPopup && oldCard) {
      replace(this._cardComponent, oldCard);
      replace(this._cardPopupComponent, oldPopup);
    } else {
      placeElement(container, this._cardComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    // console.log(`setDefaultView`);

    if (this._mode !== Mode.DEFAULT) {
      // console.log(`DEFAULT`);
      this._closePopup();
    }
  }

  update(newData) {
    this.film = newData;
    this.comments = generateComments(newData.comments);
    this._popupData = generatePopup();
    this._cardComponent.update(newData);
    this._cardPopupComponent.update(this._popupData, this.comments, newData);
  }

  _onViewChange() {
    // console.log('movie _onViewChange');
    this._mode = Mode.OPENED;
    // должна вызываться в обработчике клика и получать на вход старую карточку фильма и измененную карточку фильма.
  }

  _closePopup() {
    // console.log(`_closePopup`);
    const mainBlock = document.querySelector(`.main`);
    if (this._cardPopupComponent) {
      mainBlock.removeChild(this._cardPopupComponent.getElement());
      this._cardPopupComponent.removeElement();
    }
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _openPopup() {
    // console.log(`_openPopup`);

    this._onViewChange();
    const mainBlock = document.querySelector(`.main`);
    placeElement(mainBlock, this._cardPopupComponent, RenderPosition.BEFOREEND);
    this._cardPopupComponent.setCloseHandler(() => this._closePopup());
    // document.addEventListener(`keydown`, this._closePopup);
    this._cardPopupComponent.onEmojiClick();

    this._mode = Mode.OPENED;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._closePopup();
    }
  }

}
