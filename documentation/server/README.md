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
    <td>Callback before form submit, if you using it you have to return the object like this {isContinue: Boolean (If true, then the generator continue the process and vice cersa), error: Any (if exist, there is error), data: Any (The data will be used for execute) }</td>
  </tr>
  <tr>
    <td>5</td>
    <td>callbackAfterCreate</td>
    <td>Func</td>
    <td>() => {}</td>
    <td>No</td>
    <td>Callback after form submitted (do anything else)</td>
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
    <td>Url when want to get data for table</td>
  </tr>
  <tr>
    <td>2</td>
    <td>query</td>
    <td>Object</td>
    <td>{}</td>
    <td>Yes</td>
    <td>
      Attributes that must be filled in this object are limit (String), page (String). Limit and page are filled in, so that tables can perform pagination, so that the url when processing data requests for tables, will be added according to the data provided in the query. Example:

```javascript
{
  limit: '_xLimit',
  page: '_xPage',
  sort: "_sort={orderName}&_order={orderBy}", // fill this if you want to using sort by api, and type the query. Remember orderName and orderBy will be replace with orderName column you select and the value
  callbackBeforeSearch: url => url // you must return the new url or existing url (optional)
}
http://localhost:3000/user?_xLimit=10&_xPage=1
```
  </td>
  </tr>
  <tr>
    <td>3</td>
    <td>config</td>
    <td>Object</td>
    <td>{}</td>
    <td>No</td>
    <td>Configuration of http request, such as authorization. Example:

```javascript
{
  headers: {
    authorization: ''
  }
}
```
you can see a full documentation at <a href="https://github.com/axios/axios">here</a>
  </td>
  </tr>
</tbody>
</table>


## update ##
<b id="update">some attributes needed in update</b>


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
    <td>Url when the form want to update</td>
  </tr>
  <tr>
    <td>2</td>
    <td>get</td>
    <td>Object</td>
    <td>{}</td>
    <td>No</td>
    <td>See full documentation <a href="#get">here</a></td>
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
    <td>method</td>
    <td>String</td>
    <td>''</td>
    <td>Yes</td>
    <td>Method http request, choose one of ['post', 'get', 'delete', 'patch']</td>
  </tr>
  <tr>
    <td>5</td>
    <td>replaceUrl</td>
    <td>String</td>
    <td>''</td>
    <td>No</td>
    <td>If there is a unique value you want to give at your url, please include it in here. For example you have an url like this http://localhost/user?id=2, 2 at the url is dynamic number, that can be change depend on data on server. So you have to type like this in your url http://localhost/user?id={id}. And {id} have to fill in your replace url, so the url will be replaced depend configuration</td>
  </tr>
  <tr>
    <td>6</td>
    <td>attributeName</td>
    <td>String</td>
    <td>''</td>
    <td>No</td>
    <td>This is useful for replacing replaceUrl when get data from server, example you get data from server {id: 2}, then you just fill attributeName with id, so the replaceUrl will replace with the value at id attribute</td>
  </tr>
  <tr>
    <td>7</td>
    <td>dataFromProps</td>
    <td>Boolean</td>
    <td>No</td>
    <td>Yes</td>
    <td>If so, then you don't need to retrieve data on the server when in edit mode. Only use data received at the time of get, and when you enter it does not eat it will retrieve data from the server with the get configuration above</td>
  </tr>
  <tr>
    <td>8</td>
    <td>callbackBeforeUpdate</td>
    <td>Func</td>
    <td>() => {}</td>
    <td>No</td>
    <td>Callback before form update, if you using it you have to return the object like this {isContinue: Boolean (If true, then the generator continue the process and vice cersa), error: Any (if exist, there is error), data: Any (The data will be used for execute) }</td>
  </tr>
  <tr>
    <td>9</td>
    <td>callbackAfterUpdate</td>
    <td>Func</td>
    <td>() => {}</td>
    <td>Yes</td>
    <td>Callback after form updated (do anything else)</td>
  </tr>
</tbody>
</table>

<b>update.get</b>
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
    <td>Url when the system want to get detail data</td>
  </tr>
  <tr>
    <td>2</td>
    <td>config</td>
    <td>Object</td>
    <td>{}</td>
    <td>Yes</td>
    <td>Configuration of http request, such as authorization (example: {headers: {authorization: ''}}), you can see a full documentation at here</td>
  </tr>
  <tr>
    <td>3</td>
    <td>replaceUrl</td>
    <td>String</td>
    <td>''</td>
    <td>No</td>
    <td>If there is a unique value you want to give at your url, please include it in here. For example you have an url like this http://localhost/user?id=2, 2 at the url is dynamic number, that can be change depend on data on server. So you have to type like this in your url http://localhost/user?id={id}. And {id} have to fill in your replace url, so the url will be replaced depend configuration</td>
  </tr>
  <tr>
    <td>4</td>
    <td>attributeName</td>
    <td>String</td>
    <td>''</td>
    <td>No</td>
    <td>This is useful for replacing replaceUrl when get data from server, example you get data from server {id: 2}, then you just fill attributeName with id, so the replaceUrl will replace with the value at id attribute</td>
  </tr>
</tbody>
</table>

## delete ##
<b id="update">some attributes needed in update</b>


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
    <td>Url when want to delete each item</td>
  </tr>
  <tr>
    <td>2</td>
    <td>bulk</td>
    <td>Object</td>
    <td>{}</td>
    <td>No</td>
    <td>See full documentation <a href="#bulk">here</a></td>
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
    <td>method</td>
    <td>String</td>
    <td>''</td>
    <td>Yes</td>
    <td>Method http request, choose one of ['post', 'get', 'delete', 'patch']</td>
  </tr>
  <tr>
    <td>5</td>
    <td>replaceUrl</td>
    <td>String</td>
    <td>''</td>
    <td>No</td>
    <td>If there is a unique value you want to give at your url, please include it in here. For example you have an url like this http://localhost/user?id=2, 2 at the url is dynamic number, that can be change depend on data on server. So you have to type like this in your url http://localhost/user?id={id}. And {id} have to fill in your replace url, so the url will be replaced depend configuration</td>
  </tr>
  <tr>
    <td>6</td>
    <td>attributeName</td>
    <td>String</td>
    <td>''</td>
    <td>No</td>
    <td>This is useful for replacing replaceUrl when get data from server, example you get data from server {id: 2}, then you just fill attributeName with id, so the replaceUrl will replace with the value at id attribute</td>
  </tr>
  <tr>
    <td>7</td>
    <td>callbackBeforeUpdate</td>
    <td>Func</td>
    <td>() => {}</td>
    <td>No</td>
    <td>Callback before data delete, if you using it you have to return the object like this {isContinue: Boolean (If true, then the generator continue the process and vice cersa), error: Any (if exist, there is error), data: Any (The data will be used for execute) }</td>
  </tr>
  <tr>
    <td>8</td>
    <td>callbackAfterUpdate</td>
    <td>Func</td>
    <td>() => {}</td>
    <td>Yes</td>
    <td>Callback after data deleted (do anything else)</td>
  </tr>
</tbody>
</table>

<b>delete.bulk</b>

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
    <td>enable</td>
    <td>Boolean</td>
    <td>''</td>
    <td>Yes</td>
    <td>If true, the form will used bulk delete</td>
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
    <td>url</td>
    <td>String</td>
    <td>''</td>
    <td>No</td>
    <td>Link where the collection of item will be deleted</td>
  </tr>
  <tr>
    <td>4</td>
    <td>callbackBeforeDeleteBulk</td>
    <td>Func</td>
    <td>() => {}</td>
    <td>No</td>
    <td>Callback before bulk data delete, if you using it you have to return the object like this {isContinue: Boolean (If true, then the generator continue the process and vice cersa), error: Any (if exist, there is error), data: Any (The data will be used for execute) }</td>
  </tr>
  <tr>
    <td>5</td>
    <td>callbackAfterDeleteBulk</td>
    <td>Func</td>
    <td>() => {}</td>
    <td>No</td>
    <td>Callback after bulk data deleted (do anything else)</td>
  </tr>
</tbody>
</table>

<b>This is how to using it</b>
```javascript
<CRUDGenerate
{...otherProps}
server= {{
    http: {
      create: {
        url: "http://localhost:3000/article",
        method: "post",
        config: {},
        callbackBeforeCreate: () => {},
        callbackAfterCreate: () => {}
      },
      read: {
        url: "http://localhost:3000/article",
        query: {
          limit: "_limit",
          page: "_page",
          search: {}
        },
        config: {}
      },
      update: {
        url: "http://localhost:3000/article/{id}",
        get: {
          url: "http://localhost:3000/article/{id}",
          config: {},
          replaceUrl: "{id}",
          attributeName: "id"
        },
        config: {},
        method: "patch",
        replaceUrl: "{id}",
        attributeName: "id",
        dataFromProps: false,
        callbackBeforeUpdate: () => {},
        callbackAfterUpdate: () => {}
      },
      delete: {
        url: "http://localhost:3000/article/{id}",
        bulk: {
          enable: true,
          method: "get",
          url: "http://localhost:3000/article/{id}",
          callbackBeforeDeleteBulk: () => {},
          callbackAfterDeleteBulk: () => {}
        },
        config: {},
        method: "delete",
        replaceUrl: "{id}",
        attributeName: "id",
        callbackBeforeDelete: () => {},
        callbackAfterDelete: () => {}
      }
    }
  }}
/>
```


## YOU CAN SEE FULL EXAMPLE CONFIGURATION AT <a href="https://github.com/azharprabudi/react-autogenerate-crud/blob/master/src/config-form-user.js">HERE</a> ##



<b>Back to main <a href="https://github.com/azharprabudi/react-autogenerate-crud">link</a></b>
