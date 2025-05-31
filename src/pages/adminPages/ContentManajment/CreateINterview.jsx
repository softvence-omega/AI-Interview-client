import React, { useState, useEffect, useRef } from 'react'; // Add useRef
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthProvider';
import useApi from '../../../hook/apiHook';

const CreateInterview = () => {
  const { user } = useAuth();
  const { request } = useApi();
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Create a ref for the file input

  const [formData, setFormData] = useState({
    interview_name: '',
    description: '',
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({
    interview_name: '',
    description: '',
    file: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value ?? '' }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && !['image/jpeg', 'image/png'].includes(selectedFile.type)) {
      setErrors((prev) => ({ ...prev, file: 'Only JPEG or PNG files are allowed.' }));
      setFile(null);
      setPreviewUrl(null);
    } else if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, file: 'File size must be under 5MB.' }));
      setFile(null);
      setPreviewUrl(null);
    } else {
      setFile(selectedFile);
      setErrors((prev) => ({ ...prev, file: '' }));
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const validateForm = () => {
    const newErrors = { interview_name: '', description: '', file: '' };
    let isValid = true;

    if (!formData.interview_name.trim()) {
      newErrors.interview_name = 'Interview name is required.';
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required.';
      isValid = false;
    }

    if (!file) {
      newErrors.file = 'An image file is required.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.approvalToken) {
      toast.error('You must be logged in to create an interview.');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    if (!validateForm()) return;

    const data = new FormData();
    const jsonData = {
      interview_name: formData.interview_name,
      description: formData.description,
      user_id: user.user_id,
    };

    data.append('data', JSON.stringify(jsonData));
    data.append('file', file);

    setLoading(true);

    try {
      const res = await request({
        endpoint: '/interview/create_mock_interview',
        method: 'POST',
        body: data,
        headers: {
          Authorization: user.approvalToken,
        },
      });

      if (res.ok) {
        toast.success('Interview created successfully!');
        setFormData({ interview_name: '', description: '' });
        setFile(null);
        setPreviewUrl(null);
      } else {
        toast.error(res.message || 'Failed to create interview.', {
          description: res.data?.error || 'Check the form and try again.',
        });
      }
    } catch (err) {
      console.error('Create interview error:', err);
      toast.error('Error creating interview.', {
        description: err.message || 'Something went wrong.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1444px] mx-auto mt-20 mb-20 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">Create Interview</h2>
      <div className="p-6 rounded-lg shadow-md bg-white">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Image File</label>
            <div
              className="w-[300px] h-[200px] border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer relative overflow-hidden"
              onClick={() => fileInputRef.current.click()} // Use ref instead of getElementById
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Interview preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-gray-500">Click to upload image</span>
              )}
              <input
                ref={fileInputRef} // Attach ref
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {errors.file && (
              <p className="text-sm mt-1 italic text-red-600">{errors.file}</p>
            )}
          </div>

          {/* Interview Name */}
          <div>
            <label className="block text-gray-700 font-medium">Interview Name</label>
            <input
              type="text"
              name="interview_name"
              value={formData.interview_name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-black focus:ring-[#37B874]"
              placeholder="e.g., Software Developer 5x"
            />
            {errors.interview_name && (
              <p className="text-sm mt-1 italic text-red-600">{errors.interview_name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-black focus:ring-[#37B874]"
              placeholder="e.g., A mock interview for software developer candidates."
              rows={4}
            />
            {errors.description && (
              <p className="text-sm mt-1 italic text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-2 text-white bg-[#37B874] rounded-lg hover:bg-[#2e9b64] transition-colors disabled:opacity-50"
            >
              {loading && <LoaderCircle className="animate-spin w-4 h-4" />}
              Create Interview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInterview;