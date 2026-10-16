import PageHeader from "../../Components/Composite/PageHeader.jsx";
import IconButton from "../../Components/Composite/IconButton.jsx";
import { useAppContext } from "../../Context.jsx";
import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { enableNotifications } from "../../Notifications/notifications.js";
import { unsubscribeFromPush } from "../../Notifications/push.js";

const REMINDERS_ENABLED_KEY = "reminders:enabled";
const PERMISSION_ATTEMPTED_KEY = "reminders:permissionAttempted";

export default function Settings() {
	const { settings, updateSettings, theme, toggleTheme, resetData } =
		useAppContext();
	const [secondSleepChoice, setSecondSleepChoice] = useState(null);
	const [remindersEnabled, setRemindersEnabled] = useState(
		() =>
			localStorage.getItem(REMINDERS_ENABLED_KEY) === "true" &&
			"Notification" in window &&
			Notification.permission === "granted",
	);
	const [isEnablingReminders, setIsEnablingReminders] = useState(false);
	const [reminderStatus, setReminderStatus] = useState("");
	const secondSleepEnabled =
		secondSleepChoice ?? settings?.secondSleepEnabled ?? false;
	const nextTheme = theme === "light" ? "dark" : "light";

	const handleRemindersChange = async (event) => {
		if (!event.target.checked) {
			setIsEnablingReminders(true);
			try {
				await unsubscribeFromPush();
				setRemindersEnabled(false);
				localStorage.setItem(REMINDERS_ENABLED_KEY, "false");
				setReminderStatus("");
			} catch {
				setReminderStatus("Reminders could not be disabled. Please try again.");
			} finally {
				setIsEnablingReminders(false);
			}
			return;
		}

		if (!("Notification" in window)) {
			setReminderStatus("Notifications are not supported in this browser.");
			return;
		}

		if (
			Notification.permission !== "granted" &&
			(Notification.permission === "denied" ||
				localStorage.getItem(PERMISSION_ATTEMPTED_KEY) === "true")
		) {
			setReminderStatus(
				"Permission was not granted. Enable notifications in your browser settings to try again.",
			);
			return;
		}

		setIsEnablingReminders(true);
		setReminderStatus("");
		try {
			const permission = await enableNotifications();
			if (permission === "granted") {
				setRemindersEnabled(true);
				localStorage.setItem(REMINDERS_ENABLED_KEY, "true");
				return;
			}

			setRemindersEnabled(false);
			localStorage.setItem(REMINDERS_ENABLED_KEY, "false");
			if (permission === "default" || permission === "denied") {
				localStorage.setItem(PERMISSION_ATTEMPTED_KEY, "true");
			}
			setReminderStatus(
				permission === "unsupported"
					? "Notifications are not supported in this browser."
					: "Permission was not granted. Enable notifications in your browser settings to try again.",
			);
		} catch {
			setRemindersEnabled(false);
			localStorage.setItem(REMINDERS_ENABLED_KEY, "false");
			setReminderStatus("Reminders could not be enabled. Please try again.");
		} finally {
			setIsEnablingReminders(false);
		}
	};

	const saveSettings = (event) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const hasSecondSleep = formData.get("secondSleepEnabled") === "on";
		updateSettings({
			...settings,
			sleepStart: formData.get("sleepStart"),
			sleepEnd: formData.get("sleepEnd"),
			secondSleepEnabled: hasSecondSleep,
			secondSleepStart: hasSecondSleep
				? formData.get("secondSleepStart")
				: null,
			secondSleepEnd: hasSecondSleep
				? formData.get("secondSleepEnd")
				: null,
		});
	};

	const confirmReset = () => {
		const confirmed = window.confirm(
			"This permanently deletes all todos, everyday tasks, projects, calendar events, photos, and sleep settings, and restores the light theme. This cannot be undone. Continue?",
		);
		if (confirmed) {
			setSecondSleepChoice(null);
			resetData();
		}
	};

	return (
		<main className="page settings-page">
			<PageHeader title="Settings" />
			{settings ? (
				<form className="settings-form" onSubmit={saveSettings}>
					<h3 className="settings-section-title">Sleep schedule</h3>
					<div className="settings-fields">
						<label className="settings-field">
							<span>Sleep time</span>
							<input
								type="time"
								name="sleepStart"
								defaultValue={settings.sleepStart ?? ""}
								required
							/>
						</label>
						<label className="settings-field">
							<span>Wake-up time</span>
							<input
								type="time"
								name="sleepEnd"
								defaultValue={settings.sleepEnd ?? ""}
								required
							/>
						</label>
					</div>
					<label className="settings-toggle">
						<input
							type="checkbox"
							name="secondSleepEnabled"
							checked={secondSleepEnabled}
							onChange={(event) =>
								setSecondSleepChoice(event.target.checked)
							}
						/>
						<span>Enable a second sleep segment</span>
					</label>
					{secondSleepEnabled && (
						<div className="settings-fields settings-second-sleep-fields">
							<label className="settings-field">
								<span>Second sleep time</span>
								<input
									type="time"
									name="secondSleepStart"
									defaultValue={
										settings.secondSleepStart ?? ""
									}
									required
								/>
							</label>
							<label className="settings-field">
								<span>Final wake-up time</span>
								<input
									type="time"
									name="secondSleepEnd"
									defaultValue={settings.secondSleepEnd ?? ""}
									required
								/>
							</label>
						</div>
					)}
					<div className="settings-form-actions">
						<button className="settings-save" type="submit">
							Save changes
						</button>
					</div>
				</form>
			) : (
				<p className="settings-loading" role="status">
					Loading settings...
				</p>
			)}
			<section
				className="settings-panel settings-reminders"
				aria-labelledby="settings-reminders-title"
			>
				<div>
					<h3
						className="settings-section-title"
						id="settings-reminders-title"
					>
						Notifications
					</h3>
					{reminderStatus && (
						<p className="settings-reminders-status" role="status">
							{reminderStatus}
						</p>
					)}
				</div>
				<label className="settings-reminders-toggle">
					<input
						type="checkbox"
						checked={remindersEnabled}
						disabled={isEnablingReminders}
						onChange={handleRemindersChange}
					/>
					<span>Get reminders for your tasks and events</span>
				</label>
			</section>
			<section
				className="settings-panel settings-appearance"
				aria-labelledby="settings-appearance-title"
			>
				<div>
					<h3
						className="settings-section-title"
						id="settings-appearance-title"
					>
						Appearance
					</h3>
					<p className="settings-appearance-description">
						Choose your preferred theme.
					</p>
				</div>
				<IconButton
					variant="secondary"
					ariaLabel={`Switch to ${nextTheme} theme`}
					title={`Switch to ${nextTheme} theme`}
					onClick={toggleTheme}
				>
					{theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
				</IconButton>
			</section>
			<section
				className="settings-panel settings-reset"
				aria-labelledby="settings-reset-title"
			>
				<div>
					<h3
						className="settings-section-title"
						id="settings-reset-title"
					>
						Reset data
					</h3>
					<p className="settings-reset-description">
						Permanently remove all app data and restore defaults.
					</p>
				</div>
				<button
					className="settings-reset-button"
					type="button"
					onClick={confirmReset}
				>
					Reset all data
				</button>
			</section>
		</main>
	);
}
