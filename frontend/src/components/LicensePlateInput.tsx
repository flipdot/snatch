import "./LicensePlateInput.css";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LicensePlateInput({
	onSubmit,
}: {
	onSubmit: (licensePlate: string) => void;
}) {
	const [licensePlateDistrict, setLicensePlateDistrict] = useState("");
	const [licensePlateId, setLicensePlateId] = useState("");
	const [licensePlateError, setLicensePlateError] = useState(false);

	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				if (licensePlateDistrict.length < 1 || licensePlateId.length < 1) {
					toast.error("License plate must not be empty");
					setLicensePlateError(true);
				} else {
					const licensePlate = `${licensePlateDistrict.toUpperCase()}-${licensePlateId.toUpperCase()}`;
					onSubmit(licensePlate);
					setLicensePlateError(false);
				}
			}}
		>
			<div className={`${licensePlateError ? "error" : ""} license-plate`}>
				<input
					id="license-plate-district"
					type="text"
					value={licensePlateDistrict}
					onChange={(event) => {
						let value = event.target.value;
						// if value contains non-alphabetic characters, remove them
						// and move the cursor to the next input
						if (value.match(/[^A-ZÄÖÜ]/i) || value.length > 2) {
							value = value.replace(/[^A-ZÄÖÜ]/gi, "");
							document.getElementById("license-plate-id")?.focus();
						}
						setLicensePlateDistrict(value);
						setLicensePlateError(false);
					}}
				/>
				<span>-</span>
				<input
					id="license-plate-id"
					type="text"
					value={licensePlateId}
					onChange={(event) => {
						const value = event.target.value.replace(/[^0-9A-ZÄÖÜ]/gi, "");
						setLicensePlateId(value);
						setLicensePlateError(false);
					}}
					onKeyDown={(event) => {
						// if backspace is pressed and the input was already empty, move the cursor to the previous input
						if (event.key === "Backspace" && licensePlateId === "") {
							event.preventDefault();
							document.getElementById("license-plate-district")?.focus();
							// move the cursor to the end of the newly focused input
							const input = document.getElementById(
								"license-plate-district",
							) as HTMLInputElement;
							input.selectionStart = input.selectionEnd = input.value.length;
						}
					}}
				/>
			</div>
			<button type="submit">SNATCH</button>
		</form>
	);
}
