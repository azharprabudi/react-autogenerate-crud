## Full Documentation CheckboxOptions

<b>You can see the configuration checkboxOptions like this :</b>
<pre>
    <code>
checkboxOptions={{
    enable: true,
    objName: ''
}}
    </code>
</pre>

Here the explanation about the attribute of checkboxOptions:

<table>
    <thead>
        <tr>
            <th>No</th>
            <th>Name</th>
            <th>Type</th>
            <th>Value</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td>enable</td>
            <td>Boolean</td>
            <td>true | false</td>
            <td>If you set this value to true, the checkbox will show up in the table</td>
        </tr>
        <tr>
            <td>2</td>
            <td>objName</td>
            <td>String</td>
            <td>''</td>
            <td>Fill the objName with your attribute name of object from your data as a identifier to react know the different data selected or not. Example you get data from server like this [{name: 'brown', id: 1}, {name: 'brown', id: 2}] and you want to check the name is brown with the id 2, so you have put the unique attribute object data to somewhere, and you can look there is a unique attribute, that is 'id', so you just fill the objName to be 'id'</td>
        </tr>
    </tbody>
</table>