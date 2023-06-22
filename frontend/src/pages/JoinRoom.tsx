import { QrScanner } from "@yudiel/react-qr-scanner";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { useState } from "react";

function JoinRoom() {
	const navigate = useNavigate();
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [roomId, setRoomId] = useState("");
	const [scanErrorMessage, setScanErrorMessage] = useState("");

	Modal.setAppElement("#root");

	return (
		<>
			<h1>Join room</h1>
			<h2>Enter {navigator.mediaDevices && "or scan"} room name</h2>
			<form
				onSubmit={(event) => {
					event.preventDefault();
					if (!roomId) return;
					navigate(`/room/${roomId}`);
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<input
						value={roomId}
						onChange={(event) => setRoomId(event.target.value)}
						type="text"
						placeholder="Room name"
						// rome-ignore lint/a11y/noAutofocus: Only one input field, no text before it that the user might want to read
						autoFocus
					/>
					<button
						onClick={() => setModalIsOpen(true)}
						style={{
							borderTopLeftRadius: 0,
							borderBottomLeftRadius: 0,
							display: navigator.mediaDevices ? "block" : "none",
						}}
						type="button"
					>
						📷
					</button>
				</div>
				<button style={{ marginTop: "1rem" }} disabled={!roomId} type="submit">
					Join
				</button>
			</form>
			<Modal
				isOpen={modalIsOpen}
				onRequestClose={() => setModalIsOpen(false)}
				className="modal"
				overlayClassName="overlay"
			>
				<QrScanner
					onDecode={(result) => {
						// check if code is a URL with the same domain as the current page
						const url = new URL(result);
						if (url.hostname !== window.location.hostname) {
							setScanErrorMessage(
								`Invalid domain "${url.hostname}". You can only scan codes from ${window.location.hostname}.`,
							);
							return;
						}
						// extract room name from URL
						const path = url.pathname;
						if (!path.startsWith("/room/")) {
							setScanErrorMessage(
								"Invalid code. Please scan a SNATCH room code.",
							);
							return;
						}
						const roomId = path.substring(path.lastIndexOf("/") + 1);
						setRoomId(roomId);
						setScanErrorMessage("");
						setModalIsOpen(false);
					}}
					onError={(error) => console.log(error?.message)}
				/>
				{scanErrorMessage && <p>{scanErrorMessage}</p>}
			</Modal>
		</>
	);
}

export default JoinRoom;
