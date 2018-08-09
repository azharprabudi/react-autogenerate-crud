## FIELDS ##

This props has an array data type in which each value in the array must be an object. To find out what object / props attributes are required, please see the documentation below

<table>
  <thead>
    <tr>
      <td>No</td>
      <td>Props Name</td>
      <td>Type</td>
      <td>Default</td>
      <td>Required</td>
      <td>Description</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>title</td>
      <td>String</td>
      <td>''</td>
      <td>No</td>
      <td>The title of each group form</td>
    </tr>
    <tr>
      <td>2</td>
      <td>type</td>
      <td>String</td>
      <td>'standard'</td>
      <td>No</td>
      <td>Choose one of ['standard', 'details']</td>
    </tr>
    <tr>
      <td>3</td>
      <td>groupName</td>
      <td>String</td>
      <td>'' (unique, different with each other)</td>
      <td>No</td>
      <td>This is used to group states in fields that are in this group, so it is required to differ between groupname one and other groupname. If the same, the state will be replaced later, and it will not work properly</td>
    </tr>
    <tr>
      <td>4</td>
      <td>details</td>
      <td>Array</td>
      <td>-</td>
      <td>Yes</td>
      <td>List of input forms that are in the groupname, see full documentation <a href="#details">here</a></td>
    </tr>
  </tbody>
</table>

<b>fields[0].details</b>

<table>
  <thead>
    <tr>
      <td>No</td>
      <td>Props Name</td>
      <td>Type</td>
      <td>Default</td>
      <td>Required</td>
      <td>Description</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>component</td>
      <td>String</td>
      <td>-</td>
      <td>Yes</td>
      <td>Choose one of ['Input', 'TextArea', 'InputNominal', 'Radio', 'Checkbox', 'Select', 'SelectMultiple', 'SelectAutoComplete', 'SelectMultipleAutoComplete', 'SelectAsyncAutoComplete', 'SelectAsyncMultipleAutoComplete', 'CustomEditor', 'FileUploader']</td>
    </tr>
    <tr>
      <td>2</td>
      <td>componentAttribute</td>
      <td>Object</td>
      <td>-</td>
      <td>Yes</td>
      <td>This contains the attributes of the components that have been specified above which consist of id, name, etc. For complete documentation click <a href="#componentAttribute">here</a></td>
    </tr>
    <tr>
      <td>3</td>
      <td>validation</td>
      <td>String</td>
      <td>-</td>
      <td>No</td>
      <td>required|validEmail|minLength_[YOUR_NUMBER]|maxLength_[YOUR_NUMBER]|integer|alphabet|gt_[YOUR_NUMBER]|gte_[YOUR_NUMBER]|lt_[YOUR_NUMBER]|lte_[YOUR_NUMBER]|validUrl|regex|matches[GROUP_NAME][ATTRIBUTE_NAME_INPUT]|callback_{YOUR_FUNC_NAME_CALLBACK}</td>
    </tr>
    <tr>
      <td>4</td>
      <td>validationCallback</td>
      <td>Object</td>
      <td>{}</td>
      <td>No</td>
      <td>if there is callback_test on the previous validation, then you are required to create an attribute in the callback validation object with a test name like this
      
```javascript
validation='callback_test',
validationCallback={{
  test: (value) => {
    return {message: '', validation: true}
  }
}}
```
      </td>
  </tr>
  </tbody>
</table>
