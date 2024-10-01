export const mobileCheck = () => {
  const regex = /iPhone.+Mobile/i;
  const isMobileByUa = regex.test(navigator.userAgent);
  return isMobileByUa;
};
