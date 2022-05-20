import {useState, useEffect} from "react";
import Web3 from "web3";
import Swal from "sweetalert2";

import metamaskLogo from "../assets/metamask.svg";

export default function Wallet() {
	const [isConnected, setIsConnected] = useState(false);
	const [userInfo, setUserInfo] = useState({});

	useEffect(() => {
		function checkConnectedWallet() {
			const userData = JSON.parse(localStorage.getItem("userAccount"));
			if (userData != null) {
				setUserInfo(userData);
				setIsConnected(true);
			}
		}
		checkConnectedWallet();
	}, []);

	function isMobile() {
		return "ontouchstart" in window || "onmsgesturechange" in window;
	}

	const dappUrl = "boredmonkey.netlify.app";
	const metamaskAppDeepLink = "https://metamask.app.link/dapp/" + dappUrl;

	const detectCurrentProvider = () => {
		let provider;
		if (window.ethereum) {
			provider = window.ethereum;
		} else if (window.web3) {
			provider = window.web3.currentProvider;
		} else {
			console.log(
				"Non-Ethereum browser detected. You should consider trying MetaMask!"
			);
		}
		return provider;
	};

	const onConnect = async () => {
		try {
			const currentProvider = detectCurrentProvider();
			if (currentProvider) {
				if (currentProvider !== window.ethereum) {
					console.log(
						"Non-Ethereum browser detected. You should consider trying MetaMask!"
					);
				}
				await currentProvider.request({method: "eth_requestAccounts"});
				const web3 = new Web3(currentProvider);
				const userAccount = await web3.eth.getAccounts();
				const chainId = await web3.eth.getChainId();
				const account = userAccount[0];
				// ----------- get wallet balance --------
				let ethBalance = await web3.eth.getBalance(account);
				// ----------- conversion to Wei units --------
				ethBalance = web3.utils.fromWei(ethBalance, "ether");
				saveUserInfo(ethBalance, account, chainId);
				if (userAccount.length === 0) {
					console.log("Please connect to MetaMask");
				}
				Swal.fire({
					icon: "success",
					iconColor: "#2ecc71",
					text: "You have successfully connected your wallet!",
					showConfirmButton: false,
					position: "top-end",
					timer: 1500,
				});
			}
		} catch (err) {
			console.log(
				"There was an error fetching your accounts. Make sure your Ethereum client is configured correctly."
			);
		}
	};

	const onDisconnect = () => {
		window.localStorage.removeItem("userAccount");
		setUserInfo({});
		setIsConnected(false);
		Swal.fire({
			icon: "warning",
			iconColor: "#ec644b",
			text: "You have disconnected your wallet!",
			showConfirmButton: false,
			position: "top-end",
			timer: 1500,
		});
	};

	const saveUserInfo = (ethBalance, account, chainId) => {
		const userAccount = {
			account: account,
			balance: ethBalance,
			connectionid: chainId,
		};
		// ----------- user persisted data --------
		window.localStorage.setItem("userAccount", JSON.stringify(userAccount));
		const userData = JSON.parse(localStorage.getItem("userAccount"));
		setUserInfo(userData);
		setIsConnected(true);
	};

	return (
		<>
			<nav className="navbar sticky-top navbar-light bg-white border-bottom">
				<div className="container-fluid">
					<a
						href="/"
						className="navbar-brand d-flex align-items-center"
					>
						<img
							src={metamaskLogo}
							alt="Bored Monkey"
							width="30"
							height="30"
							className="me-2"
						/>
						{isConnected
							? userInfo.account.substring(0, 6) +
							  "..." +
							  userInfo.account.substring(
									userInfo.account.length - 6
							  )
							: "MetaMask"}
					</a>
					<form className="d-flex align-items-center">
						{isConnected ? (
							<>
								<span className="small text-success me-3 d-none d-md-block fw-bold">
									{userInfo.balance} ETH
								</span>
								<button
									onClick={onDisconnect}
									className="btn btn-outline-danger"
									type="button"
								>
									Disconnect
								</button>
							</>
						) : (
							<>
								{isMobile() ? (
									<a href={metamaskAppDeepLink}>
										<button className="btn btn-outline-success">
											Connect to MetaMask
										</button>
									</a>
								) : (
									<button
										onClick={onConnect}
										className="btn btn-outline-success"
										type="button"
									>
										Connect to MetaMask
									</button>
								)}
							</>
						)}
					</form>
				</div>
			</nav>
		</>
	);
}
