import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useAuth } from "../../../../context/AuthProvider";

Modal.setAppElement("#root");

const EditPlanModal = ({ isOpen, onRequestClose, plan, onUpdated }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priceMonthly: 0,
    priceLabel: "",
    features: [],
  });

  useEffect(() => {
    if (plan) setFormData({ ...plan });
  }, [plan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (i, value) => {
    const updated = [...formData.features];
    updated[i] = value;
    setFormData((prev) => ({ ...prev, features: updated }));
  };

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }));
  };

  const removeFeature = (i) => {
    const updated = [...formData.features];
    updated.splice(i, 1);
    setFormData((prev) => ({ ...prev, features: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/v1/plan/update-plan/${plan._id}`,
        formData,
        {
          headers: {
            Authorization: `${user?.approvalToken}`,
          },
        }
      );
      onUpdated();
      onRequestClose();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Plan"
      className="bg-white text-black p-8 max-w-2xl mx-auto my-10 rounded-xl shadow-lg border border-[#37B874] max-h-[90vh] overflow-y-auto"
      overlayClassName="fixed inset-0 bg-white/10 backdrop-blur-sm flex justify-center items-start z-50 mx-2 md:mx-0 lg:mx-0"
    >
      <h2 className="text-2xl text-center font-semibold mb-6 text-[#37B874]">Edit Plan</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border border-[#37B874] p-3 w-full rounded-md"
          placeholder="Plan Name"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border border-[#37B874] p-3 w-full rounded-md"
          placeholder="Description"
        />
        <input
          name="priceMonthly"
          type="number"
          value={formData.priceMonthly}
          onChange={handleChange}
          className="border border-[#37B874] p-3 w-full rounded-md"
          placeholder="Monthly Price"
        />
        <input
          name="priceLabel"
          value={formData.priceLabel}
          onChange={handleChange}
          className="border border-[#37B874] p-3 w-full rounded-md"
          placeholder="Price Label"
        />

        <div>
          <label className="font-semibold text-[#37B874] mb-2 block">Features</label>
          {formData.features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <input
                value={feature}
                onChange={(e) => handleFeatureChange(i, e.target.value)}
                className="border border-[#37B874] p-2 w-full rounded-md"
                placeholder={`Feature ${i + 1}`}
              />
              <button type="button" onClick={() => removeFeature(i)} className="text-red-600">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addFeature}
            className="bg-[#37B874] text-white px-3 py-1 rounded-md hover:bg-[#2e9d64] mt-3"
          >
            + Add Feature
          </button>
        </div>

        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={onRequestClose}
            className="px-5 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-md bg-[#37B874] text-white hover:bg-[#2e9d64]"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditPlanModal;
