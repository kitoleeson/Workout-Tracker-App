/** @format */

// set data on page
document.getElementById("username").innerHTML = sessionStorage.getItem("user");
document.getElementById("current_date").innerHTML = new Date()
	.toString()
	.slice(0, 15);
document.getElementById("current_cycle").innerHTML = nippard2023ppl.name;
document.getElementById("current_workout").innerHTML =
	nippard2023ppl.workouts[0].name;

function confirmWorkoutPlan() {
	// save data to session storage
	sessionStorage.setItem("cycle", nippard2023ppl);
	sessionStorage.setItem("workout", nippard2023ppl.workouts[0].name);
}
