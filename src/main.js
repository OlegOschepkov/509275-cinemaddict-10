import FilterComponent from './components/filter';
import BoardComponent from './components/board';
import ListComponent from './components/list';
import ExtraListComponent from './components/list-extra';
import CardComponent from './components/card';
import CardPopupComponent from './components/card-popup';
import UserComponent from './components/user';
import LoadMoreBtnComponent from './components/load-more-btn';
import FooterComponent from './components/footer';
import {generateFilters} from './mock/filter';
import {generateFilms} from './mock/films';
import {generateExtra} from "./mock/extra";
import {user} from './mock/user';
import {getRandomIntegerNumber, FILMS_COUNT, render, RenderPosition, shuffle} from './utils/utils';
import {generateComments} from "./mock/comments";
import {generatePopup} from './mock/popup';

const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;
const EXTRA_COUNT = 2;
const EXTRA_FILMS_COUNT = 2;

const bodyBlock = document.querySelector(`body`);
const headerBlock = document.querySelector(`.header`);
const mainBlock = document.querySelector(`.main`);

const filters = generateFilters();

const films = generateFilms(FILMS_COUNT);

user.level = getRandomIntegerNumber(0, 4);

render(headerBlock, new UserComponent(user.level).getElement(), RenderPosition.BEFOREEND);
render(mainBlock, new FilterComponent(filters, films).getElement(), RenderPosition.BEFOREEND);
const boardBlock = new BoardComponent();
render(mainBlock, boardBlock.getElement(), RenderPosition.BEFOREEND);

const listComponent = new ListComponent();

render(boardBlock.getElement(), listComponent.getElement(), RenderPosition.BEFOREEND);

const listContainer = listComponent.getElement().querySelector(`.films-list__container`);

const renderCard = (container, film) => {
  const cardComponent = new CardComponent(film);
  const comments = generateComments(film.comments);
  const popupData = generatePopup();
  const cardPopupComponent = new CardPopupComponent(popupData, comments, film);

  const poster = cardComponent.getElement().querySelector(`.film-card__poster`);
  const title = cardComponent.getElement().querySelector(`.film-card__title`);
  const commentsBtn = cardComponent.getElement().querySelector(`.film-card__comments`);
  const popupBtns = [poster, title, commentsBtn];

  const closeBtnMechanic = (evt) => {
    evt.target.removeEventListener(`click`, closeBtnMechanic, false);
    cardPopupComponent.getElement().remove();
    cardPopupComponent.removeElement();
  };

  const renderPopup = () => {
    render(bodyBlock, cardPopupComponent.getElement(), RenderPosition.BEFOREEND);
    const closeBtn = cardPopupComponent.getElement().querySelector(`.film-details__close-btn`);
    closeBtn.addEventListener(`click`, closeBtnMechanic);
  };

  popupBtns.forEach((it) => {
    it.addEventListener(`click`, function () {
      renderPopup();
    });
  });

  render(container, cardComponent.getElement(), RenderPosition.BEFOREEND);
};

render(bodyBlock, new FooterComponent(films).getElement(), RenderPosition.BEFOREEND);
let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
films.slice(0, showingFilmsCount).forEach((film) => renderCard(listContainer, film));

const extra = generateExtra(EXTRA_COUNT);
const [first, second] = extra;

const renderExtraFilms = (elem, filmsList) => {
  const extraListContainer = elem.querySelector(`.films-list__container`);
  filmsList.slice(0, EXTRA_FILMS_COUNT).forEach((film) => renderCard(extraListContainer, film));
};

const renderExtra = () => {
  if (films.reduce((acc, it) => acc + it.rating, 0) > 0) {
    render(boardBlock.getElement(), new ExtraListComponent(first).getElement(), RenderPosition.BEFOREEND);
    const extraListBlock = [...boardBlock.getElement().querySelectorAll(`.films-list--extra`)].shift();
    if (films.every((it) => it.rating === films[0].rating)) {
      const filmsShuffled = shuffle(films);
      renderExtraFilms(extraListBlock, filmsShuffled);
    } else {
      renderExtraFilms(extraListBlock, films.slice().sort((a, b) => b.rating - a.rating));
    }
  }
  if (films.reduce((acc, it) => acc + it.comments, 0) > 0) {
    render(boardBlock.getElement(), new ExtraListComponent(second).getElement(), RenderPosition.BEFOREEND);
    const extraListBlock = [...boardBlock.getElement().querySelectorAll(`.films-list--extra`)].pop();
    if (films.every((it) => it.comments === films[0].comments)) {
      const filmsShuffled = shuffle(films);
      renderExtraFilms(extraListBlock, filmsShuffled);
    } else {
      renderExtraFilms(extraListBlock, films.slice().sort((a, b) => b.comments - a.comments));
    }
  }
};

const loadMoreBtnComponent = new LoadMoreBtnComponent();

render(listComponent.getElement(), loadMoreBtnComponent.getElement(), RenderPosition.BEFOREEND);

const loadMoreButton = listComponent.getElement().querySelector(`.films-list__show-more`);

loadMoreButton.addEventListener(`click`, () => {
  const prevTasksCount = showingFilmsCount;
  showingFilmsCount = showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

  films.slice(prevTasksCount, showingFilmsCount)
    .forEach((film) => renderCard(listContainer, film));

  if (showingFilmsCount >= films.length) {
    loadMoreButton.remove();
  }
});

renderExtra();
