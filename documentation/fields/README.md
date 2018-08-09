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
  <tr>
    <td>5</td>
    <td>showOnTable</td>
    <td>Boolean</td>
    <td>False</td>
    <td>No</td>
    <td>Set to true if you want to show this attribute to column table</td>
  </tr>
  <tr>
    <td>6</td>
    <td>mergingColumn</td>
    <td>Boolean</td>
    <td>False</td>
    <td>No</td>
    <td>If you want to combine two or more value in one column, set this to true and <b>you must set typeColumnTable to be custom (if you are using merging column, this column just show on table, and not created a form input then cannot be sort)</b></td>
  </tr>
  <tr>
    <td>7</td>
    <td>sortColumnTable</td>
    <td>Boolean</td>
    <td>False</td>
    <td>No</td>
    <td>Sorting value from table</td>
  </tr>
  <tr>
    <td>8</td>
    <td>titleColumnTable</td>
    <td>String</td>
    <td>''</td>
    <td>No</td>
    <td>Title of column table</td>
  </tr>
  <tr>
    <td>9</td>
    <td>typeColumnTable</td>
    <td>String</td>
    <td>''</td>
    <td>No</td>
    <td>Choose one of ['text', 'custom', 'image', 'nominal', 'date', 'time', 'datetime', 'longtext'], to specify what the value in this column</td>
  </tr>
  <tr>
    <td>10</td>
    <td>onCustomValue</td>
    <td>Func</td>
    <td>-</td>
    <td>No</td>
    <td>You can return value or component to show on column table</td>
  </tr>
  <tr>
    <td>11</td>
    <td>attributeColumnTable</td>
    <td>String</td>
    <td>-</td>
    <td>No</td>
    <td>This in what the attribute data from server, want to show on table</td>
  </tr>
  <tr>
    <td>12</td>
    <td>prefixColumnTable</td>
    <td>String</td>
    <td>-</td>
    <td>No</td>
    <td>Add prefix to value at each column</td>
  </tr>
  <tr>
    <td>13</td>
    <td>allowSearch</td>
    <td>Boolean</td>
    <td>-</td>
    <td>No</td>
    <td>If you set true, this attribute will add to search form (merging column is not included)</td>
  </tr>
  </tbody>
</table>

<b id="componentAttribute">componentAttribute</b>
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
       <td>id</td>
       <td>String</td>
       <td>- (unique)</td>
       <td>Yes</td>
       <td>Id at your input element html</td>
    </tr>
    <tr>
       <td>2</td>
       <td>name</td>
       <td>String</td>
       <td>- (unique)</td>
       <td>Yes</td>
       <td>Name at your input element html</td>
    </tr>
     <tr>
       <td>3</td>
       <td>label</td>
       <td>String</td>
       <td>- (unique)</td>
       <td>Yes</td>
       <td>Label on top your input element html</td>
    </tr>
     <tr>
       <td>4</td>
       <td>type</td>
       <td>String</td>
       <td>- (unique)</td>
       <td>Yes</td>
       <td>Choose one of ['text', 'password', 'number', 'hidden', 'date', 'time', 'datetime-local']</td>
    </tr>
    <tr>
       <td>5</td>
       <td>extension</td>
       <td>Object</td>
       <td>-</td>
       <td>No</td>
      <td>See full documentation <a href="#extension">here</a></td>
    </tr>
    <tr>
       <td>6</td>
       <td>onAdd</td>
       <td>Object</td>
       <td>-</td>
       <td>No</td>
       <td>
        
```javascript
  onAdd: {
    disabled: false, // status when onAdd
    readonly: false, // status when onAdd
  }
```
         
  </td>
    </tr>
    <tr>
       <td>7</td>
       <td>onEdit</td>
       <td>Object</td>
       <td>-</td>
       <td>No</td>
       <td>
        
```javascript
  onEdit: {
    disabled: false, // status when onAdd
    readonly: false, // status when onAdd
  }
```
         
  </td>
    </tr>
  </tbody>
</table>

<b id="extension">extension</b>

<b>Remember if your component one of ['Radio', 'Checkbox', 'Select', 'SelectMultiple', 'SelectAutoComplete', 'SelectMultiAutoComplete', 'SelectAsyncAutoComplete', 'SelectAsyncMultiAutoComplete'] used attributed at the below</b>

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
       <td>data</td>
       <td>Array</td>
       <td>-</td>
       <td>No</td>
       <td>If you want to use existing data in your storage not in server storage, fill this with your own data</td>
    </tr>
     <tr>
       <td>2</td>
       <td>customSource</td>
       <td>Object</td>
       <td>-</td>
       <td>No</td>
       <td>Used this if you want to get data from server, example :

```javascript
customSource: {
  initialUrl: 'http://localhost.com/user?id={id} // add initialUrl if you are using selectAsyncAutoComplete / selectAsyncMultipleAutoComplete
  url: 'http://localhost.com/user', // get all user, but if you are using selectAsyncAutoComplete / selectAsyncMultipleAutoComplete just type like this 'http://localhost.com/user?name={name}' so every time you type, it automaticly get data to resemble what you wrote
  config: {}, // same as previously
  replaceUrl: { // using it if you are using selectAsyncAutoComplete / selectAsyncMultipleAutoComplete
    initial: '{id}',
    url: '{name}'
  }
}
```

</td>
    </tr>
    <tr>
       <td>3</td>
       <td>idAttributeName</td>
       <td>String</td>
       <td>-</td>
       <td>No</td>
       <td>This is the attribute name of the data obtained, and must be unique (example: id)</td>
    </tr>
    <tr>
       <td>4</td>
       <td>labelAttributeName</td>
       <td>String</td>
       <td>-</td>
       <td>No</td>
       <td>This is the attribute name of the data obtained, and want to show up to user</td>
    </tr>
  </tbody>
</table>

