import React from 'react';

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta':
        return 'bg-red-100 text-red-800';
      case 'media':
        return 'bg-yellow-100 text-yellow-800';
      case 'baja':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completada':
        return 'text-green-600';
      case 'en_progreso':
        return 'text-blue-600';
      case 'pendiente':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today && task.status !== 'completada';
  };

  const overdue = isOverdue(task.dueDate);

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-5 border-l-4 hover:shadow-lg transition duration-200 ${
        task.status === 'completada' ? 'border-l-green-500 opacity-75' : 'border-l-blue-500'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <button
            onClick={() => onToggleStatus(task.id)}
            className={`flex-shrink-0 mt-1 transition ${getStatusColor(task.status)} hover:opacity-80`}
          >
            {task.status === 'completada' ? '✓' : '○'}
          </button>

          <div className="flex-1 min-w-0">
            <h3
              className={`font-semibold text-gray-800 break-words ${
                task.status === 'completada' ? 'line-through text-gray-500' : ''
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2 ml-2 flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="text-blue-600 hover:text-blue-800 transition p-1"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-600 hover:text-red-800 transition p-1"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
        <span className={`px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>

        <span className="text-gray-600 capitalize">
          {task.status === 'en_progreso' ? 'En progreso' : task.status}
        </span>

        <span
          className={`${overdue ? 'text-red-600 font-semibold' : 'text-gray-600'}`}
        >
          {overdue ? '⚠️ ' : ''}
          {formatDate(task.dueDate)}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;