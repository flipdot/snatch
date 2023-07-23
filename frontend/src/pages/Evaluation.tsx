import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "../components/highcharts.css";
import "./Evaluation.css";

interface HistogramEntry {
	min_duration: number;
	max_duration: number;
	number_of_items: number;
}

interface EvaluationItem {
	from_location: string;
	to_location: string;
	mean: number;
	histogram: HistogramEntry[];
}

function Section({ evaluation }: { evaluation: EvaluationItem }) {
	const data = evaluation.histogram.map((v) => [
		v.max_duration * 1000,
		v.number_of_items,
	]);
	const cumulativeData: typeof data = [];
	data.reduce(
		(previousValue, currentValue) => {
			const next = [currentValue[0], currentValue[1] + previousValue[1]];
			cumulativeData.push(next);
			return next;
		},
		[0, 0],
	);
	const chartOptions = {
		title: {
			text: `${evaluation.from_location} &lt;-&gt; ${evaluation.to_location}`,
		},
		series: [
			{
				data: data,
				type: "column",
				name: "Number of cars",
				yAxis: 0,
			},
			{
				data: cumulativeData,
				type: "column",
				name: "Number of cars (cumulative)",
				yAxis: 1,
			},
		],
		xAxis: {
			type: "datetime",
			dateTimeLabelFormats: {
				second: "%M:%S",
			},
		},
		yAxis: [
			{
				title: {
					text: "Number of cars",
				},
			},
			{
				title: {
					text: "Number of cars (cumulative)",
				},
				opposite: true,
			},
		],
		tooltip: {
			formatter(this: Highcharts.TooltipFormatterContextObject) {
				if (this.x === undefined) {
					return "";
				}
				const datestr = new Date(this.x).toISOString().substr(14, 5);
				let label = `<b>${this.y} cars</b><br />in ${datestr}`;
				if (this.series.name === "Number of cars (cumulative)") {
					label += " or less";
				}
				return label;
			},
		},
		legend: false,
		chart: {
			styledMode: true,
		},
	};

	return (
		<div style={{ width: "100%" }}>
			<HighchartsReact highcharts={Highcharts} options={chartOptions} />
		</div>
	);
}

export default function Evaluation() {
	const { roomName } = useParams();
	const navigate = useNavigate();
	const [evaluationCollection, setEvaluationCollection] = useState<
		EvaluationItem[] | null
	>(null);
	const [loadingFailedMessage, setLoadingFailedMessage] = useState<
		string | null
	>(null);
	const [percentile, setPercentile] = useState(0.95);
	const [buckets, setBuckets] = useState(16);

	useEffect(() => {
		fetch(
			`${
				import.meta.env.VITE_API_URL
			}/room/${roomName}/evaluation/?percentile=${percentile || 0.95}&buckets=${
				buckets || 16
			}`,
			{
				signal: AbortSignal.timeout(5000),
			},
		)
			.then((response) => {
				if (!response.ok) {
					throw new Error(
						`HTTP error ${response.status}: ${response.statusText}`,
					);
				}
				return response.json();
			})
			.then((data) => {
				setEvaluationCollection(data);
			})
			.catch((error) => {
				setEvaluationCollection(null);
				setLoadingFailedMessage(error.message);
				console.error(error);
			});
	}, [percentile, buckets]);

	return (
		<>
			<h1>Evaluation</h1>
			<div className="evaluation-controls">
				<label>Percentile:</label>
				<button
					type="button"
					disabled={percentile <= 0.01}
					onClick={() => setPercentile(percentile - 0.01)}
				>
					-
				</button>
				<span className="setting">{percentile.toFixed(2)}</span>
				<button
					type="button"
					disabled={percentile >= 1}
					onClick={() => setPercentile(percentile + 0.01)}
				>
					+
				</button>
			</div>
			<div className="evaluation-controls">
				<label>Max buckets:</label>
				<button
					type="button"
					disabled={buckets <= 1}
					onClick={() => setBuckets(buckets - 1)}
				>
					-
				</button>
				<span className="setting">{buckets}</span>
				<button
					type="button"
					disabled={buckets >= 50}
					onClick={() => setBuckets(buckets + 1)}
				>
					+
				</button>
			</div>

			{evaluationCollection === null ? (
				loadingFailedMessage ? (
					<p className="error">{loadingFailedMessage}</p>
				) : (
					<p className="loading">Loading histogram…</p>
				)
			) : (
				evaluationCollection.map((evaluation) => (
					<Section
						key={evaluation.from_location + evaluation.to_location}
						evaluation={evaluation}
					/>
				))
			)}
			<button type="button" onClick={() => navigate(`/room/${roomName}`)}>
				Back
			</button>
		</>
	);
}
