## SERVER ##

This configuration is used to retrieve real data that is on the server, unfortunately currently only available for http requests are not available on firebase, and graphql

<b>Below are the props that are in the http attribute</b>

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
    <td>create</td>
    <td>Object</td>
    <td>{}</td>
    <td>No</td>
    <td>the description of create, you can click <a href="#create">here</a></td>
  </tr>
  <tr>
    <td>2</td>
    <td>read</td>
    <td>Object</td>
    <td>{}</td>
    <td>No</td>
    <td>the description of read, you can click <a href="#read">here</a></td>  
  </tr>
  <tr>
    <td>3</td>
    <td>update</td>
    <td>Object</td>
    <td>{}</td>
    <td>No</td>  
    <td>the description of update, you can click <a href="#update">here</a></td>
  </tr>
  <tr>
    <td>4</td>
    <td>delete</td>
    <td>Object</td>
    <td>{}</td>
    <td>No</td>
    <td>the description of update, you can click <a href="#update">here</a></td>
   </tr>
</tbody>
</table>

## create ##
<b id="create">some attributes needed in create</b>


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
    <td>Url when the form submitted</td>
  </tr>
  <tr>
    <td>2</td>
    <td>method</td>
    <td>String</td>
    <td>''</td>
    <td>Yes</td>
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
    <td>callbackBeforeCreate</td>
    <td>Func</td>
    <td>() => {}</td>
    <td>No</td>
    <td>Callback before the form is submitted</td>
  </tr>
  <tr>
    <td>5</td>
    <td>callbackAfterCreate</td>
    <td>Func</td>
    <td>() => {}</td>
    <td>No</td>
    <td>Callback after the form is submitted</td>
  </tr>
</tbody>
</table>

## read ##
<b id="read">some attributes needed in read</b>


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
    <td>Url when the form submitted</td>
  </tr>
  <tr>
    <td>2</td>
    <td>query</td>
    <td>Object</td>
    <td>{}</td>
    <td>Yes</td>
    <td>
      Attributes that must be filled in this object are limit (String), page (String), search (Object). Limit and page are filled in, so that tables can perform pagination, so that the url when processing data requests for tables, will be added according to the data provided in the query. Example:
```javascript
      {
        limit: '_xLimit',
        page: '_xPage',
      }
      http: // localhost / user? _xLimit = 10 & _xPage = 1
```
    </td>
  </tr>
  <tr>
    <td>3</td>
    <td>config</td>
    <td>Object</td>
    <td>{}</td>
    <td>No</td>
    <td>Configuration of http request, such as authorization (example: {headers: {authorization: ''}}), you can see a full documentation at <a href="https://github.com/axios/axios">here</a></td>
  </tr>
</tbody>
</table>


<b>Back to main <a href="https://github.com/azharprabudi/react-autogenerate-crud">link</a></b>

<b>Back to main <a href="https://github.com/azharprabudi/react-autogenerate-crud">link</a></b>
