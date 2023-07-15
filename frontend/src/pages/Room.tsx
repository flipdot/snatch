import { useNavigate, useParams } from "react-router-dom";
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

async function submitLicensePlate(
	roomName: string,
	location: string,
	licensePlate: string,
): Promise<string> {
	const response = await fetch(
		`${import.meta.env.VITE_API_URL}/room/${roomName}/records/`,
		{
			method: "POST",
			signal: AbortSignal.timeout(5000),
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				location: location,
				plate: licensePlate,
			}),
		},
	);
	if (!response.ok) {
		if (response.status >= 400 && response.status < 500) {
			const error = await response.json();
			throw new Error(JSON.stringify(error.detail));
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
	const navigate = useNavigate();
	const [locations, setLocations] = useState<string[]>([]);
	const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
	const [licensePlateDistrict, setLicensePlateDistrict] = useState("");
	const [licensePlateId, setLicensePlateId] = useState("");
	const [licensePlateExtraClass, setLicensePlateExtraClass] = useState("");
	const [newLocation, setNewLocation] = useState("");

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
		fetch(`${import.meta.env.VITE_API_URL}/room/${roomName}/locations/`, {
			signal: AbortSignal.timeout(5000),
		})
			.then((response) => response.json())
			.then((data) => {
				setLocations(data);
			})
			.catch((error) => {
				toast.error(
					`Failed to fetch locations from ${import.meta.env.VITE_API_URL}: ${
						error.message
					}`,
				);
				console.error(error);
			});
	}, []);

	async function onAddLocation(location: string) {
		toast.promise(addLocation(roomName || "", location), {
			loading: "Adding location...",
			success: (data) => {
				setLocations(data);
				setSelectedLocation(location);
				setNewLocation("");
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
		if (licensePlateExtraClass === "loading") {
			return;
		}
		setLicensePlateExtraClass("loading");
		toast.promise(
			submitLicensePlate(roomName || "", selectedLocation || "", licensePlate),
			{
				loading: "Submitting...",
				success: (timestamp) => {
					const date = new Date(timestamp);
					const hours = date.getHours().toString().padStart(2, "0");
					const minutes = date.getMinutes().toString().padStart(2, "0");
					const seconds = date.getSeconds().toString().padStart(2, "0");
					const formattedDate = `${hours}:${minutes}:${seconds}`;
					setLicensePlateDistrict("");
					setLicensePlateId("");
					setLicensePlateExtraClass("");
					document.getElementById("license-plate-district")?.focus();
					return `"${licensePlate}" @${formattedDate} saved!`;
				},
				error: (error) => {
					return `Failed to submit: ${error.message}`;
				},
			},
		);
	}

	return (
		<>
			<h2>Where are you snatching?</h2>
			<LocationSelector
				locations={locations}
				selectedLocation={selectedLocation}
				onSelectLocation={(location) => {
					if (location === null) {
						window.location.hash = "";
					}
					setSelectedLocation(location);
				}}
				onAddLocation={onAddLocation}
				onDeleteLocation={onDeleteLocation}
				newLocation={newLocation}
				setNewLocation={setNewLocation}
			/>
			{selectedLocation ? (
				<LicensePlateInput
					onSubmit={onSubmitLicensePlate}
					licensePlateDistrict={licensePlateDistrict}
					setLicensePlateDistrict={setLicensePlateDistrict}
					licensePlateId={licensePlateId}
					setLicensePlateId={setLicensePlateId}
					className={licensePlateExtraClass}
				/>
			) : null}
			<div className="button-bar">
				<button
					type="button"
					onClick={() => navigate(`/room/${roomName}/evaluation`)}
				>
					Evaluation
				</button>
				<ShareRoomButton roomName={roomName} />
			</div>
		</>
	);
}
