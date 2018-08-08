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
    <td>Yes if you used export</td>
    <td>This url must be filled in, because this module will automatically request data for the destination url and then automatically generate the received data in the form of csv / excel</td>
  </tr>
  <tr>
    <td>2</td>
    <td>type</td>
    <td>String | Choose one of ['csv', 'excel']</td>
    <td>'csv'</td>
    <td>Yes</td>
    <td>What file does the user want, whether it is csv or excel</td>
  </tr>
</tbody>
</table>

<b>Back to main <a href="https://github.com/azharprabudi/react-autogenerate-crud">link</a> 
