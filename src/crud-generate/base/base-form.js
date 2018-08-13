import React, { Component } from "react";

/* material modules */
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

/* etc modules */
import axios from "axios";
import has from "lodash/has";
import PropTypes from "prop-types";
import isArray from "lodash/isArray";
import isString from "lodash/isString";
import uniqueId from "lodash/uniqueId";

/* my modules */
import validators from "../helpers/validators";
import OptionsConf from "../constants/options-conf";
import AlertDialog from "../components/etc/alert-dialog";
import { libDefaultvalue } from "../components/form/lib/index";
import BaseFormStandar from "../components/form/base-form-standar";
import BaseFormDetails from "../components/form/base-form-details";

const styles = theme => ({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
    paddingTop: 65
  },
  wrapperFooter: {
    flex: 1,
    paddingTop: 25,
    paddingBottom: 15,
    paddingRight: 8,
    paddingLeft: 8,
    flexWrap: "wrap",
    marginBottom: 8,
    backgroundColor: "white"
  },
  btnSave: {
    color: "#fff",
    marginRight: 8,
    backgroundColor: theme.palette.primary.main
  },
  btnCancel: {
    color: "#fff",
    marginRight: 8,
    backgroundColor: theme.palette.error.main
  }
});

class BaseForm extends Component {
  static ID_FORM = "ID_FORM";
  static EXISTING_DATA_FROM_PROPS = "EXISTING_DATA_FROM_PROPS";

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dialog: {
        alert: {
          visible: false
        }
      },
      form: this.initialStateForm(props.fields),
      dataExist: {}
    };

    /* flag to show this is on edit mode or not */
    this.isEdit =
      has(props.params, BaseForm.ID_FORM) &&
      props.params[BaseForm.ID_FORM] !== "";

    this.rowObjectData = {}; // this is used when user want to add row
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
    let url = has(updateConfigurationServer, "url")
      ? updateConfigurationServer.url
      : "";

    /* if there a replace url exist, just replace it */
    if (has(updateConfigurationServer, "replaceUrl")) {
      url = url.replace(updateConfigurationServer.replaceUrl, id);
    }

    const data = await axios.get(url, config);
    if (has(data, "data")) {
      this.setState({
        ...this.state,
        form: this.initialStateForm(fields, data.data),
        dataExist: data.data
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
        /* the the value data from attributeDetailsName */
        form[groupName] = [];
        if (has(groupField, "attributeNameDetails")) {
          let i = 0;

          const detailsData = has(data, groupField.attributeNameDetails)
            ? data[groupField.attributeNameDetails]
            : [];

          do {
            /* give the value object, if the value doesnt exist */
            if (!form[groupName][i]) {
              form[groupName][i] = {
                uniqueId: uniqueId("row_"),
                state: {}
              };
            }
            /* set details form */
            for (let j = 0; j < details.length; j++) {
              const field = details[j];
              if (
                !has(field, "mergingColumn") ||
                field.mergingColumn === false
              ) {
                if (
                  !form[groupName][i]["state"][field.componentAttribute.name]
                ) {
                  form[groupName][i]["state"][
                    field.componentAttribute.name
                  ] = {};
                }
                form[groupName][i]["state"][field.componentAttribute.name] = {
                  value:
                    detailsData.length > 0 &&
                    has(detailsData[i], field.attributeColumnTable)
                      ? detailsData[i][field.attributeColumnTable]
                      : libDefaultvalue[field.component],
                  validationStatus: true,
                  validationText: ""
                };

                if (!has(this.rowObjectData, field.componentAttribute.name)) {
                  this.rowObjectData = {
                    ...this.rowObjectData,
                    [field.componentAttribute.name]: {
                      value: "",
                      validationStatus: true,
                      validationText: ""
                    }
                  };
                }
              }
            }

            i++;
          } while (i < detailsData.length);
        } else {
          alert(
            "You have to specify attribute details name at this configurations"
          );
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
        const functionName = itemValidator.substr(9);
        if (
          has(selectedInput, "validationCallback") &&
          has(selectedInput.validationCallback, functionName)
        ) {
          let { validation, message } = await selectedInput.validationCallback[
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
          itemValidatorArr.length === 5 &&
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
    let validationText = "";
    let validationStatus = true;

    if (isString(value)) {
      const resultValidation = await this.doValidatingInput(
        groupName,
        stateName,
        value
      );
      validationText = resultValidation.validationText;
      validationStatus = resultValidation.validationStatus;
    }

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

  /* onchange row in details */
  onChangeBaseFormDetails = groupName => async (id, stateName, value) => {
    let validationText = "";
    let validationStatus = true;

    if (isString(value)) {
      const resultValidation = await this.doValidatingInput(
        groupName,
        stateName,
        value
      );
      validationText = resultValidation.validationText;
      validationStatus = resultValidation.validationStatus;
    }

    this.setState({
      ...this.state,
      form: {
        ...this.state.form,
        [groupName]: this.state.form[groupName].map(({ uniqueId, state }) => {
          if (uniqueId === id) {
            return {
              uniqueId,
              state: {
                ...state,
                [stateName]: {
                  value,
                  validationText,
                  validationStatus
                }
              }
            };
          }
          return { uniqueId, state };
        })
      }
    });
  };

  /* add row in details */
  onClickAddRow = groupName => () => {
    this.setState({
      ...this.state,
      form: {
        ...this.state.form,
        [groupName]: [
          ...this.state.form[groupName],
          { uniqueId: uniqueId("row_"), state: this.rowObjectData }
        ]
      }
    });
  };

  /* remove row in details */
  onClickRemoveRow = groupName => id => {
    this.setState({
      ...this.state,
      form: {
        ...this.state.form,
        [groupName]: [
          ...this.state.form[groupName].filter(
            filtItem => filtItem.uniqueId !== id
          )
        ]
      }
    });
  };

  /* on submit form */
  onSubmit = async () => {
    let isValidate = true;
    let { form } = this.state;
    for (let [groupIndex, groupName] of Object.entries(form)) {
      if (!isArray(groupName)) {
        for (let [stateIndex, stateName] of Object.entries(groupName)) {
          const {
            validationText,
            validationStatus
          } = await this.doValidatingInput(
            groupIndex,
            stateIndex,
            stateName.value
          );
          form[groupIndex][stateIndex] = {
            value: stateName.value,
            validationText,
            validationStatus
          };
          if (validationStatus == false) {
            isValidate = false;
            /*
            cannot using scrolling
            if (errorElementName == null) {
              let selectedField = this.props.fields.find(
                ({ groupName }) => groupName == groupIndex
              );
              if (has(selectedField, "details")) {
                selectedField = selectedField.details.find(
                  ({ componentAttribute }) =>
                    componentAttribute.name == stateIndex
                );
                if (has(selectedField, "componentAttribute")) {
                  errorElementName = `${selectedField.componentAttribute.id}-${
                    selectedField.componentAttribute.name
                  }`;
                }
              }
            }
            */
          }
        }
      } else {
        for (let i = 0; i < groupName.length; i++) {
          const stateGroup = groupName[i].state;
          for (let [stateIndex, stateName] of Object.entries(stateGroup)) {
            const {
              validationText,
              validationStatus
            } = await this.doValidatingInput(
              groupIndex,
              stateIndex,
              stateName.value
            );
            form[groupIndex][i]["state"][stateIndex] = {
              value: stateName.value,
              validationText,
              validationStatus
            };
            if (validationStatus == false) {
              isValidate = false;
            }
          }
        }
      }
    }
    if (isValidate) {
      this.toggleDialog("alert", true)();
    } else {
      this.props.setErrorMessage({
        type: "error",
        message: "Some input field have a validation error"
      });
    }
  };

  toggleDialog = (name, visible) => () => {
    if (this.state.dialog[name].visilbe !== visible) {
      this.setState({
        ...this.state,
        dialog: {
          ...this.state.dialog,
          [name]: {
            visible
          }
        }
      });
    }
  };

  giveNormalData = data => {
    let newData = {};
    for (let i = 0; i < this.props.fields.length; i++) {
      let { groupName, type, details, ...field } = this.props.fields[i];
      if (type === "standard") {
        for (let j = 0; j < details.length; j++) {
          if (has(details[j], "mergingColumn") && !details[j].mergingColumn) {
            newData[details[j].componentAttribute.name] =
              data[groupName][details[j].componentAttribute.name].value;
          }
        }
      } else if (type === "details") {
        let { attributeNameDetails } = field;
        if (!newData[attributeNameDetails]) {
          newData[attributeNameDetails] = [];
        }
        for (let j = 0; j < data[groupName].length; j++) {
          if (!newData[attributeNameDetails][j]) {
            newData[attributeNameDetails][j] = {};
          }
          for (let k = 0; k < details.length; k++) {
            newData[attributeNameDetails][j][
              details[k].componentAttribute.name
            ] =
              data[groupName][j]["state"][details[k].componentAttribute.name][
                "value"
              ];
          }
        }
      }
    }
    return newData;
  };

  onAggreeSubmitForm = () => {
    this.props.onClickButtonSubmit(
      {
        data: this.giveNormalData(this.state.form),
        dataExist: this.state.dataExist,
        id: this.props.params[BaseForm.ID_FORM]
      },
      this.isEdit
    );
  };

  render() {
    const { classes, fields, onClickButtonClose } = this.props;
    return (
      <form
        method="post"
        encType="multipart/form-data"
        className={classes.container}
        onSubmit={() => alert(1)}
      >
        <AlertDialog
          type={"confirmation"}
          title={"confirmation"}
          message={
            this.isEdit
              ? "Are you sure want to update this data ?"
              : "Are you sure want to created this data ?"
          }
          visible={this.state.dialog.alert.visible}
          onAggree={this.onAggreeSubmitForm}
          onDisaggree={this.toggleDialog("alert", false)}
          onDialogclose={this.toggleDialog("alert", false)}
        />
        {fields.map(({ type, title, groupName, details, ...others }) => {
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
                {...others}
                key={title}
                title={title}
                details={details}
                isEdit={this.isEdit}
                state={this.state.form[groupName]}
                onClickAddRow={this.onClickAddRow(groupName)}
                onChange={this.onChangeBaseFormDetails(groupName)}
                onClickRemoveRow={this.onClickRemoveRow(groupName)}
              />
            );
          }
        })}
        <div className={classes.wrapperFooter}>
          <Button
            size={"medium"}
            variant={"contained"}
            onClick={onClickButtonClose}
            className={classes.btnCancel}
          >
            <CloseIcon />
            <Typography color={"inherit"}>Cancel</Typography>
          </Button>
          <Button
            size={"medium"}
            variant={"contained"}
            onClick={this.onSubmit}
            className={classes.btnSave}
          >
            <SaveIcon />
            <Typography color={"inherit"}>
              {this.isEdit ? "Update" : "Save"}
            </Typography>
          </Button>
        </div>
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
  }),
  setErrorMessage: PropTypes.func.isRequired,
  onClickButtonClose: PropTypes.func.isRequired,
  onClickButtonSubmit: PropTypes.func.isRequired
};

export default withStyles(styles)(BaseForm);
