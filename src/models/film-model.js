import moment from "moment";

export default class FilmModel {
  constructor(film) {
    this.id = film[`id`];
    this.name = film.film_info[`title`];
    this.poster = film.film_info[`poster`];
    this.description = film.film_info[`description`];
    this.rating = film.film_info[`total_rating`];
    this.releaseDate = film.film_info.release[`date`];
    this.year = moment(film.film_info.release[`date`]).format(`YYYY`);
    this.duration = film.film_info[`runtime`];
    this.genre = film.film_info[`genre`];
    this.commentsQuantity = film.comments.length;
    this.isWatchList = film.user_details[`watchlist`];
    this.isFavorite = film.user_details[`favorite`];
    this.isWatched = film.user_details[`already_watched`];
    this.isWatchedDate = film.user_details[`watching_date`];
    this.nameOrigin = film.film_info[`alternative_title`];
    this.pegi = film.film_info[`age_rating`];
    this.yourRating = film.user_details[`personal_rating`];
    this.director = film.film_info[`director`];
    this.screenwriter = film.film_info[`writers`];
    this.actors = film.film_info[`actors`];
    this.fullDate = moment(film.film_info.release[`date`]).format(`DD MMMM YYYY`);
    this.country = film.film_info.release[`release_country`];
    this.comments = film.comments;
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
        'personal_rating': this.yourRating,
        'watchlist': this.isWatchList,
        'already_watched': this.isWatched,
        'watching_date': this.isWatchedDate,
        'favorite': this.isFavorite,
      },
      'comments': this.comments
    };
  }

  static parseFilm(film) {
    if (film.film_info) {
      return new FilmModel(film);
    } else {
      return false;
    }
  }

  static parseFilms(films) {
    if (!films) {
      return {};
    } else if (films.length) {
      return films.map(FilmModel.parseFilm);
    } else {
      return new FilmModel(films);
    }
  }

  static clone(film) {
    return new FilmModel(film.toRAW());
  }
}
