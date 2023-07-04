import { useParams } from "react-router-dom";
import "../components/modal.css";
import ShareRoomButton from "../components/ShareRoomButton";
import { useEffect, useState } from "react";
import LocationSelector from "../components/LocationSelector";
import toast from "react-hot-toast";
import LicensePlateInput from "../components/LicensePlateInput";

async function addLocation(
	roomName: string,
	location: string,
): Promise<string[]> {
	const response = await fetch(
		`${import.meta.env.VITE_API_URL}/room/${roomName}/locations/${location}`,
		{
			method: "PUT",
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

async function deleteLocation(
	roomName: string,
	location: string,
): Promise<string[]> {
	const response = await fetch(
		`${import.meta.env.VITE_API_URL}/room/${roomName}/locations/${location}`,
		{
			method: "DELETE",
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
		if (selectedLocation) {
			window.location.hash = `#${selectedLocation}`;
		} else if (
			window.location.hash &&
			locations.includes(window.location.hash.slice(1))
		) {
			setSelectedLocation(window.location.hash.slice(1));
		}
	}, [selectedLocation, locations]);

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

	async function onAddLocation(location: string) {
		toast.promise(addLocation(roomName || "", location), {
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
	}
	async function onDeleteLocation(location: string) {
		toast.promise(deleteLocation(roomName || "", location), {
			loading: "Deleting location...",
			success: (data) => {
				setLocations(data);
				if (selectedLocation === location) {
					setSelectedLocation(null);
				}
				return `Location "${location}" deleted`;
			},
			error: (error) => {
				return `Failed to delete location: ${error.message}`;
			},
		});
	}

	async function onSubmitLicensePlate(licensePlate: string) {
		console.log(`Submitting license plate ${licensePlate}`);
	}

	return (
		<>
			<h2>Where are you snatching?</h2>
			<LocationSelector
				locations={locations}
				selectedLocation={selectedLocation}
				onSelectLocation={setSelectedLocation}
				onAddLocation={onAddLocation}
				onDeleteLocation={onDeleteLocation}
			/>
			<p>Start snatching</p>
			<LicensePlateInput onSubmit={onSubmitLicensePlate} />
			<ShareRoomButton roomName={roomName} />
		</>
	);
}
