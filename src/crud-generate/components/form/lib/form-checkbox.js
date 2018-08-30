import React, { PureComponent } from "react";

/* material ui modules */
import red from "@material-ui/core/colors/red";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { withStyles } from "@material-ui/core/styles";

/* etc modules */
import has from "lodash/has";
import axios from "axios";
import PropTypes from "prop-types";
import isArray from "lodash/isArray";
import { FormHelperText, InputLabel } from "@material-ui/core";

const styles = () => ({
  container: {
    marginTop: 18,
    marginBottom: 6
  }
});

class FormCheckbox extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: has(props.othersConf, "data")
        ? props.othersConf.data.map(item => ({
            id: item[props.idAttributeName],
            label: item[props.labelAttributeName]
          }))
        : []
    };
  }

  componentDidMount() {
    if (has(this.props.othersConf, "customSource")) {
      this.getCustomSourceData();
    }
  }

  /* get data custom source from server */
  getCustomSourceData = async () => {
    try {
      const {
        customSource: url,
        idAttributeName,
        labelAttributeName,
        ...others
      } = this.props.othersConf;
      const config = has(others, "config") ? others.config : {};

      const result = await axios.get(url, config);
      if (!has(result, "data")) {
        throw new Error(result);
      }
      this.setState({
        data: result.data.map(item => ({
          id: item[idAttributeName],
          label: item[labelAttributeName]
        }))
      });
    } catch (e) {
      alert(isArray(e) ? JSON.stringify(e) : e.toString());
    }
  };

  onChange = e => {
    const isExist = this.props.value.some(
      filtItem => filtItem.id === e.target.value
    );
    if (isExist) {
      this.props.onChangeValue(
        this.props.value.filter(({ id }) => id != e.target.value)
      );
    } else {
      this.props.onChangeValue([
        ...this.props.value,
        this.state.data.find(({ id }) => id == e.target.value)
      ]);
    }
  };

  render() {
    return (
      <div style={this.props.classes.container}>
        <InputLabel>{this.props.label}</InputLabel>
        {this.state.data.map(item => (
          <div key={item.id}>
            <FormControlLabel
              label={item.label}
              control={
                <Checkbox
                  name={this.props.name}
                  style={this.props.style}
                  onChange={this.onChange}
                  value={item.id.toString()}
                  disabled={!this.props.editable}
                  id={`${this.props.id}-${item.id}`}
                  checked={this.props.value.some(({ id }) => id == item.id)}
                />
              }
            />
          </div>
        ))}
        <FormHelperText style={{ color: red[500] }}>
          {helperText}
        </FormHelperText>
      </div>
    );
  }
}

FormCheckbox.propTypes = {
  editable: PropTypes.bool,
  id: PropTypes.string.isRequired,
  value: PropTypes.array.isRequired,
  onChangeValue: PropTypes.func.isRequired,
  othersConf: PropTypes.shape({
    data: PropTypes.array,
    customSource: PropTypes.string,
    config: PropTypes.object,
    idAttributeName: PropTypes.string.isRequired,
    labelAttributeName: PropTypes.string.isRequired
  }).isRequired,
  error: PropTypes.bool,
  style: PropTypes.object,
  helperText: PropTypes.string
};

FormCheckbox.defaultProps = {
  style: {},
  error: false,
  helperText: "",
  editable: true
};

export default withStyles(styles)(FormCheckbox);
