import AbstractSmartComponent from "./abstract-smart-component";

const getGenreMarkup = (genreSingle) => {
  return (
    `<span class="film-details__genre">${genreSingle}</span>`
  );
};

const getCommentMarkup = (comment) => {
  const {text, author, date, emoji} = comment;

  return (
    `<li class="film-details__comment">    
      ${emoji ? `<span class="film-details__comment-emoji">
          <img src="${emoji}" width="55" height="55" alt="emoji">
        </span>` : ``}
        <div>
          <p class="film-details__comment-text">${text}</p>
          <p class="film-details__comment-info">
             <span class="film-details__comment-author">${author}</span>
             <span class="film-details__comment-day">${date}</span>
             <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
    </li>`
  );
};

const getCardPopupTemplate = (popupData, comments, film) => {
  const {nameOrigin, pegi, rating, director, screenwriter, actor, fullDate, duration, country, fullDescription, genre} = popupData;
  const {poster, name, isFavorite, isWatched, isWatchList, yourRating, yourEmoji} = film;
  const commentMarkup = comments.map((it) => getCommentMarkup(it)).join(`\n`);
  const commentsLength = comments.length;
  const genreList = genre.split(`, `);
  const genreMarkup = genreList.map((it) => getGenreMarkup(it)).join(`\n`);

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
                    <p class="film-details__user-rating ${yourRating ? `yep` : `visually-hidden`}">Your rate ${yourRating}</p>
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
                    <td class="film-details__cell">${actor}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Release Date</td>
                    <td class="film-details__cell">${fullDate}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Runtime</td>
                    <td class="film-details__cell">${duration}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Country</td>
                    <td class="film-details__cell">${country}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">${genreList.length > 1 ? `Genres` : `Genre`}</td>
                    <td class="film-details__cell">
                      ${genreMarkup}
                  </tr>
                </table>
      
                <p class="film-details__film-description">
                ${fullDescription}
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
          
          <div class="form-details__middle-container ${isWatched ? `yep` : `visually-hidden`}">
            <section class="film-details__user-rating-wrap">
              <div class="film-details__user-rating-controls">
                <button class="film-details__watched-reset" type="button">Undo</button>
              </div>
      
              <div class="film-details__user-score">
                <div class="film-details__user-rating-poster">
                  <img src="./images/posters/the-great-flamarion.jpg" alt="film-poster" class="film-details__user-rating-img">
                </div>
      
                <section class="film-details__user-rating-inner">
                  <h3 class="film-details__user-rating-title">The Great Flamarion</h3>
      
                  <p class="film-details__user-rating-feelings">How you feel it?</p>
      
                  <div class="film-details__user-rating-score">
                    <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="1" id="rating-1">
                    <label class="film-details__user-rating-label" for="rating-1">1</label>
      
                    <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="2" id="rating-2">
                    <label class="film-details__user-rating-label" for="rating-2">2</label>
      
                    <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="3" id="rating-3">
                    <label class="film-details__user-rating-label" for="rating-3">3</label>
      
                    <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="4" id="rating-4">
                    <label class="film-details__user-rating-label" for="rating-4">4</label>
      
                    <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="5" id="rating-5">
                    <label class="film-details__user-rating-label" for="rating-5">5</label>
      
                    <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="6" id="rating-6">
                    <label class="film-details__user-rating-label" for="rating-6">6</label>
      
                    <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="7" id="rating-7">
                    <label class="film-details__user-rating-label" for="rating-7">7</label>
      
                    <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="8" id="rating-8">
                    <label class="film-details__user-rating-label" for="rating-8">8</label>
      
                    <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="9" id="rating-9" checked>
                    <label class="film-details__user-rating-label" for="rating-9">9</label>
      
                  </div>
                </section>
              </div>
            </section>
          </div>

      
          <div class="form-details__bottom-container">
            <section class="film-details__comments-wrap">
              <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsLength}</span></h3>
      
              <ul class="film-details__comments-list">
                  ${commentMarkup}
              </ul>
      
              <div class="film-details__new-comment">
                <div for="add-emoji" class="film-details__add-emoji-label">${yourEmoji ? yourEmoji : ``}</div>
      
                <label class="film-details__comment-label">
                  <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
                </label>
      
                <div class="film-details__emoji-list">
                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="sleeping">
                  <label class="film-details__emoji-label" for="emoji-smile">
                    <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                  </label>
      
                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="neutral-face">
                  <label class="film-details__emoji-label" for="emoji-sleeping">
                    <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                  </label>
      
                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-gpuke" value="grinning">
                  <label class="film-details__emoji-label" for="emoji-gpuke">
                    <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                  </label>
      
                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="grinning">
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
  constructor(popupData, comments, film) {
    super();
    this._film = film;
    this._comments = comments;
    this._popupData = popupData;
  }

  getTemplate() {
    return getCardPopupTemplate(this._popupData, this._comments, this._film);
  }

  update(popupData, comments, film) {
    // console.log(`component update`);
    this._film = film;
    this._comments = comments;
    this._popupData = popupData;
    this.rerender();
  }

  recoveryListeners() {
    // console.log(`recoveryListeners`, this.getElement());
    // console.log(this.getElement().querySelector(`.film-details__control-label--watchlist`), this._onWatchListClick);
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, this._onWatchListClick);
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, this._onFavoriteClick);
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, this._onWatchedClick);
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._setCloseHandler);
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`click`, this._onEmojiClick);
    this.getElement().querySelector(`.film-details__user-rating-score`).addEventListener(`click`, this._onYourRatingClick);
  }

  setCloseHandler(handler) {
    this._setCloseHandler = handler;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);
  }

  onWatchListClick(handler) {
    this._onWatchListClick = handler;
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, handler);
  }

  onFavoriteClick(handler) {
    this._onFavoriteClick = handler;
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, handler);
  }

  onWatchedClick(handler) {
    this._onWatchedClick = handler;
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, handler);
  }

  onEmojiClick(handler) {
    this._onEmojiClick = handler;
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`click`, handler);
  }

  onYourRatingClick(handler) {
    this._onYourRatingClick = handler;
    this.getElement().querySelector(`.film-details__user-rating-score`).addEventListener(`click`, handler);
  }
}

