import moment from "moment";
// import CommentsModel from "./comments-model";

export default class FilmModel {
  constructor(data) {
    this.id = data[`id`];
    this.name = data.film_info[`title`];
    this.poster = data.film_info[`poster`];
    this.description = data.film_info[`description`];
    this.rating = data.film_info[`total_rating`];
    this.releaseDate = data.film_info.release[`date`];
    this.year = moment(data.film_info.release[`date`]).format(`YYYY`);
    this.duration = data.film_info[`runtime`]; // изменить формулы
    this.genre = data.film_info[`genre`];
    this.commentsQuantity = data.comments.length;
    // filterTag
    this.isWatchList = data.user_details[`watchlist`];
    this.isFavorite = data.user_details[`favorite`];
    this.isWatched = data.user_details[`already_watched`];
    this.isWatchedDate = data.user_details[`watching_date`];
    this.nameOrigin = data.film_info[`alternative_title`];
    this.pegi = data.film_info[`age_rating`];
    this.userRating = data.user_details[`personal_rating`];
    this.director = data.film_info[`director`];
    this.screenwriter = data.film_info[`writers`];
    this.actors = data.film_info[`actors`];
    this.fullDate = moment(data.film_info.release[`date`]).format(`YYYY/MM/DD HH:MM`);
    this.country = data.film_info.release[`release_country`];
  }

  toRAW() {
    return {
      'id': this.id,
      'film_info': {
        'title': this.name,
        'alternative_title': this.nameOrigin,
        'total_rating': this.rating,
        'poster': this.poster,
        'age_rating': this.pegi,
        'director': this.director,
        'writers': this.screenwriter,
        'actors': this.actors,
        'release': {
          'date': this.releaseDate,
          'release_country': this.country
        },
        'runtime': this.duration,
        'genre': this.genre,
        'description': this.description,
      },
      'user_details': {
        'personal_rating': this.userRating,
        'watchlist': this.isWatchList,
        'already_watched': this.isWatched,
        'watching_date': this.isWatchedDate,
        'favorite': this.isFavorite,
      },
      'comments': []
    };
  }

  static parseFilm(data) {
    return new FilmModel(data);
  }

  static parseFilms(data) {
    return data.map(FilmModel.parseFilm);
  }

  // static getComments(data) {
  //   return data.map(FilmModel.parseComments);
  // }
  //
  // static parseComments(data) {
  //   return data.map((it) => new CommentsModel.parseComments(data));
  // }

  static clone(data) {
    return new FilmModel(data.toRAW());
  }
}
