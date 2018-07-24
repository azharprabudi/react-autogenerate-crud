## fetchOptions

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