/** @format */

let shown = 1;
let total_pages = 2;

// set data on page
document.getElementById("username").innerHTML = sessionStorage.getItem("user");
const session_form = document.getElementById("session_form");

// point cycle and workout variables to variables (eventually database maybe)
let cycle = sessionStorage.getItem("cycle");
let workout = JSON.parse(sessionStorage.getItem("workout"));

// get exercises array from workout variable
const exercises = workout.exercises;
let previous_exercises;

getPreviousWorkout()
	.then((result) => {
		previous_exercises = result;
		console.log(previous_exercises);
		createDivs();
	})
	.catch((error) => {
		console.error("error getting previous workout:", error);
	});

async function getPreviousWorkout() {
	const options = {
		method: "POST",
		body: JSON.stringify({ exercises: exercises.map((e) => e.name), user: sessionStorage.getItem("user") }),
		headers: {
			"Content-Type": "application/json",
		},
	};
	const response = await fetch("/get_previous_workout", options);
	const json = await response.json();
	console.log(json);
	return json.exercises;
}

function createDivs() {
	// create number list
	const exercise_number_list = [];
	exercises.forEach((e) => exercise_number_list.push(e.number));

	// find number of pages needed
	const num_pages = exercise_number_list[exercise_number_list.length - 1].replace(/\D/g, "");
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
		while (exercise_number_list.length > 0 && exercise_number_list[0].replace(/\D/g, "") == i) {
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
				for (let j = 0; j < variable_reps.length; j++) variable_reps[j] = variable_reps[j].trim();
			}
			for (let j = 1; j <= parseInt(e.sets); j++) {
				const set = document.createElement("div");
				set.className = "input_pair";
				const en = e.number;

				let weight = 0;
				let reps = 0;
				const reference = previous_exercises[n].sets;
				const rep_goal = e.reps.replace(/[^0-9-]/g, "");

				// if there is reference for this set, autofill values with reference
				if (reference && reference.length >= j) {
					weight = reference[j - 1].load;
					reps = reference[j - 1].reps;
				}

				if (variable_reps == null)
					set.innerHTML = `
						<label class="header">${j}</label>
						<input type="number" step="any" inputmode="decimal" id="${en}.${j}w" value=${weight} />
						<div class="reps">
							<input type="number" step="any" inputmode="decimal"
							id="${en}.${j}r" value=${reps} />
							<p>'${rep_goal}'</p>
						</div>
					`;
				else
					set.innerHTML = `
						<label class="header">${j}</label>
						<input type="number" step="any" inputmode="decimal" id="${en}.${j}w" value=${weight} />
						<div class="reps">
							<input type="number" step="any" inputmode="decimal"
							id="${en}.${j}r" value="${variable_reps[j - 1]}" />
							<p>'${variable_reps[j - 1]}'</p>
						</div>
					`;
				div.appendChild(set);
			}

			// notes
			const cues = document.createElement("a");
			cues.className = "info_pair";
			const list = document.createElement("ul");
			e.notes.forEach((n) => {
				const note = document.createElement("li");
				note.innerHTML = n;
				list.appendChild(note);
			});
			const reference_notes = previous_exercises[n].notes;
			if (reference_notes && reference_notes[0] != "") {
				reference_notes[0].split("\n").forEach((n) => {
					const note = document.createElement("li");
					note.innerHTML = n;
					note.className = "temporary_note";
					list.appendChild(note);
				});
			}
			cues.appendChild(list);
			div.appendChild(cues);

			// next exercise algorithm
			exercise_number_list.splice(0, 1);
			n++;

			const notes = document.createElement("div");
			notes.className = "input_pair";
			notes.innerHTML = `<textarea id="${e.number}.notes" cols="50" rows="10">`;
			div.appendChild(notes);
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
	// initialize sesison data
	const new_session = {
		user: sessionStorage.getItem("user"),
		cycle: cycle,
		workout: workout.name,
		exercises: [],
	};

	// populate exercises array
	for (let exercise of exercises) {
		const en = exercise.number;
		const new_exercise = {
			name: exercise.name,
			sets: [],
			notes: document.getElementById(`${en}.notes`).value,
		};
		for (let i = 1; i <= parseInt(exercise.sets); i++) {
			const new_set = {
				load: document.getElementById(`${en}.${i}w`).value,
				reps: document.getElementById(`${en}.${i}r`).value,
			};
			new_exercise.sets.push(new_set);
		}
		new_session.exercises.push(new_exercise);
	}
	console.log(new_session);

	try {
		console.log("sending");
		const options = {
			method: "POST",
			body: JSON.stringify(new_session),
			headers: {
				"Content-Type": "application/json",
			},
		};
		const response = await fetch("/add_session", options);
		const json = await response.json();
		console.log(json);
		if (json.redirectTo) window.location.href = json.redirectTo;
	} catch (error) {
		console.error(error);
	}
}

// take over form submission
session_form.addEventListener("submit", (event) => {
	event.preventDefault();
	sendData();
});
