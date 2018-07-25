## React Auto Generate CRUD ##

<b>Specially thanks for our team, there are :</b>

1. Hartanto Boy
2. Boby Harmoko
3. And me


To keep it up this project, for purpose to decrease the development time when using react in backend. Almost in backend, there are some CRUD module and could it be take a long time to make CRUD, CRUD, CRUD again. And i hope this library helpfull for other people same like us :).

<b>This project currently using <a href="https://material-ui.com/">material-ui</a>, i am not consider to using another framework css, cause i think this one is good enough</b>


<b>There are avaiable feature for this project :</b>
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
            <td rowspan="10">View</td>
            <td>Generate Table</td>
            <td><img width="20" height="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/2705.png" alt="done"/></td>
        </tr>
        <tr>
            <td>Fetching Data For Table</td>
            <td><img width="20" height="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/2705.png" alt="done"/></td>
        </tr>
        <tr>
            <td>Title Table</td>
            <td><img width="20" height="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/2705.png" alt="done"/></td>
        </tr>
        <tr>
            <td>Sorting Column</td>
            <td><img width="20" height="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/2705.png" alt="done"/></td>
        </tr>
        <tr>
            <td>Checkbox All Item</td>
            <td><img width="20" height="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/2705.png" alt="done"/></td>
        </tr>
        <tr>
            <td>Checkbox Multiple Item</td>
            <td><img width="20" height="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/2705.png" alt="done"/></td>
        </tr>
        <tr>
            <td>Pagination</td>
            <td><img width="20" height="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/2705.png" alt="done"/></td>
        </tr>
        <tr>
            <td>Change Row Limit</td>
            <td><img width="20" height="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/2705.png" alt="done"/></td>
        </tr>
        <tr>
            <td>Button At Top Table</td>
            <td><img width="20" height="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/2705.png" alt="done"/></td>
        </tr>
        <tr>
            <td>Button At Body Table Each Row</td>
            <td><img width="20" height="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/2705.png" alt="done"/></td>
        </tr>
        <tr>
            <td rowspan="2">Form Add / Edit</td>
            <td>Generate Form</td>
            <td>Not Yet</td>
        </tr>
        <tr>
            <td>Submit Data Add And Edit</td>
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
            <td>Delete each row item</td>
            <td><img width="20" height="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/2705.png" alt="done"/></td>
        </tr>
    </tbody>
</table>

<b>This project still ongoing, but if you want to try you can clone this repo, and just npm install it in your directory project, or if you want to check the example code visit this <a href="/src/index.js">link</a></b>

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
            <td>10 (Number of [5, 10, 15, 25, 50, 100])</td>
            <td>NO</td>
            <td>Initial limit for the table</td>
        </tr>
        <tr>
            <td>3</td>
            <td>checkboxOpitions</td>
            <td>Object</td> 
            <td>
                <pre>
                    <code>
{
    enable: false,
    objName: ""
}
                    </code>
                </pre>
            </td>
            <td>NO</td>
            <td>Read full documentation about checkboxOpitions <a href="/documentation/checkboxOptions.md">Here</a></td>
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
            <td>searchOptions</td>
            <td>Object</td>
            <td>none</td>
            <td>YES</td>
            <td>Read full documentation about searchOptions <a href="/documentation/searchOptions.md">Here</a></td>
        </tr>
        <tr>
            <td>8</td>
            <td>loadingOptions</td>
            <td>Object</td>
            <td>
                <pre>
                    <code>
{
    color: "primary",
    size: 30
}
                    </code>
                </pre>
            </td>
            <td>NO</td>
            <td>Read full documentation about loadingOptions <a href="/documentation/loadingOptions.md">Here</a></td>
        </tr>
    </tbody>
</table>

## Give us your star for this project :) ##