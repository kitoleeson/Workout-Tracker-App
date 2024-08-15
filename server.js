/** @format */

const express = require("express");
const mongoose = require("mongoose");
const Session = require("./models/session_schema");
require("dotenv").config();

const app = express();

// connect to mongodb
const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@workout-tracker.bc8ncat.mongodb.net/`;
mongoose
	.connect(dbURI)
	.then((result) => {
		console.log("connected to db");
		app.listen(3001, () => console.log("listening at 3001"));
	})
	.catch((error) => console.error(error));

app.use(express.static("public")); // send client the to the "public" folder
app.use(express.json()); // allow express to read incoming data as json

app.post("/add_session", (request, response) => {
	console.log("new add_session request");
	console.log(request.body);
	// const session = new Session({
	// 	cycle: "modified nippard ppl 2023",
	// 	workout: "push i",
	// 	exercises: [
	// 	]
	// })
});

app.post("/login", (request, response) => {
	const data = request.body;
	console.log(`${data.user} has logged in`);
	console.log(data);
	data.status = "login success";
	data.timestamp = Date.now();
	data.date = new Date().toString();
	response.json(data);
});
