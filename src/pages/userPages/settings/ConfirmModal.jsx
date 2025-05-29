// components/ConfirmModal.jsx
import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, description }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 bg-opacity-50 text-black">
      <div className=" rounded-lg shadow-lg w-[90%] max-w-md p-6 text-center bg-white">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="mb-6">{description}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-orange-400 rounded-md hover:bg-orange-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;