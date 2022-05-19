module.exports = (
  response,
  message,
  additionalData,
  status = 200,
  success = true,
) => {
  if (success === false) {
    return response.status(status).send({
      success,
      message: message || 'error',
      result: {
        ...additionalData,
      },
    });
  } else {
    return response.status(status).send({
      success,
      message: message || 'Success',
      result: {
        ...additionalData,
      },
    });
  }
};
