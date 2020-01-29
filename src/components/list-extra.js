// import AbstractComponent from "./abstract-component";
import AbstractSmartComponent from "./abstract-smart-component";

const getExtraListTemplate = (type) => {
  // const {extraName} = type;
  return (
    `<section class="films-list--extra">
    <h2 class="films-list__title">${type}</h2>
    <div class="films-list__container"></div>
  </section>`
  );
};

export default class ExtraList extends AbstractSmartComponent {
  constructor(type) {
    super();
    this._type = type;
  }

  getTemplate() {
    return getExtraListTemplate(this._type);
  }

  update() {
    // this._type = newType;
    this.getTemplate();
    this.rerender();
  }

  recoveryListeners() {}

}
