/**
 * Componente TaskCard
 * Tarjeta individual de una tarea
 */

import React from 'react';
import { Edit2, Trash2, CheckCircle, Circle } from 'lucide-react';

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  /**
   * Determinar colores según prioridad
   */
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'baja':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * Determinar colores según estado
   */
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

  /**
   * Formatear fecha
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  /**
   * Verificar si la fecha está vencida
   */
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
      {/* Header con título y prioridad */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          {/* Botón de toggle status */}
          <button
            onClick={() => onToggleStatus(task.id)}
            className={`flex-shrink-0 mt-1 transition ${getStatusColor(task.status)} hover:opacity-80`}
            title={`Marcar como ${task.status === 'completada' ? 'pendiente' : 'completada'}`}
          >
            {task.status === 'completada' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>

          {/* Contenido */}
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

        {/* Botones de acción */}
        <div className="flex gap-2 ml-2 flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="text-blue-600 hover:text-blue-800 transition p-1"
            title="Editar tarea"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-600 hover:text-red-800 transition p-1"
            title="Eliminar tarea"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer con metadata */}
      <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
        {/* Prioridad */}
        <span className={`px-2 py-1 rounded border ${getPriorityColor(task.priority)}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>

        {/* Estado */}
        <span className="text-gray-600 capitalize">
          {task.status === 'en_progreso' ? 'En progreso' : task.status}
        </span>

        {/* Fecha límite */}
        <span
          className={`${overdue ? 'text-red-600 font-semibold' : 'text-gray-600'}`}
          title={overdue ? 'Tarea vencida' : undefined}
        >
          {overdue ? '⚠️ ' : ''}
          {formatDate(task.dueDate)}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
