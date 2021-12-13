Reproduction for https://github.com/dotansimha/envelop/issues/1090

There are cases when the mutation can return `null` in that case current implementation of redis-response cache will throw an error.

```shell
ReplyError: ERR wrong number of arguments for 'del' command
    at parseError (/Users/saihaj/Desktop/redis-response-cache-del-bug/node_modules/redis-parser/lib/parser.js:179:12)
    at parseType (/Users/saihaj/Desktop/redis-response-cache-del-bug/node_modules/redis-parser/lib/parser.js:302:14) {
  command: { name: 'del', args: [] }
}
```

You can clone this repo and try it out:

1. Install dependencies: `npm install`
2. Start a redis instance: `docker-compose up -d`
3. Start the server: `npm run start`
4. Run the following query in graphiql:
   ```graphql
   mutation {
     updateUser(id: "1111") {
       id
       name
     }
   }
   ```
5. See the terminal output server will error out.
