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

const graham2025ppl = {
	name: "graham 2025 3-day ppl",
	split: "ppl",
	workouts: [
		// push
		{
			name: "push",
			duration: 90,
			exercises: [
				{
					number: "1",
					name: "incline dumbell bench press",
					sets: "3",
					reps: "8-10",
					notes: ["slightly arched back", "arms at a 45-55° angle from body", "push through feet to explode up"],
				},
				{
					number: "2",
					name: "straight-bar lying skullcrushers",
					sets: "3",
					reps: "8",
					notes: [
						"keep elbows stationary, behind head",
						"brace core throughout exercise",
						"try floor reset if not feeling triceps",
					],
				},
				{
					number: "3",
					name: "machine chest flye",
					sets: "3",
					reps: "12",
					notes: [
						"brace core throughout exercise",
						"keep chest up high and puffed out",
						"feel big stretch at end",
						"integrated partials on last set (1 rep full rom, 1 rep lengthened partial)",
					],
				},
				{
					number: "4",
					name: "cable tricep rope pushdown",
					sets: "3",
					reps: "10",
					notes: [
						"keep chest upright and puffed out",
						"keep elbows stationary at sides",
						"full lockout and push arms outwards",
					],
				},
				{
					number: "5",
					name: "cross-body cable y-raise",
					sets: "3",
					reps: "12-15",
					notes: [
						"draw out a sword at bottom",
						"flick out the sword at top",
						"lift cable out and back",
						"diagonal plane of motion",
					],
				},
				{
					number: "6",
					name: "deficit pushups",
					sets: "2",
					reps: "failure",
					notes: [
						"raise hands on plates, descend underneath hand level",
						"brace core throughout exercise",
						"drop scap and engage abs",
						"go for strict form, not number",
					],
				},
			],
		},
		// pull
		{
			name: "pull",
			duration: 90,
			exercises: [
				{
					number: "1",
					name: "lat pulldown",
					sets: "4",
					reps: "10",
					notes: [
						"middle overhand grip (1.5x shoulder)",
						"touch bar to bottom of chest",
						"use thumbless grip for mind-muscle",
						"pull scap first, then pull arms down",
						"feel lats deep stretch at top",
						"slow eccentric",
					],
				},
				{
					number: "2",
					name: "seated cable row",
					sets: "3",
					reps: "10",
					notes: [
						"squeeze shoulder blades together",
						"use thumbless grip for mind-muscle",
						"pull scap first, then pull arms back",
						"feel traps and shoulders pull apart at end",
					],
				},
				{
					number: "3",
					name: "single-arm cable baysian curls",
					sets: "2",
					reps: "10",
					notes: ["stationary elbows behind body", "take it slow"],
				},
				{
					number: "4",
					name: "omni-direction face pulls",
					sets: "3",
					reps: "12",
					notes: [
						"different direction for each set",
						"low→high, mid→mid, high→low",
						"hold ropes reverse grip",
						"pull metal piece to forehead",
					],
				},
				{
					number: "5",
					name: "omni-grip assisted pull up",
					sets: "3",
					reps: "10",
					notes: [
						"normal, neutral, then wide grip",
						"scap pull up first, then bend elbows",
						"puffy and high chest",
						"slow eccentric",
					],
				},
				{
					number: "6",
					name: "ez-bar preacher curls",
					sets: "2",
					reps: "8",
					notes: ["warm up first (very important)", "slow up and down"],
				},
				{
					number: "7",
					name: "behind-the-back straight-bar wrist curl",
					sets: "2",
					reps: "12",
					notes: ["keep arms stationary", "go heavy, make it difficult", "slow eccentric"],
				},
			],
		},
		// legs
		{
			name: "legs",
			duration: 90,
			exercises: [
				{
					number: "1",
					name: "barbell back squat",
					sets: "3",
					reps: "10, 8, 6",
					notes: [
						"do 2 sets of back hyperextensions before to activate lower back",
						"brace core throughout exercise",
						"go for depth and slowness",
						"go heavier each set",
						"feet slightly pointed outwards, externally rotate knees",
					],
				},
				{
					number: "2",
					name: "steated calf-raises",
					sets: "3",
					reps: "15",
					notes: ["stay in the bottom half", "fast concentric, slow eccentric"],
				},
				{
					number: "3",
					name: "seated leg curl",
					sets: "3",
					reps: "12",
					notes: ["lean forward in seat to stretch hamstrings", "fast concentric, slow eccentric"],
				},
				{
					number: "4",
					name: "seated leg extension",
					sets: "3",
					reps: "12",
					notes: ["lean back in seat to stretch quads", "fast concentric, slow eccentric"],
				},
				{
					number: "5",
					name: "jefferson curls",
					sets: "3",
					reps: "12",
					notes: [
						"stand on box or plates to elevate",
						"round back at bottom, then systematically unfurl",
						"pause at bottom, stretch hamstrings",
					],
				},
				{
					number: "6",
					name: "abs circut",
					sets: "2",
					reps: "60",
					notes: ["60s of n/s planks, pull throughs, twists, bear planks with taps"],
				},
			],
		},
	],
};

// connect to mongodb
const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@workout-tracker.bc8ncat.mongodb.net/workouts`;
const port = process.env.PORT || 3001;
mongoose
	.connect(dbURI)
	.then((result) => {
		console.log("connected to db");
		app.listen(port, () => {
			console.log(`listening at ${port}`);
			// json2schema(graham2025ppl);
			// clearDatabases();
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

// GET: get current program and next workout
app.post("/get_cycle", async (request, response) => {
	const data = request.body;

	// get last session and find session's cycle
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

	// find next workout
	let next_workout;
	for (let i in cycle.workouts) {
		const workout = cycle.workouts[i];
		if (workout.name == session.workout) {
			next_workout = cycle.workouts[(parseInt(i) + 1) % cycle.workouts.length];
			break;
		}
	}
	response.json({
		user: data.user,
		cycle: cycle.name,
		workout: next_workout,
	});
});

// GET: all workout programs for switch/start
app.get("/all_cycles", async (request, response) => {
	const all_programs = await Program.find().sort({ name: 1 }).exec();

	// create and populate new array to exclude metadata
	const program_info = [];
	all_programs.forEach((p) => {
		const new_program = {
			name: p.name,
			split: p.split,
			workouts: p.workouts,
		};
		program_info.push(new_program);
	});
	response.json({ cycles: program_info });
	console.log(program_info);
});

// GET: get previous workout data
app.post("/get_previous_workout", async (request, response) => {
	console.log("getting previous workout");
	const user = request.body.user;
	const exercises = request.body.exercises;

	const found_exercises = [];
	const all_exercises = [];
	console.log(exercises);

	// type: 0 = total, 1 = found
	const num_found = (exercise, type = 0) => {
		let num = 0;
		const array = type ? found_exercises : exercises;
		for (let e of array) if (e == exercise) num++;
		return num;
	};

	for (let exercise of exercises) {
		// count how many times total the current exercise exists in workout
		const t = num_found(exercise, 0);
		// count how many times so far the current exercise exists in workout
		const n = num_found(exercise, 1);

		console.log(exercise.toUpperCase(), t, n);

		const prev_exercises = await Exercise.find({ name: exercise, user: user }).sort({ createdAt: -1 }).limit(t).exec();

		// if no exercise is found, return only exercise name
		if (prev_exercises.length <= 0) {
			all_exercises.push({ name: exercise });
			continue;
		}

		const new_exercise = prev_exercises[t - n - 1];

		found_exercises.push(exercise);
		all_exercises.push({
			name: new_exercise.name,
			sets: new_exercise.sets,
			notes: new_exercise.notes,
		});
	}

	response.json({
		status: "workout data gathered",
		exercises: all_exercises,
	});
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
		promises.push(new_exercise);
	}
	promises.push(new_session);

	// use reduce() to ensure all promises are saved in order
	const save_promises = promises.reduce((promise_chain, exercise) => {
		return promise_chain.then(() => exercise.save());
	}, Promise.resolve());

	save_promises
		.then(() => {
			console.log("all exercises saved");
			console.log("new session added to database!");
			response.json({
				status: "complete!",
				session_id: new_session.id,
				redirectTo: "/",
			});
		})
		.catch((error) => console.error("error saving exercises: ", error));
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
			console.log(chalk.bold.yellow("operation timed out. databases not cleared."));
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
- change workout/cycle page ✅
- autofill form values based on previous workouts ✅
- workout finished page ❌
- click on exercise to see full history ❌
- autofill other html values ❌
- graphs and stuff ❌
-----------------------------------------------

*/
