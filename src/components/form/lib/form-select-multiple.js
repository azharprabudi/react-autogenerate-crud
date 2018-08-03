import React, { PureComponent } from "react";

/* material ui modules */
import Chip from "@material-ui/core/Chip";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import { withStyles } from "@material-ui/core/styles";

/* etc modules */
import axios from "axios";
import has from "lodash/has";
import PropTypes from "prop-types";
import isArray from "lodash/isArray";
import find from "lodash/find";

const styles = theme => ({
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  chip: {
    margin: theme.spacing.unit / 4
  }
});

class FormSelectMultiple extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: has(props.extension, "data") ? props.extension.data : []
    };
  }

  componentDidMount() {
    if (has(this.props.extension, "customSource")) {
      this.getCustomSourceData();
    }
  }

  /* get the data from server, if the user doest provide the data from props and choose the custom source */
  getCustomSourceData = async () => {
    try {
      const { extension } = this.props;
      const url = has(extension.customSource, "url")
        ? extension.customSource.url
        : "";
      const method = has(extension.customSource, "method")
        ? extension.customSource.method
        : "get";
      const config = has(extension.customSource, "config")
        ? extension.customSource.config
        : {};
      const data = await axios[method](url, config);
      if (!has(data, "data")) {
        throw new Error(data);
      }
      this.setState({
        data: data.data
      });
    } catch (e) {
      alert(isArray(e) ? JSON.stringify(e) : e.toString());
    }
  };

  /* on change listener */
  onChangeSelected = e => {
    this.props.onChange(e.target.value);
  };

  /* on remove listener */
  onRemoveSelected = id => () => {
    this.props.onChange(this.props.value.filter(propsId => propsId !== id));
  };

  render() {
    const {
      id,
      name,
      value,
      style,
      error,
      label,
      classes,
      disabled,
      readonly,
      extension,
      helperText
    } = this.props;
    return (
      <FormControl
        fullWidth
        error={error}
        margin={"normal"}
        disabled={disabled}
      >
        <InputLabel htmlFor={id}>{label}</InputLabel>
        <Select
          multiple
          style={style}
          value={value}
          onChange={this.onChangeSelected}
          input={<Input id={id} name={name} readOnly={readonly} />}
          renderValue={selected => (
            <div className={classes.chips}>
              {selected.map(value => {
                const dataSelected = find(this.state.data, {
                  [extension.idAttributeName]: value
                });
                const label = has(dataSelected, extension.labelAttributeName)
                  ? dataSelected[extension.labelAttributeName]
                  : "";
                return (
                  <Chip
                    key={value}
                    label={label}
                    className={classes.chip}
                    onDelete={this.onRemoveSelected(value)}
                  />
                );
              })}
            </div>
          )}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 48 * 4.5 + 8,
                width: 250
              }
            }
          }}
        >
          {this.state.data.map(item => (
            <MenuItem
              key={item[extension.idAttributeName]}
              value={item[extension.idAttributeName]}
            >
              {item[extension.labelAttributeName]}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    );
  }
}

FormSelectMultiple.propTypes = {
  /* required */
  id: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  disabled: PropTypes.bool.isRequired,
  readonly: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  extension: PropTypes.shape({
    data: PropTypes.array,
    customSource: PropTypes.shape({
      url: PropTypes.string.isRequired,
      method: PropTypes.string,
      config: PropTypes.object
    }),
    idAttributeName: PropTypes.string.isRequired,
    labelAttributeName: PropTypes.string.isRequired
  }).isRequired,
  helperText: PropTypes.string.isRequired,
  /* non required */
  style: PropTypes.object
};

export default withStyles(styles)(FormSelectMultiple);
