import React, { PureComponent } from "react";

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

class BaseForm extends PureComponent {
  static ID_FORM = "ID_FORM";
  static EXISTING_DATA_FROM_PROPS = "EXISTING_DATA_FROM_PROPS";

  constructor(props) {
    super(props);
    this.state = {
      dialog: {
        alert: {
          visible: false
        }
      },
      form: this.initialStateForm(props.fields),
      dataExist: {}
    };

    this.mockRowCollectionState = {}; // this is used when user want to add row
    /* flag to show this is on edit mode or not */
    this.isEdit =
      has(props.params, BaseForm.ID_FORM) &&
      props.params[BaseForm.ID_FORM] !== "";
  }

  componentDidMount() {
    const { fields, params } = this.props;
    if (this.isEdit) {
      if (Object.keys(params[BaseForm.EXISTING_DATA_FROM_PROPS]).length > 0) {
        this.setState({
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
    try {
      let configurationGetData = {};
      let { configurationServer, fields } = this.props;

      if (has(configurationServer, "getDataUpdate")) {
        configurationGetData = { ...configurationServer.getDataUpdate };
      } else {
        configurationGetData = { ...configurationServer.read };
      }

      const config = has(configurationGetData, "config")
        ? configurationGetData.config
        : {};
      let url = has(configurationGetData, "url")
        ? configurationGetData.url
        : "";

      /* if there a replace url exist, just replace it */
      if (has(configurationServer, "replaceUrlWithUniqueId")) {
        url = url.replace(configurationServer.replaceUrlWithUniqueId, id);
      }

      const data = await axios.get(url, config);
      if (has(data, "data")) {
        this.setState({
          ...this.state,
          form: this.initialStateForm(fields, data.data),
          dataExist: data.data
        });
      }
    } catch (e) {
      this.props.onSetErrorMessage(
        isArray(e) ? JSON.stringify(e) : e.toString()
      );
    }
  };

  initialStateForm = (fields, data = {}) => {
    let form = {};
    for (let i = 0; i < fields.length; i++) {
      const { groupName, details, type, ...groupField } = fields[i];
      /*
      currently there are two type of form, there are standard and details
      */
      if (type === "standard") {
        form[groupName] = {};
        for (let j = 0; j < details.length; j++) {
          const field = details[j];
          if (!has(field, "mergingColumn") || !field.mergingColumn) {
            /* get value from data */
            let value = "";
            if (has(data, field.uniqueId)) {
              value = data[field.uniqueId];
            } else if (has(field, "defaultValue")) {
              value = field.defaultValue;
            } else {
              value = libDefaultvalue[field.component];
            }
            form[groupName][field.uniqueId] = {
              value,
              validationText: "",
              validationStatus: true
            };
          }
        }
      }

      if (type === "details") {
        /* the the value data from uniqueDetail */
        form[groupName] = [];
        if (has(groupField, "uniqueDetail")) {
          let i = 0;
          const detailsData = has(data, groupField.uniqueDetail)
            ? data[groupField.uniqueDetail]
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
              if (!has(field, "mergingColumn") || !field.mergingColumn) {
                if (!form[groupName][i]["state"][field.uniqueId]) {
                  form[groupName][i]["state"][field.uniqueId] = {};
                }

                let value = "";
                if (has(detailsData[i], field.uniqueId)) {
                  value = detailsData[i][field.uniqueId];
                } else if (has(field, "defaultValue")) {
                  value = field.defaultValue;
                } else {
                  value = libDefaultvalue[field.component];
                }

                form[groupName][i]["state"][field.uniqueId] = {
                  value,
                  validationText: "",
                  validationStatus: true
                };

                if (!has(this.mockRowCollectionState, field.uniqueId)) {
                  this.mockRowCollectionState = {
                    ...this.mockRowCollectionState,
                    [field.uniqueId]: {
                      value: "",
                      validationText: "",
                      validationStatus: true
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
          if (fields[i].details[j].uniqueId === stateName) {
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
      form: {
        ...this.state.form,
        [groupName]: [
          ...this.state.form[groupName],
          {
            uniqueId: uniqueId("row_"),
            state: { ...this.mockRowCollectionState }
          }
        ]
      }
    });
  };

  /* remove row in details */
  onClickRemoveRow = groupName => id => {
    this.setState({
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
      this.props.onSetErrorMessage({
        type: "error",
        message: "Some input field have a validation error"
      });
    }
  };

  toggleDialog = (name, visible) => () => {
    if (this.state.dialog[name].visilbe !== visible) {
      this.setState({
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
          if (!has(details[j], "mergingColumn") || !details[j].mergingColumn) {
            newData[details[j].uniqueId] =
              data[groupName][details[j].uniqueId].value;
          }
        }
      } else if (type === "details") {
        if (has(field, uniqueDetail)) {
          if (!newData[field.uniqueDetail]) {
            newData[field.uniqueDetail] = [];
          }
          for (let j = 0; j < data[groupName].length; j++) {
            if (!newData[field.uniqueDetail][j]) {
              newData[field.uniqueDetail][j] = {};
            }
            for (let k = 0; k < details.length; k++) {
              newData[field.uniqueDetail][j][details[k].uniqueId] =
                data[groupName][j]["state"][details[k].uniqueId].value;
            }
          }
        } else {
          alert(
            "You have to specify attribute details name at this configurations"
          );
        }
      }
    }
    return newData;
  };

  onAggreeSubmitForm = () => {
    this.props.onClickButtonSubmit(
      {
        abnormalData: this.state.form,
        data: this.giveNormalData(this.state.form),
        dataExist: this.state.dataExist,
        id: this.props.params[BaseForm.ID_FORM]
      },
      this.isEdit
    );
  };

  render() {
    return (
      <form
        method="post"
        encType="multipart/form-data"
        className={this.props.classes.container}
      >
        {this.props.extensionComponentForm.top}
        <AlertDialog
          type={"confirmation"}
          title={"Confirmation"}
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
        {this.props.fields.map(
          ({ type, title, groupName, details, ...others }) => {
            if (type === "standard") {
              return (
                <BaseFormStandar
                  key={title}
                  title={title}
                  details={details}
                  isEdit={this.isEdit}
                  state={this.state.form[groupName]}
                  onChangeValue={this.onChangeBaseFormStandar(groupName)}
                />
              );
            } else {
              return (
                <BaseFormDetails
                  key={title}
                  title={title}
                  details={details}
                  isEdit={this.isEdit}
                  uniqueDetail={others.uniqueDetail}
                  state={this.state.form[groupName]}
                  onClickAddRow={this.onClickAddRow(groupName)}
                  onClickRemoveRow={this.onClickRemoveRow(groupName)}
                  onChangeValue={this.onChangeBaseFormDetails(groupName)}
                />
              );
            }
          }
        )}
        {this.props.extensionComponentForm.bottom}
        <div className={this.props.classes.wrapperFooter}>
          <Button
            size={"medium"}
            variant={"contained"}
            className={this.props.classes.btnCancel}
            onClick={this.props.onClickButtonClose}
          >
            <CloseIcon />
            <Typography color={"inherit"}>Cancel</Typography>
          </Button>
          <Button
            size={"medium"}
            variant={"contained"}
            onClick={this.onSubmit}
            className={this.props.classes.btnSave}
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
  configurationServer: PropTypes.shape({
    replaceUrlWithUniqueId: PropTypes.string.isRequired,
    create: PropTypes.object.isRequired,
    update: PropTypes.object.isRequired,
    getDataUpdate: PropTypes.object.isRequired
  }),
  onSetErrorMessage: PropTypes.func.isRequired,
  onClickButtonClose: PropTypes.func.isRequired,
  onClickButtonSubmit: PropTypes.func.isRequired,
  extensionComponentForm: PropTypes.shape({
    top: PropTypes.element,
    bottom: PropTypes.element
  })
};

export default withStyles(styles)(BaseForm);
