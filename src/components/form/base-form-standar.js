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

console.log("lib", lib);

class BaseFormStandar extends Component {
  renderItemInput = item => {
    if (typeof lib[item.component] !== "undefined") {
      const SelectedComponent = lib[item.component];
      return <SelectedComponent {...item} key={item.id} />;
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
        {this.props.details.map(itemInput => this.renderItemInput(itemInput))}
      </div>
    );
  }
}

BaseFormStandar.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  groupName: PropTypes.string.isRequired,
  details: PropTypes.array.isRequired
};

export default withStyles(styles)(BaseFormStandar);
