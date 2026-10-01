import Button from "../Basic/Button";

function FilterTabs({ options, value, onChange, className = "" }) {
	return (
		<div className={`app-filter-tabs ${className} m-3`}>
			{options.map((option) => {
				const key = typeof option === "string" ? option : option.value;
				const label =
					typeof option === "string" ? option : option.label;
				const isActive = key === value;

				return (
					<Button
						key={key}
						type="button"
						aria-pressed={isActive}
						onClick={() => onChange(key)}
						variant="secondary"
						active={isActive}
					>
						{label}
					</Button>
				);
			})}
		</div>
	);
}

export default FilterTabs;
