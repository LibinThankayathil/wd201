const express = require("express");
const app = express();
var csrf = require("tiny-csrf");
var cookieParser = require("cookie-parser");
const { Todo, User } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
const { request } = require("http");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! it's a secret"));
app.use(csrf("uX2f9vX7LmD3yNq5HvJw8KsRbZ1eT4cA", ["POST", "PUT", "DELETE"]));

const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

const flash = require("connect-flash");

const saltRounds = 10;
app.use(
  session({
    secret: "my-super-secret-key-212233413432424232",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, //24hrs
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error"); // Often used with Passport
  next();
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({ where: { email: username } })
        .then(async (user) => {
          if (!user) {
            return done(null, false, { message: "User not found" });
          }
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Invalid password" });
          }
        })
        .catch((error) => {
          return done(error);
        });
    },
  ),
);

passport.serializeUser((user, done) => {
  console.log("Serializing user in session", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log("Deserializing user from session", id);
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

app.set("view engine", "ejs");

app.post("/users", async (request, response) => {
  const hashedPwd = await bcrypt.hashSync(request.body.password, saltRounds);
  try {
    const user = await User.create({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: hashedPwd,
    });
    request.login(user, (err) => {
      if (err) {
        request.flash("error_msg", "Login after signup failed");
        return response.redirect("/login");
      }
      request.flash("success_msg", "Successfully signed up and logged in!");
      return response.redirect("/todos");
    });
  } catch (error) {
    console.log(error);
    request.flash("error_msg", "Email already in use or invalid data");
    return response.redirect("/signup");
  }
});

app.get("/signup", (request, response) => {
  response.render("signup", {
    title: "Sign Up",
    csrfToken: request.csrfToken(),
  });
});

app.get("/login", (request, response) => {
  response.render("login", { title: "Login", csrfToken: request.csrfToken() });
});

app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (request, response) => {
    request.flash("success_msg", "Successfully logged in!");
    response.redirect("/todos");
  },
);

app.get("/signout", (request, response, next) => {
  request.logout((err) => {
    if (err) {
      return next(err);
    }
    request.flash("success_msg", "You have been signed out");
    response.redirect("/login");
  });
});

app.get("/", async (request, response) => {
  if (request.isAuthenticated && request.isAuthenticated()) {
    return response.redirect("/todos");
  }

  response.render("index", {
    title: "Todo application",
    csrfToken: request.csrfToken(),
  });
});

app.use(express.static(path.join(__dirname, "public")));

app.get(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    const allTodos = await Todo.getAllTodos();
    const loggedInUser = request.user.id;
    if (request.accepts("html")) {
      response.render("todo", {
        allTodos,
        loggedInUser,
        csrfToken: request.csrfToken(),
      });
    } else {
      response.json({ allTodos });
    }
  },
);

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    try {
      if (!request.body.title || !request.body.title.trim()) {
        return response.status(422).json({ error: "Title is required" });
      }
      if (!request.body.dueDate) {
        return response.status(422).json({ error: "Due date is required" });
      }
      const todo = await Todo.addTodo({
        title: request.body.title,
        dueDate: request.body.dueDate,
        userId: request.user.id,
      });
      if (request.accepts("html")) {
        return response.redirect("/todos");
      }
      return response.json(todo);
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  },
);

app.put(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    const todo = await Todo.findByPk(request.params.id);
    try {
      const updatedTodo = await todo.setCompletionStatus(
        request.body.completed,
      );
      return response.json(updatedTodo);
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  },
);

app.delete(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    console.log("We have to delete a Todo with ID: ", request.params.id);
    // FILL IN YOUR CODE HERE
    try {
      const deleted = await Todo.deleteTodo(request.params.id);
      if (deleted === 0) {
        // No todo found with that ID
        return response.send(false);
      }
      // Successfully deleted
      return response.send(true);
    } catch (error) {
      console.log(error);
      return response.status(422).send(false);
    }
    // First, we have to query our database to delete a Todo by ID.
    // Then, we have to respond back with true/false based on whether the Todo was deleted or not.
    // response.send(true)
  },
);

module.exports = app;
