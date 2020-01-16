import FilmModel from "./models/film-model";
import CommentsModel from "./models/comments-model";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const API = class {
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
      .then((response) => response.json());
  }

  updateFilm(id, data) {
    // console.log(JSON.stringify(data.toRAW()));
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(FilmModel.parseFilm);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }

  addComment(id, comment) {
    const commentsModel = new CommentsModel(comment);
    // console.log(JSON.stringify(commentsModel.toRAW()));
    return this._load({
      url: `comments/${id}`,
      method: Method.PUT,
      body: JSON.stringify(commentsModel.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(FilmModel.parseFilm);
  }

  deleteComment(id, comment) {
    // console.log(comment);
    return this._load({
      url: `comments/${id}`,
      method: Method.DELETE,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(FilmModel.parseFilm);

    // return this._load({url: `comments/${id}`, method: Method.DELETE});
  }
};

export default API;
