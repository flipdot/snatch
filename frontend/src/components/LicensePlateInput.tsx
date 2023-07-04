import "./LicensePlateInput.css";
import { useState } from "react";

export default function LicensePlateInput({
	onSubmit,
}: {
	onSubmit: (licensePlate: string) => void;
}) {
	const [licensePlateDistrict, setLicensePlateDistrict] = useState("");
	const [licensePlateId, setLicensePlateId] = useState("");

	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				onSubmit(`${licensePlateDistrict}-${licensePlateId}`);
			}}
		>
			<div className="license-plate">
				<input
					id="license-plate-district"
					type="text"
					value={licensePlateDistrict}
					onChange={(event) =>
						setLicensePlateDistrict(event.target.value.toUpperCase())
					}
				/>
				<span>-</span>
				<input
					id="license-plate-id"
					type="text"
					value={licensePlateId}
					onChange={(event) =>
						setLicensePlateId(event.target.value.toUpperCase())
					}
				/>
			</div>
			<button type="submit">SNATCH</button>
		</form>
	);
}
