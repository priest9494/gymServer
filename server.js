const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const fs = require('fs')
const https = require('https')

const typeRoutes = require("./api/routes/types")
const trainersRoutes = require("./api/routes/trainers")
const clientsRoutes = require("./api/routes/clients")
const subsRoutes = require("./api/routes/subs")
const paymentsRoutes = require("./api/routes/payments")
const visitsRoutes = require("./api/routes/visits")
const subMark = require("./api/routes/complexQueries/subMark")
const report = require("./api/routes/complexQueries/report")
const auth = require("./api/routes/auth")

const app = express()

app.use(bodyParser.json({limit: '5mb'}))
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}))
app.use(cors())

app.use("/v1/types", typeRoutes)
app.use("/v1/trainers", trainersRoutes)
app.use("/v1/clients", clientsRoutes)
app.use("/v1/subs", subsRoutes)
app.use("/v1/payments", paymentsRoutes)
app.use("/v1/visits", visitsRoutes)
app.use("/v1/report", report)
app.use("/v1/mark", subMark)
app.use("/v1/auth", auth)

https.createServer({
  key: fs.readFileSync('server_key.pem'),
  cert: fs.readFileSync('server_crt.pem')
}, app)
.listen(3000, function () {
  console.log('start')
})

