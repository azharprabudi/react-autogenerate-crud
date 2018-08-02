import React, { Component } from "react";

/* material design modules */
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

/* etc modules */
import PropTypes from "prop-types";
import upperFirst from "lodash/upperFirst";

/* my modules */
import BaseForm from "../../base/base-form";
import Colors from "../../constants/colors";
import OptionsConf from "../../constants/options-conf";

const styles = theme => ({
  appBar: {
    position: "relative",
    backgroundColor: Colors.blue
  },
  flex: {
    flex: 1
  },
  toolbar: {
    paddingLeft: 0,
    paddingRight: 0
  }
});

class FormDialog extends Component {
  render() {
    const {
      fields,
      classes,
      onClose,
      visible,
      title,
      params,
      onClickButtonClose,
      addConfigurationServer,
      updateConfigurationServer
    } = this.props;
    return (
      <Dialog fullScreen open={visible} onClose={onClose}>
        <AppBar className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <IconButton color="inherit" onClick={onClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography
              variant="title"
              color="inherit"
              className={classes.flex}
            >
              {upperFirst(title)}
            </Typography>
            <Button color="inherit" onClick={onClickButtonClose}>
              Submit
            </Button>
          </Toolbar>
        </AppBar>
        <BaseForm
          params={params}
          fields={fields}
          addConfigurationServer={addConfigurationServer}
          updateConfigurationServer={updateConfigurationServer}
        />
      </Dialog>
    );
  }
}

FormDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  params: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  addConfigurationServer: PropTypes.shape({
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
  onClickButtonClose: PropTypes.func.isRequired,
  onClickButtonSubmit: PropTypes.func.isRequired
};

export default withStyles(styles)(FormDialog);
