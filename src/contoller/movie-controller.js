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
    this._container = container ;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._cardComponent = null;
    this._cardPopupComponent = null;
    this._mode = Mode.DEFAULT;
    this._popupData = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    // this._openPopup = this._openPopup.bind(this)
  }

  renderCard(film) {
    const oldCard = this._cardComponent;
    const oldPopup = this._cardPopupComponent;

    const container = this._container;
    // const mainBlock = document.querySelector(`.main`);

    this._cardComponent = new CardComponent(film);
    const comments = generateComments(film.comments);
    this._popupData = generatePopup();
    this._cardPopupComponent = new CardPopupComponent(this._popupData, comments, film);

    // const poster = this._cardComponent.getElement().querySelector(`.film-card__poster`);
    // const title = this._cardComponent.getElement().querySelector(`.film-card__title`);
    // const commentsBtn = this._cardComponent.getElement().querySelector(`.film-card__comments`);
    // const popupButtons = [poster, title, commentsBtn];

    // const onEscKeyDown = (evt) => {
    //   const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    //
    //   if (isEscKey) {
    //     mainBlock.removeChild(this._cardPopupComponent.getElement());
    //     document.removeEventListener(`keydown`, onEscKeyDown);
    //   }
    // };

    // const closeBtnMechanic = (evt) => {
    //   evt.target.removeEventListener(`click`, closeBtnMechanic, false);
    //   mainBlock.removeChild(this._cardPopupComponent.getElement());
    // };

    // const renderPopup = () => {
    //   this._onViewChange();
    //   placeElement(mainBlock, this._cardPopupComponent, RenderPosition.BEFOREEND);
    //   this._cardPopupComponent.setCloseHandler(closeBtnMechanic);
    //   document.addEventListener(`keydown`, this._closePopup);
    // };

    // popupButtons.forEach((it) => {
    //   it.addEventListener(`click`, function () {
    //     this._openPopup();
    //     document.addEventListener(`keydown`, this._onEscKeyDown);
    //   });
    // });
    //
    // popupButtons.forEach((it) => {
    //   it.addEventListener(`click`, function () {
    //     this._openPopup();
    //     document.addEventListener(`keydown`, this._onEscKeyDown);
    //   });
    // });

    this._cardComponent.onShowPopupClick(() => {
          this._openPopup();
          document.addEventListener(`keydown`, this._onEscKeyDown);
    })

    this._cardComponent.onWatchListClick((evt) => {
      evt.preventDefault();
      this._onDataChange(this, film, Object.assign({}, film, {
        isWatchList: !film.isWatchList,
      }));
    });

    this._cardComponent.onFavoriteClick((evt) => {
      evt.preventDefault();
      this._onDataChange(this, film, Object.assign({}, film, {
        isFavorite: !film.isFavorite,
      }));
    });

    this._cardComponent.onWatchedClick((evt) => {
      evt.preventDefault();
      this._onDataChange(this, film, Object.assign({}, film, {
        isWatched: !film.isWatched,
      }));
    });

    this._cardPopupComponent.onWatchListClick((evt) => {
      evt.preventDefault();
      this._onDataChange(this, this._popupData, Object.assign({}, this._popupData, {
        isWatchList: !film.isWatchList,
      }));
      this._openPopup()
    });

    if (oldPopup && oldCard) {
      replace(this._cardComponent, oldCard);
      replace(this._cardPopupComponent, oldPopup);
    } else {
      placeElement(container, this._cardComponent, RenderPosition.BEFOREEND);
    }

    // if (oldCard) {
    //   replace(this._cardComponent, oldCard);
    // } else {
    //   placeElement(container, this._cardComponent, RenderPosition.BEFOREEND);
    // }
  }

  _onDataChange() {
    // вообще не работает. Может из за этой строки this._onDataChange = onDataChange?
    console.log('_onDataChange');
    this._cardComponent.update()
  }

  setDefaultView() {
    console.log('setDefaultView');

    if (this._mode !== Mode.DEFAULT) {
      console.log('def');
      this._closePopup()
    }
  }

  // _onViewChange(newCard, oldCard) {
  //   console.log('movie _onViewChange');
  //   this._mode = Mode.OPENED;
  //   //должна вызываться в обработчике клика и получать на вход старую карточку фильма и измененную карточку фильма.
  // }

  _closePopup() {
    // this._cardPopupComponent.reset();
    const mainBlock = document.querySelector(`.main`);

    mainBlock.removeChild(this._cardPopupComponent.getElement());
    this._mode = Mode.DEFAULT;
  }

  _openPopup() {
    this._onViewChange();

    const mainBlock = document.querySelector(`.main`);
    placeElement(mainBlock, this._cardPopupComponent, RenderPosition.BEFOREEND);
    this._cardPopupComponent.setCloseHandler(() => this._closePopup());
    document.addEventListener(`keydown`, this._closePopup);
    this._mode = Mode.OPENED;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._closePopup();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

}
