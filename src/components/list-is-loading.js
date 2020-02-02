import AbstractComponent from "./abstract-component";

const getLoadingListTemplate = () => {
  return (
    `<section class="films-list">
      <h2 class="films-list__title">Loading...</h2>
    </section>`
  );
};

export default class LoadingList extends AbstractComponent {
  getTemplate() {
    return getLoadingListTemplate();
  }
}
