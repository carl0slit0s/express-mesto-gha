const reqErorr = () => {
  const error = new Error('Не передан емайл или пароль');
  error.statusCode = 400;
  throw error;
};

const authErorr = () => {
  const error = new Error('Неправильный емайл или пароль');
  error.statusCode = 401;
  throw error;
};

const notFoundErorr = () => {
  const error = new Error('Пользователь не найден');
  error.statusCode = 404;
  throw error;
};

module.exports = { reqErorr, authErorr, notFoundErorr };
