import UsernamePasswordInput from "./usernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
	// Check if username includes @
	if (options.username.includes("@")) {
		return [
			{
				field: "username",
				message: "username must not contain a '@'",
			},
		];
	}
	// Check if email includes @
	if (!options.email.includes("@")) {
		return [
			{
				field: "email",
				message: "invalid email",
			},
		];
	}
	// Check if username is at least of length 2
	if (options.username.length <= 2) {
		return [
			{
				field: "username",
				message: "username must be at least 2 characters",
			},
		];
	}
	// Check if password is at least of length 3
	if (options.password.length <= 3) {
		return [
			{
				field: "password",
				message: "password must be at least 4 characters",
			},
		];
	}

	return null;
};
