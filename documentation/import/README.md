## IMPORT ##

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
    <td>Url when want to import the data</td>
  </tr>
  <tr>
    <td>2</td>
    <td>method</td>
    <td>String</td>
    <td>post</td>
    <td>YES</td>
    <td>Method http request, choose one of ['post', 'get', 'delete', 'patch']</td>
  </tr>
  <tr>
    <td>3</td>
    <td>config</td>
    <td>Object</td>
    <td>{}</td>
    <td>No</td>
    <td>Configuration of http request, such as authorization (example: {headers: {authorization: ''}}), you can see a full documentation at <a href="https://github.com/axios/axios">here</a></td>
  </tr>
  <tr>
    <td>4</td>
    <td>callbackBeforeImport</td>
    <td>Func</td>
    <td>() => {}</td>
    <td>No</td>
    <td>Callback before data import, if you using it you have to return the object like this {isContinue: Boolean (If true, then the generator continue the process and vice cersa), error: Any (if exist, there is error), data: Any (The data will be used for execute) }</td>
  </tr>
  <tr>
    <td>5</td>
    <td>callbackAfterImport</td>
    <td>Func</td>
    <td>() => {}</td>
    <td>No</td>
    <td>Callback after the data importted (do anything else)</td>
  </tr>
  <tr>
    <td>6</td>
    <td>formatDataImport</td>
    <td>Object</td>
    <td></td>
    <td>Yes</td>
    <td>Give your example data for the example code you can check at <a href="https://github.com/azharprabudi/react-autogenerate-crud/blob/master/src/config-form-user.js">her </td>
  </tr>
</tbody>
</table>

## YOU CAN SEE FULL EXAMPLE CONFIGURATION AT <a href="https://github.com/azharprabudi/react-autogenerate-crud/blob/master/src/config-full-form-user.js">HERE</a> ##


<b>Back to main <a href="https://github.com/azharprabudi/react-autogenerate-crud">link</a> 
