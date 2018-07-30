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

  // getDataFromServerAndSetToState() {
  //   const id = this.props.options[ID_FORM];
  //   if (has(this.props.editConfiguration, "get")) {
  //   } else {
  //     alert("");
  //   }
  // }

  initialState = formOptions => {
    let form = {};
    for (let i = 0; i < formOptions.length; i++) {
      let { groupName, details, type } = formOptions[i];
      if (type === "standard") {
        form[groupName] = {};
        for (let j = 0; j < details.length; j++) {
          let { name } = details[j].attribute;
          form[groupName][name] = {
            value: "",
            validationStatus: true,
            validationText: ""
          };
        }
      } else if (type === "details") {
        form[groupName] = [{}];
        for (let j = 0; j < details.length; j++) {
          let { name } = details[j].attribute;
          form[groupName][0][name] = {
            value: "",
            validationStatus: true,
            validationText: ""
          };
        }
      }
    }
    let initialState = {
      loading: false,
      snackbarInfo: {
        type: "error",
        message: "",
        visible: false
      },
      form
    };

    return initialState;
  };

  onChangeBaseformStandar = (groupName, stateName, value) => {
    this.setState({
      ...this.state,
      form: {
        ...this.state.form,
        [groupName]: {
          ...this.state.form.groupName,
          [stateName]: {
            value,
            validationStatus: false,
            validationText: "Ikan Cuek"
          }
        }
      }
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <form
        method="post"
        encType="multipart/form-data"
        className={classes.container}
      >
        {this.props.formOptions.map(({ type, title, groupName, details }) => {
          if (type === "standard") {
            return (
              <BaseFormStandar
                key={title}
                details={details}
                state={this.state.form[groupName]}
                onChange={(stateName, value) =>
                  this.onChangeBaseformStandar(groupName, stateName, value)
                }
                title={title}
              />
            );
          } else {
            return <BaseFormDetails key={groupForm.title} {...groupForm} />;
          }
        })}
      </form>
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
