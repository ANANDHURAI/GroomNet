import React from 'react';

const ErrorMessage = ({ message }) => {
  return message ? <div className="error-message">{message}</div> : null;
};

export default ErrorMessage;
