import React, { PureComponent } from "react";

/* material modules */
import red from "@material-ui/core/colors/red";
import InputLabel from "@material-ui/core/InputLabel";
import { withStyles } from "@material-ui/core/styles";
import FormHelperText from "@material-ui/core/FormHelperText";

/* editor */
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "../../../css/react-draft-wysiwyg.css";

/* etc modules */
import axios from "axios";
import has from "lodash/has";
import PropTypes from "prop-types";
import classNames from "classnames";
import isArray from "lodash/isArray";
import isEqual from "lodash/isEqual";

const styles = () => ({
  container: {
    width: "90%",
    marginTop: 16,
    marginBottom: 8
  },
  wrapper: {
    marginTop: 8,
    marginBottom: 8
  },
  wrapperEditor: {
    border: 1,
    padding: 8,
    borderColor: "rgba(0,0,0,0.2)",
    borderStyle: "solid"
  },
  wrapperToolbar: {
    border: 1,
    borderColor: "rgba(0,0,0,0.2)",
    borderStyle: "solid"
  },
  helperText: {
    color: red[500]
  }
});

class FormWysiwyg extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty()
    };
    this.initialize = true;
  }

  uploadImageCallBack = async file => {
    try {
      const url = has(this.props.othersConf, "imageUploadUrl")
        ? this.props.othersConf.imageUploadUrl
        : "";

      const config = has(extension.editorConf.img, "imageUploadConfig")
        ? this.props.othersConf.imageUploadConfig
        : {};

      const type = has(extension.editorConf.img, "imageUploadType")
        ? this.props.othersConf.imageUploadType
        : "base64";

      let data = null;
      if (type === "formData") {
        data = new FormData();
        data.append("image", file);
      } else {
        data = { image: await this.readImage(file, type) };
      }

      const result = await axios.post(url, data, config);
      if (!has(result, "data")) {
        throw new Error(result);
      }
      return result.data;
    } catch (e) {
      alert(isArray(e) ? JSON.stringify(e) : e.toString());
    }
  };

  readImage = (file, type) => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };

      /* handle error */
      reader.onabort = e => reject(e);
      reader.onerror = e => reject(e);

      if (type == "binaryString") {
        reader.readAsBinaryString(file);
      } else {
        reader.readAsDataURL(file);
      }
    });
  };

  componentDidUpdate(previousProps) {
    if (
      this.initialize &&
      this.props.isEdit &&
      isEqual(this.props.value, previousProps.value) === false
    ) {
      this.setState(
        {
          editorState: EditorState.createWithContent(
            ContentState.createFromBlockArray(
              htmlToDraft(this.props.value).contentBlocks
            )
          )
        },
        () => this.forceUpdate()
      );
      this.initialize = false;
    }
  }

  onChange = editorState => {
    this.setState({
      editorState
    });
    this.props.onChange(
      draftToHtml(convertToRaw(editorState.getCurrentContent()))
    );
  };

  render() {
    return (
      <div className={this.props.classes.container}>
        <InputLabel>{this.props.label}</InputLabel>
        <Editor
          editorState={this.state.editorState}
          editorClassName={classNames(
            "editor-class",
            this.props.classes.wrapperEditor
          )}
          wrapperClassName={classNames(
            "wrapper-class",
            this.props.classes.wrapper
          )}
          toolbarClassName={classNames(
            "toolbar-class",
            this.props.classes.wrapperToolbar
          )}
          onEditorStateChange={this.onChange}
          toolbar={{
            uploadCallback: this.uploadImageCallBack,
            alt: { present: true, mandatory: false }
          }}
        />
        {this.props.error && (
          <FormHelperText className={this.props.classes.helperText}>
            {this.props.helperText}
          </FormHelperText>
        )}
      </div>
    );
  }
}

FormWysiwyg.propTypes = {
  error: PropTypes.bool,
  helperText: PropTypes.string,
  label: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  othersConf: PropTypes.shape({
    imageUploadUrl: PropTypes.string.isRequired,
    imageUploadConfig: PropTypes.object,
    imageUploadType: PropTypes.oneOf(["base64", "binaryString", "formData"])
  }).isRequired
};

FormWysiwyg.defaultProps = {
  error: false,
  helperText: ""
};

export default withStyles(styles)(FormWysiwyg);
