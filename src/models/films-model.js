import {getFilmsByFilter} from "../utils/filter-utils";
import {getRandomDate} from "../utils/utils";
import he from "he";
import {FilterType} from "../components/filter";

export default class FilmsModel {
  constructor() {
    this._films = [];

    this._activeFilterType = FilterType.ALL;

    this._filterChangeHandlers = [];
    this._dataChangeHandlers = [];
  }

  getFilteredFilms() {
    return getFilmsByFilter(this._films, this._activeFilterType);
  }

  getFilteredByTimeFilms() {
    return getFilmsByFilter(this._films, this._activeFilterType);
  }

  getFilms() {
    return this._films;
  }

  getFilm(id) {
    return this._films[id];
  }

  setFilms(films) {
    this._films = films;
    this._callHandlers(this._dataChangeHandlers);
  }

  updateFilm(id, newFilm) {
    const index = this._films.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._films = [].concat(this._films.slice(0, index), newFilm, this._films.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  addComment(comment, filmId) {
    const index = this._films.findIndex((it) => it.id === filmId.film.id);

    if (index === -1) {
      return false;
    }

    const safeText = he.encode(comment);
    const newComment = {
      comment: safeText,
      date: getRandomDate(new Date(2010, 0, 1), new Date(), false),
      emotion: filmId.yourEmoji
    };
    return newComment;
  }

  removeComment(film, commentId) {
    const index = this._films.findIndex((it) => it.id === film.id);

    if (index === -1) {
      return false;
    }

    const thatFilm = this._films[index];
    const indexComment = thatFilm.comments.findIndex((comment) => comment.id === commentId);

    if (indexComment === -1) {
      return false;
    }

    thatFilm.comments = [].concat(thatFilm.comments.slice(0, indexComment), thatFilm.comments.slice(indexComment + 1));
    return commentId;
  }

  onFilterChange(handler) {
    this._filterChangeHandlers.push(handler);
  }

  onDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }
}
