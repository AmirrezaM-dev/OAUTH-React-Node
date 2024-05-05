import { GoogleLogin } from "@react-oauth/google"
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props"
import { Button, Col, Container, Row } from "react-bootstrap"
import { useAuth } from "./useAuth"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebook, faTwitter } from "@fortawesome/free-brands-svg-icons"

const AuthProvider = ({ children }) => {
	const {
		onLoginSubmit,
		firstLogin,
		loadingLogin,
		setLoadingLogin,
		authApi,
	} = useAuth()
	return (
		<Container className="mt-5">
			<Row className="justify-content-center">
				<Col md={6}>
					<div className="p-4 shadow rounded-lg bg-light">
						<h2 className="text-center mb-4">Welcome!</h2>
						{children}
						<hr className="my-4" />
						{process.env.REACT_APP_ENV_OAUTH_DISABLED ? (
							<div className="text-center">
								<p className="mb-3">Or sign in using:</p>
								{process.env
									.REACT_APP_ENV_GOOGLE_OAUTH_DISABLED ? (
									<div
										className={`google-auth mb-3 ${
											!firstLogin || loadingLogin
												? "d-none"
												: ""
										}`}
									>
										<GoogleLogin
											onSuccess={onLoginSubmit}
											onFailure={() =>
												setLoadingLogin(false)
											}
											onError={() => {
												console.log("Login Failed")
											}}
										/>
									</div>
								) : (
									<></>
								)}
								{process.env
									.REACT_APP_ENV_FACEBOOK_OAUTH_DISABLED ? (
									<div
										className={`facebook-auth mb-3 ${
											!firstLogin || loadingLogin
												? "d-none"
												: ""
										}`}
									>
										<FacebookLogin
											appId="987869802896721"
											autoLoad={false}
											fields="name,email"
											onClick={() => {
												setLoadingLogin(true)
											}}
											callback={onLoginSubmit}
											render={(renderProps) => (
												<Button
													variant="primary"
													style={{
														backgroundColor:
															"#3b5998",
														borderColor: "#3b5998",
														alignItems: "center", // Centers items vertically
													}}
													onClick={
														renderProps.onClick
													}
												>
													{/* Text content */}
													<span
														style={{
															marginRight: "10px",
														}}
													>
														Log in with Facebook
													</span>
													{/* Icon */}
													<FontAwesomeIcon
														icon={faFacebook}
													/>
												</Button>
											)}
										/>
									</div>
								) : (
									<></>
								)}
								{process.env
									.REACT_APP_ENV_TWITTER_OAUTH_DISABLED ? (
									<div
										className={`mb-3 ${
											!firstLogin || loadingLogin
												? "d-none"
												: ""
										}`}
									>
										<Button
											variant="info"
											className="text-white"
											onClick={() => {
												try {
													authApi
														.get(
															"http://localhost:9000/auth/twitter"
														)
														.then((response) => {
															console.log(
																response.data
																	.redirectUrl
															)
															// window.location.href =
															// 	response.data.redirectUrl
														})
												} catch (error) {
													console.error(
														"Error logging in:",
														error
													)
												}
											}}
										>
											<span
												style={{
													marginRight: "25px",
												}}
											>
												Log in with Twitter
											</span>
											<FontAwesomeIcon
												icon={faTwitter}
												className="mr-2"
											/>
										</Button>
									</div>
								) : (
									<></>
								)}
							</div>
						) : (
							<></>
						)}
					</div>
				</Col>
			</Row>
		</Container>
	)
}

export default AuthProvider
