import React from "react";

const inputComponent = ({ inputRef, ...props }) => (
  <div ref={inputRef} {...props} />
);

export default inputComponent;
