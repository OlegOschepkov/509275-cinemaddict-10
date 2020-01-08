// import {FilterType} from '../components/filter';

export const getFavoriteFilms = (films) => {
  return films.filter((film) => film.isFavorite);
};

export const getWatchListFilms = (films) => {
  return films.filter((film) => film.isWatchList);
};

export const getWatchedFilms = (films) => {
  return films.filter((film) => film.isWatched);
};

export const getFilmsByFilter = (films, filterType) => {
  // console.log((films.filter((films) => films.isWatchList)).length)
  switch (filterType) {
    case `ALL`:
      return films;
    case `FAVORITES`:
      return getFavoriteFilms(films);
    case `WATCHLIST`:
      return getWatchListFilms(films);
    case `WATCHED`:
      return getWatchedFilms(films);
    // case FilterType.STATS:
    //   return ??(films);
  }
  return films;
};
