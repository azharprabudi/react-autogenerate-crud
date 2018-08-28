import React from "react";
import Typography from "@material-ui/core/Typography";

export const valueRowTable = {
  Input: value => <Typography>{value}</Typography>,
  InputHidden: value => <Typography>{value}</Typography>,
  InputPassword: value => <Typography>{value}</Typography>,
  InputDate: value => (
    <Typography>{moment(value).format("YYYY-MM-D")}</Typography>
  ),
  InputTime: value => (
    <Typography>{moment(value).format("H:mm:ss")}</Typography>
  ),
  InputDateTime: value => (
    <Typography>{moment(value).format("YYYY-MM-D, H:mm:ss")}</Typography>
  ),
  InputNumber: value => <Typography>{value}</Typography>,
  InputNominal: value => <Typography>{value}</Typography>,
  TextArea: value => <Typography>{`${value.substr(0, 50)}...`}</Typography>,
  Radio: value => <Typography>{value}</Typography>,
  Checkbox: value => <Typography>{value.join(",")}</Typography>,
  Select: value => <Typography>{value}</Typography>,
  SelectMultiple: <Typography>{value.join(",")}</Typography>,
  SelectAutoComplete: value => <Typography>{value}</Typography>,
  SelectMultipleAutoComplete: <Typography>{value.join(",")}</Typography>,
  SelectAsyncAutoComplete: value => <Typography>{value}</Typography>,
  SelectAsyncMultipleAutoComplete: <Typography>{value.join(",")}</Typography>,
  CustomEditor: value => <Typography>{`${value.substr(0, 50)}...`}</Typography>,
  FileUploader: value => {
    if (/(.jpg|.jpeg|.gif|.png)$/.test(value)) {
      return (
        <img
          src={value}
          alt={value}
          style={{
            maxWidth: 150,
            maxHeight: 150
          }}
        />
      );
    }
    return null;
  }
};
