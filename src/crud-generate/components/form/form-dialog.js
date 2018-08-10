import React, { Component } from "react";

/* material design modules */
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

/* etc modules */
import PropTypes from "prop-types";
import upperFirst from "lodash/upperFirst";

/* my modules */
import BaseForm from "../../base/base-form";
import OptionsConf from "../../constants/options-conf";

const styles = theme => ({
  appBar: {
    position: "fixed",
    backgroundColor: theme.palette.primary.main
  },
  flex: {
    flex: 1
  },
  toolbar: {
    paddingLeft: 15,
    paddingRight: 15
  }
});

class FormDialog extends Component {
  test = () => {
    console.log(this.reftest);
  };
  render() {
    const {
      fields,
      classes,
      onClose,
      visible,
      title,
      params,
      onClickButtonClose,
      createConfigurationServer,
      updateConfigurationServer,
      onClickButtonSubmit
    } = this.props;
    return (
      <Dialog fullScreen open={visible} onClose={onClose}>
        <AppBar className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <Typography
              variant="title"
              color="inherit"
              className={classes.flex}
            >
              {upperFirst(title)}
            </Typography>
            <IconButton
              color="inherit"
              onClick={onClickButtonClose}
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <BaseForm
          params={params}
          fields={fields}
          onClickButtonSubmit={onClickButtonSubmit}
          onClickButtonClose={onClickButtonClose}
          createConfigurationServer={createConfigurationServer}
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
  onClickButtonClose: PropTypes.func.isRequired,
  onClickButtonSubmit: PropTypes.func.isRequired
};

export default withStyles(styles)(FormDialog);
