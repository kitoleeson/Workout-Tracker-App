/** @format */

// set data on page
document.getElementById("username").innerHTML = sessionStorage.getItem("user");

let exercise_string = "";
const workout = JSON.parse(sessionStorage.getItem("workout"));
workout.exercises.forEach((e) => {
	exercise_string += `
    <div class="spread_plan">
        <p>${e.number}</p>
        <p>${e.name}</p>
    </div>`;
});
if (exercise_string == "") {
	exercise_string = `<p>rest day!</p>`;
	document.getElementById("continue_button").href = "/";
}
document.getElementById("current_exercises").innerHTML = exercise_string;
