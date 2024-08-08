/** @format */

// set data on page
document.getElementById("username").innerHTML = sessionStorage.getItem("user");

let exercise_string = "";
nippard2023ppl.workouts[0].exercises.forEach((e) => {
	exercise_string += `
    <div class="spread_plan">
        <p>${e.number}</p>
        <p>${e.name}</p>
    </div>`;
});
document.getElementById("current_exercises").innerHTML = exercise_string;

function confirmWorkoutPlan() {
	// save data to session storage
	sessionStorage.setItem("cycle", nippard2023ppl.name);
	sessionStorage.setItem("workout", nippard2023ppl.workouts[0].name);
}
