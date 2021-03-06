import FilmModel from "../models/film-model";
import CommentsModel from "../models/comments-model";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  throw new Error(`${response.status}: ${response.statusText}`);
};

export default class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getFilms() {
    return this._load({url: `movies`})
      .then((response) => response.json())
      .then(FilmModel.parseFilms);
  }

  getComments(id) {
    return this._load({url: `comments/${id}`})
      .then((response) => response.json())
      .then(CommentsModel.parseComments);
  }

  updateFilm(id, film) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(film.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(FilmModel.parseFilm);
  }

  addComment(id, comment) {
    const commentsModel = new CommentsModel(comment);
    return this._load({
      url: `comments/${id}`,
      method: Method.POST,
      body: JSON.stringify(commentsModel.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(() => id);
  }

  deleteComment(id, comment) {
    return this._load({
      url: `comments/${comment}`,
      method: Method.DELETE,
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(() => id);
  }

  sync(films) {
    return this._load({
      url: `movies/sync`,
      method: Method.POST,
      body: JSON.stringify(films),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json());
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
