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
	user: {
		type: String,
		requred: true,
	},
	session: {
		type: Schema.Types.ObjectId,
		ref: "session",
		required: true,
	},
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

const Exercise = mongoose.model("exercise", exercise_schema);
module.exports = Exercise;
