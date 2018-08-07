import isString from "lodash/isString";
import validate from "validate.js";

const isRequired = str => {
  if (!isString(str)) {
    str = str.toString();
  }
  if (str.replace(/\s/g, "") === "") {
    return { validation: false, message: "This field is required" };
  }
  return { validation: true, message: "" };
};

const isEmail = email => {
  if (!isString(email)) {
    email = email.toString();
  }

  const isValidate = validate(
    { validate: { email } },
    { validate: { email: true } }
  );
  if (has(isValidate, "validate")) {
    return { validation: false, message: "Invalid format email" };
  }
  return { validation: true, message: "" };
};

const isMin = (str, min) => {
  if (!isString(str)) {
    str = str.toString();
  }

  if (str.length < min) {
    return {
      validation: false,
      message: `The value have more than equal ${min}`
    };
  }
  return true;
};

const isMax = (str, max) => {
  if (!isString(str)) {
    str = str.toString();
  }

  if (str.length > max) {
    return {
      validation: false,
      message: `The value have less than equal ${max}`
    };
  }
  return { validation: true, message: "" };
};

const isEqual = (str1, str2) => {
  if (str1 !== str2) {
    return { validation: false, message: "Not matches" };
  }
  return { validation: true, message: "" };
};

const isInteger = str => {
  if (!isString(str)) {
    str = str.toString();
  }

  if (/[^0-9]/g.test(str)) {
    return { validation: false, message: "The value have to be integer" };
  }
  return { validation: true, message: "" };
};

const isAlphabet = str => {
  if (!isString(str)) {
    str = str.toString();
  }

  if (/[^A-z]g/.test(str)) {
    return {
      validation: false,
      message: "The value have to be alphabet (A-z)"
    };
  }

  return { validation: false, message: "" };
};

const greaterThan = (numb, min) => {
  if (!isInteger(numb)) {
    numb = parseInt(numb, 10);
  }

  if (numb > min) {
    return {
      validation: false,
      message: `The value have to greater than ${min}`
    };
  }
  return { validation: true, message: "" };
};

const greaterThanEqual = (numb, min) => {
  if (!isInteger(numb)) {
    numb = parseInt(numb, 10);
  }

  if (numb >= min) {
    return {
      validation: false,
      message: `The value have to greater than equal ${min}`
    };
  }
  return { validation: true, message: "" };
};

const lessThan = (numb, max) => {
  if (!isInteger(numb)) {
    numb = parseInt(numb, 10);
  }

  if (numb < max) {
    return {
      validation: false,
      message: `The value have to less than equal ${max}`
    };
  }
  return { validation: true, message: "" };
};

const lessThanEqual = (numb, max) => {
  if (!isInteger(numb)) {
    numb = parseInt(numb, 10);
  }

  if (numb <= max) {
    return {
      validation: false,
      message: `The value have to less than equal ${max}`
    };
  }
  return { validation: true, message: "" };
};

const isUrl = url => {
  if (!isString(url)) {
    url = url.toString();
  }

  const isValidate = validate(
    { validate: { url } },
    { validate: { url: true } }
  );
  if (has(isValidate, "validate")) {
    return { validation: false, message: "Invalid format url" };
  }
  return { validation: true, message: "" };
};

const validRegex = (str, regex) => {
  if (!isString(str)) {
    str = str.toString();
  }

  const isValidate = validate({ str }, { str: { format: regex } });
  if (has(isValidate, "str")) {
    return { validation: false, message: "Not matches with custom validation" };
  }
  return true;
};

export default {
  required: isRequired,
  validEmail: isEmail,
  minLength: isMin,
  maxLength: isMax,
  mathces: isEqual,
  integer: isInteger,
  aplhabet: isAlphabet,
  gt: greaterThan,
  gte: greaterThanEqual,
  lt: lessThan,
  lte: lessThanEqual,
  validUrl: isUrl,
  regex: validRegex
};
