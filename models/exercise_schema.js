/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Set = require("./set_schema");

const exercise_schema = new Schema({
	name: {
		type: String,
		required: true,
	},
	sets: {
		type: [Set],
		required: true,
	},
	notes: [String],
});

const Exercise = mongoose.model("exercise", exercise_schema);
module.exports = Exercise;
