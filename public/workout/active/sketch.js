/** @format */

let shown = 1;
let total_pages = 2;

// set data on page
document.getElementById("username").innerHTML = sessionStorage.getItem("user");
const session_form = document.getElementById("session_form");

createDivs();
// show(0);

function createDivs() {
	// point cycle and workout variables to variables (eventually database maybe)
	let cycle;
	for (let i = 0; i < all_workout_plans.length; i++) {
		if (all_workout_plans[i].name == sessionStorage.getItem("cycle"))
			cycle = all_workout_plans[i];
	}
	let workout;
	for (let i = 0; i < cycle.workouts.length; i++) {
		if (cycle.workouts[i].name == sessionStorage.getItem("workout"))
			workout = cycle.workouts[i];
	}

	// get exercises array from workout variable
	const exercises = workout.exercises;
	const exercise_number_list = [];
	exercises.forEach((e) => exercise_number_list.push(e.number));

	// find number of pages needed
	const num_pages = exercise_number_list[
		exercise_number_list.length - 1
	].replace(/\D/g, "");
	total_pages = num_pages;

	console.log("exercise number list", exercise_number_list);

	// set variables
	let n = 0;

	// build each page
	for (let i = 1; i <= num_pages; i++) {
		const div = document.createElement("div");
		div.id = `exercise${i}`;
		div.className = "info_cluster";

		// for each exercise with number i
		while (
			exercise_number_list.length > 0 &&
			exercise_number_list[0].replace(/\D/g, "") == i
		) {
			const e = exercises[n];

			// build exercise
			// exercise name header
			const name_header = document.createElement("a");
			name_header.className = "info_pair";
			name_header.innerHTML = `<p class="header">${e.number}) ${e.name}</p>`;
			div.appendChild(name_header);

			// set weight reps header
			const swr_header = document.createElement("div");
			swr_header.className = "input_pair";
			swr_header.innerHTML = `<label class="header">set</label><label class="header">weight</label><label class="header">reps</label>`;
			div.appendChild(swr_header);

			// each set
			let variable_reps;
			if (e.reps.includes(",")) {
				variable_reps = e.reps.split(",");
				for (let j = 0; j < variable_reps.length; j++)
					variable_reps[j] = variable_reps[j].trim();
			}
			for (let j = 1; j <= parseInt(e.sets); j++) {
				const set = document.createElement("div");
				const en = e.number;
				let reps = e.reps.includes("-")
					? e.reps.split("-")[e.reps.split("-").length - 1]
					: e.reps.replace(/\D/g, "");
				set.className = "input_pair";
				if (variable_reps == null)
					set.innerHTML = `<label class="header">${j}</label>
									<input type="number" step="any" inputmode="decimal" id="${en}.${j}w" value=0 />
									<input type="number" step="any" inputmode="decimal" id="${en}.${j}r" value=${reps} />`;
				else
					set.innerHTML = `<label class="header">${j}</label>
									<input type="number" step="any" inputmode="decimal" id="${en}.${j}w" value=0 />
									<input type="number" step="any" inputmode="decimal" id="${en}.${j}r" value="${
						variable_reps[j - 1]
					}" />`;
				div.appendChild(set);
			}

			// notes
			const notes = document.createElement("a");
			notes.className = "info_pair";
			const list = document.createElement("ul");
			e.notes.forEach((n) => {
				const note = document.createElement("li");
				note.innerHTML = n;
				list.appendChild(note);
			});
			notes.appendChild(list);
			div.appendChild(notes);

			// next exercise algorithm
			exercise_number_list.splice(0, 1);
			n++;
		}

		// next and back button
		const buttons = document.createElement("div");
		if (i == num_pages) buttons.className = "input_pair";
		else buttons.className = "input_pair space_under";
		buttons.innerHTML = `
			<a class="confirm" onclick="show(-1)">
				<p class="header">back</p>
			</a>
			<a class="confirm" onclick="show(1)">
				<p class="header">next</p>
			</a>
		`;
		div.appendChild(buttons);

		// add confirm button
		if (i == num_pages) {
			const confirm = document.createElement("input");
			confirm.className = "confirm space_under header info_pair";
			confirm.type = "submit";
			confirm.value = "submit";
			div.appendChild(confirm);
		}

		session_form.appendChild(div);
	}

	// show first exercise
	show(0);
}

function show(direction) {
	let destination = parseInt(shown) + parseInt(direction);
	if (destination > total_pages) destination = 1;
	else if (destination <= 0) destination = total_pages;
	for (let i = 1; i <= total_pages; i++) {
		document.getElementById(`exercise${i}`).style.display = "none";
	}
	document.getElementById(`exercise${destination}`).style.display = "";
	shown = destination;
	return false;
}

async function sendData() {
	const data = new FormData(session_form);

	try {
		const options = {
			method: "POST",
			body: data,
		};
		const response = await fetch("/add_session", options);
		console.log(await response.json());
	} catch (error) {
		console.error(error);
	}
}

// take over form submission
session_form.addEventListener("submit", (event) => {
	event.preventDefault();
	sendData();
});
