import { useParams } from "react-router-dom";
import "../components/modal.css";
import ShareRoomButton from "../components/ShareRoomButton";
import { useEffect, useState } from "react";
import LocationSelector from "../components/LocationSelector";
import toast from "react-hot-toast";

async function addLocation(
	roomName: string,
	location: string,
): Promise<string[]> {
	const response = await fetch(
		`${import.meta.env.VITE_API_URL}/room/${roomName}/locations/${location}`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			signal: AbortSignal.timeout(5000),
		},
	);
	if (!response.ok) {
		if (response.status >= 400 && response.status < 500) {
			const error = await response.json();
			throw new Error(error.detail);
		}
		throw new Error(response.statusText);
	}
	return await response.json();
}
export default function Room() {
	const { roomName } = useParams();
	if (!roomName) {
		return <h1>Room name is missing</h1>;
	}
	const [locations, setLocations] = useState<string[]>([]);
	const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

	useEffect(() => {
		fetch(`${import.meta.env.VITE_API_URL}/room/${roomName}/locations`, {
			signal: AbortSignal.timeout(5000),
		})
			.then((response) => response.json())
			.then((data) => {
				setLocations(data);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	return (
		<>
			<h2>Where are you snatching?</h2>
			<LocationSelector
				locations={locations}
				selectedLocation={selectedLocation}
				onSelectLocation={setSelectedLocation}
				onAddLocation={async (location) => {
					toast.promise(addLocation(roomName, location), {
						loading: "Adding location...",
						success: (data) => {
							setLocations(data);
							setSelectedLocation(location);
							return `Location "${location}" added`;
						},
						error: (error) => {
							return `Failed to add location: ${error.message}`;
						},
					});
				}}
			/>
			<hr />
			<ShareRoomButton roomName={roomName} />
		</>
	);
}
