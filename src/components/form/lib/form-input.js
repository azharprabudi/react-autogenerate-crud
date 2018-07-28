import React, { PureComponent } from "react";

/* material ui */
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperTextr from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  input: {
    marginTop: 15
  }
});

class FormInput extends PureComponent {
  render() {
    const { classes, id, name, label } = this.props;
    return (
      <FormControl fullWidth className={classes.input}>
        <InputLabel htmlFor={id}>{label}</InputLabel>
        <Input
          id={id}
          fullWidth
          margin={"dense"}
          name={name}
          value={""}
          onChange={val => console.log(val)}
        />
      </FormControl>
    );
  }
}

export default withStyles(styles)(FormInput);
