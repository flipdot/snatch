import "./LocationSelector.css";
import { useState } from "react";

function LocationEntry({
	location,
	isSelected,
	onSelectLocation,
	onDeleteLocation,
}: {
	location: string;
	isSelected: boolean;
	onSelectLocation: (location: null | string) => void;
	onDeleteLocation: (location: string) => void;
}) {
	return (
		<li className={isSelected ? "selected" : ""}>
			<button
				type="button"
				onClick={() => onSelectLocation(isSelected ? null : location)}
			>
				{location}
			</button>
			<button
				type="button"
				className="action"
				onClick={() => onDeleteLocation(location)}
			>
				X
			</button>
		</li>
	);
}

export default function LocationSelector({
	locations,
	selectedLocation,
	onSelectLocation,
	onAddLocation,
	onDeleteLocation,
}: {
	locations: string[];
	selectedLocation: string | null;
	onSelectLocation: (location: null | string) => void;
	onAddLocation: (location: string) => void;
	onDeleteLocation: (location: string) => void;
}) {
	const [newLocation, setNewLocation] = useState("");

	return (
		<span className="location-selector">
			<ul>
				{locations.map((location) => (
					<LocationEntry
						key={location}
						location={location}
						isSelected={location === selectedLocation}
						onSelectLocation={onSelectLocation}
						onDeleteLocation={onDeleteLocation}
					/>
				))}
			</ul>
			<form
				onSubmit={(event) => {
					event.preventDefault();
					onAddLocation(newLocation.trim());
					// TODO: if onAddLocation is successful, clear the input
					// 	setNewLocation("");
				}}
				style={{ display: "flex" }}
			>
				<input
					type="text"
					placeholder="Add location"
					value={newLocation}
					style={{ flex: "1 1 auto" }}
					onChange={(event) => {
						setNewLocation(event.target.value);
					}}
					onSubmit={() => console.log("yo")}
				/>
				<button type="submit" className="action" disabled={!newLocation}>
					+
				</button>
			</form>
		</span>
	);
}
