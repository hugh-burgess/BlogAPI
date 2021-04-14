const express = require("express");
const db = require("./lib/db");
const cors = require("cors");

/*
  We create an express app calling
  the express function.
*/
const app = express();
app.use(cors());

/*
  We setup middleware to:
  - parse the body of the request to json for us
  https://expressjs.com/en/guide/using-middleware.html
*/
app.use(express.json());

/*
  Endpoint to handle GET requests to the root URI "/"
*/

// Create User
app.post("/users", (req, res) => {
  // listening to requests with a POST method for /users

  db.insert(req.body);
  console.log(req.body); // request the body of the object into terminal
  res.json({
    message: "completed", //sending something back
  });
});

// Insert JSON Post Props
app.post("/posts", (req, res) => {
  // listening to requests with a POST method for /posts
  if (!req.body.title && !req.body.body) {
    // validating that the title and body is made
    res.status(400);
    res.json({ error: "You have to make a title and body, dummy!" });
  } else {
    db.insert({ title: req.body.title, body: req.body.title }) // insert someting from the Postman body into the db.json object here in VSC
      // insert properties from Postman JSON to the JSON VSC Object
      .then((posts) => {
        console.log(posts);
        res.json(posts); // to see the info we got from Postman, in Postmans Body Response
        res.status(201);
      })
      .catch((error) => {
        console.error(error);
      });
  }
});

// get posts id handler - Read Post ID
//        posts/1 for example
app.get("/posts/:id", (req, res) => {
  //the param is the url ending in an id in Postman
  const { id } = req.params; // destructuring

  db.findById(id)
    .then((post) => {
      if (post === undefined) {
        res.status(404);
        res.json({ error: `Post with id ${id} not found.` });
      } else {
        res.status(200);
        res.json(post);
      }
    })
    .catch((error) => {
      res.status(500);
      res.json({
        error: "Internal Server Error",
      });
    });

  // res.status(200);
  // res.json(id);

  // :id is a params placeholder for whatever we'll pass, keep it meaningful.
  // inside this i write my code to what is expected by the endpoint
  // db.findById(req.params.id)
  //   .then((posts) => {
  //     res.status(200);
  //     console.log(posts); // get object in terminal
  //     res.json(posts); // see object in Postman
  //   })
  //   .catch((error) => {
  //     res.status(404);
  //     res.json({
  //       error: `Not Found: ${error}`,
  //     });
  //   });
});

// patch an id handler
// Patch Posts
app.patch("/posts/:id", (req, res) => {
  // inside this i write my code to what is expected by the endpoint

  db.updateById(req.params.id, req.body)
    // first argument targets id parameter of the request, second targets the body of the object
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

// Delete Posts
app.delete("/posts/:id", (req, res) => {
  const { id } = req.params;

  db.deleteById(id).then(() => {
    res.status(204);
    console.log("deleted successfully");
  });
});

/*
  We have to start the server. We make it listen on the port 4000

*/
app.listen(4000, () => {
  console.log("Listening on http://localhost:4000");
});
