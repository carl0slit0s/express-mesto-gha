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
  console.log()
  error.statusCode = 404;
  throw error;
};

const alreadyExistsError = () => {
  const error = new Error('Почта занята');
  error.statusCode = 409;
  return error;
};

const notFoundPageErorr = (req, res) => {
  res.status(404).send({ message: 'страница не найдена' });
};
module.exports = {
  reqErorr,
  authErorr,
  notFoundErorr,
  notFoundPageErorr,
  alreadyExistsError,
};
