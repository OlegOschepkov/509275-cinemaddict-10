import AbstractComponent from "./abstract-component";

const getLoadMoreBtnTemplate = () => `<button class="films-list__show-more">Show more</button>`;

export default class LoadMoreButton extends AbstractComponent {
  getTemplate() {
    return getLoadMoreBtnTemplate();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
