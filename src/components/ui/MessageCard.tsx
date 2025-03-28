// src/components/ui/MessageCard.tsx
import React from 'react';
import { format } from 'date-fns';

interface MessageCardProps {
  sender: string;
  senderRole?: string;
  senderAvatar?: string;
  content: string;
  timestamp: string | Date;
  attachment?: string;
  isRead?: boolean;
  onRead?: () => void;
  onReply?: () => void;
  onDelete?: () => void;
  className?: string;
}

const MessageCard: React.FC<MessageCardProps> = ({
  sender,
  senderRole,
  senderAvatar,
  content,
  timestamp,
  attachment,
  isRead = true,
  onRead,
  onReply,
  onDelete,
  className = '',
}) => {
  const formattedDate = timestamp instanceof Date
    ? format(timestamp, 'MMM d, yyyy h:mm a')
    : format(new Date(timestamp), 'MMM d, yyyy h:mm a');

  return (
    <div className={`bg-white shadow-sm rounded-lg border ${isRead ? 'border-gray-200' : 'border-blue-300'} overflow-hidden ${className}`}>
      <div className="p-4">
        <div className="flex items-start mb-2">
          <div className="flex-shrink-0 mr-3">
            {senderAvatar ? (
              <img
                src={senderAvatar}
                alt={sender}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
                {sender.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{sender}</h3>
                {senderRole && (
                  <p className="text-xs text-gray-500 capitalize">{senderRole}</p>
                )}
              </div>
              <span className="text-xs text-gray-500">{formattedDate}</span>
            </div>

            <div className="mt-2 text-sm text-gray-700 whitespace-pre-line">{content}</div>

            {attachment && (
              <div className="mt-2">

                  href={attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                >
                  <span className="mr-1">📎</span> Attachment
                </a>
              </div>
            )}
          </div>
        </div>

        {(onRead || onReply || onDelete) && (
          <div className="mt-3 flex justify-end space-x-2 text-xs">
            {!isRead && onRead && (
              <button
                onClick={onRead}
                className="text-blue-600 hover:text-blue-800"
              >
                Mark as read
              </button>
            )}
            {onReply && (
              <button
                onClick={onReply}
                className="text-gray-600 hover:text-gray-800"
              >
                Reply
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageCard;