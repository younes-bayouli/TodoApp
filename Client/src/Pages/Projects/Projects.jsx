import { useState } from "react";
import ProjectList from "./ProjectList";
import ProjectDetail from "./ProjectDetail";
import "./Projects.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api";

function Projects() {
	const queryClient = useQueryClient();
	const { data: projects } = useQuery({
		queryKey: ["projects"],
		queryFn: api.projects.getAll,
	});
	const createProjectMutation = useMutation({
		mutationFn: (project) => api.projects.create(project),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["projects"] });
		},
	});
	const updateProjectMutation = useMutation({
		mutationFn: ({ projectId, projectData }) =>
			api.projects.update(projectId, projectData),
		onSuccess: (updatedProject) => {
			queryClient.invalidateQueries({ queryKey: ["projects"] });
			setSelectedProject(updatedProject);
		},
	});
	const deleteProjectMutation = useMutation({
		mutationFn: (projectId) => api.projects.delete(projectId),
		onSuccess: () => {
			console.log("Project deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["projects"] });
			setSelectedProject(null);
		},
	});
	const [selectedProject, setSelectedProject] = useState(null);
	const [filter, setFilter] = useState("all");

	const handleProjectClick = (project) => {
		setSelectedProject(project);
	};

	const handleBackToProjects = () => {
		setSelectedProject(null);
	};

	const addProject = (project) => {
		createProjectMutation.mutate(project);
	};

	const toggleTodo = (todoId) => {
		if (!selectedProject || !projects) return;
		const project = projects.find((proj) => proj.id === selectedProject.id);
		if (!project) return;

		const updatedTodos = project.todos.map((todo) =>
			todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
		);

		updateProjectMutation.mutate({
			projectId: project.id,
			projectData: {
				...project,
				todos: updatedTodos,
			},
		});
	};

	const deleteTodo = (todoId) => {
		if (!selectedProject || !projects) return;
		const project = projects.find((proj) => proj.id === selectedProject.id);
		if (!project) return;

		const updatedTodos = project.todos.filter((todo) => todo.id !== todoId);

		updateProjectMutation.mutate({
			projectId: project.id,
			projectData: {
				...project,
				todos: updatedTodos,
			},
		});
	};

	const deleteProject = (projectId) => {
		if (!projectId) return;
		deleteProjectMutation.mutate(projectId);
	};

	const addTodo = (newTodo) => {
		if (!selectedProject || !projects) return;
		const project = projects.find((proj) => proj.id === selectedProject.id);
		if (!project) return;

		updateProjectMutation.mutate({
			projectId: project.id,
			projectData: {
				...project,
				todos: [...(project.todos ?? []), newTodo],
			},
		});
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
			onDeleteProject={deleteProject}
		/>
	);
}

export default Projects;
