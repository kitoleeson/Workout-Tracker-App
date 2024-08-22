/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const program_schema = new Schema(
	{
		data: {
			type: Object,
			required: true,
		},
	},
	{ timestamps: true }
);

const Program = mongoose.model("program", program_schema);
module.exports = Program;
