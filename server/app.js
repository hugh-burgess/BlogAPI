const express = require("express");
const db = require("./lib/db");

/*
  We create an express app calling
  the express function.
*/
const app = express();

/*
  We setup middleware to:
  - parse the body of the request to json for us
  https://expressjs.com/en/guide/using-middleware.html
*/
app.use(express.json());

/*
  Endpoint to handle GET requests to the root URI "/"
*/
app.get("/posts", (req, res) => {
  db.findAll()
    .then((posts) => {
      res.status(200);
      res.json(posts);
    })
    .catch((error) => {
      res.status(500);
      res.send();
    });
});

// this brings stuff from Postman into the Terminal here, then we tell the handler to put it somewhere and then use a frontend to render it in react!

app.post("/users", (req, res) => {
  console.log(req.body); // request the body of the object into terminal
  res.json({
    hello: "world", //sending something back
  });
});

/*
  We have to start the server. We make it listen on the port 4000

*/
app.listen(4000, () => {
  console.log("Listening on http://localhost:4000");
});
