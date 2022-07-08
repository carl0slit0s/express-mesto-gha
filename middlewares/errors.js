const reqErorr = () => {
  const error = new Error('ошибка запроса');
  error.statusCode = 400;
  return error;
};

const authErorr = () => {
  const error = new Error('ошибка авторизации');
  error.statusCode = 401;
  return error;
};

const notFoundErorr = () => {
  const error = new Error('Пользователь не найден');
  error.statusCode = 404;
  return error;
};

module.exports = { reqErorr, authErorr, notFoundErorr };
