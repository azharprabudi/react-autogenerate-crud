import React, { PureComponent } from "react";

/* material modules */
import red from "@material-ui/core/colors/red";
import InputLabel from "@material-ui/core/InputLabel";
import { withStyles } from "@material-ui/core/styles";

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
import { FormHelperText } from "@material-ui/core";

const styles = theme => ({
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
  }
});

class FormWysiwyg extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty()
    };

    this.imageConf = {};
    if (
      has(props.extension, "editorConf") &&
      has(props.extension.editorConf, "img") &&
      has(props.extension.editorConf.img, "uploadUrl")
    ) {
      this.imageConf = {
        image: {
          uploadCallback: this.uploadImageCallBack,
          alt: { present: true, mandatory: true }
        }
      };
    }
    this.initialize = true;
  }

  uploadImageCallBack = async file => {
    try {
      const { extension } = this.props;
      const url = has(extension.editorConf.img, "uploadUrl")
        ? extension.editorConf.img.uploadUrl
        : "";
      const method = has(extension.editorConf.img, "method")
        ? extension.editorConf.img.method
        : "post";
      const config = has(extension.editorConf.img, "config")
        ? extension.editorConf.img.config
        : {};

      const type = has(extension.editorConf.img, "type")
        ? extension.editorConf.img.type
        : "formData";

      let data = {};
      if (type === "formData") {
        data = new FormData();
        data.append("image", file);
      } else {
        data.image = await this.readImage(file, type);
      }

      const result = await axios[method](url, data, config);
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

      if (type == "base64") {
        reader.readAsDataURL(file);
      } else if (type == "binaryString") {
        reader.readAsBinaryString(file);
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
    const { classes, label, helperText } = this.props;
    return (
      <div className={classes.container}>
        <InputLabel>{label}</InputLabel>
        <Editor
          editorState={this.state.editorState}
          editorClassName={classNames("editor-class", classes.wrapperEditor)}
          wrapperClassName={classNames("wrapper-class", classes.wrapper)}
          toolbarClassName={classNames("toolbar-class", classes.wrapperToolbar)}
          onEditorStateChange={this.onChange}
          toolbar={{
            ...this.imageConf
          }}
        />
        <FormHelperText style={{ color: red[500] }}>
          {helperText}
        </FormHelperText>
      </div>
    );
  }
}

FormWysiwyg.propTypes = {
  label: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  helperText: PropTypes.string.isRequired
};

export default withStyles(styles)(FormWysiwyg);
