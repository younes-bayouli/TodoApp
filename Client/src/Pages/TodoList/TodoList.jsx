import { useState } from "react";
import useData from "../../Utils/useData.js";
import useModal from "../../hooks/useModal.jsx";
import PageHeader from "../../Components/Composite/PageHeader.jsx";
import EmptyState from "../../Components/Composite/EmptyState.jsx";
import Todo from "../../Components/Composite/Todo.jsx";
import QuickAddForm from "../../Components/Composite/QuickAddForm.jsx";
import FilterTabs from "../../Components/Composite/FilterTabs.jsx";
import "../../styles/todolist.css";

const filters = ["All", "Open", "Completed"];
const priorityOrder = { high: 0, medium: 1, low: 2 };

const todoFields = {
	title: {
		type: "text",
		label: "Title",
		placeholder: "Enter todo title",
		size: "full",
	},

	details: {
		type: "textarea",
		label: "Details",
		placeholder: "Enter todo details...",
		size: "full",
	},

	priority: {
		type: "select",
		label: "Priority",
		size: "small",
		options: [
			{ value: "high", label: "High" },
			{ value: "medium", label: "Medium" },
			{ value: "low", label: "Low" },
		],
	},
};

const validateForm = (todo) => {
	const newErrors = {};
	if (!todo?.title?.trim()) {
		newErrors.title = "todo title is required";
	}
	return newErrors;
};

function TodoList() {
	const {
		data: tasks,
		create: addTaskMutation,
		update: updateTaskMutation,
		remove: deleteTaskMutation,
	} = useData("todos");
	const { Modal, openModal } = useModal({
		name: "Todo",
		modalFields: todoFields,
		validate: validateForm,
	});
	const [filter, setFilter] = useState("All");

	const visibleTasks = tasks
		?.filter((task) => {
			if (filter === "Open") return !task.completed;
			if (filter === "Completed") return task.completed;
			return true;
		})
		.sort((firstTask, secondTask) => {
			if (firstTask.completed !== secondTask.completed) {
				return (
					Number(firstTask.completed) - Number(secondTask.completed)
				);
			}

			return (
				priorityOrder[firstTask.priority] -
				priorityOrder[secondTask.priority]
			);
		});

	const openCount = tasks?.filter((task) => !task.completed).length;

	const addTask = ({ title, priority }) => {
		addTaskMutation.mutate({
			Data: {
				title,
				details: "",
				priority,
				completed: false,
			},
		});
	};

	const toggleTask = (taskId) => {
		const task = tasks?.find((item) => item.id === taskId);
		if (!task) return;

		updateTaskMutation.mutate({
			Id: taskId,
			Data: {
				...task,
				completed: !task.completed,
			},
		});
	};

	const removeTask = (taskId) => {
		deleteTaskMutation.mutate(taskId);
	};

	return (
		// The list is the only part that scrolls, so it takes the
		// remaining height and its own overflow.
		<div className="page tasks-page flex-grow-1 min-h-0 d-flex flex-column">
			<PageHeader title="Tasks" className="under-line">{`${openCount} open`}</PageHeader>

			<QuickAddForm
				onSubmit={({ title, priority }) => addTask({ title, priority })}
			/>
			<FilterTabs options={filters} value={filter} onChange={setFilter} />

			<div className="tasks-page-list d-flex flex-column gap-2 overflow-y-auto min-h-0">
				{visibleTasks?.length ? (
					visibleTasks.map((task) => (
						<Todo
							key={task.id}
							todo={task}
							onToggle={toggleTask}
							onRemove={removeTask}
							onEdit={(task) =>
								openModal({
									object: task,
									mutation: updateTaskMutation,
								})
							}
						/>
					))
				) : (
					<EmptyState
						description="Nothing here — add a task above."
					/>
				)}
			</div>
			{Modal}
		</div>
	);
}

export default TodoList;
