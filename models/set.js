/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const set_schema = new Schema({
	parent: {
		type: Schema.Types.ObjectId,
		ref: "exercise",
		required: true,
	},
	exercise: {
		type: String,
		required: true,
	},
	load: {
		type: Number,
		required: true,
	},
	reps: {
		type: Number,
		required: true,
	},
});

const Set = mongoose.model("set", set_schema);
module.exports = Set;
