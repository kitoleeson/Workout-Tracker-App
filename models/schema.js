/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const set_schema = new Schema({
	load: {
		type: Number,
		required: true,
	},
	reps: {
		type: Number,
		required: true,
	},
});

const exercise_schema = new Schema({
	name: {
		type: String,
		required: true,
	},
	sets: {
		type: [set_schema],
		required: true,
	},
	notes: [String],
});

const session_schema = new Schema(
	{
		cycle: {
			type: String,
			required: true,
		},
		workout: {
			type: String,
			required: true,
		},
		exercises: {
			type: [exercise_schema],
			required: true,
		},
	},
	{ timestamps: true }
);

const Session = mongoose.model("session", session_schema);
module.exports = Session;
