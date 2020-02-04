import nanoid from "nanoid";
import FilmModel from "../models/film-model";
import CommentsModel from "../models/comments-model";

const getSyncedData =
  (items) => items.filter(({success}) => success).map(({payload}) => payload.film);

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSynchronized = true;
  }

  getFilms() {
    if (this.getIsOnLine()) {
      return this._api.getFilms().then(
          (films) => {
            films.forEach((film) => this._store.setItem(`film_${film.id}`, film.toRAW()));
            return films;
          }
      );
    }

    const filmNames = Object.keys(this._store.getAll()).filter(function (k) {
      return !k.indexOf(`film_`);
    });
    const storeFilms = filmNames.map((it) => this._store.getAll()[it]);
    this._isSynchronized = false;
    return Promise.resolve(FilmModel.parseFilms(storeFilms));
  }

  getComments(id) {
    if (this.getIsOnLine()) {
      return this._api.getComments(id).then(
          (comments) => {
            comments.forEach((comment) => comment.toRAW());
            this._store.setItem(`comments_${id}`, comments);
            return comments;
          }
      );
    }

    const storeComments = this._store.getAll()[`comments_${id}`];
    this._isSynchronized = false;

    return Promise.resolve(CommentsModel.parseComments(storeComments));
  }

  getSynchronize() {
    return this._isSynchronized;
  }

  getIsOnLine() {
    return window.navigator.onLine;
  }

  updateFilm(id, film) {
    if (this.getIsOnLine()) {
      return this._api.updateFilm(id, film).then(
          (newData) => {
            this._store.setItem(`film_${newData.id}`, newData.toRAW());
            return newData;
          }
      );
    }

    const fakeUpdatedFilm = FilmModel.parseFilms(Object.assign({}, film.toRAW(), `film_${id}`));
    this._isSynchronized = false;

    this._store.setItem(`film_${id}`, Object.assign({}, fakeUpdatedFilm.toRAW(), {offline: true}));

    return Promise.resolve(fakeUpdatedFilm);
  }

  addComment(id, comment) {
    if (this.getIsOnLine()) {
      return this._api.addComment(id, comment);
    }

    const fakeNewCommentId = nanoid();
    const fakeNewComment = CommentsModel.parseComment(Object.assign({}, comment.toRAW(), {id: fakeNewCommentId}));
    this._isSynchronized = false;

    this._store.setItem(fakeNewComment.id, Object.assign({}, fakeNewComment.toRAW(), {offline: true}));

    return Promise.resolve(fakeNewComment);
  }

  deleteComment(id, comment) {
    if (this.getIsOnLine()) {
      return this._api.deleteComment(id, comment);
    }

    return false;
  }

  sync() {
    if (this.getIsOnLine()) {
      const filmNames = Object.keys(this._store.getAll()).filter(function (k) {
        return !k.indexOf(`film_`);
      });
      const storeFilms = filmNames.map((it) => this._store.getAll()[it]);

      return this._api.sync(storeFilms)
        .then((response) => {
          storeFilms.forEach((film) => {
            if (film.offline) {
              this._store.removeItem(film.id);
            }
          });

          const createdFilms = getSyncedData(response.created);
          const updatedFilms = getSyncedData(response.updated);
          [...createdFilms, ...updatedFilms].forEach((film) => {
            this._store.setItem(film.id, film);
          });

          this._isSynchronized = true;

          return Promise.resolve();
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
