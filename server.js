const express = require("express");
const next = require("next");
var basicAuth = require("basic-auth-connect");

const testFolder = "./.next/";
const fs = require("fs");

fs.readdirSync(testFolder).forEach(file => {
  console.log(file);
});

const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(basicAuth(process.env.ADMIN_USER, process.env.ADMIN_PASSWORD));

    server.get("/procedure/:id", (req, res) => {
      const actualPage = "/procedure";
      const queryParams = { id: req.params.id };
      app.render(req, res, actualPage, queryParams);
    });

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(PORT, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${PORT}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
