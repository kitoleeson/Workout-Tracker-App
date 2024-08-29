/** @format */

document.getElementById("username").innerHTML = sessionStorage.getItem("user");
document.getElementById("current_date").innerHTML =
	sessionStorage.getItem("date");

getCycles();

let all_cycles;
let selected_cycle;
let selected_workout;

async function getCycles() {
	const response = await fetch("/all_cycles");
	const json = await response.json();
	all_cycles = json.cycles;
	console.log(all_cycles);

	// populate cycle dropdown
	let cycles = '<option value="no choice"></option>';
	for (let cycle of all_cycles)
		cycles += `<option value="${cycle.name}">${cycle.name}</option>`;
	document.getElementById("current_cycle").innerHTML = cycles;
}

function getCycleInfo(element) {
	const index = element.selectedIndex - 1;
	selected_cycle = all_cycles[index];
	const cycle_info = document.getElementById("cycle_info");

	if (index < 0) {
		cycle_info.innerHTML = `
			<p class="header">cycle info:</p>
			<p>please select a cycle</p>
		`;
		cycle_info.style.padding = "1em 2em";
		return;
	}

	// populate cycle information
	cycle_info.style.padding = "1em 2em 1.5em 2em";
	cycle_info.innerHTML = `
		<p class="header">cycle info:</p>
		<div class="spread_plan">
			<p>weekly workouts:</p>
			<p>${selected_cycle.workouts.length}</p>
		</div>
		<div class="spread_plan">
			<p>split:</p>
			<p>${selected_cycle.split}</p>
		</div>
	`;

	// populate workout dropdown
	let workouts = '<option value="no choice"></option>';
	for (let workout of selected_cycle.workouts)
		workouts += `<option value="${workout.name}">${workout.name}</option>`;
	document.getElementById("current_workout").innerHTML = workouts;
}

function getWorkoutInfo(element) {
	const index = element.selectedIndex - 1;
	selected_workout = selected_cycle.workouts[index];
	const workout_info = document.getElementById("workout_info");

	if (index < 0) {
		workout_info.innerHTML = `
			<p class="header">exercises:</p>
			<p>please select a workout</p>
		`;
		workout_info.style.padding = "1em 2em";
		return;
	}
	console.log(selected_cycle);
	const workout = selected_cycle.workouts[index];

	// populate cycle information
	workout_info.style.padding = "1em 2em 1.5em 2em";
	let workouts_string = '<p class="header">exercises:</p>';
	for (let exercise of workout.exercises)
		workouts_string += `
		<div class="spread_plan">
			<p>${exercise.number}</p>
			<p>${exercise.name}</p>
		</div>
	`;
	workout_info.innerHTML = workouts_string;
}

function submitNewWorkout() {
	event.preventDefault;

	// check required
	const cycle = document.getElementById("current_cycle");
	const workout = document.getElementById("current_workout");

	if (cycle.value == "no choice" || workout.value == "no choice") {
		alert("please select both cycle and workout options");
		return false;
	}

	console.log("Cycle selected:", cycle.value);
	console.log("Workout selected:", workout.value);

	sessionStorage.setItem("cycle", selected_cycle.name);
	sessionStorage.setItem("workout", JSON.stringify(selected_workout));
	window.location.href = "../../workout/plan";

	return false;
}
