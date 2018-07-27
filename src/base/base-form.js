import React, { Component } from "react";

/* material modules */
import { withStyles } from "@material-ui/core/styles";

/* etc modules */
import PropTypes from "prop-types";

/* my modules */
import BaseFormInput from "../components/form/base-form-input";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  }
});

class BaseForm extends Component {
  constructor(props) {
    super(props);

    this.state = this.initialState(props.formOptions);
  }

  static EXISTING_DATA_FROM_PROPS = "EXISTING_DATA_FROM_PROPS";

  initialState = formOptions => {
    let initialState = {
      loading: false,
      snackbarInfo: {
        type: "error",
        message: "",
        visible: false
      },
      form: {}
    };
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <BaseFormInput />
      </div>
    );
  }
}

BaseForm.propTypes = {
  formOptions: PropTypes.object.isRequired,
  callbackBeforeSubmitForm: PropTypes.func.isRequired
};

export default withStyles(styles)(BaseForm);
