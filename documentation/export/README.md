## EXPORT ##

This configuration must be done if the user wants to add an export feature to the data on the server, to use this feature please read the documentation below

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
    <td>url</td>
    <td>String</td>
    <td>''</td>
    <td>Yes</td>
    <td>This module will automatically request data for the destination url and then automatically generate the received data in the form of csv / excel. If this is loaded empty, it will automatically use the read url that has been configured in the server props</td>
  </tr>
  <tr>
    <td>2</td>
    <td>type</td>
    <td>String</td>
    <td>csv</td>
    <td>No</td>
    <td>What file does the user want, whether it is csv or excel, fill the value one of ['csv', 'excel']</td>
  </tr>
</tbody>
</table>

<b>This is how to using it</b>
```javascript
<CRUDGenerate
{...otherProps}
export={{
  url: 'http://yourapi.com/data-export-csv',
  type: 'csv'
}}
/>
```

## YOU CAN SEE FULL EXAMPLE CONFIGURATION AT <a href="https://github.com/azharprabudi/react-autogenerate-crud/blob/master/src/config-full-form-user.js">HERE</a> ##


<b>Back to main <a href="https://github.com/azharprabudi/react-autogenerate-crud">link</a> 
