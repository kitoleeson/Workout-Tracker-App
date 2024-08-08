/** @format */

const express = require("express");
const app = express();
require("dotenv").config();

// connect to mongodb
const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@workout-tracker.bc8ncat.mongodb.net/`;

app.listen(3001, () => console.log("listening at 3001"));
app.use(express.static("public")); // send client the to the "public" folder
app.use(express.json()); // allow express to read incoming data as json

app.post("/login", (request, response) => {
	const data = request.body;
	console.log(`${data.user} has logged in`);
	console.log(data);
	data.status = "login success";
	data.timestamp = Date.now();
	data.date = new Date().toString();
	response.json(data);
});
