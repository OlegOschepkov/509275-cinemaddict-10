import {getLowest} from '../utils/utils';

const userLevels = {
  0: ``,
  1: `novice`,
  11: `fan`,
  21: `movie buff`,
};

const user = {
  _level: 0,
  get level() {
    return `${userLevels[this._level]}`;
  },
  set level(val) {
    this._level = getLowest(userLevels, val);
  }
};

export {user};
