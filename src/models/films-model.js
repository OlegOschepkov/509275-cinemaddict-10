// import {FilterType} from "../components/filter";
import {getFilmsByFilter} from "../utils/filter-utils";
import {randomDate} from "../utils/utils";
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
    // console.log(this._films)
    return this._films;
  }

  setFilms(films) {
    this._films = Array.from(films);
  }

  updateFilm(id, newFilm) {
    const index = this._films.findIndex((it) => it.id === id);

    if (index === -1) {
      return;
    }

    this._films = [].concat(this._films.slice(0, index), newFilm, this._films.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);
    this._callHandlers(this._filterChangeHandlers);
    //
    return true;
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  onFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  addComment(comment, filmId) {
    const index = this._films.findIndex((it) => it.id === filmId);

    if (index === -1) {
      return false;
    }

    const thatFilm = this._films[index];

    const safeText = he.encode(comment);
    const newComment = {
      id: Math.random(),
      text: safeText,
      author: `Guest`,
      date: randomDate(new Date(2010, 0, 1), new Date(), false),
      emoji: thatFilm.yourEmoji ? thatFilm.yourEmoji : ``
    };
    thatFilm.comments.unshift(newComment);

    return true;
  }

  removeComment(film, commentId) {

    const index = this._films.findIndex((it) => it.id === film.id);

    if (index === -1) {
      return false;
    }

    const thatFilm = this._films[index];

    const indexComment = thatFilm.comments.findIndex((comment) => comment.id === Number(commentId));

    if (indexComment === -1) {
      return false;
    }

    thatFilm.comments = [].concat(thatFilm.comments.slice(0, indexComment), thatFilm.comments.slice(indexComment + 1));

    return true;
  }
}
