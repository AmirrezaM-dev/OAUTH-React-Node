import { useAuth } from "../Components/useAuth"
import { Link } from "react-router-dom"
import { Form, Button } from "react-bootstrap"
import AuthProvider from "../Components/AuthProvider"

const Register = () => {
	const {
		formData,
		handleFormData,
		firstLogin,
		loadingLogin,
		validator,
		onSignUpSubmit,
	} = useAuth()
	return (
		<AuthProvider>
			<Form onSubmit={onSignUpSubmit}>
				<Form.Group className="mb-2">
					<Form.Label className="mb-1">Fullname</Form.Label>
					<Form.Control
						type="fullname"
						name="fullname"
						placeholder="Enter fullname"
						value={formData.fullname}
						onChange={handleFormData}
						disabled={!firstLogin || loadingLogin}
						isInvalid={validator.fullname === false}
						isValid={validator.fullname}
					/>
				</Form.Group>
				<Form.Group className="mb-2">
					<Form.Label className="mb-1">Email Address</Form.Label>
					<Form.Control
						type="email"
						name="email"
						placeholder="Enter email"
						value={formData.email}
						onChange={handleFormData}
						disabled={!firstLogin || loadingLogin}
						isInvalid={validator.email === false}
						isValid={validator.email}
					/>
				</Form.Group>
				<Form.Group className="mb-2">
					<Form.Label className="mb-1">Password</Form.Label>
					<Form.Control
						type="password"
						name="password"
						placeholder="Enter password"
						value={formData.password}
						onChange={handleFormData}
						disabled={!firstLogin || loadingLogin}
						isInvalid={validator.password === false}
						isValid={validator.password}
					/>
				</Form.Group>
				<Form.Group className="mb-2">
					<Form.Label className="mb-1">Confirm Password</Form.Label>
					<Form.Control
						type="password"
						name="confirmPassword"
						placeholder="Confirm password"
						value={formData.confirmPassword}
						onChange={handleFormData}
						disabled={!firstLogin || loadingLogin}
						isInvalid={validator.confirmPassword === false}
						isValid={validator.confirmPassword}
					/>
				</Form.Group>
				<Button className="mt-1" variant="primary" type="submit">
					Sign Up
				</Button>
			</Form>
			<p className="mt-2 text-center">
				Do you already have an account?{" "}
				<Link to={"/" + process.env.REACT_APP_ENV_FRONT_END_LOGIN}>
					Sign In
				</Link>
			</p>
		</AuthProvider>
	)
}

export default Register
