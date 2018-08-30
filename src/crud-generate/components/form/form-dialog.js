import React, { PureComponent } from "react";

/* material design modules */
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

/* etc modules */
import PropTypes from "prop-types";

/* my modules */
import BaseForm from "../../base/base-form";

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

class FormDialog extends PureComponent {
  render() {
    return (
      <Dialog fullScreen open={this.props.visible} onClose={this.props.onClose}>
        <AppBar className={this.props.classes.appBar}>
          <Toolbar className={this.props.classes.toolbar}>
            <Typography
              variant="title"
              color="inherit"
              className={this.props.classes.flex}
            >
              {this.props.title}
            </Typography>
            <IconButton
              color="inherit"
              onClick={this.props.onClickButtonClose}
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
          {this.props.loading && <LinearProgress color="secondary" />}
        </AppBar>
        <BaseForm
          params={this.props.params}
          fields={this.props.fields}
          onSetErrorMessage={this.props.onSetErrorMessage}
          onClickButtonSubmit={this.props.onClickButtonSubmit}
          onClickButtonClose={this.props.onClickButtonClose}
          configurationServer={this.props.configurationServer}
          extensionComponentForm={this.props.extensionComponentForm}
        />
      </Dialog>
    );
  }
}

FormDialog.propTypes = {
  fields: PropTypes.array.isRequired,
  visible: PropTypes.bool.isRequired,
  params: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  configurationServer: PropTypes.shape({
    create: PropTypes.object.isRequired,
    update: PropTypes.object.isRequired,
    getDataUpdate: PropTypes.object.isRequired
  }),
  loading: PropTypes.bool.isRequired,
  onClickButtonClose: PropTypes.func.isRequired,
  onClickButtonSubmit: PropTypes.func.isRequired,
  onSetErrorMessage: PropTypes.func.isRequired,
  extensionComponentForm: PropTypes.shape({
    top: PropTypes.element,
    bottom: PropTypes.element
  })
};

export default withStyles(styles)(FormDialog);
