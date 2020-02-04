import AbstractSmartComponent from "./abstract-smart-component";
import {getHumanReadableDuration} from "../utils/utils";
import debounce from "lodash/debounce";
import moment from "moment";

const DEBOUNCE_TIMEOUT = 300;
const MIN_RATING = 1;
const MAX_RATING = 9;

const humanize = (timeObj) => {
  let humanizedString;
  if (timeObj.days >= 2) {
    humanizedString = `a few day ago`;
  } else if (timeObj.days > 0 && timeObj.days < 2) {
    humanizedString = `a day ago`;
  } else if (timeObj.hours >= 2 && timeObj.hours < 24) {
    humanizedString = `a few hour ago`;
  } else if (timeObj.hours > 0 && timeObj.hours < 2) {
    humanizedString = `a hour ago`;
  } else if (timeObj.minutes > 2 && timeObj.minutes < 60) {
    humanizedString = `a few minutes ago`;
  } else if (timeObj.minutes > 1 && timeObj.minutes < 3) {
    humanizedString = `a minute ago`;
  } else if (timeObj.seconds >= 0 && timeObj.seconds < 60) {
    humanizedString = `now`;
  }

  return humanizedString;
};

const getGenreMarkup = (genreSingle) => {
  return (
    `<span class="film-details__genre">${genreSingle}</span>`
  );
};

const getRatingScoreMarkup = (rating) => {
  const ratingElements = [];
  for (let i = MIN_RATING; i <= MAX_RATING; i++) {
    let isChekced = false;
    if (i === rating) {
      isChekced = true;
    }
    ratingElements.push(`<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${i}" id="rating-${i}" ${isChekced ? `checked` : ``}>
                    <label class="film-details__user-rating-label" for="rating-${i}">${i}</label>`);
  }
  return ratingElements;
};

const getCommentMarkup = (comments) => {
  const {id, comment, author, date, emotion} = comments;

  const time = {
    days: Math.round(moment.duration(new Date() - new Date(date), `milliseconds`).days()),
    hours: Math.round(moment.duration(new Date() - new Date(date), `milliseconds`).hours()),
    minutes: Math.round(moment.duration(new Date() - new Date(date), `milliseconds`).minutes()),
    seconds: Math.round(moment.duration(new Date() - new Date(date), `milliseconds`).seconds())
  };

  const humanizedDate = humanize(time);

  return (
    `<li class="film-details__comment" data-id="${id}">
      ${emotion ? `<span class="film-details__comment-emoji">
          <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji">
        </span>` : ``}
        <div>
          <p class="film-details__comment-text">${comment}</p>
          <p class="film-details__comment-info">
             <span class="film-details__comment-author">${author}</span>
             <span class="film-details__comment-day">${humanizedDate}</span>
             <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
    </li>`
  );
};

const getCardPopupTemplate = (film, comments, emoji, isOnline) => {
  const {poster, name, isFavorite, isWatched, isWatchList, yourRating, nameOrigin, pegi, rating, director, screenwriter, actors, fullDate, duration, country, description, genre} = film;
  const onlineCheck = isOnline;
  let commentMarkup = ``;
  let commentsLength;
  const yourEmoji = emoji;
  if (comments && comments.length > 0) {
    commentMarkup = comments.map((it) => getCommentMarkup(it)).join(`\n`);
    commentsLength = comments.length;
  }
  const genreMarkup = genre.map((it) => getGenreMarkup(it)).join(`\n`);
  const ratingScoreMarkup = getRatingScoreMarkup(yourRating).join(`\n`);
  const durationHumanReadable = getHumanReadableDuration(duration);

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
          <div class="form-details__top-container">
            <div class="film-details__close">
              <button class="film-details__close-btn" type="button">close</button>
            </div>
            <div class="film-details__info-wrap">
              <div class="film-details__poster">
                <img class="film-details__poster-img" src="${poster}" alt="">

                <p class="film-details__age">${pegi}+</p>
              </div>

              <div class="film-details__info">
                <div class="film-details__info-head">
                  <div class="film-details__title-wrap">
                    <h3 class="film-details__title">${name}</h3>
                    <p class="film-details__title-original">Original: ${nameOrigin}</p>
                  </div>

                  <div class="film-details__rating">
                    <p class="film-details__total-rating">${rating}</p>
                    <p class="film-details__user-rating ${isWatched && yourRating > 0 ? `` : `visually-hidden`}">Your rate ${yourRating}</p>
                  </div>
                </div>

                <table class="film-details__table">
                  <tr class="film-details__row">
                    <td class="film-details__term">Director</td>
                    <td class="film-details__cell">${director}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Writers</td>
                    <td class="film-details__cell">${screenwriter}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Actors</td>
                    <td class="film-details__cell">${actors}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Release Date</td>
                    <td class="film-details__cell">${fullDate}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Runtime</td>
                    <td class="film-details__cell">${durationHumanReadable}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Country</td>
                    <td class="film-details__cell">${country}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">${genre.length > 1 ? `Genres` : `Genre`}</td>
                    <td class="film-details__cell">
                      ${genreMarkup}
                  </tr>
                </table>

                <p class="film-details__film-description">
                ${description}
                </p>
              </div>
            </div>

            <section class="film-details__controls">
              <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isWatchList ? `checked` : ``}>
              <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

              <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatched ? `checked` : ``}>
              <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

              <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorite ? `checked` : ``}>
              <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
            </section>
          </div>

          <div class="form-details__middle-container ${isWatched ? `` : `visually-hidden`}">
            <section class="film-details__user-rating-wrap">
              <div class="film-details__user-rating-controls">
                <button class="film-details__watched-reset" type="button">Undo</button>
              </div>

              <div class="film-details__user-score">
                <div class="film-details__user-rating-poster">
                  <img src="./images/posters/the-great-flamarion.jpg" alt="film-poster" class="film-details__user-rating-img">
                </div>

                <section class="film-details__user-rating-inner">
                  <h3 class="film-details__user-rating-title">${name}</h3>

                  <p class="film-details__user-rating-feelings">How you feel it?</p>

                  <div class="film-details__user-rating-score">
                  ${ratingScoreMarkup}
                  </div>
                </section>
              </div>
            </section>
          </div>

          <div class="form-details__bottom-container">
            <section class="film-details__comments-wrap">
            ${onlineCheck ? `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsLength}</span></h3> ` : `<h3 class="film-details__comments-title shake-infinite">Please check internet connection!</h3>`}

              <ul class="film-details__comments-list">
                  ${commentMarkup}
              </ul>

              <div class="film-details__new-comment">
                <div for="add-emoji" class="film-details__add-emoji-label">${yourEmoji ? `<img src="./images/emoji/${yourEmoji}.png" width="30" height="30" alt="emoji">` : ``}</div>

                <label class="film-details__comment-label">
                  <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${onlineCheck ? `` : `disabled`}></textarea>
                </label>

                <div class="film-details__emoji-list">
                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${onlineCheck ? `` : `disabled`}>
                  <label class="film-details__emoji-label" for="emoji-smile">
                    <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                  </label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${onlineCheck ? `` : `disabled`}>
                  <label class="film-details__emoji-label" for="emoji-sleeping">
                    <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                  </label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-gpuke" value="puke" ${onlineCheck ? `` : `disabled`}>
                  <label class="film-details__emoji-label" for="emoji-gpuke">
                    <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                  </label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${onlineCheck ? `` : `disabled`}>
                  <label class="film-details__emoji-label" for="emoji-angry">
                    <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                  </label>
                </div>
              </div>
            </section>
          </div>
        </form>
    </section>`
  );
};

export default class CardPopup extends AbstractSmartComponent {
  constructor(film, comments) {
    super();
    this._film = film;
    this._comments = comments;
    this._emoji = ``;
    this._onDeleteButtonClick = null;
  }

  getTemplate() {
    return getCardPopupTemplate(this._film, this._comments, this._emoji, this._isOnline);
  }

  setEmoji(emoji) {
    this._emoji = emoji;
    this.rerender();
    this._emoji = ``;
  }

  setStatus(isOnline) {
    this._isOnline = isOnline;
  }

  update(film, comments) {
    this._film = film;
    this._comments = comments;
    this.rerender();
  }

  removeElement() {
    super.removeElement();
  }

  disableToggle() {
    this.getElement().querySelector(`.film-details__comment-input`).toggleAttribute(`readonly`, true);
  }

  recoveryListeners() {
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, this._onWatchListClick);
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, this._onFavoriteClick);
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, this._onWatchedClick);
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._onCloseHandler);
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`click`, this._onEmojiClick);
    this.getElement().querySelector(`.film-details__user-rating-score`).addEventListener(`click`, this._onYourRatingClick);
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`keydown`, this._ontSubmitHandler);
    this.getElement().querySelector(`.film-details__watched-reset`).addEventListener(`click`, this._onResetClick);

    if (this.getElement().querySelector(`.film-details__comment-delete`)) {
      [...this.getElement().querySelectorAll(`.film-details__comment-delete`)].forEach((it) => {
        it.addEventListener(`click`, this._onDeleteButtonClick);
      });
    }
  }

  onCloseHandler(handler) {
    this._onCloseHandler = handler;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);
  }

  onWatchListClick(handler) {
    this._onWatchListClick = handler;
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, debounce(handler, DEBOUNCE_TIMEOUT));
  }

  onFavoriteClick(handler) {
    this._onFavoriteClick = handler;
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, debounce(handler, DEBOUNCE_TIMEOUT));
  }

  onWatchedClick(handler) {
    this._onWatchedClick = handler;
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, debounce(handler, DEBOUNCE_TIMEOUT));
  }

  onEmojiClick(handler) {
    this._onEmojiClick = handler;
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`click`, debounce(handler, DEBOUNCE_TIMEOUT));
  }

  onYourRatingClick(handler) {
    this._onYourRatingClick = handler;
    this.getElement().querySelector(`.film-details__user-rating-score`).addEventListener(`click`, debounce(handler, DEBOUNCE_TIMEOUT));
  }

  onSubmitClick(handler) {
    this._ontSubmitHandler = handler;
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`keydown`, debounce(handler, DEBOUNCE_TIMEOUT));
  }

  onResetClick(handler) {
    this._onResetClick = handler;
    this.getElement().querySelector(`.film-details__watched-reset`).addEventListener(`click`, debounce(handler, DEBOUNCE_TIMEOUT));
  }

  onDeleteButtonClick(handler) {
    this._onDeleteButtonClick = handler;
    if (this.getElement().querySelector(`.film-details__comment-delete`)) {
      [...this.getElement().querySelectorAll(`.film-details__comment-delete`)].forEach((it) => {
        it.addEventListener(`click`, debounce(handler, DEBOUNCE_TIMEOUT));
      });
    }
  }
}

