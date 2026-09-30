/**
 * Row of mutually-exclusive filter tabs.
 *
 * Exists because TodoList and Projects each had the same
 * <ul><li><button> row with a different active class. The active
 * styling lives here so both pages cannot drift apart.
 */
function FilterTabs({ options, value, onChange, className = "" }) {
	return (
		<div className={`app-filter-tabs ${className}`}>
			{options.map((option) => {
				const key = typeof option === "string" ? option : option.value;
				const label =
					typeof option === "string" ? option : option.label;
				const isActive = key === value;

				return (
					<button
						key={key}
						type="button"
						className={isActive ? "active" : ""}
						aria-pressed={isActive}
						onClick={() => onChange(key)}
					>
						{label}
					</button>
				);
			})}
		</div>
	);
}

export default FilterTabs;
