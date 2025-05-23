/** @format */

// set data on page
document.getElementById("username").innerHTML = sessionStorage.getItem("user");
const current_date = new Date().toString().slice(0, 15);
document.getElementById("current_date").innerHTML = current_date;
sessionStorage.setItem("date", current_date);

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

	if (json.cycle == "no current cycle") {
		document.getElementById("confirm_button").innerHTML = "start cycle";
		document.getElementById("confirm_link").href = "../change_plan/";
	}
}
