# What is this

Another [roadmap.sh project](https://roadmap.sh/projects/todo-list-api), this one is a RESTful API, express, using mariaDB for user, task, and refresh token data and redis for rate limiting.
The instructions on how to use it are pretty much explained on the roadmap website

# How to run

1. clone the repo

2. install dependencies

```console
npm i
```
3. Have a mariadb database server running as wall as a redis-server instance

4. and create a `.env` file on the root folder with the following template:
```env
JWT_SECRET=<your jwt secret>
JWT_REFRESH_SECRET=<your refresh token secret>
DB_HOST=<mysqlmariadb credentials>
DB_USER=<ditto>
DB_PASSWORD=<ditto>
DB_NAME=<ditto>
DB_PORT=<port>
```

6. start the application
```console
npm start
```

---

Bonus features:
- [x] Refresh Token mechanism (with JWT)
- [x] Automatic Refresh token reuse detection
- [x] Rate limiting with REDIS
- [ ] unit testing
- [ ] task filtering and sorting

# Built with:
- express (http client)
- sequelize (ORM)
- eslint (linting)
- redis (rate limiting)
- bcryptjs (password hashing)
- lots of other stuff