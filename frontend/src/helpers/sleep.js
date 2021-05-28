// Sleep the amount of milliseconds that are given
const sleep = (milliseconds = 500) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export default sleep;
