## TABLE ##

This configuration must be done, if you want to add additional buttons that are above the table, or replace the existing button. In addition, this configuration can add buttons found on each row, and replace existing ones. To use this please follow the method below

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
    <td>buttonTopTable</td>
    <td>Object</td>
    <td>{}</td>
    <td>No</td>
    <td>This will replace or add a button above the table. This existing object has attributes ['create', 'delete', 'exportCsv', 'exportExcel'] you can replace it just use the specify the attribute name, to know the list props and how to use it click <a href="#buttonTopTable">here</a></td>
  </tr>
  <tr>
    <td>2</td>
    <td>row</td>
    <td>Object</td>
    <td>{}</td>
    <td>No</td>
    <td>This will replace or add a button that is in each row, to use it click here, to use it click <a href="#buttonTopTable">here</a></td>
  </tr>
</tbody>
</table>

## BUTTONTOPTABLE ##

<b>Current Props For Each Attribute Of buttonTopTable</b> 
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
    <td>label</td>
    <td>String</td>
    <td>''</td>
    <td>Yes</td>
    <td>Label for the button</td>
  </tr>
  <tr>
    <td>2</td>
    <td>class</td>
    <td>String</td>
    <td>''</td>
    <td>No</td>
    <td>Class for the button</td>
  </tr>
  <tr>
    <td>3</td>
    <td>onClick</td>
    <td>Func</td>
    <td>() => {}</td>
    <td>No</td>
    <td>The action when button clicked</td>
  </tr>
  <tr>
    <td>4</td>
    <td>size</td>
    <td>String</td>
    <td>''</td>
    <td>Yes</td>
    <td>Size for the button, choose one of ['small', 'medium', 'large']</td>
  </tr>
  <tr>
    <td>5</td>
    <td>variant</td>
    <td>String</td>
    <td>''</td>
    <td>Yes</td>
    <td>Variant for the button, choose one of ['text', 'flat', 'outlined', 'contained', 'raised', 'fab', 'extendedFab']</td>
  </tr>
  <tr>
    <td>6</td>
    <td>style</td>
    <td>Object</td>
    <td>{}</td>
    <td>No</td>
    <td>Styling your button</td>
  </tr>
  <tr>
    <td>7</td>
    <td>href</td>
    <td>String</td>
    <td>''</td>
    <td>No</td>
    <td>If your button doesnt have an action, you can fill the href to navigate to another page</td>
  </tr>
  <tr>
    <td>8</td>
    <td>type</td>
    <td>String</td>
    <td>''</td>
    <td>Yes</td>
    <td>Just fill button</td>
  </tr>
  <tr>
    <td>9</td>
    <td>iconName</td>
    <td>String</td>
    <td>''</td>
    <td>Yes</td>
    <td>See the full icon at <a href="https://material.io/tools/icons/">here</a></td>
  </tr>
</tbody>
</table>
<b>Because this project using material ui, you can use their props from official website at <a href="https://material-ui.com/api/button/">here</a></b>

<b>This is how to using it</b>
<pre>
<CRUDGenerate
{...anotherProps}
table={{
   buttonTopTable: {
    'create': {
        label: "New Create", // modifiy existing button
      },
    'delete': {
        label: 'New Delete' // modifiy existing button
    },
    'newButton': { // add new button
        label: 'New Button',
        onClick: () => alert(1)
    },
   }
}}
/>
</pre>

<b>Back to main <a href="https://github.com/azharprabudi/react-autogenerate-crud">link</a></b>
