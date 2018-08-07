import React from "react";
import NumberFormat from "react-number-format";

const NumberFormatCustom = props => {
  const { inputRef, onChange, prefix, ...other } = props;
  return (
    <NumberFormat
      {...other}
      ref={inputRef}
      prefix={prefix}
      thousandSeparator
      onValueChange={onChange}
    />
  );
};

export default NumberFormatCustom;
