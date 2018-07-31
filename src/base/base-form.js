import React, { Component } from "react";

/* material modules */
import { withStyles } from "@material-ui/core/styles";

/* etc modules */
import axios from "axios";
import has from "lodash/has";
import PropTypes from "prop-types";

/* my modules */
import validators from "../helpers/validators";
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

  doValidatingInput = (groupName, stateName, value) => {
    /* this function find the selected input from data array */
    let i = 0;
    let selectedInput = {};
    while (i < this.props.formOptions.length) {
      let itemInput = this.props.formOptions[i];
      if (itemInput.groupName === groupName) {
        let j = 0;
        while (j < itemInput.details.length) {
          if (itemInput.details[j].attribute.name === stateName) {
            selectedInput = itemInput.details[j];
            break;
          }
          j++;
        }
        break;
      }
      i++;
    }

    /* do validation */
    if (!has(selectedInput, "validation")) {
      return { validationStatus: true, validationText: "" };
    }

    let { validation } = selectedInput;
    let iteration = 0;
    let validationText = "";
    let validationStatus = true;
    let validationArr = validation.split("|");
    console.log(validators);
    while (iteration < validationArr.length) {
      let itemValidator = validationArr[iteration];
      let itemValidatorArr = itemValidator.split(/\[(.*?)\]/g);
      if (
        itemValidatorArr.length === 1 &&
        has(validators, itemValidatorArr[0])
      ) {
        let { validation, message } = validators[itemValidatorArr[0]](value);
        if (validation === false) {
          validationText = message;
          validationStatus = validation;
          break;
        }
      } else if (
        itemValidatorArr.length === 3 &&
        has(validators, itemValidatorArr[0])
      ) {
        let { validation, message } = validators[itemValidatorArr[0]](
          value,
          itemValidatorArr[1]
        );
        if (validation === false) {
          validationText = message;
          validationStatus = validation;
          break;
        }
      } else if (
        itemValidatorArr.length === 6 &&
        has(validators, itemValidatorArr[0])
      ) {
        let { validation, message } = validators[itemValidatorArr[0]](
          value,
          this.state.form[itemValidatorArr[1]][itemValidatorArr[3]].value
        );
        if (validation === false) {
          validationText = message;
          validationStatus = validation;
          break;
        }
      }
      iteration++;
    }
    return { validationStatus, validationText };
  };

  onChangeBaseformStandar = (groupName, stateName, value) => {
    const { validationStatus, validationText } = this.doValidatingInput(
      groupName,
      stateName,
      value
    );
    this.setState({
      ...this.state,
      form: {
        ...this.state.form,
        [groupName]: {
          ...this.state.form.groupName,
          [stateName]: {
            value,
            validationText: "",
            validationStatus: true
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
        onSubmit={() => alert(1)}
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
