import ListComponent from "../components/list";
import ExtraListComponent from "../components/list-extra";
import LoadMoreBtnComponent from "../components/load-more-btn";
import EmptyListComponent from "../components/empty-list";
import SortComponent, {SortType} from "../components/sort.js";
import {placeElement, RenderPosition, remove} from "../utils/render";
import {shuffle} from "../utils/utils";
import MovieController, {Mode as MovieControllerMode} from "./movie-controller";
// import CommentsModel from "../models/comments-model";
// import FilterController from "../contoller/filter-controller";
import {generateExtra} from "../mock/extra";
import CommentsModel from "../models/comments-model";
// import StatisticComponent from "../components/statistic";

const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;
const EXTRA_COUNT = 2;
const EXTRA_FILMS_COUNT = 2;

const renderFilms = (filmListElement, films, onDataChange, onViewChange, api) => {
  // console.log(films);
  return films.map((film) => {
    const filmController = new MovieController(filmListElement, onDataChange, onViewChange, api);
    filmController.renderCard(film, MovieControllerMode.DEFAULT);
    return filmController;
  });
};

export default class pageController {
  constructor(container, filmsModel, filter, statistics, api) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._api = api;

    this._films = [];
    this._showedFilms = [];
    this._movieControllersAll = [];
    this._emptyListComponent = new EmptyListComponent();
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
    this._listComponent = new ListComponent();
    this._sortComponent = new SortComponent();
    this._statisticsBlock = statistics;
    this._filterController = filter;
    this._loadMoreButtonComponent = new LoadMoreBtnComponent();
    this._onViewChange = this._onViewChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._filmsModel.onFilterChangeHandler(this._onFilterChange);
    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);
    this.toggleVisibility = this.toggleVisibility.bind(this);
    this.hidden = false;
    // this._filterController.onStatsClick(this._toggleVisibility);
    // this._creatingComment = null;
  }

  render() {
    this._films = this._filmsModel.getFilms();
    const container = this._container.getElement();

    placeElement(container, this._sortComponent, RenderPosition.BEFOREEND);

    if (this._films.length === 0) {
      placeElement(container, this._emptyListComponent, RenderPosition.BEFOREEND);
      return;
    } else {

      placeElement(container, this._listComponent, RenderPosition.BEFOREEND);

      this._renderLoadMoreButton();

      this._renderFilms(this._films.slice(0, this._showingFilmsCount));

      const [...extras] = generateExtra(EXTRA_COUNT);

      let shift = 0;
      extras.forEach((it, i) => {
        const tag = it.extraFlag;
        if (tag === `rating`) {
          if (this._films.reduce((acc, that) => acc + that[tag], 0) > 0) {
            placeElement(container, new ExtraListComponent(it.extraName), RenderPosition.BEFOREEND);

            const extraListBlock = [...container.querySelectorAll(`.films-list--extra`)][i];
            if (this._films.every((elem) => elem[tag] === this._films[0][tag])) {
              const filmsShuffled = shuffle(this._films).slice(0, EXTRA_FILMS_COUNT);
              const extraListContainer = extraListBlock.querySelector(`.films-list__container`);
              renderFilms(extraListContainer, filmsShuffled, this._onDataChange, this._onViewChange, this._api);
            } else {
              const extraListContainer = extraListBlock.querySelector(`.films-list__container`);
              renderFilms(extraListContainer, this._films.slice().sort((a, b) => b[tag] - a[tag]).slice(0, EXTRA_FILMS_COUNT), this._onDataChange, this._onViewChange, this._api);
            }
          } else {
            shift = shift + 1;
          }
        } else if (tag === `commentsQuantity`) {
          if (this._films.reduce((acc, that) => acc + that[tag], 0) > 0) {
            placeElement(container, new ExtraListComponent(it.extraName), RenderPosition.BEFOREEND);
            const row = shift > 0 ? 0 : i;
            const extraListBlock = [...container.querySelectorAll(`.films-list--extra`)][row];
            // const extraListBlock = container.querySelector(`.films-list--extra`);
            // const extraListContainer = extraListBlock.querySelector(`.films-list__container`);
            if (this._films.every((elem) => elem[tag].length === this._films[0][tag])) {
              const filmsShuffled = shuffle(this._films).slice(0, EXTRA_FILMS_COUNT);
              const extraListContainer = extraListBlock.querySelector(`.films-list__container`);
              renderFilms(extraListContainer, filmsShuffled, this._onDataChange, this._onViewChange, this._api);
            } else {
              const extraListContainer = extraListBlock.querySelector(`.films-list__container`);
              renderFilms(extraListContainer, this._films.slice().sort((a, b) => b[tag] - a[tag]).slice(0, EXTRA_FILMS_COUNT), this._onDataChange, this._onViewChange, this._api);
            }
          }
        } else {
          throw new Error(`Unknown type of extra-film-list`);
        }
      });
    }
  }

  _renderFilms(films) {
    const listContainer = this._listComponent.getElement().querySelector(`.films-list__container`);
    const newFilms = renderFilms(listContainer, films, this._onDataChange, this._onViewChange, this._api);
    this._showedFilms = this._showedFilms.concat(newFilms);
    this._showingFilmsCount = this._showedFilms.length;
  }

  _renderLoadMoreButton() {
    if (this._showedFilms.length >= this._films.length) {
      return;
    }
    placeElement(this._listComponent.getElement(), this._loadMoreButtonComponent, RenderPosition.BEFOREEND);
    this._loadMoreButtonComponent.setClickHandler(this._onLoadMoreButtonClick);
  }

  _onLoadMoreButtonClick() {
    const prevFilmsCount = this._showingFilmsCount;
    this._showingFilmsCount = this._showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

    this._renderFilms(this._films.slice(prevFilmsCount, this._showingFilmsCount));

    if (this._showingFilmsCount >= this._films.length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _onDataChange(movieController, oldData, newData) {
    if (newData === null) {
      console.log('newData === null')
      this._api.deleteComment(movieController.film.id, oldData)
        .then((filmId) => {
          this._api.getComments(filmId)
            .then((comments) => {
              const newComments = CommentsModel.parseComments(comments);
              movieController.update(movieController.film, newComments);
            });
        })
        .catch(() => {
          movieController.shake(true);
        });
    } else if (oldData === null) {
      console.log('oldData === null')

      this._api.addComment(movieController.film.id, this._filmsModel.addComment(newData, movieController))
        .then((filmId) => {
          this._api.getComments(filmId)
            .then((comments) => {
              const newComments = CommentsModel.parseComments(comments);
              movieController.update(movieController.film, newComments);
            });
        })
        .catch(() => {
          movieController.shake(true);
        });

    } else {
      this._api.updateFilm(oldData.id, newData)
        .then((filmModel) => {
          this._filmsModel.updateFilm(oldData.id, filmModel);

          // if (isSuccess) {
          //   this._api.getComments(filmModel.id)
          //     .then((comments) => {
          //       filmModel.comments = comments;
          //       movieController.update(filmModel);
          //       this._filterController.update();
          //     });
          // }
        })
        .catch(() => {
          movieController.shake();
        });
    }
  }

  _onViewChange() {
    this._movieControllersAll.forEach((it) => {
      it.setDefaultView();
    });
  }

  _onSortTypeChange(sortType) {
    let sortedFilms = [];
    const films = this._filmsModel.getFilms();

    switch (sortType) {
      case SortType.DATE_DOWN:
        sortedFilms = films.slice().sort((a, b) => b.year - a.year);
        break;
      case SortType.RATING_DOWN:
        sortedFilms = films.slice().sort((a, b) => b.rating - a.rating);
        break;
      case SortType.DEFAULT:
        this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
        sortedFilms = films.slice(0, this._showingFilmsCount);
        break;
    }

    this._removeFilms();
    this._renderFilms(sortedFilms);
    console.log(this._films);


    if (sortType === SortType.DEFAULT) {
      this._renderLoadMoreButton();
    } else {
      remove(this._loadMoreButtonComponent);
    }
  }

  _onFilterChange() {
    if (this.hidden) {
      this.hidden = false;
      this._showComponent();
    }
    this._removeFilms();
    this._films = this._filmsModel.getFilteredFilms();
    this._renderFilms(this._films.slice(0, SHOWING_FILMS_COUNT_ON_START));
    this._renderLoadMoreButton();
  }

  _removeFilms() {
    this._showedFilms.forEach((filmsController) => filmsController.destroy());
    this._showedFilms = [];
  }

  toggleVisibility() {
    // console.log(this.hidden);
    if (!this.hidden) {
      this._hideComponent();
    } else {
      this._showComponent();
    }
    this.hidden = !this.hidden;
  }

  _showComponent() {
    this._container.show();
    this._statisticsBlock.hide();
  }

  _hideComponent() {
    this._container.hide();
    this._statisticsBlock.show();
  }
}
