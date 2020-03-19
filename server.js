const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const typeRoutes = require("./api/routes/types");
const trainersRoutes = require("./api/routes/trainers");
const clientsRoutes = require("./api/routes/clients");
const subsRoutes = require("./api/routes/subs");
const paymentsRoutes = require("./api/routes/payments");
const visitsRoutes = require("./api/routes/visits");
const subRegisterRoutes = require("./api/routes/complexQueries/clientRegister");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use("/v1/types", typeRoutes);
app.use("/v1/trainers", trainersRoutes);
app.use("/v1/clients", clientsRoutes);
app.use("/v1/subs", subsRoutes);
app.use("/v1/payments", paymentsRoutes);
app.use("/v1/visits", visitsRoutes);

app.use("/v1/register", subRegisterRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log("[Server] online " + new Date()));
