import React, { PureComponent, Fragment } from "react";

/* material modules */
import Button from "@material-ui/core/Button";
import red from "@material-ui/core/colors/red";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import { withStyles } from "@material-ui/core/styles";
import FormHelperText from "@material-ui/core/FormHelperText";

/* etc modules */
import has from "lodash/has";
import PropTypes from "prop-types";
import Dropzone from "react-dropzone";

const styles = theme => ({
  container: {
    marginTop: 16,
    marginBottom: 8
  },
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
    color: "#fff",
    backgroundColor: theme.palette.error.main
  },
  img: {
    width: "100%"
  },
  imageText: {
    fontSize: 12,
    color: "rgba(0,0,0,0.5)"
  },
  helperText: {
    color: red[500]
  }
});

class FormFileUploader extends PureComponent {
  constructor(props) {
    super(props);
    this.minSize = 0;
    this.maxSize = 5000000;
    this.allowTypes = "image/jpeg, image/jpg, image/png";

    if (has(props, "uploaderConf")) {
      if ((props.uploaderConf, "minSize")) {
        this.minSize = props.uploaderConf.minSize;
      }

      if ((props.uploaderConf, "maxSize")) {
        this.maxSize = props.uploaderConf.maxSize;
      }

      if ((props.uploaderConf, "allowTypes")) {
        this.allowTypes = props.uploaderConf.allowTypes;
      }
    } else {
      alert("You have to passing uploderConf at property this component");
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
        this.props.onChangeValue(fileBase64);
      };
      reader.onabort = () => alert("Abort upload file");
      reader.onerror = () => alert("Error upload file");

      reader.readAsDataURL(accepted[0]);
    }
  };

  /* listener remove image */
  removeImage = () => {
    this.props.onChangeValue("");
  };

  render() {
    return (
      <div className={this.props.classes.container} style={this.props.style}>
        <InputLabel>{this.props.label}</InputLabel>
        {this.props.value !== "" ? (
          <Fragment>
            <div className={classes.wrapperImages}>
              <img
                src={this.props.value}
                alt={"Image Preview"}
                className={this.props.classes.img}
              />
            </div>
            {!this.props.editable && (
              <Button
                size={"small"}
                variant="contained"
                className={this.props.classes.button}
                onClick={this.removeImage}
              >
                <Typography color={"inherit"}>Remove</Typography>
              </Button>
            )}
          </Fragment>
        ) : (
          <Dropzone
            multiple={false}
            onDrop={this.onDrop}
            minSize={this.minSize}
            maxSize={this.maxSize}
            accept={this.allowTypes}
            inputProps={{
              id: this.props.id,
              name: this.props.name,
              readOnly: !this.props.editable,
              disabled: !this.props.editable
            }}
            className={this.props.classes.wrapperImages}
          >
            <p className={this.props.classes.imageText}>
              Click / Drop Here For Add image
            </p>
          </Dropzone>
        )}
        {this.props.error && (
          <FormHelperText className={this.props.classes.helperText}>
            {this.props.helperText}
          </FormHelperText>
        )}
      </div>
    );
  }
}

FormFileUploader.propTypes = {
  error: PropTypes.bool,
  helperText: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  editable: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  othersConf: PropTypes.shape({
    minSize: PropTypes.number,
    maxSize: PropTypes.number,
    allowTypes: PropTypes.string
  }),
  onChangeValue: PropTypes.func.isRequired,
  style: PropTypes.object
};

FormFileUploader.defaultProps = {
  style: {},
  helperText: "",
  error: false,
  editable: true
};

export default withStyles(styles)(FormFileUploader);
