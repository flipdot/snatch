import { useParams } from "react-router-dom";
import "../components/modal.css";
import ShareRoomButton from "../components/ShareRoomButton";

export default function Room() {
	const { roomName } = useParams();
	if (!roomName) {
		return <h1>Room name is missing</h1>;
	}

	return (
		<>
			<h1>Room</h1>
			<p className="room-name">{roomName}</p>
			<ShareRoomButton roomName={roomName} />
		</>
	);
}
