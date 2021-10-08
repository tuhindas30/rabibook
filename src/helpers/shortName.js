const shortName = (name) => {
  let short = name[0];
  for (let i = 0; i < name.length; i++) {
    if (name[i] === " ") {
      short += name[i + 1];
    }
  }
  return short;
};

export default shortName;
