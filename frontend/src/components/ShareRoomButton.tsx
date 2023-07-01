import Modal from "react-modal";
import QRCode from "react-qr-code";
import { useState } from "react";

export default function ShareRoomButton({ roomName }: { roomName: string }) {
	const [modalIsOpen, setModalIsOpen] = useState(false);

	const baseUrl = window.location.origin;
	const [buttonText, setButtonText] = useState("Copy");

	const roomUrl = `${baseUrl}/room/${roomName}`;

	return (
		<>
			<button onClick={() => setModalIsOpen(true)} type="button">
				Share room ”{roomName}”
			</button>
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
						type="button"
					/>
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
						type="button"
					>
						{buttonText}
					</button>
				</div>
			</Modal>
		</>
	);
}
