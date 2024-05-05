import React from "react"
import { Container, Spinner } from "react-bootstrap"

const Preloader = () => {
	return (
		<div className="preloader-container">
			<Container className="d-flex justify-content-center align-items-center">
				<Spinner animation="grow" variant="primary" />
				<h4 className="ml-3">Loading...</h4>
			</Container>
		</div>
	)
}

export default Preloader
