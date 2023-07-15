import "./index.css";
import { useNavigate } from "react-router-dom";
import generateRandomName from "../mnemonic-generator";

function Index() {
	const navigate = useNavigate();

	return (
		<>
			<img alt="SNATCH" src="/word-logo.svg" width="300rem" />
			<div className="button-bar">
				<button
					onClick={() => {
						const newRoomId = generateRandomName();
						navigate(`/room/${newRoomId}`);
					}}
					type="button"
				>
					Create room
				</button>
				<button onClick={() => navigate("/join")} type="button">
					Join room
				</button>
			</div>
		</>
	);
}

export default Index;
