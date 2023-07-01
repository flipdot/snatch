import "./LocationSelector.css";
import { useState } from "react";

function LocationEntry({
	location,
	isSelected,
	onSelectLocation,
}: {
	location: string;
	isSelected: boolean;
	onSelectLocation: (location: string) => void;
}) {
	return (
		<li
			className={isSelected ? "selected" : ""}
			onClick={() => onSelectLocation(location)}
			onKeyDown={() => onSelectLocation(location)}
		>
			{location}
		</li>
	);
}

export default function LocationSelector({
	locations,
	selectedLocation,
	onSelectLocation,
	onAddLocation,
}: {
	locations: string[];
	selectedLocation: string | null;
	onSelectLocation: (location: string) => void;
	onAddLocation: (location: string) => void;
}) {
	const [newLocation, setNewLocation] = useState("");

	return (
		<>
			<ul className="location-selector">
				{locations.map((location) => (
					<LocationEntry
						key={location}
						location={location}
						isSelected={location === selectedLocation}
						onSelectLocation={onSelectLocation}
					/>
				))}
			</ul>
			<form
				onSubmit={(event) => {
					event.preventDefault();
					onAddLocation(newLocation)
					// TODO: if onAddLocation is successful, clear the input
					// 	setNewLocation("");
				}}
			>
				<input
					type="text"
					placeholder="Add location"
					value={newLocation}
					onChange={(event) => {
						setNewLocation(event.target.value);
					}}
					onSubmit={() => console.log("yo")}
				/>
				<button type="submit" disabled={!newLocation}>
					Add
				</button>
			</form>
		</>
	);
}
