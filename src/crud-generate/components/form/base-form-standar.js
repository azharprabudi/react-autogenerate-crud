import React, { PureComponent } from "react";

/* material modules */
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

/* etc modules */
import has from "lodash/has";
import PropTypes from "prop-types";
import upperFirst from "lodash/upperFirst";

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

class BaseFormStandar extends PureComponent {
  onChangeValue = stateName => value => {
    this.props.onChange(stateName, value);
  };

  renderItemInput = item => {
    if (typeof lib[item.component] !== "undefined") {
      const SelectedComponent = lib[item.component];
      const { value, validationStatus, validationText } = this.props.state[
        item.uniqueId
      ];

      let editable = true;
      /* condition readonly and disabled form */
      if (this.props.isEdit && has(item, "editEditable")) {
        editable = item.editEditable;
      } else if (!this.props.isEdit && has(item, "addEditable")) {
        editable = item.addEditable;
      }

      const style = has(item, "style") ? item.style : {};
      const display =
        item.component === "InputHidden" ? { display: "none" } : {};
      const othersConf = has(item, "othersConf") ? item.othersConf : {};

      return (
        <Grid item key={id} sm={6} xs={12} style={display}>
          <SelectedComponent
            style={style}
            value={value}
            id={item.uniqueId}
            label={item.label}
            editable={editable}
            name={item.uniqueId}
            othersConf={othersConf}
            error={!validationStatus}
            isEdit={this.props.isEdit}
            helperText={validationText}
            others={item.propsComponent}
            onChangeValue={this.onChangeValue(uniqueId)}
          />
        </Grid>
      );
    }
    return null;
  };

  render() {
    return (
      <div className={this.props.classes.container}>
        <div className={this.props.classes.wrapperTitle}>
          <Typography variant="title" color="inherit">
            {`# ${upperFirst(this.props.title)}`}
          </Typography>
        </div>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          spacing={16}
        >
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
  classes: PropTypes.object.isRequired,
  isEdit: PropTypes.bool.isRequired,
  onChangeValue: PropTypes.func.isRequired
};

export default withStyles(styles)(BaseFormStandar);
