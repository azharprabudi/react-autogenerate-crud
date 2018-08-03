import React, { Component } from "react";

/* material modules */
import { withStyles } from "@material-ui/core/styles";

/* etc modules */
import axios from "axios";
import has from "lodash/has";
import PropTypes from "prop-types";

/* my modules */
import validators from "../helpers/validators";
import OptionsConf from "../constants/options-conf";
import { libDefaultvalue } from "../components/form/lib/index";
import BaseFormStandar from "../components/form/base-form-standar";
import BaseFormDetails from "../components/form/base-form-details";

const styles = theme => ({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
    paddingTop: 65
  }
});

class BaseForm extends Component {
  static ID_FORM = "ID_FORM";
  static EXISTING_DATA_FROM_PROPS = "EXISTING_DATA_FROM_PROPS";

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      snackbarInfo: {
        type: "error",
        message: "",
        visible: false
      },
      form: this.initialStateForm(props.fields)
    };

    /* flag to show this is on edit mode or not */
    this.isEdit =
      has(props.params, BaseForm.ID_FORM) &&
      props.params[BaseForm.ID_FORM] !== "";
  }

  componentDidMount() {
    const { fields, params } = this.props;
    if (
      has(params, BaseForm.ID_FORM) &&
      has(params, BaseForm.EXISTING_DATA_FROM_PROPS)
    ) {
      if (Object.keys(params[BaseForm.EXISTING_DATA_FROM_PROPS]).length > 0) {
        this.setState({
          ...this.state,
          form: this.initialStateForm(
            fields,
            params[BaseForm.EXISTING_DATA_FROM_PROPS]
          )
        });
      } else {
        this.getInitialDataFromServer(params[BaseForm.ID_FORM]);
      }
    }
  }

  getInitialDataFromServer = async id => {
    let { updateConfigurationServer, fields } = this.props;
    if (has(updateConfigurationServer, "get")) {
      updateConfigurationServer = { ...updateConfigurationServer.get };
    }
    const config = has(updateConfigurationServer, "config")
      ? updateConfigurationServer.config
      : {};
    const method = has(updateConfigurationServer, "method")
      ? updateConfigurationServer.method
      : "get";
    let url = has(updateConfigurationServer, "url")
      ? updateConfigurationServer.url
      : "";

    /* if there a replace url exist, just replace it */
    if (has(updateConfigurationServer, "replaceUrl")) {
      url = url.replace(updateConfigurationServer.replaceUrl, id);
    }

    const data = await axios[method](url, config);
    if (has(data, "data")) {
      this.setState({
        ...this.state,
        form: this.initialStateForm(fields, data.data)
      });
    }
  };

  initialStateForm = (fields, data = {}) => {
    let form = {};

    /* loop all the fields available */
    for (let i = 0; i < fields.length; i++) {
      const { groupName, details, type, ...groupField } = fields[i];

      /*
      currently there are two type of form,
      there are standard and details
      */

      /* standar */
      if (type === "standard") {
        form[groupName] = {};
        for (let j = 0; j < details.length; j++) {
          const field = details[j];
          if (!has(field, "mergingColumn") || field.mergingColumn === false) {
            /* get value from data */
            form[groupName][field.componentAttribute.name] = {
              value: has(data, field.attributeColumnTable)
                ? data[field.attributeColumnTable]
                : libDefaultvalue[field.component],
              validationStatus: true,
              validationText: ""
            };
          }
        }
      }

      /* details */
      if (type === "details") {
        /* the attribute details can be specify just give the information about in configuration, in attribute attributeNameDetails   */
        if (has(groupField, "attributeNameDetails")) {
          const indexDetails = groupField["attributeNameDetails"];
          const formDetails = data[indexDetails];
          /* looping the data details */
          for (let j = 0; j < formDetails.length; j++) {
            form[groupName][j] = {};
            for (let k = 0; k < details.length; k++) {
              const field = details[k];
              if (
                !has(field, "mergingColumn") ||
                field.mergingColumn === false
              ) {
                form[groupName][j][field.componentAttribute.name] = {
                  value: has(formDetails[j], field.attributeColumnTable)
                    ? formDetails[j][field.attributeColumnTable]
                    : libDefaultvalue[field.component],
                  validationStatus: true,
                  validationText: ""
                };
              }
            }
          }
        } else {
          form[groupName] = [{}];
          for (let j = 0; j < details.length; j++) {
            const field = details[j];
            if (!has(field, "marginColumn") || field.mergingColumn === false) {
              form[groupName][0][field.componentAttribute.name] = {
                value: libDefaultvalue[field.component],
                validationStatus: true,
                validationText: ""
              };
            }
          }
        }
      }
    }
    return form;
  };

  /* handling do validation whenever user change the value on form */
  doValidatingInput = async (groupName, stateName, value) => {
    /* this function find the selected input from data array */
    let i = 0;
    let selectedInput = {};
    const { fields } = this.props;

    while (i < fields.length) {
      if (fields[i].groupName === groupName) {
        let j = 0;
        while (j < fields[i].details.length) {
          if (fields[i].details[j].componentAttribute.name === stateName) {
            selectedInput = fields[i].details[j];
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
    while (iteration < validationArr.length) {
      let itemValidator = validationArr[iteration];
      /* there two type custom validation, one is depend on crud generator and the other one is custom callback validation have to promise function */
      if (itemValidator.indexOf("callback") > -1) {
        const functionName = itemValidator.substr(17 - 8);
        if (
          has(selectedInput, "callback") &&
          has(selectedInput.callback, functionName)
        ) {
          let { validation, message } = await selectedInput.callback[
            functionName
          ](value);
          if (validation === false) {
            validationText = message;
            validationStatus = validation;
            break;
          }
        }
      } else {
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
      }
      iteration++;
    }
    return { validationStatus, validationText };
  };

  /* handling on change value in form */
  onChangeBaseFormStandar = groupName => async (stateName, value) => {
    const { validationText, validationStatus } = await this.doValidatingInput(
      groupName,
      stateName,
      value
    );

    this.setState({
      ...this.state,
      form: {
        ...this.state.form,
        [groupName]: {
          ...this.state.form[groupName],
          [stateName]: {
            value,
            validationText,
            validationStatus
          }
        }
      }
    });
  };

  render() {
    const { classes, fields } = this.props;
    return (
      <form
        method="post"
        encType="multipart/form-data"
        className={classes.container}
        onSubmit={() => alert(1)}
      >
        {fields.map(({ type, title, groupName, details }) => {
          if (type === "standard") {
            return (
              <BaseFormStandar
                key={title}
                title={title}
                details={details}
                isEdit={this.isEdit}
                state={this.state.form[groupName]}
                onChange={this.onChangeBaseFormStandar(groupName)}
              />
            );
          } else {
            return (
              <BaseFormDetails
                isEdit={this.isEdit}
                key={groupForm.title}
                {...groupForm}
              />
            );
          }
        })}
      </form>
    );
  }
}

BaseForm.propTypes = {
  params: PropTypes.shape({
    [BaseForm.ID_FORM]: PropTypes.string,
    [BaseForm.EXISTING_DATA_FROM_PROPS]: PropTypes.object
  }).isRequired,
  fields: PropTypes.array.isRequired,
  createConfigurationServer: PropTypes.shape({
    url: PropTypes.string.isRequired,
    method: PropTypes.oneOf(OptionsConf.methodValue),
    config: PropTypes.object,
    callbackBeforeCreate: PropTypes.func,
    callbackAfterCreate: PropTypes.func
  }),
  updateConfigurationServer: PropTypes.shape({
    url: PropTypes.string.isRequired,
    get: PropTypes.shape({
      url: PropTypes.string.isRequired,
      method: PropTypes.oneOf(OptionsConf.methodValue)
    }),
    method: PropTypes.oneOf(OptionsConf.methodValue),
    config: PropTypes.object,
    replaceUrl: PropTypes.string,
    attributeName: PropTypes.string,
    dataFromProps: PropTypes.bool,
    callbackBeforeUpdate: PropTypes.func,
    callbackAfterUpdate: PropTypes.func
  })
};

export default withStyles(styles)(BaseForm);
