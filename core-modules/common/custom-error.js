// Reference
// http://www.bennadel.com/blog/2828-creating-custom-error-objects-in-node-js-with-error-capturestacktrace.htm
// https://gist.github.com/justmoon/15511f92e5216fa2624b
// There are few npm modules but they all are too complex and not transparent.

const util = require('util');

const errorCodes = require('./error-codes');
const errorMessages = require('./error-messages');

/**
 * @description Base class of custom errors
 * @param msg
 * @param rootException An exception can contain another exception or error.
 * @param errorCode
 * @param constr constructor of the child class
 * @constructor
 */
const AbstractError = function AbstractError(msg, rootException, errorCode, constr) {
  Error.captureStackTrace(this, constr || this);

  this._message = msg || 'Error';
  this._rootException = rootException || null;
  this._errorCode = errorCode || 0;
  this.isIgnorable = false;
};
util.inherits(AbstractError, Error);
AbstractError.prototype.name = 'AbstractError';

AbstractError.prototype.toString = function toString() {
  return `${this.name}: ${this._message}`;
};

AbstractError.prototype.getErrorCode = function getErrorCode() {
  return this._errorCode;
};

/**
 * The nested|inner|root exception object.
 * @returns {null|*}
 */
AbstractError.prototype.getRootException = function getRootException() {
  return this._rootException;
};

/**
 * The Error message
 * @returns {*|string}
 */
AbstractError.prototype.getMessage = function getMessage() {
  return this._message;
};

/**
 * Few exception at some places can be ignored. Set this flag to true in such cases.
 */
AbstractError.prototype.setErrorAsIgnorable = function setErrorAsIgnorable() {
  this.isIgnorable = true;
};

AbstractError.prototype.isErrorIgnorable = function isErrorIgnorable() {
  return this.isIgnorable;
};

/**
 * The end data that an end user gets. This is damn useful in case of API server. This is the
 * data/message that the API consumer will get in case of an error.
 * @param data
 */
AbstractError.prototype.setDisplayData = function setDisplayData(data) {
  this._displayData = data;
};

AbstractError.prototype.getDisplayData = function getDisplayData() {
  return this._displayData || undefined;
};

/**
 * The display message that an end user gets.
 * @param msg
 */
AbstractError.prototype.setDisplayMessage = function setDisplayMessage(msg) {
  this._displayMessage = msg;
};

AbstractError.prototype.getDisplayMessage = function getDisplayMessage() {
  return this._displayMessage || this._message || errorMessages.DEFAULT;
};

/**
 * @description Class InternalError
 * @param msg
 * @param rootException
 * @constructor
 */
const InternalError = function InternalError(msg, rootException) {
  InternalError.super_.call(this, msg, rootException, errorCodes.INTERNAL_ERROR, this.constructor);
};
util.inherits(InternalError, AbstractError);
InternalError.prototype.name = 'InternalError';
InternalError.prototype._displayMessage = errorMessages.INTERNAL_ERROR;

/**
 * @description Class DatabaseError
 * @param msg
 * @param rootException
 * @constructor
 */
const DatabaseError = function DatabaseError(msg, rootException) {
  DatabaseError.super_.call(this, msg, rootException, errorCodes.DATABASE_ERROR, this.constructor);
};
util.inherits(DatabaseError, AbstractError);
DatabaseError.prototype.name = 'DatabaseError';

/**
 * class NotFoundError
 *
 * @param {String} msg error message
 * @param {Error} rootException
 * @constructor
 */
const NotFoundError = function NotFoundError(msg, rootException) {
  NotFoundError.super_.call(this, msg, rootException, errorCodes.NOT_FOUND_ERROR, this.constructor);
};
util.inherits(NotFoundError, AbstractError);
NotFoundError.prototype.name = 'NotFoundError';
NotFoundError.prototype._displayMessage = errorMessages.NOT_FOUND;

/**
 * This error is raised to drop action/job. This means that we no longer want to process that job
 * and we can safely delete that job
 * @param msg
 * @param rootException
 * @constructor
 */
const DropAction = function DropAction(msg, rootException) {
  DropAction.super_.call(this, msg, rootException, errorCodes.SKIP_ACTION, this.constructor);
};
util.inherits(DropAction, AbstractError);
DropAction.prototype.name = 'DropAction';

/**
 * class AccessDeniedError
 *
 * @param {string} msg error message
 * @param {Error} rootException
 * @constructor
 */
const AccessDeniedError = function AccessDeniedError(msg, rootException) {
  AccessDeniedError.super_.call(
    this,
    msg,
    rootException,
    errorCodes.ACCESS_DENIED,
    this.constructor
  );
};
util.inherits(AccessDeniedError, AbstractError);
AccessDeniedError.prototype.name = 'AccessDeniedError';
AccessDeniedError.prototype._displayMessage = errorMessages.ACCESS_DENIED;

/**
 * Class InvalidInputError
 *
 * @param {String} msg error message
 * @param {Error} rootException
 * @constructor
 */
const InvalidInputError = function InvalidInputError(msg, rootException) {
  InvalidInputError.super_.call(
    this,
    msg,
    rootException,
    errorCodes.INVALID_INPUT,
    this.constructor
  );
};
util.inherits(InvalidInputError, AbstractError);
InvalidInputError.prototype.name = 'InvalidInputError';
InvalidInputError.prototype._displayMessage = errorMessages.INVALID_INPUT;

// Exporting all the classes.
// All the new error classes that you make should go here.
const errorClasses = {
  InternalError,
  DatabaseError,
  NotFoundError,
  DropAction,
  AccessDeniedError,
  InvalidInputError,
};

errorClasses.isValidError = function isValidError(error) {
  try {
    const className = error.name;
    if (className === 'isValidError') {
      return false;
    }

    /* eslint-disable-next-line no-prototype-builtins */
    return errorClasses.hasOwnProperty(className);
  } catch (e) {
    return false;
  }
};

module.exports = errorClasses;
