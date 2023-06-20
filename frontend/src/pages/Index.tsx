import "./index.css";
import { useNavigate } from "react-router-dom";
import generateRandomName from "../mnemonic-generator";

function Index() {
	const navigate = useNavigate();

	return (
		<>
			<h1>SNATCH</h1>
			<div className="button-bar">
				<button
					onClick={() => {
						const newRoomId = generateRandomName();
						navigate(`/room/${newRoomId}`);
					}}
				>
					Create room
				</button>
				<button onClick={() => navigate("/join")}>Join room</button>
			</div>
		</>
	);
}

export default Index;
