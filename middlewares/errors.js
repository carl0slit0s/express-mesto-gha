const reqErorr = () => {
  const error = new Error('Не передан емайл или пароль');
  error.statusCode = 400;
  throw error;
};

const authErorr = () => {
  console.log('ловим ощибку');
  const error = new Error('Неправильный емайл или пароль');
  error.statusCode = 401;
  console.log(error.statusCode)
  throw error;
};

const notFoundErorr = () => {
  const error = new Error('Пользователь не найден');
  error.statusCode = 404;
  throw error;
};

module.exports = { reqErorr, authErorr, notFoundErorr };
