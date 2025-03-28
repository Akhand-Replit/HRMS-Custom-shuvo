// src/components/ui/NotificationBanner.tsx
import React, { useState, useEffect } from "react";

type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationBannerProps {
  type: NotificationType;
  message: string;
  isVisible: boolean;
  onDismiss?: () => void;
  autoHideDuration?: number | null;
  className?: string;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  type,
  message,
  isVisible,
  onDismiss,
  autoHideDuration = 5000,
  className = "",
}) => {
  const [isShown, setIsShown] = useState(isVisible);

  useEffect(() => {
    setIsShown(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (isShown && autoHideDuration !== null) {
      const timer = setTimeout(() => {
        setIsShown(false);
        if (onDismiss) onDismiss();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [isShown, autoHideDuration, onDismiss]);

  if (!isShown) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50 text-green-800 border-green-400";
      case "error":
        return "bg-red-50 text-red-800 border-red-400";
      case "warning":
        return "bg-yellow-50 text-yellow-800 border-yellow-400";
      case "info":
        return "bg-blue-50 text-blue-800 border-blue-400";
      default:
        return "bg-gray-50 text-gray-800 border-gray-400";
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✗";
      case "warning":
        return "⚠";
      case "info":
        return "ℹ";
      default:
        return "";
    }
  };

  return (
    <div
      className={`rounded-md border px-4 py-3 ${getTypeStyles()} ${className}`}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <span className="text-lg mr-2">{getTypeIcon()}</span>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm">{message}</p>
        </div>
        {onDismiss && (
          <div className="pl-3">
            <button
              type="button"
              className="inline-flex rounded-md bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={() => {
                setIsShown(false);
                onDismiss();
              }}
            >
              <span className="sr-only">Dismiss</span>
              <span className="text-lg">×</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationBanner;
