## React Auto Generate CRUD ##

Thank you very much to the best team I have ever had, they are:

1. Hartanto Boby
2. Boby Harmoko
3. And me

This project is made open source to help other people who use react in developing their backend, because we think the process of making CRUD to master data is very time consuming and especially it is done many times.

<b>This project uses several dependencies:</b>

1. "@ material-ui / core": "^ 1.4.1",
2. "@ material-ui / icons": "^ 2.0.0",
3. "axios": "^ 0.18.0",
4. "classnames": "^ 2.2.6",
5. "draft-js": "^ 0.10.5",
6. "draftjs-to-html": "^ 0.8.4",
7. "html-to-draftjs": "^ 1.4.0",
8. "immutable": "^ 3.8.2",
9. "lodash": "^ 4.17.10",
10. "moment": "^ 2.22.2",
11. "prop-types": "^ 15.6.2",
12. "react-draft-wysiwyg": "^ 1.12.13",
13. "react-dropzone": "^ 4.2.13",
14. "react-number-format": "^ 3.5.0",
15. "react-select": "^ 2.0.0",
16. "react-text-mask": "^ 5.4.3",
17. "validate.js": "^ 0.12.0"

And also, this project already has features including:

<table>
    <thead>
        <tr>
            <td>No.</td>
            <td>Name</td>
            <td>Status</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td>Access Control Level (CRUD)</td>
            <td><img width="20" height="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/2705.png" alt="done"/></td>
        </tr>
        <tr>
            <td>2</td>
            <td>Pagination</td>
            <td><img width="20" height="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/2705.png" alt="done"/></td>
        </tr>
        <tr>
            <td>3</td>
            <td>Limitation</td>
            <td><img width="20" height="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/2705.png" alt="done"/></td>
        </tr>
        <tr>
            <td>4</td>
            <td>Auto generate table (depending on the configuration column you want to display)</td>
            <td><img width="20" height="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/2705.png" alt="done"/></td>
        </tr>
        <tr>
            <td>5</td>
            <td>Merging the column table</td>
            <td><img width="20" height="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/2705.png" alt="done"/></td>
        </tr>
        <tr>
            <td>6</td>
            <td>Sorting column ASC & DESC</td>
            <td><img width="20" height="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/2705.png" alt="done"/></td>
        </tr>
        <tr>
            <td>7</td>
            <td>Delete Bulk & Single Item</td>
            <td><img width="20" height="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/2705.png" alt="done"/></td>
        </tr>
        <tr>
            <td>8</td>
            <td>Add an additional button top of table</td>
            <td><img width="20" height="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/2705.png" alt="done"/></td>
        </tr>
        <tr>
            <td>9</td>
            <td>Add an additional button at each row</td>
            <td><img width="20" height="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/2705.png" alt="done"/></td>
        </tr>
        <tr>
            <td>10</td>
            <td>Auto generate form (depend on the configuration)</td>
            <td><img width="20" height="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/2705.png" alt="done"/></td>
        </tr>
        <tr>
            <td>11</td>
            <td>Export data to CSV</td>
            <td><img width="20" height="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/2705.png" alt="done"/></td>
        </tr>
        <tr>
            <td>12</td>
            <td>Autoload data in edit mode</td>
            <td><img width="20" height="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/2705.png" alt="done"/></td>
        </tr>
        <tr>
            <td>13</td>
            <td>Export data to excel</td>
            <td>Not Yet</td>
        </tr>
        <tr>
            <td>14</td>
            <td>Form details</td>
            <td>Not Yet</td>
        </tr>
        <tr>
            <td>15</td>
            <td>Submit for edit data, and add new</td>
            <td>Not Yet</td>
        </tr>
        <tr>
            <td>16</td>
            <td>Search</td>
            <td>Not Yet</td>
        </tr>
        <tr>
            <td>17</td>
            <td>Sorting using api</td>
            <td>Not Yet</td>
        </tr>
    </tbody>
</table>

<b>Click <a href="./src/index.js">here</a> to know, how to use this generator</b>

## Below is a documentation of this project ##

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
            <td>aclId</td>
            <td>String</td>
            <td>*</td>
            <td>No</td>
            <td>aclId is used to provide each user with an access limit to the actions that can be carried out in this generator, namely, add, update, delete</td>
        </tr>
        <tr>
            <td>2</td>
            <td>aclRules</td>
            <td>Object</td>
            <td>
                <pre>
                   <code>
{
    "*": {
        create: true (required),
        read: true (required),
        update: true (required),
        delete: true (required),
        export: true (required),
        import: true (required)
    }
}
                    </code>
               </pre>
            </td>
            <td>No</td>
            <td>From the aclId given above, from here it can be seen that the user can only access several modules or everything</td>
        </tr>
        <tr>
            <td>3</td>
            <td>initialLimit</td>
            <td>Number</td>
            <td>10</td>
            <td>No</td>
            <td>Every time a table is created, the data limit displayed and requested by the server uses this number, but this number can change if the limit per page in the table view is changed</td>
        </tr>
        <tr>
            <td>4</td>
            <td>title</td>
            <td>String</td>
            <td>''</td>
            <td>Yes</td>
            <td>Title of table</td>
        </tr>
        <tr>
            <td>5</td>
            <td>server</td>
            <td>Object</td>
            <td>{}</td>
            <td>Yes</td>
            <td>See full documentation at <a href="./documentation/server/README.md">here</a></td>
        </tr>
        <tr>
            <td>6</td>
            <td>table</td>
            <td>Object</td>
            <td>{}</td>
            <td>No</td>
            <td>See full documentation <a href="./documentation/table/README.md">here</a></td>
        </tr>
        <tr>
            <td>7</td>
            <td>fields</td>
            <td>Object</td>
            <td>{}</td>
            <td>Yes</td>
            <td>See full documentation <a href="./documentation/fields/README.md">here</a></td>
        </tr>
        <tr>
            <td>8</td>
            <td>export</td>
            <td>Object</td>
            <td>{}</td>
            <td>Yes</td>
            <td>See full documentation <a href="./documentation/export/README.md">here</a></td>
        </tr>
    </tbody>
</table>

<b>Click <a href="./src/config-form-user.js">here</a> to see the configuration</b>


## If you interest, give us your star for this project :) ##
