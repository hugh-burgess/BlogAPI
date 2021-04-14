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

// app.get("/posts", (req, res) => {
//   // inside this i write my code to what is expected by the endpoint
//   res.status(200);
//   res.json({
//     hello: "from the new json object",
//   });
// });

app.get("/posts/all", (req, res) => {
  db.findAll()
    .then((posts) => {
      res.status(200);
      console.log(posts); // get object in terminal
      res.json(posts); // see object in Postman
    })
    .catch((error) => {
      res.status(500);
      res.json({
        error: `Internal Server Error: ${error}`,
      });
    });
});

// this brings stuff from Postman into the Terminal here, then we tell the handler to put it somewhere and then use a frontend to render it in react!

app.post("/users", (req, res) => {
  // listening to requests with a POST method for /users

  console.log(req.body); // request the body of the object into terminal
  res.json({
    hello: "world", //sending something back
  });
});

app.post("/posts", (req, res) => {
  // listening to requests with a POST method for /posts

  db.insert(req.body) // insert someting from the Postman body into the db.json object here in VSC
    .then((posts) => {
      console.log(posts);
      res.json(posts); // to see the info we got from Postman, in Postmans Body Response
      res.status(201);
    })
    .catch((error) => {
      console.error(error);
    });
});

// get posts id
app.get("/posts/:id", (req, res) => {
  // inside this i write my code to what is expected by the endpoint
  db.findById(req.params.id)
    .then((posts) => {
      res.status(200);
      console.log(posts); // get object in terminal
      res.json(posts); // see object in Postman
    })
    .catch((error) => {
      res.status(404);
      res.json({
        error: `Not Found: ${error}`,
      });
    });
});

/*
  We have to start the server. We make it listen on the port 4000

*/
app.listen(4000, () => {
  console.log("Listening on http://localhost:4000");
});
