/** @format */

// set data on page
document.getElementById("username").innerHTML = sessionStorage.getItem("user");
document.getElementById("current_date").innerHTML = new Date()
	.toString()
	.slice(0, 15);

getCycle();

// get workout cycle and day
async function getCycle() {
	const day = new Date().getDay();
	const options = {
		method: "POST",
		body: JSON.stringify({ user: sessionStorage.getItem("user"), day: day }),
		headers: {
			"Content-Type": "application/JSON",
		},
	};
	console.log("fetching cycle..");
	const response = await fetch("/get_cycle", options);
	const json = await response.json();
	console.log(json);

	document.getElementById("current_cycle").innerHTML = json.cycle;
	sessionStorage.setItem("cycle", json.cycle);

	document.getElementById("current_workout").innerHTML = json.workout.name;
	sessionStorage.setItem("workout", JSON.stringify(json.workout));
}
