import React from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Xác nhận',
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  confirmColor = 'red', // red, green, blue
  type = 'warning' // warning, success, info
}) => {
  if (!isOpen) return null;

  const colorClasses = {
    red: {
      bg: 'bg-red-600 hover:bg-red-700',
      icon: 'bg-red-100 text-red-600',
    },
    green: {
      bg: 'bg-green-600 hover:bg-green-700',
      icon: 'bg-green-100 text-green-600',
    },
    blue: {
      bg: 'bg-blue-600 hover:bg-blue-700',
      icon: 'bg-blue-100 text-blue-600',
    }
  };

  const typeIcons = {
    warning: AlertTriangle,
    success: CheckCircle,
    info: Info
  };

  const Icon = typeIcons[type];
  const colors = colorClasses[confirmColor];

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl animate-slideUp">
        {/* Header with Icon */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-12 h-12 rounded-full ${colors.icon} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2.5 ${colors.bg} text-white rounded-lg transition-colors font-medium`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
