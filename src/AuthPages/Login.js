import { useAuth } from "../Components/useAuth"
import { Link } from "react-router-dom"
import { Form, Button } from "react-bootstrap"
import AuthProvider from "../Components/AuthProvider"

const Login = () => {
	const {
		formData,
		handleFormData,
		firstLogin,
		loadingLogin,
		validator,
		onLoginSubmit,
	} = useAuth()
	return (
		<AuthProvider>
			<Form onSubmit={onLoginSubmit}>
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
				<Button className="mt-1" variant="primary" type="submit">
					Sign In
				</Button>
			</Form>
			<p className="mt-2 text-center">
				Don't have an account?{" "}
				<Link to={"/" + process.env.REACT_APP_ENV_FRONT_END_REGISTER}>
					Sign Up
				</Link>
			</p>
		</AuthProvider>
	)
}

export default Login
