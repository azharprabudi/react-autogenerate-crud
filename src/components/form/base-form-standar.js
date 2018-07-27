import React, { Component } from "react";

/* material modules */
import { withStyles } from "@material-ui/core/styles";

/* etc modules */
import PropTypes from "prop-types";

const styles = theme => ({
  container: {
    backgroundColor: "white"
  }
});

class BaseFormStandar extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <h1> hleo gaes</h1>
      </div>
    );
  }
}

export default withStyles(styles)(BaseFormStandar);
