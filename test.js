async function main() {
	let request = await fetch('https://ice64.securenetsystems.net/WTTS', {
		headers: {
			"Icy-Metadata": "1"
		}
	});
	let data = request.body
	data = data.getReader();
	while (true) {
		console.log(await data.read());
	}
	console.log(request.headers);
}
main();
