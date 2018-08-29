const express = require("express");
const next = require("next");
var basicAuth = require("basic-auth-connect");

// require("./lib/parseOpenDataXml");

const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

app
  .prepare()
  .then(() => {
    const server = express();

    if (!dev) {
      server.use(basicAuth(process.env.ADMIN_USER, process.env.ADMIN_PASSWORD));
    }

    server.all("/graphql", (req, res) => {
      console.log("HOHO")
      const url = "http://localhost:3100/graphql";
      const request = require("request")
      return req.pipe(request({ qs: req.query, uri: url }).on('error', function (err) {
        console.info(err);
        return res.sendStatus(400);
      }))
        .pipe(res);
    })

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
