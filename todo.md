1. PATCH = users/:id_user/update-password
2. FIND = posts/find-by-user/:id_user
3. What's happened with the post if an user with role user is deleted
4. Test endpoints.
5. Delete database and test again.
6. Make and update the README

---

deploy

```.json
{
  "scripts": {
    "build": "tsc",
    "start": "node ./dist/app.js"
  },
    "dependencies": {
      "module-alias": "2.3.4"
  },
  "_moduleAliases": {
    "@errors": "dist/modules/errors",
    "@controllers": "dist/modules/controllers",
    "@services": "dist/modules/services",
    "@repositories": "dist/modules/repositories",
    "@models": "dist/modules/models",
    "@schemas": "dist/modules/schemas",
    "@routes": "dist/modules/routes",
    "@utils": "dist/modules/utils",
    "@mappers": "dist/modules/mappers",
    "@middlewares": "dist/modules/middlewares",
    "@collections": "dist/modules/collections",
    "@sources": "dist/sources",
    "@config": "dist/config"
  }
}
```
