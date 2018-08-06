import React from "react";

/* etc modules */
import PropTypes from "prop-types";

/* my modules */
import BaseAsyncAutoComplete from "./base/base-async-auto-complete";

const FormSelectAsyncMultipleAutoComplete = props => (
  <BaseAsyncAutoComplete {...props} multi={true} />
);

FormSelectAsyncMultipleAutoComplete.propTypes = {
  /* required */
  id: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  disabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  extension: PropTypes.shape({
    data: PropTypes.array,
    customSource: PropTypes.shape({
      url: PropTypes.string.isRequired,
      method: PropTypes.string,
      config: PropTypes.object
    }),
    idAttributeName: PropTypes.string.isRequired,
    labelAttributeName: PropTypes.string.isRequired
  }).isRequired,
  error: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  helperText: PropTypes.string.isRequired,
  /* non required */
  multi: PropTypes.bool,
  style: PropTypes.object
};

export default FormSelectAsyncMultipleAutoComplete;
