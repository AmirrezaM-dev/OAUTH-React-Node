import React, { useEffect } from "react"
import { Route, Routes, useLocation, useNavigate } from "react-router-dom"
import Preloader from "./Components/PreLoader"
import { useMain } from "./Components/useMain"
import { useAuth } from "./Components/useAuth"
import Login from "./AuthPages/Login"
import Register from "./AuthPages/Register"
import { Button } from "react-bootstrap"

const App = () => {
	const { showPreloader } = useMain()
	const { ForgotForm, loggedIn, firstLogin, logout } = useAuth()
	const pathname = useLocation().pathname
	const navigate = useNavigate()
	useEffect(() => {
		if (
			loggedIn &&
			(pathname.indexOf(process.env.REACT_APP_ENV_FRONT_END_LOGIN) !==
				-1 ||
				pathname.indexOf(
					process.env.REACT_APP_ENV_FRONT_END_REGISTER
				) !== -1)
		)
			navigate("/")

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loggedIn, pathname])
	return !firstLogin || showPreloader ? (
		<Preloader />
	) : (
		<>
			<div className={loggedIn ? "pt-5" : ""}>
				<Routes>
					<Route
						path={process.env.REACT_APP_ENV_FRONT_END_LOGIN}
						element={<Login />}
					/>
					<Route
						path={process.env.REACT_APP_ENV_FRONT_END_REGISTER}
						element={<Register />}
					/>
					<Route
						path={process.env.REACT_APP_ENV_FRONT_END_REGISTER}
						element={ForgotForm}
					/>
					<Route
						path={"/"}
						element={
							<>
								<Button onClick={logout}>Logout</Button>
							</>
						}
					/>
				</Routes>
			</div>
		</>
	)
}

export default App
