/** @format */

async function login(u) {
	// save user to session storage
	sessionStorage.setItem("user", u);

	// initialize data variable
	const data = { user: u };

	// initialize success, error, and options variables
	const geo_onSuccess = async (position) => {
		data.lat = position.coords.latitude;
		data.lon = position.coords.longitude;
		console.log(`Your current coordinates: ${data.lat}, ${data.lon}`);
		sendData();
	};
	const geo_onError = (error) => {
		console.error(error);
		sendData();
	};
	const geo_options = { enableHighAccuracy: true };

	// perform geolocation
	if ("geolocation" in navigator) {
		console.log("geolocation available");
		navigator.geolocation.getCurrentPosition(
			await geo_onSuccess,
			geo_onError,
			geo_options
		);
	} else {
		console.log("geolocation not available");
	}

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
