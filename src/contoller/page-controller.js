import ListComponent from '../components/list';
import ExtraListComponent from '../components/list-extra';
import CardComponent from '../components/card';
import CardPopupComponent from '../components/card-popup';
import LoadMoreBtnComponent from '../components/load-more-btn';
import EmptyListComponent from '../components/empty-list';
import {generateComments} from "../mock/comments";
import {generatePopup} from "../mock/popup";
import {render, RenderPosition, remove} from "../utils/render";
import {shuffle} from "../utils/utils";
import {generateExtra} from "../mock/extra";
import BoardComponent from "../components/board";
import FooterComponent from "../components/footer";

const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;
const EXTRA_FILMS_COUNT = 2;

const renderCard = (container, film) => {
  const cardComponent = new CardComponent(film);
  const comments = generateComments(film.comments);
  const popupData = generatePopup();
  const cardPopupComponent = new CardPopupComponent(popupData, comments, film);

  const poster = cardComponent.getElement().querySelector(`.film-card__poster`);
  const title = cardComponent.getElement().querySelector(`.film-card__title`);
  const commentsBtn = cardComponent.getElement().querySelector(`.film-card__comments`);
  const popupBtns = [poster, title, commentsBtn];

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      container.removeChild(cardPopupComponent.getElement());
      // cardPopupComponent.getElement().remove();
      // cardPopupComponent.removeElement();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const closeBtnMechanic = (evt) => {
    evt.target.removeEventListener(`click`, closeBtnMechanic, false);
    container.removeChild(cardPopupComponent.getElement());
    // cardPopupComponent.getElement().remove();
    // cardPopupComponent.removeElement();
  };

  const renderPopup = () => {
    render(container, cardPopupComponent, RenderPosition.BEFOREEND);
    // const closeBtn = cardPopupComponent.getElement().querySelector(`.film-details__close-btn`);
    // closeBtn.addEventListener(`click`, closeBtnMechanic);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  popupBtns.forEach((it) => {
    it.addEventListener(`click`, function () {
      renderPopup();
    });
  });

  render(container, cardComponent, RenderPosition.BEFOREEND);
};

const renderExtraFilms = (elem, filmsList) => {
  const extraListContainer = elem.querySelector(`.films-list__container`);
  filmsList.slice(0, EXTRA_FILMS_COUNT).forEach((film) => renderCard(extraListContainer, film));
};

export default class pageController {
  constructor (container) {
    this._container = container;

    this._emptyListComponent = new EmptyListComponent();
    this._listComponent = new ListComponent();
    this._extraTasksListComponent = new ExtraListComponent();
    this._loadMoreButtonComponent = new LoadMoreBtnComponent();
  }

  render (films, type) {
    const container = this._container.getElement();

    render(container, this._listComponent, RenderPosition.BEFOREEND);

    const listContainer = this._listComponent.getElement().querySelector(`.films-list__container`);

    if (films.length === 0) {
      render(container, this._emptyListComponent, RenderPosition.BEFOREEND);
      return;
    } else {

      render(container, this._listComponent, RenderPosition.BEFOREEND);

      let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
      films.slice(0, showingFilmsCount).forEach((film) => renderCard(listContainer, film));

      render(this._listComponent.getElement(), this._loadMoreButtonComponent, RenderPosition.BEFOREEND);


      this._loadMoreButtonComponent.setClickHandler(() => {
        const prevTasksCount = showingFilmsCount;
        showingFilmsCount = showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;



        films.slice(prevTasksCount, showingFilmsCount)
          .forEach((film) => renderCard(listContainer, film));

        if (showingFilmsCount >= films.length) {
          remove(this._loadMoreButtonComponent)
        }
      });

      const [...extras] = type;

      let shift = 0;

      extras.forEach(function (it, i) {
        const tag = it.extraFlag;
        if (films.reduce((acc, it) => acc + it[tag], 0) > 0) {
          render(container, new ExtraListComponent(it.extraName), RenderPosition.BEFOREEND);
          const extraListBlock = [...container.querySelectorAll(`.films-list--extra`)][i - shift];
          if (films.every((it) => it[tag] === films[0][tag])) {
            const filmsShuffled = shuffle(films);
            renderExtraFilms(extraListBlock, filmsShuffled);
          } else {
            console.log('hoi')
            renderExtraFilms(extraListBlock, films.slice().sort((a, b) => b[tag] - a[tag]));
          }
        } else {
          shift++;
        }
      });
    }
  }
}
