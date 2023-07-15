import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface HistogramEntry {
	duration: number;
	number_of_items: number;
}

interface Histogram {
	min: HistogramEntry;
	p25: HistogramEntry;
	p50: HistogramEntry;
	p75: HistogramEntry;
	p90: HistogramEntry;
	p95: HistogramEntry;
	p99: HistogramEntry;
	max: HistogramEntry;
}

interface EvaluationItem {
	from_location: string;
	to_location: string;
	mean: number;
	histogram: Histogram;
}

function Section({ evaluation }: { evaluation: EvaluationItem }) {
	return (
		<div>
			<h3>
				{evaluation.from_location} -&gt; {evaluation.to_location}
			</h3>
			<ul>
				<li>Mean duration: {evaluation.mean}s</li>
				<li>Fastest car: {evaluation.histogram.min.duration}s</li>
				<li>
					{evaluation.histogram.p25.number_of_items} cars in{" "}
					{evaluation.histogram.p25.duration}s or less (25%)
				</li>
				<li>
					{evaluation.histogram.p50.number_of_items} cars in{" "}
					{evaluation.histogram.p50.duration}s or less (50%)
				</li>
				<li>
					{evaluation.histogram.p75.number_of_items} cars in{" "}
					{evaluation.histogram.p75.duration}s or less (75%)
				</li>
				<li>
					{evaluation.histogram.p90.number_of_items} cars in{" "}
					{evaluation.histogram.p90.duration}s or less (90%)
				</li>
				<li>
					{evaluation.histogram.p95.number_of_items} cars in{" "}
					{evaluation.histogram.p95.duration}s or less (95%)
				</li>
				<li>
					{evaluation.histogram.p99.number_of_items} cars in{" "}
					{evaluation.histogram.p99.duration}s or less (99%)
				</li>
				<li>Slowest car: {evaluation.histogram.max.duration}s</li>
			</ul>
		</div>
	);
}

export default function Evaluation() {
	const { roomName } = useParams();
	const navigate = useNavigate();
	const [evaluationCollection, setEvaluationCollection] = useState<
		EvaluationItem[]
	>([]);

	useEffect(() => {
		fetch(`${import.meta.env.VITE_API_URL}/room/${roomName}/evaluation/`, {
			signal: AbortSignal.timeout(5000),
		})
			.then((response) => response.json())
			.then((data) => {
				setEvaluationCollection(data);
			})
			.catch((error) => {
				toast.error(
					`Failed to fetch evaluation from ${import.meta.env.VITE_API_URL}: ${
						error.message
					}`,
				);
				console.error(error);
			});
	}, []);

	return (
		<>
			<h1>Evaluation</h1>
			{evaluationCollection.map((evaluation) => (
				<Section
					key={evaluation.from_location + evaluation.to_location}
					evaluation={evaluation}
				/>
			))}
			<button type="button" onClick={() => navigate(`/room/${roomName}`)}>
				Back
			</button>
		</>
	);
}
