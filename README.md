### Container
```
$ docker exec -it node bash
$ docker exec -it mysql bash
$ docker exec -it nginx bash
```

### Migration
```
$ docker exec -it node bash
$ npm install
$ node_modules/.bin/sequelize db:migrate:undo:all
$ node_modules/.bin/sequelize db:migrate
$ npm run only-once
```