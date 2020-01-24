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
    if (this._isOnLine()) {
      return this._api.getFilms().then(
          (films) => {
            films.forEach((film) => this._store.setItem(`film_${film.id}`, film.toRAW()));
            return films;
          }
      );
    }

    const foo = Object.keys(this._store.getAll()).filter(function (k) {
      return ~k.indexOf(`film_`);
    });
    const storeFilms = foo.map((it) => this._store.getAll()[it]);
    this._isSynchronized = false;
    // console.log(this._store.getAll())
    return Promise.resolve(FilmModel.parseFilms(storeFilms));
  }

  getComments(id) {
    if (this._isOnLine()) {
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

  updateFilm(id, data) {
    if (this._isOnLine()) {
      return this._api.updateFilm(id, data).then(
          (newData) => {
            // console.log(newData)
            this._store.setItem(newData.id, newData.toRAW());
            return newData;
          }
      );
    }

    const fakeUpdatedFilm = FilmModel.parseFilms(Object.assign({}, data.toRAW(), {id}));
    this._isSynchronized = false;

    this._store.setItem(id, Object.assign({}, fakeUpdatedFilm.toRAW(), {offline: true}));
    // console.log(this._store.getAll())

    // return Promise.resolve(fakeUpdatedFilm);
  }

  addComment(id, comment) {
    if (this._isOnLine()) {
      return this._api.addComment(id, comment);
    }

    const fakeNewCommentId = nanoid();
    const fakeNewComment = CommentsModel.parseComment(Object.assign({}, comment.toRAW(), {id: fakeNewCommentId}));
    this._isSynchronized = false;

    this._store.setItem(fakeNewComment.id, Object.assign({}, fakeNewComment.toRAW(), {offline: true}));

    return Promise.resolve(fakeNewComment);
  }

  deleteComment(id, comment) {
    if (this._isOnLine()) {
      return this._api.deleteComment(id, comment);
    }

    return false; // заглушка

    // this._isSynchronized = false;
    // this._store.removeItem(id);
    //
    // return Promise.resolve();
  }

  sync() {
    if (this._isOnLine()) {
      const foo = Object.keys(this._store.getAll()).filter(function (k) {
        return ~k.indexOf(`film_`);
      });
      const storeFilms = foo.map((it) => this._store.getAll()[it]);
      // console.log(storeFilms)

      return this._api.sync(storeFilms)
        .then((response) => {
          // console.log(response)
          // Удаляем из хранилища задачи, что были созданы
          // или изменены в оффлайне. Они нам больше не нужны
          storeFilms.filter((film) => film.offline).forEach((film) => {
            this._store.removeItem(film.id);
          });

          // Забираем из ответа синхронизированные задачи
          const createdTasks = getSyncedData(response.created);
          const updatedTasks = getSyncedData(response.updated);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент,
          // вдруг сеть пропадёт
          [...createdTasks, ...updatedTasks].forEach((film) => {
            this._store.setItem(film.id, film);
          });

          // Помечаем, что всё синхронизировано
          this._isSynchronized = true;

          return Promise.resolve();
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  getSynchronize() {
    return this._isSynchronized;
  }

  _isOnLine() {
    return window.navigator.onLine;
  }
}
