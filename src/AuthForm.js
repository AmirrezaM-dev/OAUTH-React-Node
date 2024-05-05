import React from "react"
import { Form, Button, Container, Row, Col } from "react-bootstrap"
import { GoogleLogin } from "@react-oauth/google"
import FacebookLogin from "react-facebook-login"
const AuthForm = () => {
	const handleFacebookLogin = (response) => {
		console.log(response)
		if (response.accessToken) {
			// onLoginSuccess(response.accessToken)
		} else {
			// onLoginFailure()
		}
	}

	return (
		<Container className="mt-5">
			<Row className="justify-content-center">
				<Col md={6}>
					<div className="p-4 shadow rounded-lg bg-light">
						<h2 className="text-center mb-4">Welcome Back!</h2>
						<Form>
							<Form.Group controlId="formBasicEmail">
								<Form.Label>Email Address</Form.Label>
								<Form.Control
									type="email"
									placeholder="Enter email"
								/>
							</Form.Group>

							<Form.Group controlId="formBasicPassword">
								<Form.Label>Password</Form.Label>
								<Form.Control
									type="password"
									placeholder="Password"
								/>
							</Form.Group>

							<Button
								className="mt-3"
								variant="primary"
								type="submit"
							>
								Sign In
							</Button>
						</Form>
						<hr className="my-4" />
						<div className="text-center">
							<p className="mb-3">Or sign in using:</p>
							<div className="mb-3">
								<GoogleLogin
									onSuccess={(e) => {
										if (e.credential) {
											//success
										} else {
											//failure
										}
									}}
									onError={() => {
										console.log("Login Failed")
									}}
								/>
							</div>
							<FacebookLogin
								appId="987869802896721"
								autoLoad={false}
								fields="name,email,picture"
								callback={handleFacebookLogin}
							/>
							<Button
								variant="outline-info"
								className="mx-1 mb-2"
							>
								Twitter
							</Button>
						</div>
						<p className="mt-3 text-center">
							Don't have an account? <a href="#">Sign Up</a>
						</p>
					</div>
				</Col>
			</Row>
		</Container>
	)
}

export default AuthForm
