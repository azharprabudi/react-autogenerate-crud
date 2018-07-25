## React Auto Generate CRUD ##

Specially thanks for our team, there are :

1. Hartanto Boy
2. Boby Harmoko
3. And me

To keep it up this project, for purpose to decrease the development time when using react in backend. Almost in backend, there are some CRUD module and could it be take a long time to make CRUD, CRUD, CRUD again. And i hope this library helpfull for other people same like us :).

<b>Currently there are avaiable feature for this project :</b>
<table>
    <thead>
        <tr>
            <td>Module</td>
            <td>Feature</td>
            <td>Status</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="9">View</td>
            <td>Generate Automatic Table With Data</td>
            <td><img width="20" height="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/2705.png" alt="done"/></td>
        </tr>
        <tr>
            <td>Title Table</td>
            <td><img width="20" height="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/2705.png" alt="done"/></td>
        </tr>
        <tr>
            <td>Checkbox</td>
            <td><img width="20" height="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/2705.png" alt="done"/></td>
        </tr>
        <tr>
            <td>Fetch Data From Server</td>
            <td><img width="20" height="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/2705.png" alt="done"/></td>
        </tr>
        <tr>
            <td>Sorting Column</td>
            <td><img width="20" height="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/2705.png" alt="done"/></td>
        </tr>
        <tr>
            <td>Pagination</td>
            <td><img width="20" height="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/2705.png" alt="done"/></td>
        </tr>
        <tr>
            <td>Button Add New / Edit</td>
            <td>Not Yet</td>
        </tr>
        <tr>
            <td>Add Custom Button Before Table</td>
            <td>Not Yet</td>
        </tr>
        <tr>
            <td>Add Custom Button In Table Body</td>
            <td>Not Yet</td>
        </tr>
        <tr>
            <td rowspan="2">Add / Edit</td>
            <td>Generate Form Add / Edit</td>
            <td>Not Yet</td>
        </tr>
        <tr>
            <td>Submit Data To Server</td>
            <td>Not Yet</td>
        </tr>
        <tr>
            <td rowspan="3">Search</td>
            <td>Generate Form Search</td>
            <td>Not Yet</td>
        </tr>
        <tr>
            <td>Fetch Data Depend On Search</td>
            <td>Not Yet</td>
        </tr>
        <tr>
            <td>Clear Search</td>
            <td>Not Yet</td>
        </tr>
        <tr>
            <td rowspan="2">Delete</td>
            <td>Delete bulk</td>
            <td><img width="20" height="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/2705.png" alt="done"/></td>
        </tr>
        <tr>
            <td>Delete single</td>
            <td><img width="20" height="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/2705.png" alt="done"/></td>
        </tr>
    </tbody>
</table>

<b>This project still ongoing, but if you want to try you can clone this repo, and just npm install it in the directory project, or if you want to check the example code visit this <a href="/src/index.js">link</a></b>

## See the complete documentation below
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
            <td>none</td>
            <td>YES</td>
            <td>Title will show at the top of the table</td>
        </tr>
        <tr>
            <td>2</td>
            <td>limit</td>
            <td>Number</td> 
            <td>10</td>
            <td>NO</td>
            <td>Limitation of fetching data from url view in fetchOptions</td>
        </tr>
        <tr>
            <td>3</td>
            <td>useCheckbox</td>
            <td>Boolean</td> 
            <td>false</td>
            <td>NO</td>
            <td>if the value equal to true, the checkbox button will show in the table, so you can delete multiple data in view, and just passing the url for delete data in fetchOptions
            </td>
        </tr>
        <tr>
            <td>4</td>
            <td>fetchOptions</td>
            <td>Object</td>
            <td>none</td>
            <td>YES</td>
            <td>Read full documentation about fetchOptions <a href="/documentation/fetchOptions.md">Here</a></td>
        </tr>
        <tr>
            <td>5</td>
            <td>tableOptions</td>
            <td>Object</td>
            <td>none</td>
            <td>YES</td>
            <td>Read full documentation about tableOptions <a href="/documentation/tableOptions.md">Here</a></td>
        </tr>
        <tr>
            <td>6</td>
            <td>formOptions</td>
            <td>Object</td>
            <td>none</td>
            <td>YES</td>
            <td>Read full documentation about formOptions <a href="/documentation/formOptions.md">Here</a></td>
        </tr>
        <tr>
            <td>7</td>
            <td>loadingOptions</td>
            <td>Object</td>
            <td>none</td>
            <td>YES</td>
            <td>Read full documentation about loadingOptions <a href="/documentation/loadingOptions.md">Here</a></td>
        </tr>
    </tbody>
</table>