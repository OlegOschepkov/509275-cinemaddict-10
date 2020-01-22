export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  getAll() {
    // console.log(JSON.parse(this._storage.getItem(this._storeKey)).film_0.id)
    try {
      return JSON.parse(this._storage.getItem(this._storeKey));
    } catch (err) {
      return {};
    }
  }

  dropAll() {}

  setItem(key, value) {
    const store = this.getAll();

    // console.log(key)

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, {[key]: value})
        )
    );
  }

  removeItem(key) {
    const store = this.getAll();

    delete store[key];

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store)
        )
    );
  }
}
