import { useState } from "react";
import ProjectList from "./ProjectList";
import ProjectDetail from "./ProjectDetail";
import "./Projects.css";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/api";

function Projects() {
	const {
		data:projects,
	}=useQuery({
		queryKey:["projects"],
		queryFn:api.projects.getAll
	})
	const [selectedProject, setSelectedProject] = useState(null);
	const [filter, setFilter] = useState("all");

	const handleProjectClick = (project) => {
		setSelectedProject(project);
	};

	const handleBackToProjects = () => {
		setSelectedProject(null);
	};

	const addProject = (project) => {
		setProjects((currentProjects) => [...currentProjects, project]);
	};

	const toggleTodo = (todoId) => {
		const updatedProjects = projects?.map((proj) => {
			if (proj.id === selectedProject.id) {
				const updatedTodos = proj.todos.map((todo) =>
					todo.id === todoId
						? { ...todo, completed: !todo.completed }
						: todo,
				);
				return { ...proj, todos: updatedTodos };
			}
			return proj;
		});
		setProjects(updatedProjects);
		setSelectedProject(
			updatedProjects.find((p) => p.id === selectedProject.id),
		);
	};

	const deleteTodo = (todoId) => {
		const updatedProjects = projects.map((proj) => {
			if (proj.id === selectedProject.id) {
				const updatedTodos = proj.todos.filter(
					(todo) => todo.id !== todoId,
				);
				return { ...proj, todos: updatedTodos };
			}
			return proj;
		});
		setProjects(updatedProjects);
		setSelectedProject(
			updatedProjects.find((p) => p.id === selectedProject.id),
		);
	};

	const addTodo = (newTodo) => {
		const updatedProjects = projects.map((proj) => {
			if (proj.id === selectedProject.id) {
				return { ...proj, todos: [...proj.todos, newTodo] };
			}
			return proj;
		});

		setProjects(updatedProjects);
		setSelectedProject(
			updatedProjects.find((p) => p.id === selectedProject.id),
		);
	};

	// Project Cards View
	if (!selectedProject) {
		return (
			<ProjectList
				projects={projects}
				onProjectClick={handleProjectClick}
				filter={filter}
				onFilterChange={setFilter}
				onAddProject={addProject}
			/>
		);
	}

	// Project Detail View
	const selectedProjectData = projects.find(
		(p) => p.id === selectedProject.id,
	);

	return (
		<ProjectDetail
			project={selectedProjectData}
			onBack={handleBackToProjects}
			onToggleTodo={toggleTodo}
			onDeleteTodo={deleteTodo}
			onAddTodo={addTodo}
		/>
	);
}

export default Projects;
