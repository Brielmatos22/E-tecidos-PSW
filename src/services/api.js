const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function loginUser(email, password) {
	const response = await fetch(`${API_URL}/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email, password }),
	});

	const data = await response.json().catch(() => ({}));

	if (!response.ok) {
		throw new Error(data.message || "Não foi possível realizar o login.");
	}

	return data;
}
