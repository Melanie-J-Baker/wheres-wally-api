const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const RateLimit = require("express-rate-limit");
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const indexRouter = require("./routes/index");
const gameRouter = require("./routes/game");
const charactersRouter = require("./routes/characters");

const app = express();

const limiter = RateLimit({
  windowsMs: 1 * 60 * 60 * 1000, // 1 hour
  max: 300,
});

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const devDbURL =
  "mongodb+srv://bakermel:THu7zgEbHovjfnEN@cluster0.qixgpia.mongodb.net/wheres-wally-api-dev?retryWrites=true&w=majority&appName=Cluster0";
const mongoDB = process.env.MONGODB_URI || devDbURL;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

app.set("trust proxy", 1);
if (process.env.NODE_ENV !== "production") {
  app.use(logger("dev"));
} else {
  app.use(logger("combined"));
}
const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200, // For legacy browser support
  allowedHeaders: "Content-Type",
};

app.use(cors(corsOptions));
//app.use(cors());
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self"],
    },
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(compression());

app.use("/", indexRouter);
app.use("/game", gameRouter);
app.use("/characters", charactersRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
