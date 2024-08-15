/** @format */

const express = require("express");
const mongoose = require("mongoose");
// const Session = require("./models/session");
require("dotenv").config();

const app = express();

// connect to mongodb
const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@workout-tracker.bc8ncat.mongodb.net/workouts`;
mongoose
	.connect(dbURI)
	.then((result) => {
		console.log("connected to db");
		app.listen(3001, () => console.log("listening at 3001"));
		runTest();
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

const nippard2023ppl = {
	name: "modified nippard ppl 2023",
	split: "ppl",
	workouts: [
		// push i
		{
			name: "push i",
			duration: 90,
			exercises: [
				{
					number: "1a",
					name: "bench press",
					sets: "1",
					reps: "3-5",
					notes: [
						"slightly arched back",
						"3 points of contact with bench",
						"explosive reps",
					],
				},
				{
					number: "1b",
					name: "larsen press",
					sets: "2",
					reps: "10",
					notes: [
						"75% of previous weight",
						"same arch and setup",
						"slightly closer grip",
						"smooth tempo (1-2s up & down)",
					],
				},
				{
					number: "2",
					name: "standing dumbell arnold press",
					sets: "3",
					reps: "8-10",
					notes: ["squeeze glutes", "drive through heels", "up 2 3 4"],
				},
				{
					number: "3a",
					name: "cable press-around",
					sets: "2",
					reps: "12-15",
					notes: ["press around body (past midline)"],
				},
				{
					number: "3b",
					name: "static pec stretch",
					sets: "2",
					reps: "30s hold",
					notes: ["same pec just used"],
				},
				{
					number: "4",
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
					number: "5a",
					name: "squeeze-only tricep pressdown",
					sets: "3",
					reps: "8",
					notes: ["lower range of motion", `"keep it where it's difficult"`],
				},
				{
					number: "5b",
					name: "stretch-only overhead tricep extention",
					sets: "3",
					reps: "8",
					notes: ["higher range of motion", "feel a stretch"],
				},
				{
					number: "6",
					name: "cross-body tricep extention",
					sets: "2",
					reps: "10-12",
					notes: ["keep elbow in the same spot"],
				},
			],
		},
		// pull i
		{
			name: "pull i",
			duration: 90,
			exercises: [
				{
					number: "1a",
					name: "lat pulldown",
					sets: "4",
					reps: "10",
					notes: [
						"feeder sets",
						"rpe 4-5, then 6-7, then 7-8, then 10",
						"middle overhand grip (1.5x shoulder)",
						"touch to bottom of chest",
						"use thumbless grip",
					],
				},
				{
					number: "1b",
					name: "lat pulldown",
					sets: "1",
					reps: "10",
					notes: ["failure set", "try to get same reps as last feeder"],
				},
				{
					number: "1c",
					name: "lat pulldown",
					sets: "1",
					reps: "10",
					notes: ["drop set", "70% previous set weight"],
				},
				{
					number: "2",
					name: "omni-grip chest-supported machine row",
					sets: "3",
					reps: "10-12",
					notes: [
						"different grip for each set",
						"squeeze shoulder blades together",
					],
				},
				{
					number: "3a",
					name: "bottom-half dumbell pullover",
					sets: "2",
					reps: "10-12",
					notes: ["feel stretch in lats", "stay in bottom half"],
				},
				{
					number: "3b",
					name: "static lat stretch",
					sets: "2",
					reps: "30s hold",
					notes: [
						"work, right, left, rest, work, left, right",
						"grab something solid, lean hips back",
					],
				},
				{
					number: "4",
					name: "omni-direction face pull",
					sets: "3",
					reps: "12-15",
					notes: [
						"different direction for each set",
						"low→high, mid→mid, high→low",
					],
				},
				{
					number: "5",
					name: "ez-bar bicep curl",
					sets: "3",
					reps: "6-8",
					notes: ["use progressive overload", "control negative"],
				},
				{
					number: "6",
					name: "bottom-half dumbell preacher curl",
					sets: "2",
					reps: "10-12",
					notes: ["one side at a time", "weaker arm, then match reps"],
				},
			],
		},
		// legs i
		{
			name: "legs i",
			duration: 90,
			exercises: [
				{
					number: "1a",
					name: "back squat",
					sets: "1",
					reps: "2-4",
					notes: ["go deep", "full pyramid warmup"],
				},
				{
					number: "1b",
					name: "paused back squat",
					sets: "2",
					reps: "5",
					notes: [
						"75% previous set weight",
						"pause for 2",
						"3 seconds",
						"explode up",
						"hold breath whole way",
					],
				},
				{
					number: "2",
					name: "barbell romanian deadlift",
					sets: "3",
					reps: "8-10",
					notes: ["keep knees in same spot", "keep bar close to shins"],
				},
				{
					number: "3",
					name: "dumbell walking lunge",
					sets: "2",
					reps: "20 strides",
					notes: [
						"knees softly contact floor",
						"control negative",
						"don't let grip strength limit",
					],
				},
				{
					number: "4",
					name: "seated leg curl",
					sets: "3",
					reps: "10-12",
					notes: ["keep upright to feel stretch", "toes pointed out, up, in"],
				},
				{
					number: "5",
					name: "leg press toe press",
					sets: "4",
					reps: "10-12",
					notes: ["toes pointed out, in, up, up"],
				},
				{
					number: "6",
					name: "decline plate crunch",
					sets: "3",
					reps: "10-12",
					notes: [
						"round lower back",
						"squeeze abs together",
						"use progressive overload",
					],
				},
			],
		},
		// rest
		{
			name: "rest i",
			duration: 0,
			exercises: [],
		},
		// push ii
		{
			name: "push ii",
			duration: 90,
			exercises: [
				{
					number: "1",
					name: "incline barbell bench press",
					sets: "3",
					reps: "8, 5, 15",
					notes: [
						"moderate, heavy, lighter weight",
						"grip just outside shoulder width",
					],
				},
				{
					number: "2",
					name: "machine shoulder press",
					sets: "3",
					reps: "10-12",
					notes: [
						"arms below parallel with the floor",
						"use thumbless grip",
						"constant tension (1s up, 1s down)",
						"last set to failiure",
					],
				},
				{
					number: "3",
					name: "floor reset skullcrusher",
					sets: "3",
					reps: "6-8",
					notes: [
						"reach extension w/ bar behind eyes",
						"use progressive overload",
					],
				},
				{
					number: "4",
					name: "bent-over cable pec flye",
					sets: "3",
					reps: "10-12",
					notes: [
						"bend forward, push straight down",
						"hands together at end",
						"feel stretch",
					],
				},
				{
					number: "5",
					name: "cable stretched lateral raise",
					sets: "3",
					reps: "20",
					notes: [
						"first 5 slow eccentric, next 10 consant, last 5 slow eccentric",
					],
				},
				{
					number: "6",
					name: "plate front raise",
					sets: "2",
					reps: "15-20",
					notes: [
						"steer on the way up (alternating)",
						"back to even on bottom",
					],
				},
				{
					number: "7",
					name: "diamond pushup",
					sets: "1",
					reps: "failure",
					notes: ["drop to knees after failure"],
				},
			],
		},
		// pull ii
		{
			name: "pull ii",
			duration: 90,
			exercises: [
				{
					number: "1",
					name: "one-arm half-kneeling lateral pulldown",
					sets: "3",
					reps: "12-15",
					notes: [
						"brace non-working hand against same side knee",
						"keep cable and forearm in line",
						"stop once arm in line with body",
					],
				},
				{
					number: "2",
					name: "pull up",
					sets: "1",
					reps: "failure",
					notes: [
						"focus on form (full rom, chest up)",
						"add reps each week, if possible",
						"1.5x shoulder width grip, chest up",
						"pull elbows to side",
					],
				},
				{
					number: "3",
					name: "kroc row",
					sets: "3",
					reps: "10-12",
					notes: [
						"3 point row with allowance for slightly looser form",
						"constant tension with control",
					],
				},
				{
					number: "4",
					name: "cable shrug-in",
					sets: "3",
					reps: "10-12",
					notes: [
						"shrug up and in",
						"small lean forward",
						"cables stretched behind",
					],
				},
				{
					number: "5",
					name: "reverse pec deck",
					sets: "3",
					reps: "10-12",
					notes: ["out and back (grab the money)", "omni-grip to taste"],
				},
				{
					number: "6",
					name: "overhead cable bicep curl",
					sets: "3",
					reps: "10-12",
					notes: [
						"kneel down, curl with arm out to side",
						"keep elbow in same spot",
					],
				},
			],
		},
		// legs ii
		{
			name: "legs ii",
			duration: 90,
			exercises: [
				{
					number: "1a",
					name: "trap bar deadlift",
					sets: "1",
					reps: "5",
					notes: ["slight extra lean forward", "add weight each week"],
				},
				{
					number: "1b",
					name: "stiff-leg deadlift",
					sets: "2",
					reps: "8",
					notes: [
						"50-60% of working previous weight",
						"regular deadlift with high hips",
						"hinge at hips",
					],
				},
				{
					number: "2",
					name: "leg press",
					sets: "4",
					reps: "10-12",
					notes: [
						"focus on quality depth (deepest without excess lower back rounding)",
						"constant tension (control negative)",
					],
				},
				{
					number: "3",
					name: "nordic curls",
					sets: "3",
					reps: "8-10",
					notes: ["dont go too far up (no tension at top)"],
				},
				{
					number: "4",
					name: "slow-eccentric leg extension",
					sets: "3",
					reps: "8-10",
					notes: ["3 second negative", "lean back"],
				},
				{
					number: "5",
					name: "seated calf raise",
					sets: "4",
					reps: "15-20",
					notes: ["slow and controlled", "dont focus on full contraction"],
				},
				{
					number: "6",
					name: "roman chair leg raise",
					sets: "3",
					reps: "10-20",
					notes: [
						"curl lower back and squeeze abs",
						"stop set once cant get legs to chest",
						"slow negative",
					],
				},
			],
		},
	],
};

const Session = require("./models/session");
const Exercise = require("./models/exercise");
const Set = require("./models/set");

function runTest() {
	console.log("running test");
	let session, exercise, set;

	session = new Session({
		cycle: nippard2023ppl.name,
		workout: nippard2023ppl.workouts[0].name,
	});
	exercise = new Exercise({
		name: nippard2023ppl.workouts[0].exercises[0].name,
	});
	set = new Set({
		load: 250,
		reps: 5,
	});

	session.exercises.push(exercise);
	exercise.sets.push(set);

	// Promise.all([session.save(), exercise.save(), set.save()]).then(() =>
	// 	console.log("added!")
	// );
}
