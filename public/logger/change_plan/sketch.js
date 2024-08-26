/** @format */

document.getElementById("username").innerHTML = sessionStorage.getItem("user");
document.getElementById("current_date").innerHTML =
	sessionStorage.getItem("date");

getCycles();

async function getCycles() {
	const response = await fetch("/all_cycles");
	const json = await response.json();
	console.log(json);
}
