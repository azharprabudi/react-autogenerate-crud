import React, { PureComponent, Fragment } from "react";

/* material ui */
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

/* etc modules */
import PropTypes from "prop-types";

class AlertDialog extends PureComponent {
  render() {
    return (
      <Dialog
        open={this.props.visible}
        onClose={this.props.onDialogclose}
        fullScreen={this.props.fullScreen}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="responsive-dialog-title">
          {this.props.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{this.props.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          {this.props.type == "confirmation" ? (
            <Fragment>
              <Button onClick={this.props.onDisaggree} color="primary">
                No
              </Button>
              <Button onClick={this.props.onAggree} color="primary" autoFocus>
                Yes
              </Button>
            </Fragment>
          ) : (
            <Button onClick={this.props.onDisaggree} color="primary" autoFocus>
              Ok
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  }
}

AlertDialog.propTypes = {
  onDialogclose: PropTypes.func,
  fullScreen: PropTypes.bool,
  /* required */
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onAggree: PropTypes.func.isRequired,
  onDisaggree: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["", "alert", "confirmation"]).isRequired
};

AlertDialog.defaultProps = {
  fullScreen: false,
  onDialogclose: () => {}
};

export default AlertDialog;
