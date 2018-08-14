import React, { Component } from "react";

/* material ui modules */
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from "@material-ui/icons/Search";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";

/* etc modules */
import has from "lodash/has";
import PropTypes from "prop-types";
import classNames from "classnames";

/* my modules */
import lib from "../components/form/lib";

const styles = theme => ({
  container: {
    borderRadius: 5
  },
  button: {
    marginRight: 12
  },
  title: {
    fontWeight: "bold"
  },
  expansion: {
    paddingLeft: 8,
    paddingRight: 8
  },
  expansionDetails: {
    display: "block",
    paddingBottom: 15
  }
});

class BaseSearch extends Component {
  onChangeValue = name => value => {
    this.props.onChangeSearch(name, value);
  };

  renderItemInput = ({
    component,
    componentAttribute: { id, type, name, label, value, style, ...item }
  }) => {
    const { values } = this.props;
    const SelectedInput = lib[component];

    let extension = {};
    if (has(item, "extension")) {
      extension = item.extension;
    }

    if (typeof SelectedInput !== "undefined") {
      return (
        <Grid sm={6} xs={12} item key={id}>
          <SelectedInput
            id={id}
            type={type}
            name={name}
            label={label}
            value={values[name]}
            style={style}
            extension={extension}
            error={false}
            isEdit={false}
            helperText={""}
            readonly={false}
            disabled={false}
            onChange={this.onChangeValue(name)}
          />
        </Grid>
      );
    }
    return null;
  };

  render() {
    const { fields, classes, doClearFormValue, doSearchValue } = this.props;
    return (
      <ExpansionPanel className={classes.container}>
        <ExpansionPanelSummary
          className={classes.expansion}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography className={classes.title} variant={"title"}>
            Search Form
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails
          className={classNames(classes.expansionDetails, classes.expansion)}
        >
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            spacing={16}
          >
            {fields.map(item => this.renderItemInput(item))}
          </Grid>
          <Button
            className={classes.button}
            color={"default"}
            variant={"contained"}
            size={"small"}
            onClick={doSearchValue}
          >
            <SearchIcon />
            <Typography color={"inherit"}>Search</Typography>
          </Button>
          <Button
            className={classes.button}
            color={"default"}
            variant={"contained"}
            size={"small"}
            onClick={doClearFormValue}
          >
            <ClearIcon />
            <Typography color={"inherit"}>Clear</Typography>
          </Button>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

BaseSearch.propTypes = {
  fields: PropTypes.array.isRequired,
  values: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  onChangeSearch: PropTypes.func.isRequired,
  doSearchValue: PropTypes.func.isRequired,
  doClearFormValue: PropTypes.func.isRequired
};

export default withStyles(styles)(BaseSearch);
