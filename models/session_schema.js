/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Exercise = require("./exercise_schema");

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
			type: [Exercise],
			required: true,
		},
	},
	{ timestamps: true }
);

const Session = mongoose.model("session", session_schema);
module.exports = Session;
