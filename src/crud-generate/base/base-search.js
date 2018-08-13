import React, { Component } from "react";

/* material ui modules */
import Paper from "@material-ui/core/Paper";

/* etc modules */
import PropTypes from "prop-types";

/* my modules */

class BaseSearch extends Component {
  render() {
    return <Paper>tes</Paper>;
  }
}

BaseSearch.propTypes = {
  fields: PropTypes.array.isRequired
};

export default BaseSearch;
