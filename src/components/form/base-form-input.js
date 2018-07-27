import React, { PureComponent } from "react";

/* material ui */
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperTextr from "@material-ui/core/FormHelperText";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  input: {
    marginVertical: theme.spacing.unit
  }
});

class BaseFormInput extends PureComponent {
  constructor() {
    super();
    this.state = {
      name: ""
    };
  }

  onChangeStateName = (stateName, value) => () => {
    this.setState({
      ...this.state,
      [stateName]: value
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <FormControl className={classes.input}>
        <InputLabel htmlFor="name-simple">Name</InputLabel>
        <Input
          id="name-simple"
          value={this.state.name}
          onChange={this.onChangeStateName("name")}
          fullWidth
          margin={"dense"}
        />
      </FormControl>
    );
  }
}

export default withStyles(styles)(BaseFormInput);
