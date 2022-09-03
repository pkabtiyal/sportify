let mongoose = require("mongoose");
require("dotenv").config();
let express = require("express");
let cors = require("cors");
let app = express();
const corsOptions = {
  origin: "*",
};
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(cors(corsOptions));
// connect to db
const username = process.env.WP_USERNAME;
const password = process.env.WP_PASSWORD;
const cluster = process.env.WP_CLUSTER;
const dbname = process.env.WP_DATABASE;

const uri = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("Successfully connected to database");
  })
  .catch((err) => console.log(err));
  // mongoose.set('debug', true);
//end

const userRoute = require("./routes/user");
const membershipRoute = require("./routes/membership");
// const broadcastRoute = require("./routes/broadcastRoutes");
const facilitiesRoute = require("./routes/facilities");
const reservationsRoute = require("./routes/reservations");
const searchFacility = require("./routes/search");
const stripeRoute = require("./routes/stripe");
const merchandiseRoute = require("./routes/merchandise");
const blogRoute = require("./routes/blog");
const eventRouter = require('./routes/events');
const eventBookingRouter = require('./routes/eventBookings');
const rewardsRoute = require("./routes/rewards");
const couponsRoute = require("./routes/coupons");
app.use(userRoute);
app.use(rewardsRoute);
app.use(couponsRoute);
app.use(membershipRoute);
// app.use(broadcastRoute);
app.use("/facility", facilitiesRoute);
app.use("/reservation", reservationsRoute);
app.use("/search", searchFacility);
app.use(merchandiseRoute);
app.use(stripeRoute);
app.use('/blogs',blogRoute);
app.use('/events', eventRouter);
app.use('/event-bookings',eventBookingRouter);

app.use("/test", (req, res) => {
  res.send("It works!'");
});

module.exports = app;
