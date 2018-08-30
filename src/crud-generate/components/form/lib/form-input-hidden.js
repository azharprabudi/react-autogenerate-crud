import React, { PureComponent } from "react";

/* etc modules */
import PropTypes from "prop-types";

class FormInputHidden extends PureComponent {
  onChange = e => {
    this.props.onChangeValue(e.target.value);
  };

  render() {
    return (
      <input
        type={"hidden"}
        id={this.props.id}
        name={this.props.name}
        onChange={this.onChange}
        value={this.props.value}
      />
    );
  }
}

FormInputHidden.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
  onChangeValue: PropTypes.func.isRequired
};

export default FormInputHidden;
