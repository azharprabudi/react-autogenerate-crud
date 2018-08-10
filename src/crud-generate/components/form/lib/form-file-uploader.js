import React, { PureComponent, Fragment } from "react";

/* material modules */
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import { withStyles } from "@material-ui/core/styles";

/* etc modules */
import has from "lodash/has";
import PropTypes from "prop-types";
import Dropzone from "react-dropzone";

/* my modules */
import Colors from "../../../constants/colors";

const styles = theme => ({
  wrapperImages: {
    width: 180,
    height: 180,
    marginTop: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    borderWidth: 2,
    borderStyle: "dotted",
    borderColor: "rgba(0,0,0,0.5)",
    borderRadius: 5,
    textAlign: "center"
  },
  button: {
    marginTop: 8,
    color: Colors.white,
    backgroundColor: Colors.red
  },
  img: {
    width: "100%"
  },
  imageText: {
    fontSize: 12,
    color: "rgba(0,0,0,0.5)"
  }
});

class FormFileUploader extends PureComponent {
  constructor(props) {
    super(props);
    this.minSize = 0;
    this.maxSize = 5000000;
    this.allowTypes = "image/jpeg, image/jpg, image/png";

    if (has(props.extension, "uploaderConf")) {
      if ((props.extension.uploaderConf, "minSize")) {
        this.minSize = props.extension.uploaderConf.minSize;
      }

      if ((props.extension.uploaderConf, "maxSize")) {
        this.maxSize = props.extension.uploaderConf.maxSize;
      }

      if ((props.extension.uploaderConf, "allowTypes")) {
        this.allowTypes = props.extension.uploaderConf.allowTypes;
      }
    }
  }

  /* on drop listener */
  onDrop = (accepted, rejected) => {
    if (rejected.length > 0) {
      alert("Some file cannot upload");
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        const fileBase64 = reader.result;
        this.props.onChange(fileBase64);
      };
      reader.onabort = () => alert("Abort upload file");
      reader.onerror = () => alert("Error upload file");

      reader.readAsDataURL(accepted[0]);
    }
  };

  /* listener remove image */
  removeImage = () => {
    this.props.onChange("");
  };

  render() {
    const { label, id, name, disabled, readonly, classes } = this.props;
    return (
      <div style={{ marginTop: 16, marginBottom: 8 }}>
        <InputLabel>{label}</InputLabel>
        {this.props.value !== "" ? (
          <Fragment>
            <div className={classes.wrapperImages}>
              <img
                src={this.props.value}
                alt={"image preview"}
                className={classes.img}
              />
            </div>
            <Button
              size={"small"}
              variant="contained"
              className={classes.button}
              onClick={this.removeImage}
            >
              <Typography color={"inherit"}>Remove</Typography>
            </Button>
          </Fragment>
        ) : (
          <Dropzone
            multiple={false}
            onDrop={this.onDrop}
            minSize={this.minSize}
            maxSize={this.maxSize}
            accept={this.allowTypes}
            inputProps={{
              id,
              name,
              disabled,
              readOnly: readonly
            }}
            className={classes.wrapperImages}
          >
            <p className={classes.imageText}>Click / Drop Here For Add image</p>
          </Dropzone>
        )}
      </div>
    );
  }
}

FormFileUploader.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  readonly: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  extension: PropTypes.shape({
    uploaderConf: PropTypes.shape({
      minSize: PropTypes.number.isRequired,
      maxSize: PropTypes.number.isRequired,
      allowTypes: PropTypes.string.isRequired
    })
  })
};

export default withStyles(styles)(FormFileUploader);
