/** @format */

const express = require("express");
const mongoose = require("mongoose");
const Session = require("./models/session");
const Exercise = require("./models/exercise");
const Set = require("./models/set");
require("dotenv").config();

const app = express();

// connect to mongodb
const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@workout-tracker.bc8ncat.mongodb.net/workouts`;
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
			name: exercise.name,
			sets: [],
			notes: exercise.notes,
		});

		// initialize and add sets
		for (let set of exercise.sets) {
			const new_set = new Set({
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
		});
	});
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

clearDatabases();

function clearDatabases() {
	Promise.all([
		Session.deleteMany({}),
		Exercise.deleteMany({}),
		Set.deleteMany({}),
	]).then(() => {
		console.log("databases clear");
	});
}

/*

------------------ TODO LIST ------------------
- add user to database form from sessionStorage ✅
- autofill form values based on previous workouts ❌
- change workout/cycle page ❌
- workout finished page ❌
- graphs and stuff ❌
- autofill other html values ❌
- autochoose workout based on day ❌
- click on exercise to see full history ❌
-----------------------------------------------

*/
