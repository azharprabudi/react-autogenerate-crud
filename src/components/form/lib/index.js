import FormInput from "./form-input";
import FormTextArea from "./form-text-area";
import FormInputNominal from "./form-input-nominal";
import FormRadio from "./form-radio";
import FormCheckbox from "./form-checkbox";
import FormSelect from "./form-select";
import FormSelectMultiple from "./form-select-multiple";
import FormSelectAutoComplete from "./form-select-auto-complete";
import FormSelectMultipleAutoComplete from "./form-select-multiple-auto-complete";
import FormFileUploader from "./form-file-uploader";

const lib = {
  Input: FormInput,
  TextArea: FormTextArea,
  InputNominal: FormInputNominal,
  Radio: FormRadio,
  Checkbox: FormCheckbox,
  Select: FormSelect,
  SelectMultiple: FormSelectMultiple,
  SelectAutoComplete: FormSelectAutoComplete,
  SelectMultipleAutoComplete: FormSelectMultipleAutoComplete,
  FileUploader: FormFileUploader
};

export const libDefaultvalue = {
  Input: "",
  TextArea: "",
  InputNominal: "",
  InputAutoComplete: "",
  Radio: "",
  Checkbox: [],
  Select: "",
  SelectMultiple: [],
  SelectAutoComplete: "",
  SelectMultipleAutoComplete: [],
  FileUploader: ""
};

export default lib;
