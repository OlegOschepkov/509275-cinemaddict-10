import {clamp} from '../utils/utils';

const userLevels = {
  [0]: `Apprentice`,
  [1]: `Journeyman`,
  [2]: `Master`,
  [3]: `Grandmaster`,
  [4]: `SecretMaster`
};

const user = {
  _level: 0,
  get level() {
    return `${userLevels[this._level]}`;
  },
  set level(val) {
    this._level = clamp(val, 0, Object.keys(userLevels).length);
  }
};

export {user};
