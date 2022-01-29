export const getTrimmedAddress = (addr) => {
  const firstSix = addr.slice(0, 6);
  const lastThree = addr.slice(addr.length - 3);
  return `${firstSix}...${lastThree}`;
};
