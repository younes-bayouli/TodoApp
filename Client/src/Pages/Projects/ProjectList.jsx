import { useEffect } from "react";
import { useAppContext } from "../../Context";
import useData from "../../Utils/useData";
import ProjectCard from "./ProjectCard";

const projectFields = {
	name: {
		type: "text",
		label: "Title",
		placeholder: "Enter task title",
		size: "full",
	},

	description: {
		type: "textarea",
		label: "Description",
		placeholder: "Enter task details...",
		size: "full",
	},

	deadline: {
		type: "date",
		label: "Deadline",
		placeholder: "",
		size: "half",
	},

	color: {
		type: "color",
		label: "Color",
		size: "small",
	},
	owner: {
		type: "text",
		label: "Project Owner",
		placeholder: "Younes Bayouli",
		size: "full",
	},
};
const nullProject = {
	name: "",
	description: "",
	deadline: "",
	color: "#0d6efd",
	owner: "",
	todos: [],
};

const validateForm = (project) => {
	const newErrors = {};
	if (!project?.name?.trim()) {
		newErrors.projectName = "Project name is required";
	} else if (!project?.owner?.trim()) {
		newErrors.projectOwner = "Project owner is required";
	}
	return newErrors;
};
function ProjectList({ projects, onClick }) {
	const { create } = useData("projects");
	const { openModal, configModal } = useAppContext();
	useEffect(() => {
		configModal({
			modalName: "projects",
			modalObject: nullProject,
			config: projectFields,
			validate: validateForm,
			onSubmit:create,
		});
	}, []);
	return (
		<div>
			<div className="row g-4">
				{projects?.map((project) => (
					<div className="col-12 col-md-6 col-lg-4" key={project.id}>
						<ProjectCard
							project={project}
							onClick={onClick}
							isSelected={false}
						/>
					</div>
				))}
				<div className="col-12 col-md-6 col-lg-4">
					<button
						type="button"
						className="card h-100 w-100 project-card add-project-card"
						onClick={openModal}
					>
						<span
							className="display-4 text-primary"
							aria-hidden="true"
						>
							+
						</span>
					</button>
				</div>
			</div>
		</div>
	);
}

export default ProjectList;
