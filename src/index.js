import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {Web3ReactProvider} from "@web3-react/core";
import Web3 from "web3";

function getLibrary(provider) {
	return new Web3(provider);
}

ReactDOM.render(
	<React.StrictMode>
		<Web3ReactProvider getLibrary={getLibrary}>
			<App />
		</Web3ReactProvider>
	</React.StrictMode>,
	document.getElementById("root")
);
reportWebVitals();
