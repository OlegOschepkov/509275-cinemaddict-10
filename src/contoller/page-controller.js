import ListComponent from '../components/list';
import ExtraListComponent from '../components/list-extra';
import LoadMoreBtnComponent from '../components/load-more-btn';
import EmptyListComponent from '../components/empty-list';
import SortComponent, {SortType} from '../components/sort.js';
import {placeElement, RenderPosition, remove} from "../utils/render";
import {shuffle} from "../utils/utils";
import MovieController from "./movie-controller";

const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;
const EXTRA_FILMS_COUNT = 2;

const renderFilms = (filmListElement, films, onDataChange, onViewChange) => {
  return films.map((film) => {
    const filmController = new MovieController(filmListElement, onDataChange, onViewChange);
    filmController.renderCard(film);
    return filmController;
  });
};

const renderExtraFilms = (elem, filmsList) => {
  const extraListContainer = elem.querySelector(`.films-list__container`);
  const movieCard = new MovieController(extraListContainer);
  filmsList.slice(0, EXTRA_FILMS_COUNT).forEach((film) => movieCard.renderCard(film));
};

export default class pageController {
  constructor(container) {
    this._container = container;

    this._films = [];
    this._showedFilms = [];
    this._movieControllersAll = [];
    this._emptyListComponent = new EmptyListComponent();
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
    this._listComponent = new ListComponent();
    this._sortComponent = new SortComponent();
    this._loadMoreButtonComponent = new LoadMoreBtnComponent();
    this._onViewChange = this._onViewChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(films, type) {
    this._films = films;
    const container = this._container.getElement();

    placeElement(container, this._sortComponent, RenderPosition.BEFOREEND);

    if (this._films.length === 0) {
      placeElement(container, this._emptyListComponent, RenderPosition.BEFOREEND);
      return;
    } else {

      placeElement(container, this._listComponent, RenderPosition.BEFOREEND);

      const listContainer = this._listComponent.getElement().querySelector(`.films-list__container`);

      const newFilms = renderFilms(listContainer, this._films.slice(0, this._showingFilmsCount), this._onDataChange, this._onViewChange);
      this._movieControllersAll = films.map(() => {
        return new MovieController(listContainer, this._onDataChange, this._onViewChange);
      });

      this._showedFilms = this._showedFilms.concat(newFilms);

      this._renderLoadMoreButton();

      const [...extras] = type;

      let shift = 0;

      extras.forEach((it, i) => {
        const tag = it.extraFlag;
        if (this._films.reduce((acc, that) => acc + that[tag], 0) > 0) {
          placeElement(container, new ExtraListComponent(it.extraName), RenderPosition.BEFOREEND);

          const extraListBlock = [...container.querySelectorAll(`.films-list--extra`)][i - shift];

          if (this._films.every((elem) => elem[tag] === this._films[0][tag])) {
            const filmsShuffled = shuffle(this._films);
            renderExtraFilms(extraListBlock, filmsShuffled);
          } else {
            renderExtraFilms(extraListBlock, this._films.slice().sort((a, b) => b[tag] - a[tag]));
          }
        } else {
          shift++;
        }
      });

      // this._sortComponent.setSortTypeChangeHandler((sortType, movieController) => {
      // });
    }
  }

  _renderLoadMoreButton() {
    if (this._showedFilms >= this._films.length) {
      return;
    }

    placeElement(this._listComponent.getElement(), this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    const listContainer = this._listComponent.getElement().querySelector(`.films-list__container`);

    this._loadMoreButtonComponent.setClickHandler(() => {
      const prevFilmsCount = this._showingFilmsCount;
      this._showingFilmsCount = this._showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

      const newFilms = renderFilms(listContainer, this._films.slice(prevFilmsCount, this._showingFilmsCount), this._onDataChange, this._onViewChange);
      this._showedFilms = this._showedFilms.concat(newFilms);
      if (this._showingFilmsCount >= this._films.length) {
        remove(this._loadMoreButtonComponent);
      }
    });
  }

  _onDataChange(movieController, oldData, newData) {
    const index = this._films.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._films = [].concat(this._films.slice(0, index), newData, this._films.slice(index + 1));

    movieController.renderCard(newData);
  }

  _onViewChange() {
    this._movieControllersAll.forEach((it) => {
      it.setDefaultView();
    });
  }

  _onSortTypeChange(sortType) {
    let sortedFilms = [];

    switch (sortType) {
      case SortType.DATE_DOWN:
        sortedFilms = this._films.slice().sort((a, b) => b.year - a.year);
        break;
      case SortType.RATING_DOWN:
        sortedFilms = this._films.slice().sort((a, b) => b.rating - a.rating);
        break;
      case SortType.DEFAULT:
        sortedFilms = this._films.slice(0, this._showingFilmsCount);
        break;
    }

    const listContainer = this._listComponent.getElement().querySelector(`.films-list__container`);

    listContainer.innerHTML = ``;

    const newFilms = renderFilms(listContainer, sortedFilms, this._onDataChange, this._onViewChange);

    this._showedFilms = this._showedFilms.concat(newFilms);

    if (sortType === SortType.DEFAULT) {
      this._renderLoadMoreButton();
    } else {
      remove(this._loadMoreButtonComponent);
    }
  }
}
