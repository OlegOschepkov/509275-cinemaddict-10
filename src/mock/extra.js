const extraTypes = [
  `Top rated`, `Most commented`
];

const generateExtra = () => {
  return extraTypes.map((it) => {
    return {
      extraType: it,
    };
  });
};

export {generateExtra};
