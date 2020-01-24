import AbstractComponent from "./abstract-component";

export default class AbstractSmartComponent extends AbstractComponent {
  constructor() {
    super();
    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }

    this._element = null;
  }

  recoveryListeners() {
    throw new Error(`Abstract method not implemented: recoveryListeners`);
  }

  update() {
    throw new Error(`Abstract method not implemented: update`);

    // сюда измененные данные
  }

  rerender() {
    // console.log(this);
    const oldElement = this.getElement();
    const parent = oldElement.parentElement;

    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, oldElement);

    this.recoveryListeners();
  }
}
