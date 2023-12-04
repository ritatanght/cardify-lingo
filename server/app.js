const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieSession = require("cookie-session");

const usersRouter = require("./api/users");
const categoriesRouter = require("./api/categories");
const setsRouter = require("./api/sets");
const cardsRouter = require("./api/cards");
const favoritesRouter = require("./api/favorites");
const searchesRouter = require("./api/searches");
const authRouter = require("./api/auth")
const cors = require("cors");
const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cookieSession({
    name: "session",
    keys: ['coffee','bagel'],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/sets", setsRouter);
app.use("/api/cards", cardsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/search", searchesRouter);

// For any other route, serve React's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;
