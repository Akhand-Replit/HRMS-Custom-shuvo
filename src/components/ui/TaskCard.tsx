// src/components/ui/TaskCard.tsx
import React from "react";
import { format } from "date-fns";
import StatusIndicator from "./StatusIndicator";

interface TaskCardProps {
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  assignedDate: string | Date;
  status: "completed" | "pending" | "in-progress";
  dueDate?: string | Date;
  completionPercentage?: number;
  onView?: () => void;
  onEdit?: () => void;
  onComplete?: () => void;
  className?: string;
}

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  description,
  assignedTo,
  assignedBy,
  assignedDate,
  status,
  dueDate,
  completionPercentage,
  onView,
  onEdit,
  onComplete,
  className = "",
}) => {
  const formattedAssignedDate =
    assignedDate instanceof Date
      ? format(assignedDate, "MMM d, yyyy")
      : format(new Date(assignedDate), "MMM d, yyyy");

  const formattedDueDate = dueDate
    ? dueDate instanceof Date
      ? format(dueDate, "MMM d, yyyy")
      : format(new Date(dueDate), "MMM d, yyyy")
    : null;

  return (
    <div
      className={`bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden ${className}`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <StatusIndicator status={status} />
        </div>

        <p className="text-sm text-gray-700 mb-4">{description}</p>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
          <div>
            <span className="font-medium">Assigned to:</span> {assignedTo}
          </div>
          <div>
            <span className="font-medium">Assigned by:</span> {assignedBy}
          </div>
          <div>
            <span className="font-medium">Assigned date:</span>{" "}
            {formattedAssignedDate}
          </div>
          {formattedDueDate && (
            <div>
              <span className="font-medium">Due date:</span> {formattedDueDate}
            </div>
          )}
        </div>

        {typeof completionPercentage === "number" && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          {onView && (
            <button
              onClick={onView}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded"
            >
              View
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded"
            >
              Edit
            </button>
          )}
          {onComplete && status !== "completed" && (
            <button
              onClick={onComplete}
              className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded"
            >
              Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
