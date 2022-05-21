import React, {Component} from "react";
import "./App.css";

import MetaMask from "./auth/Metamask";
// import Web3Modal from "./auth/Web3Modal";
// import Wallet from "./auth/Wallet";

class App extends Component {
	render() {
		return (
			<>
				<MetaMask />
			</>
		);
	}
}

export default App;
