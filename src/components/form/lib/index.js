import FormInput from "./form-input";
import FormTextArea from "./form-text-area";
import FormInputNominal from "./form-input-nominal";
import FormInputAutoComplete from "./form-input-auto-complete";
import FormRadio from "./form-radio";
import FormCheckbox from "./form-checkbox";
import FormSelect from "./form-select";
import FormSelectMultiple from "./form-select-multiple";
import FormDateTimePicker from "./form-date-time-picker";
import FormDatePicker from "./form-date-picker";
import FormTimePicker from "./form-time-picker";
import FormFileUploader from "./form-file-uploader";

const lib = {
  Input: FormInput,
  TextArea: FormTextArea,
  InputNominal: FormInputNominal,
  InputAutoComplete: FormInputAutoComplete,
  Radio: FormRadio,
  Checkbox: FormCheckbox,
  Select: FormSelect,
  SelectMultiple: FormSelectMultiple,
  DateTimePicker: FormDateTimePicker,
  DatePicker: FormDatePicker,
  TimePicker: FormTimePicker,
  FileUploader: FormFileUploader
};

export default lib;
