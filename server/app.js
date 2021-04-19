require("dotenv").config();
const express = require("express");
const db = require("./lib/db");
const cors = require("cors");

const mongoose = require("mongoose");
const Post = require("./models/post");
const app = express();

/*
  We create an express app calling
  the express function.
*/

/*
We setup middleware to:
- parse the body of the request to json for us
https://expressjs.com/en/guide/using-middleware.html
*/
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  const { method, url } = req;
  console.log(`${method} ${url}`);
  next();
});
/*
  Endpoint to handle GET requests to the root URI "/"
*/

app.get("/posts", (req, res) => {
  Post.find()
    .then((posts) => {
      res.status(200);
      res.json(posts);
    })
    .catch((error) => {
      res.status(404);
      res.json({ error: `Not posts found.` });
    });
});

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
    Post.create({ title: req.body.title, body: req.body.title }) // insert someting from the Postman body into the db.json object here in VSC
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

  Post.findById(id)
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

  Post.findByIdAndUpdate(req.params.id, req.body)
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

  Post.findByIdAndDelete(id).then(() => {
    res.status(204);
    res.json("deleted!");
    console.log("deleted successfully");
  });
});

/*
  We have to start the server. We make it listen on the port 4000

*/

/*
  We have to start the server. We make it listen on the port 4000
*/
const { PORT, MONGO_URL } = process.env; // used on line 151 and 159

// {
//   USER: "hughburgess",
//   COMMAND_MODE: "unix2003"
// }

// localhost is 127.0.0.1 by definition
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// console.log(MONGO_URL); this shows mongodb://localhost/blogs in the terminal
const mongodb = mongoose.connection;

mongodb.on("open", () => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});
