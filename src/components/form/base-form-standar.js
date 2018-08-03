import React, { Component } from "react";

/* material modules */
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

/* etc modules */
import has from "lodash/has";
import PropTypes from "prop-types";

/* my modules */
import lib from "./lib";

const styles = theme => ({
  container: {
    flex: 1,
    paddingTop: 15,
    paddingRight: 10,
    paddingBottom: 15,
    paddingLeft: 10,
    flexWrap: "wrap",
    marginBottom: 10,
    backgroundColor: "white"
  }
});

class BaseFormStandar extends Component {
  onChange = stateName => value => {
    this.props.onChange(stateName, value);
  };

  renderItemInput = ({
    component,
    componentAttribute: { name, id, label, type, ...others }
  }) => {
    if (typeof lib[component] !== "undefined") {
      const SelectedComponent = lib[component];
      const { value, validationStatus, validationText } = this.props.state[
        name
      ];

      let readonly = false;
      let disabled = false;
      let extension = {};

      /* condition readonly and disabled form */
      if (this.props.isEdit && has(others, "onEdit")) {
        if (has(others.onEdit, "readonly")) {
          readonly = others.onEdit.readonly;
        }

        if (has(others.onEdit, "disabled")) {
          disabled = others.onEdit.disabled;
        }
      } else if (!this.props.isEdit && has(others, "onAdd")) {
        if (has(others.onAdd, "readonly")) {
          readonly = others.onAdd.readonly;
        }

        if (has(others.onAdd, "disabled")) {
          disabled = others.onAdd.disabled;
        }
      }

      /* condition extension */
      if (has(others, "extension")) {
        extension = others.extension;
      }

      const style = has(others, "style") ? others.style : {};
      return (
        <SelectedComponent
          id={id}
          key={id}
          type={type}
          name={name}
          label={label}
          value={value}
          extension={others}
          readonly={readonly}
          disabled={disabled}
          extension={extension}
          error={!validationStatus}
          helperText={validationText}
          onChange={this.onChange(name)}
        />
      );
    }
    return null;
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <Typography variant="title" color="inherit">
          {this.props.title.toUpperCase()}
        </Typography>
        {this.props.details.map(item => this.renderItemInput(item))}
      </div>
    );
  }
}

BaseFormStandar.propTypes = {
  title: PropTypes.string.isRequired,
  details: PropTypes.array.isRequired,
  state: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  isEdit: PropTypes.bool.isRequired
};

export default withStyles(styles)(BaseFormStandar);
