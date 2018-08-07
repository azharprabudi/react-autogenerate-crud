import React, { PureComponent } from "react";

/* material ui component */
import { withStyles } from "@material-ui/core/styles";
import SnackBar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import WarningIcon from "@material-ui/icons/Warning";
import CloseIcon from "@material-ui/icons/Close";
import green from "@material-ui/core/colors/green";
import amber from "@material-ui/core/colors/amber";

/* etc modules */
import classNames from "classnames";
import PropTypes from "prop-types";

/* my modules */
import OptionsConf from "../../constants/options-conf";

const iconDependOnType = {
  error: ErrorIcon,
  success: CheckCircleIcon,
  info: InfoIcon,
  warning: WarningIcon
};

const styles = theme => ({
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.dark
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit
  },
  message: {
    display: "flex",
    alignItems: "center"
  },
  margin: {
    margin: theme.spacing.unit
  }
});

class CustomSnackbar extends PureComponent {
  render() {
    const {
      type,
      message,
      onClickSnackbar,
      onClose,
      visible,
      anchorOrigin,
      classes
    } = this.props;
    const Icon = iconDependOnType[type];
    return (
      <SnackBar open={visible} onClose={onClose} anchorOrigin={anchorOrigin}>
        <SnackbarContent
          className={classNames(classes[type], classes.margin)}
          aria-describedby="client-snackbar"
          message={
            <span id="client-snackbar" className={classes.message}>
              <Icon className={classNames(classes.icon, classes.iconVariant)} />
              {message}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={onClickSnackbar}
            >
              <CloseIcon className={classes.icon} />
            </IconButton>
          ]}
        />
      </SnackBar>
    );
  }
}

CustomSnackbar.propTypes = {
  type: PropTypes.oneOf(OptionsConf.snackbarValue).isRequired,
  message: PropTypes.string.isRequired,
  onClickSnackbar: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  anchorOrigin: PropTypes.object
};

CustomSnackbar.defaultProps = {
  onClose: () => {},
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "right"
  }
};

export default withStyles(styles)(CustomSnackbar);
