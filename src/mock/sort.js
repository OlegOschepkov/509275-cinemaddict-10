const sortNames = [
  `Sort by default`, `Sort by date`, `Sort by rating`
];

const generateSorting = () => {
  return sortNames.map((it) => {
    return {
      sortType: it,
    };
  });
};

export {generateSorting};
