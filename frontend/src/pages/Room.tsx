import { useParams } from "react-router-dom";
import { useState } from "react";
import Modal from "react-modal";
import QRCode from "react-qr-code";
import "../components/modal.css";

export default function Room() {
	const { roomName } = useParams();
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [buttonText, setButtonText] = useState("Copy");
	const baseUrl = window.location.origin;
	const roomUrl = `${baseUrl}/room/${roomName}`;

	Modal.setAppElement("#root");

	return (
		<>
			<h1>Room</h1>
			<p className="room-name">{roomName}</p>
			<button onClick={() => setModalIsOpen(true)}>Share room</button>
			<Modal
				isOpen={modalIsOpen}
				onRequestClose={() => setModalIsOpen(false)}
				className="modal"
				overlayClassName="overlay"
			>
				<div
					style={{
						display: "flex",
						flex: "1 1 auto",
						justifyContent: "space-between",
						alignItems: "start",
					}}
				>
					<h2>Share room link</h2>
					<button
						onClick={() => setModalIsOpen(false)}
						className="closeModal"
					></button>
				</div>
				<QRCode
					value={roomUrl}
					style={{
						display: "block",
						margin: "auto",
						padding: "1rem",
						backgroundColor: "#fff",
					}}
				/>
				<div id="copy-button-container">
					<input
						type="text"
						value={roomUrl}
						readOnly
						onFocus={(event) => {
							event.target.select();
						}}
					/>
					<button
						onClick={() => {
							navigator.clipboard.writeText(roomUrl);
							setButtonText("Copied!");
							setTimeout(() => {
								setButtonText("Copy");
							}, 3000);
						}}
						style={{
							width: "7em",
							display: navigator.clipboard ? "block" : "none",
						}}
					>
						{buttonText}
					</button>
				</div>
			</Modal>
		</>
	);
}
