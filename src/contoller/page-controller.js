import ListComponent from "../components/list";
import ExtraListComponent from "../components/list-extra";
import LoadMoreBtnComponent from "../components/load-more-btn";
import EmptyListComponent from "../components/empty-list";
import {SortType} from "../components/sort.js";
import {placeElement, RenderPosition, remove} from "../utils/render";
import {shuffle} from "../utils/utils";
import MovieController, {Mode as MovieControllerMode} from "./movie-controller";
import {generateExtra} from "../mock/extra";
import CommentsModel from "../models/comments-model";

const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;
const EXTRA_COUNT = 2;
const EXTRA_FILMS_COUNT = 2;

const renderFilms = (filmListElement, films, onDataChange, onViewChange, api) => {
  return films.map((film) => {
    const filmController = new MovieController(filmListElement, onDataChange, onViewChange, api);
    filmController.renderCard(film, MovieControllerMode.DEFAULT);
    return filmController;
  });
};

const prepareExtraFilms = (films, tag) => {
  return shuffle(films).sort((a, b) => b[tag] - a[tag]).slice(0, EXTRA_FILMS_COUNT);
};

const shuffleExtraFilms = (films) => {
  return shuffle(films).slice(0, EXTRA_FILMS_COUNT);
};

export default class PageController {
  constructor(container, filmsModel, filter, statistics, api, user, sort) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._api = api;
    this._user = user;
    this._films = [];
    this._showedFilms = [];
    this._showedExtraFilmsComments = [];
    this._showedExtraFilmsRating = [];
    this._movieControllersAll = [];
    this._emptyListComponent = new EmptyListComponent();
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
    this._listComponent = new ListComponent();
    this._sortComponent = sort;
    this._statisticsBlock = statistics;
    this._filterController = filter;
    this._loadMoreButtonComponent = new LoadMoreBtnComponent();
    this._onViewChange = this._onViewChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.onSortTypeChange(this._onSortTypeChange);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._filmsModel.onFilterChange(this._onFilterChange);
    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);
    this.toggleVisibility = this.toggleVisibility.bind(this);
    this._filterController.onStatsClick(this.toggleVisibility);
  }

  render() {
    this._films = this._filmsModel.getFilms();
    const container = this._container.getElement();
    this._user.setLevel(this._films);
    this._user.update();
    this._statisticsBlock.update(this._filmsModel.getFilms(), this._user.getLevel());

    if (this._films.length === 0) {
      placeElement(container, this._emptyListComponent, RenderPosition.BEFOREEND);
      return;
    }

    placeElement(container, this._listComponent, RenderPosition.BEFOREEND);
    this._renderLoadMoreButton();
    this._renderFilms(this._films.slice(0, this._showingFilmsCount));
    this._renderExtra(this._films);
  }

  _renderExtra(films) {
    const container = this._container.getElement();
    const [...extras] = generateExtra(EXTRA_COUNT);
    this._removeExtraFilms();

    const extraFilmsRender = (it, tag) => {
      let listType;
      let showedFilms;
      switch (tag) {
        case `rating`:
          listType = this._extraListRating;
          break;
        case `commentsQuantity`:
          listType = this._extraListComments;
          break;
      }
      if (films.reduce((acc, that) => acc + that[tag], 0) > 0) {
        if (!listType) {
          switch (tag) {
            case `rating`:
              listType = new ExtraListComponent(it.extraName);
              break;
            case `commentsQuantity`:
              listType = new ExtraListComponent(it.extraName);
              break;
          }
        }
        placeElement(container, listType, RenderPosition.BEFOREEND);
        if (films.every((elem) => elem[tag] === films[0][tag])) {
          const extraListContainer = listType.getElement().querySelector(`.films-list__container`);
          renderFilms(extraListContainer, shuffleExtraFilms(films), this._onDataChange, this._onViewChange, this._api);
        } else {
          const extraListContainer = listType.getElement().querySelector(`.films-list__container`);
          switch (tag) {
            case `rating`:
              this._showedExtraFilmsRating = renderFilms(extraListContainer, prepareExtraFilms(films, tag), this._onDataChange, this._onViewChange, this._api);
              showedFilms = this._showedExtraFilmsRating;
              break;
            case `commentsQuantity`:
              this._showedExtraFilmsComments = renderFilms(extraListContainer, prepareExtraFilms(films, tag), this._onDataChange, this._onViewChange, this._api);
              showedFilms = this._showedExtraFilmsComments;
              break;
          }
          showedFilms = renderFilms(extraListContainer, prepareExtraFilms(films, tag), this._onDataChange, this._onViewChange, this._api);
          this._movieControllersAll = this._movieControllersAll.concat(showedFilms);
        }
      }
    };

    extras.forEach((it) => {
      const tag = it.extraFlag;
      if (tag === `rating`) {
        if (films.reduce((acc, that) => acc + that[tag], 0) > 0) {
          extraFilmsRender(it, tag);
        }
      } else if (tag === `commentsQuantity`) {
        if (films.reduce((acc, that) => acc + that[tag], 0) > 0) {
          extraFilmsRender(it, tag);
        }
      } else {
        throw new Error(`Unknown type of extra-film-list`);
      }
    });
  }

  _renderFilms(films) {
    const listContainer = this._listComponent.getElement().querySelector(`.films-list__container`);
    const newFilms = renderFilms(listContainer, films, this._onDataChange, this._onViewChange, this._api);
    this._showedFilms = this._showedFilms.concat(newFilms);
    this._movieControllersAll = this._movieControllersAll.concat(newFilms);
    this._showingFilmsCount = this._showedFilms.length;
  }

  _renderLoadMoreButton() {
    if (this._showedFilms.length >= this._films.length) {
      return;
    }
    placeElement(this._listComponent.getElement(), this._loadMoreButtonComponent, RenderPosition.BEFOREEND);
    this._loadMoreButtonComponent.onClick(this._onLoadMoreButtonClick);
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
      let newComments;
      this._api.deleteComment(movieController.film.id, oldData)
        .then((filmId) => {
          this._getFilms(movieController, filmId, newComments);
        })
        .catch(() => {
          movieController.shake(true);
        });
    } else if (oldData === null) {
      let newComments;
      this._api.addComment(movieController.film.id, this._filmsModel.addComment(newData, movieController))
        .then((filmId) => {
          this._getFilms(movieController, filmId, newComments);
        })
        .catch(() => {
          movieController.shake(true);
        });
    } else {
      const oldFilms = this._filmsModel.getFilteredFilms();
      this._api.updateFilm(oldData.id, newData)
        .then((filmModel) => {
          this._filmsModel.updateFilm(oldData.id, filmModel);
          this._films = this._filmsModel.getFilteredFilms();
          movieController.update(filmModel);
          this._filterController.update();
          this._user.setLevel(this._films);
          this._statisticsBlock.update(this._films, this._user.getLevel());
          this._user.update();
          if (oldFilms.length !== this._films.length) {
            this._onFilterChange();
          }
        })
        .catch(() => {
          movieController.shake();
        });
    }
  }

  _getFilms(movieController, filmId, updatedComments) {
    this._api.getComments(filmId)
      .then((comments) => {
        updatedComments = CommentsModel.parseComments(comments);
      })
      .then(() => {
        this._api.getFilms()
          .then((films) => {
            this._filmsModel.updateFilm(movieController.film.id, films.filter((it) => it.id === movieController.film.id));
            movieController.update(this._filmsModel.getFilm(movieController.film.id), updatedComments);
            this._renderExtra(films);
          });
      });
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

    if (sortType === SortType.DEFAULT) {
      this._renderLoadMoreButton();
    } else {
      remove(this._loadMoreButtonComponent);
    }
  }

  _onFilterChange() {
    remove(this._loadMoreButtonComponent);
    if (this.hidden) {
      this.hidden = false;
      this._showComponent();
    }
    this._removeFilms();
    this._films = this._filmsModel.getFilteredFilms();
    this._renderFilms(this._films.slice(0, SHOWING_FILMS_COUNT_ON_START));
    this._filterController.update();
    this._renderLoadMoreButton();
  }

  _removeFilms() {
    this._showedFilms.forEach((filmsController) => filmsController.destroy());
    this._showedFilms = [];
  }

  _removeExtraFilms() {
    this._showedExtraFilmsComments.forEach((filmsController) => filmsController.destroy());
    this._showedExtraFilmsRating.forEach((filmsController) => filmsController.destroy());
    this._showedExtraFilmsComments = [];
    this._showedExtraFilmsRating = [];
  }

  toggleVisibility() {
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
