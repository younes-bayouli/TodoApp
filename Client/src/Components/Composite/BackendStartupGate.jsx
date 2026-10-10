import { useEffect, useState } from "react";
import { api } from "../../api/api.js";
import "./BackendStartupGate.css";

const STARTUP_SEEN_KEY = "backendStartupWelcomeSeen";

function isFirstLoadInSession() {
	try {
		return window.sessionStorage.getItem(STARTUP_SEEN_KEY) !== "true";
	} catch {
		return true;
	}
}

function markStartupSeen() {
	try {
		window.sessionStorage.setItem(STARTUP_SEEN_KEY, "true");
		return true;
	} catch {
		return false;
	}
}

export default function BackendStartupGate({ children }) {
	const [runStartupCheck] = useState(isFirstLoadInSession);
	const [backendReady, setBackendReady] = useState(!runStartupCheck);
	const [minimumWelcomeElapsed, setMinimumWelcomeElapsed] =
		useState(!runStartupCheck);
	const [welcomeExited, setWelcomeExited] = useState(!runStartupCheck);
	const [appEntered, setAppEntered] = useState(!runStartupCheck);

	useEffect(() => {
		if (!runStartupCheck) return;

		markStartupSeen();

		let active = true;
		let requestInProgress = false;
		const welcomeTimer = window.setTimeout(() => {
			if (active) setMinimumWelcomeElapsed(true);
		}, 3000);
		let intervalId;

		const checkBackend = async () => {
			if (requestInProgress) return;
			requestInProgress = true;

			try {
				await api.settings.get();
				if (active) {
					setBackendReady(true);
					window.clearInterval(intervalId);
				}
			} catch {
				// Keep the welcome screen visible and retry on the next interval.
			} finally {
				requestInProgress = false;
			}
		};

		intervalId = window.setInterval(checkBackend, 2000);
		void checkBackend();

		return () => {
			active = false;
			window.clearTimeout(welcomeTimer);
			window.clearInterval(intervalId);
		};
	}, [runStartupCheck]);

	useEffect(() => {
		if (!runStartupCheck || (welcomeExited && appEntered)) return;

		const root = window.document.documentElement;
		root.classList.add("startup-transition-active");

		return () => {
			root.classList.remove("startup-transition-active");
		};
	}, [runStartupCheck, welcomeExited, appEntered]);

	const finishWelcomeExit = (event) => {
		if (
			event.target === event.currentTarget &&
			event.animationName === "startup-welcome-exit"
		) {
			setWelcomeExited(true);
		}
	};
	const finishAppEntrance = (event) => {
		if (
			event.target === event.currentTarget &&
			event.animationName === "startup-app-enter"
		) {
			setAppEntered(true);
		}
	};

	if (runStartupCheck && (!backendReady || !minimumWelcomeElapsed)) {
		return (
			<main className="startup-welcome startup-welcome-enter">
				<h3>Welcome, Younes.</h3>
			</main>
		);
	}

	return (
		<>
			<div
				className={`startup-app${runStartupCheck ? " startup-app-enter" : ""}`}
				onAnimationEnd={finishAppEntrance}
			>
				{children}
			</div>
			{runStartupCheck && !welcomeExited && (
				<main
					className="startup-welcome startup-welcome-exit"
					onAnimationEnd={finishWelcomeExit}
				>
					<h3>Welcome, Younes.</h3>
				</main>
			)}
		</>
	);
}
