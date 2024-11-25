# What is this

Another [roadmap.sh](https://roadmap.sh/projects/todo-list-api) project, this one is a RESTful API, express, using mariaDB for user, task, and refresh token data and redis for rate limiting.
The instructions on how to use it are pretty much explained there

# How to run

1. clone the repo

2. install dependencies

```console
npm i
```
3. [install XAMPP](https://www.apachefriends.org/download.html) or use your mysql/mariadb instalation

4. import the table from the `dbExport.sql` file

5. and create a `.env` file on the root folder with the following template:
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
- [x] Refresh Token mechanism
- [x] Automatic Refresh token reuse detection
- [x] Rate limiting
- [ ] unit testing
- [ ] task filtering and sorting

Complete!
