# React Auto Generate CRUD

This library specially, we made for our backend development to reduce time to make crud using react. Thanks so much for PT. Solusi Informasi Digital, to give us more time to make this library until working well.

<b>Some information for you</b>

<pre>
    <code>
If you want this library, npm module is comming soon :)
    </code>
</pre>

Example code if you want to use this library like these :

<pre>
    <code>
        <BaseTable
        existingData={false}
        fetchOptions={{
          get: {
            url: "https://jsonplaceholder.typicode.com/posts/"
          }
        }}
        tableOptions={{
          btnAddNew: true,
          btnEdit: true,
          columns: [
            {
              title: "Judul",
              objName: "title",
              canBeSort: true
            },
            {
              title: "Deskripsi",
              objName: "body",
              canBeSort: true
            }
          ]
        }}
        />    
    </code>
</pre>

<table>
    <thead>
        <tr>
            <td>No</td>
            <td>Props Name</td>
            <td>Default</td>
            <td>Required</td>
            <td>Description</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td>useCheckbox</td>
            <td>false</td>
            <td>none</td>
            <td>if the value you set to true, the checkbox button will show in the table, so you can delete the multiple data in view, and just passing the url for delete data
            </td>
        </tr>
        <tr>
            <td>2</td>
            <td>existingData</td>
            <td>false</td>
            <td>none</td>
            <td>If you have a existing data from another store, and you dont want to the table fetch new data, you can set the value to true, and passing the data in propsName data</td>
        </tr>
    </tbody>
</table>

This is still development, and there is a screenshot for you for this project :) 

<img src="https://image.ibb.co/dCJH68/screen_shot.png" alt="screenshot library" />

Thank to read this documentation :)