export const devLogger = (...args) => {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
};
