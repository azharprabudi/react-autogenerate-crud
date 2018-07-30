import React, { Component } from "react";

/* material modules */
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

/* etc modules */
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
  renderItemInput = ({ component, attribute }) => {
    if (typeof lib[component] !== "undefined") {
      const SelectedComponent = lib[component];
      const { value, validationStatus, validationText } = this.props.state[
        attribute.name
      ];
      return (
        <SelectedComponent
          {...attribute}
          value={value}
          key={attribute.id}
          error={!validationStatus}
          helperText={validationText}
          onChange={value => this.props.onChange(attribute.name, value)}
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
  onChange: PropTypes.func.isRequired
};

export default withStyles(styles)(BaseFormStandar);
