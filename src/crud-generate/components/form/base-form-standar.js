import React, { Component } from "react";

/* material modules */
import Grid from "@material-ui/core/Grid";
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
    paddingTop: 25,
    paddingBottom: 15,
    paddingRight: 8,
    paddingLeft: 8,
    flexWrap: "wrap",
    marginBottom: 16,
    backgroundColor: "white"
  },
  wrapperTitle: {
    marginBottom: 15
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
        <Grid item key={id} sm={6} xs={12}>
          <SelectedComponent
            id={id}
            type={type}
            name={name}
            label={label}
            value={value}
            style={style}
            extension={others}
            readonly={readonly}
            disabled={disabled}
            extension={extension}
            error={!validationStatus}
            isEdit={this.props.isEdit}
            helperText={validationText}
            onChange={this.onChange(name)}
            className={this.props.classes.input}
          />
        </Grid>
      );
    }
    return null;
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <div className={classes.wrapperTitle}>
          <Typography variant="title" color="inherit">
            {`# ${this.props.title.toUpperCase()}`}
          </Typography>
        </div>
        <Grid container spacing={16}>
          {this.props.details.map(item => this.renderItemInput(item))}
        </Grid>
      </div>
    );
  }
}

BaseFormStandar.propTypes = {
  title: PropTypes.string.isRequired,
  details: PropTypes.array.isRequired,
  state: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  isEdit: PropTypes.bool.isRequired
};

export default withStyles(styles)(BaseFormStandar);
