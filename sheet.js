/** @format */

const fs = require("fs");
const { parse } = require("csv-parse");

const data = [];
fs.createReadStream("csvs/legs2.csv")
	.pipe(parse({ delimiter: ",", from_line: 1 }))
	.on("data", function (row) {
		// console.log(row);
		row[4] = row[4].split("-");
		row[4].splice(0, 1);
		for (i = 0; i < row[4].length; i++) row[4][i] = row[4][i].trim();
		data.push(row);
	})
	.on("error", function (error) {
		console.log(error.message);
	})
	.on("end", function () {
		// console.log(data);
		data.forEach((d) => {
			const exercise = {
				number: d[0],
				name: d[1],
				sets: d[2],
				reps: d[3],
				notes: d[4],
			};
			console.log(exercise);
			console.log(",");
		});
	});
