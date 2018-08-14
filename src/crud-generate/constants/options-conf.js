export default {
  limitValue: [5, 10, 15, 25, 50, 100],
  componentValue: [
    "Input",
    "TextArea",
    "InputNominal",
    "InputSeparator",
    "Radio",
    "Checkbox",
    "Select",
    "SelectMultiple",
    "SelectAutoComplete",
    "SelectMultipleAutoComplete",
    "SelectAsyncAutoComplete",
    "SelectAsyncMultipleAutoComplete",
    "CustomEditor",
    "FileUploader"
  ],
  componentNotAllowedSearch: [
    "Radio",
    "Checkbox",
    "CustomEditor",
    "FileUploader",
    "TextArea"
  ],
  methodValue: ["get", "post", "patch", "put", "delete"],
  typeColumnValue: [
    "text",
    "custom",
    "image",
    "nominal",
    "date",
    "time",
    "datetime",
    "longtext"
  ],
  typeExportValue: ["csv", "excel"],
  typeFormValue: ["standard", "details"],
  alertValue: ["", "alert", "confirmation"],
  formatImage: ["base64", "formData", "binaryString"],
  snackbarValue: ["error", "success", "warning", "info"]
};
