import { CircleAlert, TriangleAlert } from "lucide-react";

const ErrorMessage = ({ error,className,onTransitionEnd,id }) => {
	if (!error) return null;

	return (
		<div
            id={id}
            onTransitionEnd={onTransitionEnd}
            className={`alert alert-danger ${className || ""}`}
		>
			<TriangleAlert className="flex-shrink-0 me-2" />
			{error.message}
		</div>
	);
};

export default ErrorMessage;
