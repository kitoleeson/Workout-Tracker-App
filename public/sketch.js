/** @format */

async function login(u) {
	// save user to session storage
	sessionStorage.setItem("user", u);

	// initialize data variable
	const data = { user: u };

	async function sendData() {
		// send login data to server
		const options = {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/JSON",
			},
		};
		console.log("sending");
		const response = await fetch("/login", options);
		const json = await response.json();
		console.log(json);
	}
}
