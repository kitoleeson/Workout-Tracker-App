/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const exercise_schema = new Schema(
	{
		number: { type: String, required: true },
		name: { type: String, required: true },
		sets: { type: String, required: true },
		reps: { type: String, required: true },
		notes: { type: [String], required: true },
	},
	{ timestamps: true }
);

const workout_schema = new Schema(
	{
		name: { type: String, required: true },
		duration: { type: Number, required: true },
		exercises: { type: [exercise_schema], required: true },
	},
	{ timestamps: true }
);

const program_schema = new Schema(
	{
		name: { type: String, required: true },
		split: { type: String, required: true },
		offset: { type: Number, required: true },
		workouts: { type: [workout_schema], required: true },
	},
	{ timestamps: true }
);

const Program = mongoose.model("program", program_schema);
module.exports = Program;
