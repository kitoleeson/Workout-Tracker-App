/** @format */

const express = require("express");
const mongoose = require("mongoose");
const chalk = require("chalk");
const readline = require("readline");
require("dotenv").config();

const Session = require("./models/session");
const Exercise = require("./models/exercise");
const Program = require("./models/program");

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

// GET: get cycle
app.post("/get_cycle", async (request, response) => {
	const data = request.body;
	const session = await Session.findOne({ user: data.user }).sort({
		createdAt: -1,
	});
	if (!session) {
		response.json({
			user: data.user,
			cycle: "no current cycle",
			workout: { name: "no current workout" },
		});
		return;
	}
	const cycle = await Program.findOne({ name: session.cycle }).sort({
		createdAt: -1,
	});
	const workout_num = (data.day + parseInt(cycle.offset)) % 7;
	response.json({
		user: data.user,
		cycle: cycle.name,
		workout: cycle.workouts[workout_num],
	});
});

// GET: setup session
app.get("/set_session", (request, response) => {
	// pass in session request
});

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
		if (exercise.sets[0].reps <= 0) continue;
		const new_exercise = new Exercise({
			session: new_session,
			user: data.user,
			name: exercise.name,
			sets: [],
			notes: exercise.notes,
		});

		// initialize and add sets
		for (let set of exercise.sets) {
			if (set.reps <= 0) break;
			const new_set = {
				load: set.load,
				reps: set.reps,
			};
			new_exercise.sets.push(new_set);
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
			// redirectTo: "/",
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
			await Promise.all([Session.deleteMany({}), Exercise.deleteMany({})]);
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

function json2schema(program) {
	const new_program = new Program({
		name: program.name,
		split: program.split,
		offset: program.offset,
		workouts: [],
	});

	for (let workout of program.workouts) {
		const new_workout = {
			name: workout.name,
			duration: workout.duration,
			exercises: [],
		};

		for (let exercise of workout.exercises) {
			const new_exercise = {
				number: exercise.number,
				name: exercise.name,
				sets: exercise.sets,
				reps: exercise.reps,
				notes: exercise.notes,
			};
			new_workout.exercises.push(new_exercise);
		}
		new_program.workouts.push(new_workout);
	}

	new_program.save().then(console.log("program saved to db"));
}

/*

------------------ TODO LIST ------------------
- add user to database form from sessionStorage ✅
- optional clear databases on server ✅
- database for workout programs ✅
- autochoose workout based on day ✅
- change workout/cycle page ❌
- autofill form values based on previous workouts ❌
- workout finished page ❌
- click on exercise to see full history ❌
- autofill other html values ❌
- graphs and stuff ❌
-----------------------------------------------

*/
