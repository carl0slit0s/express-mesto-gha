const reqErorr = () => {
  const error = new Error('ошибка запроса');
  error.statusCode = 400;
  return error;
};

const authErorr = () => {
  const error = new Error('ошибка авторизации');
  error.statusCode = 401;
  throw error;
};

const notFoundErorr = () => {
  const error = new Error('Пользователь не найден');
  error.statusCode = 404;
  return error;
};

const alreadyExistsError = () => {
  const error = new Error('Почта занята');
  error.statusCode = 409;
  return error;
};

const noRightsError = () => {
  const error = new Error('нет прав доступа');
  error.statusCode = 403;
  return error;
};

const notFoundPageErorr = () => {
  const error = new Error('страница не найдена');
  error.statusCode = 404;
  return error;
};

const validErorr = () => {
  const error = new Error('ошибка валидации');
  error.statusCode = 400;
  return error;
};

module.exports = {
  reqErorr,
  authErorr,
  notFoundErorr,
  notFoundPageErorr,
  alreadyExistsError,
  noRightsError,
  validErorr,
};
