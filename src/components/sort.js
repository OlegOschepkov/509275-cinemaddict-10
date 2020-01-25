import AbstractSmartComponent from "./abstract-smart-component";

export const SortType = {
  RATING_DOWN: `rating-down`,
  DATE_DOWN: `date-down`,
  DEFAULT: `default`,
};

const getSortTemplate = (isActive) => {
  return (
    `<ul class="sort">
      <li><a href="#" data-sort-type="${SortType.DEFAULT}" class="sort__button ${isActive === SortType.DEFAULT ? `sort__button--active` : ``}">Sort by default</a></li>
      <li><a href="#" data-sort-type="${SortType.DATE_DOWN}" class="sort__button ${isActive === SortType.DATE_DOWN ? `sort__button--active` : ``}">Sort by date</a></li>
      <li><a href="#" data-sort-type="${SortType.RATING_DOWN}" class="sort__button ${isActive === SortType.RATING_DOWN ? `sort__button--active` : ``}">Sort by rating</a></li>
    </ul>`
  );
};

export default class Sort extends AbstractSmartComponent {
  constructor() {
    super();
    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return getSortTemplate(this._currentSortType);
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      this._setSortTypeChangeHandler = handler;

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;
      handler(this._currentSortType);
      this.update();
      // this.rerender();
    });
  }

  update() {
    this.getTemplate();
    this.rerender();
    // this.recoveryListeners();
  }

  recoveryListeners() {
    this.setSortTypeChangeHandler(this._setSortTypeChangeHandler);
  }
}
