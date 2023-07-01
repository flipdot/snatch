import React from "react";
import ReactDOM from "react-dom/client";
import Index from "./pages/Index.tsx";
import "./main.css";
import "./colors.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import JoinRoom from "./pages/JoinRoom";
import Room from "./pages/Room";
import NavBar from "./components/NavBar";
import Modal from "react-modal";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<Toaster />
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<NavBar />}>
					<Route path="" element={<Index />} />
					<Route path="/join" element={<JoinRoom />} />
					<Route path="room/:roomName" element={<Room />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</React.StrictMode>,
);

Modal.setAppElement("#root");
