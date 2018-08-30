import React, { PureComponent } from "react";

/* etc modules */
import PropTypes from "prop-types";

/* my modules */
import BaseSelect from "./base/base-select";

const FormSelect = props => <BaseSelect {...props} multi={false} />;

FormSelect.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  error: PropTypes.bool,
  editable: PropTypes.bool,
  value: PropTypes.any.isRequired,
  onChangeValue: PropTypes.func.isRequired,
  othersConf: PropTypes.shape({
    data: PropTypes.array,
    customSource: PropTypes.string,
    config: PropTypes.object,
    idAttributeName: PropTypes.string.isRequired,
    labelAttributeName: PropTypes.string.isRequired
  }).isRequired,
  style: PropTypes.object,
  helperText: PropTypes.string
};

FormSelect.defaultProps = {
  style: {},
  error: false,
  editable: true,
  helperText: ""
};

export default FormSelect;
