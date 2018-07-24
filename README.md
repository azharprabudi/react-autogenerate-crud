# React Auto Generate CRUD

This library specially, we made for our backend development to reduce time to make crud using react. Thanks so much for PT. Solusi Informasi Digital, to give us more time to make this library until working well.

<b>Some information for you</b>

<pre>
    <code>
If you want this library, npm module is comming soon :)
    </code>
</pre>

<b>Example code if you want to use this library like these :</b>

<pre>
    <code>
<BaseTable
existingData={false}
fetchOptions={{ get: { url: "https://jsonplaceholder.typicode.com/posts/" } }}
tableOptions={{ btnAddNew: true, btnEdit: true, columns: [{ title: "Judul", objName: "title", canBeSort: true}, { title: "Deskripsi", objName: "body", canBeSort: true }]}}
/>
    </code>
</pre>

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
            <td>useCheckbox</td>
            <td>Boolean</td> 
            <td>false</td>
            <td>NO</td>
            <td>if the value you set to true, the checkbox button will show in the table, so you can delete the multiple data in view, and just passing the url for delete data
            </td>
        </tr>
        <tr>
            <td>2</td>
            <td>existingData</td>
            <td>Boolean</td>
            <td>false</td>
            <td>NO</td>
            <td>If you have a existing data from another store, and you dont want to the table fetch new data, you can set the value to true, and passing the data in propsName data</td>
        </tr>
        <tr>
            <td>3</td>
            <td>fetchOptions</td>
            <td>Object</td>
            <td>none</td>
            <td>YES</td>
            <td>
            This very usefully for the component know, how to fetch the data from. The example object like this :
            <pre>
            <code>
{
    get: { url: "", config: {}, method: 'get' },
    add: { url: "", config: {}, method: 'post' },
    edit: { url: "", config: {}, replaceUrlParameter: { "{id}": "id" } },
    delete: { url: "", config: {}, replaceUrlParameter: { "{id}": "id" } }
}
            </code>
            </pre>
            Attribute config at the top, you can check from this link : https://github.com/axios/axios. And for attribute replaceUrlParameter, this used whenever you have a link EDIT like this: http://apisaya.com/api/v1/user/1, Number one at that link is the userid, you can so if you want link like that, you just throw it into  edit fetchOptions like this :
            <pre>
                <code>
edit: { url: "http://apisaya.com/api/v1/user/{userId}", config: {}, replaceUrlParameter: { "{userId}": "id" } }
the "id" must be the real object name, depend on data get from the api
                </code>
            </pre>
            </td>
        </tr>
    </tbody>
</table>

<b>This is still development, and there is a screenshot for you for this project :)</b>

<img src="https://image.ibb.co/dCJH68/screen_shot.png" alt="screenshot library" />

<b>Thank to read this documentation :)</b>
<a href="/documentation/test.md">test</a>