import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import "bootstrap/dist/css/bootstrap.min.css"
import { GoogleOAuthProvider } from "@react-oauth/google"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
	//<React.StrictMode>
	<GoogleOAuthProvider clientId={process.env.REACT_APP_ENV_GOOGLE_CLIENT_ID}>
		<App />
	</GoogleOAuthProvider>
	//</React.StrictMode>
)
