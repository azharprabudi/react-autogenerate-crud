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
      classes,
      onClose,
      visible,
      title,
      params,
      serverRequest,
      onClickButtonClose
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
          fields={this.fields}
          serverRequest={this.props.serverRequest}
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
  fields: PropTypes.array.isRequired,
  serverRequest: PropTypes.object.isRequired,
  onClickButtonClose: PropTypes.func.isRequired,
  onClickButtonSubmit: PropTypes.func.isRequired
};

export default withStyles(styles)(FormDialog);
