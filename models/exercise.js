/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const exercise_schema = new Schema({
	name: {
		type: String,
		required: true,
	},
	sets: {
		type: [Schema.Types.ObjectId],
		ref: "set",
		required: true,
	},
	notes: [String],
});

const Exercise = mongoose.model("exercise", exercise_schema);
module.exports = Exercise;
