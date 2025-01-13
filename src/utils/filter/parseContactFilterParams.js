const validContactTypes = ['work', 'home', 'personal'];

const parseContactType = (type) => {
  if (typeof type !== 'string') return undefined;
  if (!validContactTypes.includes(type)) return undefined;
  return type;
};

const parseIsFavourite = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return undefined;
};

export const parseContactFilterParams = ({ contactType, isFavourite }) => {
  const parsedContactType = parseContactType(contactType);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    contactType: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
};
