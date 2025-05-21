const Modal = ({ title, description, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white text-[#37B874] p-6 rounded-xl shadow-lg w-96 text-center relative">
          <h2 className="text-2xl font-bold mb-3">{title}</h2>
          <p className="text-gray-600">{description}</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-[#37B874] text-white rounded-lg font-medium"
          >
            Close
          </button>
        </div>
      </div>
    );
  };
  
  export default Modal;
  