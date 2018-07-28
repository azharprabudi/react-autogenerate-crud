import React, { Component } from "react";

/* material modules */
import { withStyles } from "@material-ui/core/styles";

/* etc modules */
import axios from "axios";
import PropTypes from "prop-types";

/* my modules */
import BaseFormStandar from "../components/form/base-form-standar";
import BaseFormDetails from "../components/form/base-form-details";

const styles = theme => ({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3"
  }
});

class BaseForm extends Component {
  static ID_FORM = "ID_FORM";
  static EXISTING_DATA_FROM_PROPS = "EXISTING_DATA_FROM_PROPS";

  constructor(props) {
    super(props);
    this.state = this.initialState(props.formOptions);
  }

  componentDidMount() {
    // if (this.props.options[BaseForm.IS_EDIT_FORM]) {
    //   if (
    //     has(this.props.editConfiguration, "useExistingDataFromProps") &&
    //     this.props.editConfiguration.useExistingDataFromProps
    //   ) {
    //   } else {
    //     this.getDataFromServerAndSetToState();
    //   }
    // }
  }

  getDataFromServerAndSetToState() {
    const id = this.props.options[ID_FORM];
    if (has(this.props.editConfiguration, "get")) {
    } else {
      alert("");
    }
  }

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
        {this.props.formOptions.map(groupForm => {
          if (groupForm.type === "standard") {
            return <BaseFormStandar key={groupForm.title} {...groupForm} />;
          } else {
            return <BaseFormDetails key={groupForm.title} {...groupForm} />;
          }
        })}
      </div>
    );
  }
}

BaseForm.propTypes = {
  params: PropTypes.object.isRequired,
  callbackBeforeEditForm: PropTypes.func,
  formOptions: PropTypes.array.isRequired,
  callbackBeforeSubmitForm: PropTypes.func,
  editConfiguration: PropTypes.object.isRequired,
  addNewConfiguration: PropTypes.object.isRequired
};

export default withStyles(styles)(BaseForm);
