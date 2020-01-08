const filterNames = [
  `All movies`, `Watchlist`, `History`, `Favorites`, `Stats`
];

const filterLinks = [
  `all`, `watchlist`, `history`, `favorites`, `stats`
];

const filterType = [
  `ALL`,
  `WATCHLIST`,
  `WATCHED`,
  `FAVORITES`,
  `STATS`
];


const generateFilters = () => {
  return filterNames.map((it, i) => {
    return {
      name: it,
      type: filterType[i],
      link: filterLinks[i],
    };
  });
};

export {generateFilters};
