import React, { PureComponent } from "react";

/* material ui */
import Radio from "@material-ui/core/Radio";
import red from "@material-ui/core/colors/red";
import RadioGroup from "@material-ui/core/RadioGroup";
import InputLabel from "@material-ui/core/InputLabel";
import { withStyles } from "@material-ui/core/styles";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel";

/* etc modules */
import has from "lodash/has";
import axios from "axios";
import PropTypes from "prop-types";
import isArray from "lodash/isArray";

const styles = () => ({
  container: {
    marginTop: 18,
    marginBottom: 6
  },
  helperText: {
    color: red[500]
  }
});

class FormRadio extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: has(props.othersConf, "data")
        ? props.extension.data.map(item => ({
            id: item[props.othersConf.idAttributeName],
            label: item[props.otherConf.labelAttributeName]
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

      /* fetch data from server */
      const data = await axios.get(url, config);
      if (!has(data, "data")) {
        throw new Error(data);
      }
      this.setState({
        data: data.data.map(item => ({
          id: item[idAttributeName],
          label: item[labelAttributeName]
        }))
      });
    } catch (e) {
      alert(isArray(e) ? JSON.stringify(e) : e.toString());
    }
  };

  onChange = e => {
    this.props.onChangeValue(e.target.value);
  };

  render() {
    return (
      <div style={this.props.classes.container}>
        <InputLabel>{this.props.label}</InputLabel>
        <RadioGroup
          id={this.props.id}
          name={this.props.name}
          style={this.props.style}
          onChange={this.onChange}
          value={this.props.value.id.toString()}
        >
          {this.state.data.map(item => (
            <FormControlLabel
              control={<Radio />}
              key={item.id}
              label={item.label}
              value={item.id.toString()}
              disabled={!this.props.editable}
              readonly={!this.props.editable}
            />
          ))}
        </RadioGroup>
        {this.props.error && (
          <FormHelperText className={this.props.classes.helperText}>
            {this.props.helperText}
          </FormHelperText>
        )}
      </div>
    );
  }
}

FormRadio.propTypes = {
  error: PropTypes.bool,
  editable: PropTypes.bool,
  style: PropTypes.object,
  helperText: PropTypes.string,
  id: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  onChangeValue: PropTypes.func.isRequired,
  othersConf: PropTypes.shape({
    data: PropTypes.array,
    customSource: PropTypes.string,
    config: PropTypes.object,
    idAttributeName: PropTypes.string.isRequired,
    labelAttributeName: PropTypes.string.isRequired
  }).isRequired
};

FormRadio.defaultProps = {
  style: {},
  error: false,
  editable: true,
  helperText: ""
};

export default withStyles(styles)(FormRadio);
