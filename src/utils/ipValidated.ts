export const ipValidated = (ip: string) => {
  const ipRegex =
    /^(25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?\d)){3}$/;
  const isValid = ipRegex.test(ip);
  return { isValid };
};