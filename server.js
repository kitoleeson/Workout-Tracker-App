/** @format */

const express = require("express");
const mongoose = require("mongoose");
const chalk = require("chalk");
const readline = require("readline");
require("dotenv").config();

const Session = require("./models/session");
const Exercise = require("./models/exercise");
const Set = require("./models/set");

const app = express();

// connect to mongodb
const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@workout-tracker.bc8ncat.mongodb.net/workouts`;
const port = process.env.PORT || 3001;
mongoose
	.connect(dbURI)
	.then((result) => {
		console.log("connected to db");
		app.listen(port, () => {
			console.log(`listening at ${port}`);
			clearDatabases();
		});
	})
	.catch((error) => console.error(error));

app.use(express.static("public")); // send client the to the "public" folder
app.use(express.json()); // allow express to read incoming data as json

// POST: login
app.post("/login", (request, response) => {
	const data = request.body;
	console.log(`${data.user} has logged in`);
	console.log(data);
	data.status = "login success";
	data.timestamp = Date.now();
	data.date = new Date().toString();
	response.json(data);
});

// GET: setup session
app.get("/set_session", (request, response) => {});

// POST: add session
app.post("/add_session", (request, response) => {
	console.log("new add_session request");
	const data = request.body;
	console.log(request.body);

	const promises = [];

	// intialize session
	const new_session = new Session({
		user: data.user,
		cycle: data.cycle,
		workout: data.workout,
		exercises: [],
	});

	// initialize and add exercises
	for (let exercise of data.exercises) {
		const new_exercise = new Exercise({
			session: new_session,
			user: data.user,
			name: exercise.name,
			sets: [],
			notes: exercise.notes,
		});

		// initialize and add sets
		for (let set of exercise.sets) {
			const new_set = new Set({
				user: data.user,
				parent: new_exercise,
				exercise: new_exercise.name,
				load: set.load,
				reps: set.reps,
			});
			new_exercise.sets.push(new_set);
			promises.push(new_set.save());
		}

		new_session.exercises.push(new_exercise);
		promises.push(new_exercise.save());
	}
	promises.push(new_session.save());

	Promise.all(promises).then(() => {
		console.log("new session added to database!");
		response.json({
			status: "complete!",
			session_id: new_session.id,
			redirectTo: "/",
		});
	});
});

async function clearDatabases() {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	const askQuestionWithTimeout = (question, timeoutDuration) => {
		return new Promise((resolve, reject) => {
			let timer;

			rl.question(question, (answer) => {
				clearTimeout(timer);
				resolve(answer);
			});

			timer = setTimeout(() => {
				rl.close();
				reject(new Error("Timeout"));
			}, timeoutDuration);
		});
	};

	try {
		const answer = await askQuestionWithTimeout(
			chalk.bold.yellow(">> do you want to clear databases?") + " (y/n) ",
			60000
		); // 60 seconds timeout
		if (["yes", "y", "yea", "yeah"].includes(answer.toLowerCase())) {
			await Promise.all([
				Session.deleteMany({}),
				Exercise.deleteMany({}),
				Set.deleteMany({}),
			]);
			console.log(chalk.bold.yellow("databases cleared"));
		} else {
			console.log(chalk.bold.yellow("databases not cleared"));
		}
	} catch (error) {
		if (error.message === "Timeout") {
			console.log(
				chalk.bold.yellow("operation timed out. databases not cleared.")
			);
			// Execute your alternative function here
		} else {
			console.error(chalk.bold.yellow("an unexpected error occurred:"), error);
		}
	} finally {
		rl.close(); // Ensure readline interface is closed after operation
	}
}

/*

------------------ TODO LIST ------------------
- add user to database form from sessionStorage ✅
- optional clear databases on server ✅
- change workout/cycle page ❌
- autofill form values based on previous workouts ❌
- autochoose workout based on day ❌
- workout finished page ❌
- click on exercise to see full history ❌
- autofill other html values ❌
- graphs and stuff ❌
-----------------------------------------------

*/
