// utils/createError.js
export default (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};