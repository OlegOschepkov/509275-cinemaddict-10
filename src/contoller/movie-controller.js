import CardComponent from "../components/card";
// import {generatePopup} from "../mock/popup";
import CardPopupComponent from "../components/card-popup";
import {placeElement, RenderPosition, remove} from "../utils/render";
import {replace} from "../utils/utils";
import FilmModel from "../models/film-model";
import CommentsModel from "../models/comments-model";

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  OPENED: `opened`
};

export const EmptyComment = {
  description: ``,
  date: null,
  emoji: [],
};
// const emojiList = {
//   DEFAULT: ``,
//   SMILE: `smile`,
//   GPUKE: `puke`,
//   SLEEPING: `sleeping`,
//   ANGRY: `angry`
// };
const SHAKE_ANIMATION_TIMEOUT = 600;

export default class MovieController {
  constructor(container, onDataChange, onViewChange, api) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._api = api;
    this._cardComponent = null;
    this._cardPopupComponent = null;
    this._mode = Mode.DEFAULT;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this.film = null;
    this._commentId = null;
    this.comments = null;
  }

  renderCard(film, mode) {
    this.film = film;
    const oldCard = this._cardComponent;
    const oldPopup = this._cardPopupComponent;

    this._cardComponent = new CardComponent(this.film);
    this._cardPopupComponent = new CardPopupComponent(this.film);

    this._cardComponent.onShowPopupClick(() => {
      if (this.comments === null) {
        this._api.getComments(this.film.id)
          .then((comments) => {
            // const commentsModel = new CommentsModel(comments);
            this.comments = CommentsModel.parseComments(comments);
            this._cardPopupComponent.update(this.film, this.comments);
            this._openPopup();
          });
      } else {
        this._openPopup();
      }
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._cardComponent.onWatchListClick((evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(this.film);
      newFilm.isWatchList = !this.film.isWatchList;
      this._onDataChange(this, this.film, newFilm);
    });

    this._cardComponent.onFavoriteClick((evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(this.film);
      newFilm.isFavorite = !this.film.isFavorite;
      this._onDataChange(this, this.film, newFilm);
    });

    this._cardComponent.onWatchedClick((evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(this.film);
      newFilm.isWatched = !this.film.isWatched;
      this._onDataChange(this, this.film, newFilm);
    });

    this._cardPopupComponent.onWatchListClick((evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(this.film);
      newFilm.isWatchList = !this.film.isWatchList;
      this._onDataChange(this, this.film, newFilm);
    });

    this._cardPopupComponent.onFavoriteClick((evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(this.film);
      newFilm.isFavorite = !this.film.isFavorite;
      this._onDataChange(this, this.film, newFilm);
    });

    this._cardPopupComponent.onWatchedClick((evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(this.film);
      newFilm.isWatched = !this.film.isWatched;
      this._onDataChange(this, this.film, newFilm);
    });

    this._cardPopupComponent.onYourRatingClick((evt) => {
      if (evt.target.classList.contains(`film-details__user-rating-label`)) {
        const newFilm = FilmModel.clone(this.film);
        newFilm.yourRating = parseInt(document.getElementById(evt.target.htmlFor).value, 10);
        this.toggleDisable();
        this._onDataChange(this, this.film, newFilm);
      }
    });

    this._cardPopupComponent.onEmojiClick((evt) => {
      const target = evt.target;
      if (target.tagName === `INPUT`) {
        const emojiName = target.getAttribute(`id`).substring(6);
        // const newFilm = FilmModel.clone(this.film);
        this.yourEmoji = `${emojiName}`;
        this._cardPopupComponent.setEmoji(`${emojiName}`);
        // this._onDataChange(this, this.film, null);
      }
    });

    this._cardPopupComponent.onSubmitHandler((evt) => {
      if (evt.key === `Enter` && evt.ctrlKey) {
        evt.preventDefault();
        if (evt.target.value.length > 0) {
          this.toggleDisable();
          this._onDataChange(this, null, evt.target.value);
        }
      }
    });

    this._cardPopupComponent.onDeleteButtonClickHandler((evt) => {
      evt.preventDefault();
      this._commentId = evt.target.closest(`.film-details__comment`).dataset.id;
      // const newFilm = FilmModel.clone(this.film);
      this._onDataChange(this, this._commentId, null);
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldPopup && oldCard) {
          replace(this._cardComponent, oldCard);
          replace(this._cardPopupComponent, oldPopup);
          this._closePopup();
        } else {
          placeElement(this._container, this._cardComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldPopup && oldCard) {
          replace(this._cardComponent, oldCard);
          replace(this._cardPopupComponent, oldPopup);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        placeElement(this._container, this._cardPopupComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }

  update(newData, comments) {
    this._cardComponent.update(newData);
    this._cardPopupComponent.update(newData, comments);
  }

  _onViewChange() {
    this._mode = Mode.OPENED;
  }

  _closePopup() {
    const mainBlock = document.querySelector(`.main`);
    if (this._cardPopupComponent) {
      mainBlock.removeChild(this._cardPopupComponent.getElement());
      this._cardPopupComponent.removeElement();
    }
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _openPopup() {
    this._onViewChange();
    const mainBlock = document.querySelector(`.main`);
    placeElement(mainBlock, this._cardPopupComponent, RenderPosition.BEFOREEND);
    this._cardPopupComponent.setCloseHandler(() => this._closePopup());
    this._cardPopupComponent.recoveryListeners();
    this._mode = Mode.OPENED;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyComment, null);
      }
      this._closePopup();
    }
  }

  destroy() {
    remove(this._cardPopupComponent);
    remove(this._cardComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  toggleDisable() {
    this._cardPopupComponent.getElement().querySelector(`.film-details__comment-input`).classList.toggle(`blocking`);
    this._cardPopupComponent.getElement().querySelector(`.film-details__user-rating-score`).classList.toggle(`blocking`);
  }

  shake(isComment) {
    // console.log('shake');
    this._cardPopupComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._cardComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    // if (isComment) {
    //   this._cardPopupComponent.getElement().querySelector(`.film-details__comment-input`).classList.add('error-comments');
    // }
    this.toggleDisable();

    setTimeout(() => {
      this._cardPopupComponent.getElement().style.animation = ``;
      this._cardComponent.getElement().style.animation = ``;
      // if (isComment) {
      //   this._cardPopupComponent.getElement().querySelector(`.film-details__comment-input`).classList.remove('error-comments');
      // }
      this.toggleDisable();

    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
