import {useEffect, useState} from "react";
import {ethers} from "ethers";
import Web3Modal from "web3modal";
import Swal from "sweetalert2";
import logo from "../assets/logo.webp";

// ----------- providers options --------
import WalletConnect from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

const providerOptions = {
	walletlink: {
		package: CoinbaseWalletSDK,
		options: {
			appName: "Web 3 Modal",
			infuraId: process.env.REACT_APP_INFURA_KEY,
		},
	},
	walletconnect: {
		package: WalletConnect,
		options: {
			infuraId: process.env.REACT_APP_INFURA_KEY,
		},
	},
};
// ----------- end: providers options --------

const web3Modal = new Web3Modal({
	cacheProvider: true,
	providerOptions,
});

export default function Home() {
	const [provider, setProvider] = useState();
	const [account, setAccount] = useState();

	const connectWallet = async () => {
		try {
			const provider = await web3Modal.connect();
			const library = new ethers.providers.Web3Provider(provider);
			const accounts = await library.listAccounts();
			setProvider(provider);
			if (provider) {
				Swal.fire({
					icon: "success",
					iconColor: "#2ecc71",
					text: "You have successfully connected your wallet!",
					showConfirmButton: false,
					position: "top-end",
					timer: 1500,
				});
				setAccount(accounts[0]);
			}
		} catch (err) {
			console.log({err});
		}
	};

	const refreshState = () => {
		setAccount();
	};

	const disconnect = async () => {
		await web3Modal.clearCachedProvider();
		refreshState();
		Swal.fire({
			icon: "warning",
			iconColor: "#ec644b",
			text: "You have disconnected your wallet!",
			showConfirmButton: false,
			position: "top-end",
			timer: 1500,
		});
	};

	useEffect(() => {
		if (web3Modal.cachedProvider) {
			connectWallet();
		}
	}, []);

	return (
		<>
			<nav className="navbar sticky-top navbar-light bg-white border-bottom">
				<div className="container-fluid">
					<a
						href="/"
						className="navbar-brand d-flex align-items-center"
					>
						<img
							src={logo}
							alt="Bored Monkey"
							width="30"
							height="30"
							className="me-2"
						/>
						Bored Monkey
					</a>
					<form className="d-flex align-items-center">
						<span className="small text-muted me-3 d-none d-md-block">
							{account &&
								account.substring(0, 6) +
									"..." +
									account.substring(account.length - 6)}
						</span>
						{account ? (
							<button
								onClick={disconnect}
								className="btn btn-outline-danger"
								type="button"
							>
								Disconnect
							</button>
						) : (
							<button
								onClick={connectWallet}
								className="btn btn-outline-success"
								type="button"
							>
								Connect Wallet
							</button>
						)}
					</form>
				</div>
			</nav>
		</>
	);
}
