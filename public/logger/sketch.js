/** @format */

const { SchemaTypeOptions } = require("mongoose");

// set data on page
document.getElementById("username").innerHTML = sessionStorage.getItem("user");
document.getElementById("current_date").innerHTML = new Date()
	.toString()
	.slice(0, 15);

// get workout cycle and day
const options = {
	method: "POST",
	body: JSON.stringify({ user: sessionStorage.getItem("user") }),
	headers: {
		"Content-Type": "application/JSON",
	},
};
const response = fetch("/get_cycle", options);
const json = response.json();
document.getElementById("current_cycle").innerHTML = json.cycle;
document.getElementById("current_workout").innerHTML =
	nippard2023ppl.workouts[0].name;

function confirmWorkoutPlan() {
	// save data to session storage
	sessionStorage.setItem("cycle", nippard2023ppl);
	sessionStorage.setItem("workout", nippard2023ppl.workouts[0].name);
}
