import React, { useState, useEffect } from 'react';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthProvider';
import useApi from '../../../hook/apiHook';

const CreateQuestionBank = () => {
  const { user } = useAuth();
  const { request } = useApi();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    interview_id: '',
    questionBank_name: '',
    duration: '',
    difficulty_level: 'Intermediate',
    question_Type: 'Multiple Choice',
    description: '',
    what_to_exhibit: '',
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({
    interview_id: '',
    questionBank_name: '',
    duration: '',
    difficulty_level: '',
    question_Type: '',
    description: '',
    what_to_exhibit: '',
    file: '',
  });
  const [loading, setLoading] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [fetchingInterviews, setFetchingInterviews] = useState(true);

  // Fetch interviews for dropdown
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await request({
          endpoint: '/interview/get_mock_interview',
          method: 'GET',
          headers: { Authorization: user?.approvalToken },
        });
        if (res.ok) {
          const allInterviews = res.data.body.all_InterView || [];
          setInterviews(allInterviews);
        } else {
          toast.error(res.message || 'Failed to fetch interviews.');
        }
      } catch (err) {
        toast.error('Error fetching interviews.');
        console.error('Fetch interviews error:', err);
      } finally {
        setFetchingInterviews(false);
      }
    };

    if (user?.approvalToken) {
      fetchInterviews();
    } else {
      setFetchingInterviews(false);
    }
  }, [user?.approvalToken]);

  console.log("yooooooo+++++++++++++---------->", interviews);

  // Clean up preview URL
  useEffect(() => {
    console.log(previewUrl, "priview");
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
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
    let isValid = true;
    const newErrors = {
      interview_id: '',
      questionBank_name: '',
      duration: '',
      difficulty_level: '',
      question_Type: '',
      description: '',
      what_to_exhibit: '',
      file: '',
    };

    if (!formData.interview_id) {
      newErrors.interview_id = 'Please select an interview.';
      isValid = false;
    }
    if (!formData.questionBank_name.trim()) {
      newErrors.questionBank_name = 'Question bank name is required.';
      isValid = false;
    }
    const durationNum = parseInt(formData.duration);
    if (!formData.duration || isNaN(durationNum) || durationNum <= 0) {
      newErrors.duration = 'Valid duration (in minutes) is required.';
      isValid = false;
    }
    if (!formData.difficulty_level) {
      newErrors.difficulty_level = 'Difficulty level is required.';
      isValid = false;
    }
    if (!formData.question_Type) {
      newErrors.question_Type = 'Question type is required.';
      isValid = false;
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required.';
      isValid = false;
    }
    if (!formData.what_to_exhibit.trim()) {
      newErrors.what_to_exhibit = 'What to expect is required.';
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
      toast.error('You must be logged in to create a question bank.');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    if (!validateForm()) {
      return;
    }

    const data = new FormData();
    const jsonData = {
      interview_id: formData.interview_id,
      questionBank_name: formData.questionBank_name,
      duration: parseInt(formData.duration),
      difficulty_level: formData.difficulty_level,
      question_Type: formData.question_Type,
      description: formData.description,
      what_to_exhibit: formData.what_to_exhibit
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item),
    };
    data.append('data', JSON.stringify(jsonData));
    if (file) {
      data.append('img', file); // Use 'img' as per requirement
    }

    // Debug FormData
    for (let [key, value] of data.entries()) {
      console.log(`FormData: ${key} =`, value);
    }

    setLoading(true);
    try {
      const res = await request({
        endpoint: '/interview/create_question_bank',
        method: 'POST',
        body: data,
        headers: {
          Authorization: user.approvalToken,
        },
      });

      if (res.ok) {
        toast.success('Question bank created successfully!');
        setFormData({
          interview_id: '',
          questionBank_name: '',
          duration: '',
          difficulty_level: 'Intermediate',
          question_Type: 'Multiple Choice',
          description: '',
          what_to_exhibit: '',
        });
        setFile(null);
        setPreviewUrl(null);
      } else {
        console.log('API response:', res);
        toast.error(res.message || 'Failed to create question bank.', {
          description: res.data?.error || 'Check the form data and try again.',
        });
      }
    } catch (err) {
      console.error('Create question bank error:', err);
      toast.error('Error creating question bank.', {
        description: err.message || 'Network error.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1444px] mx-auto mt-20 mb-20 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">Create Question Bank</h2>
      <div className="p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image File */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Image File</label>
            <div
              className="w-[300px] h-[200px] border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer relative overflow-hidden"
              onClick={() => document.getElementById('fileInput').click()}
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
                id="fileInput"
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

          {/* Interview Dropdown */}
          <div>
            <label className="block text-gray-700 font-medium">Select Interview</label>
            <select
              name="interview_id"
              value={formData.interview_id}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-black focus:ring-[#37B74]"
              disabled={fetchingInterviews || !interviews.length}
            >
              <option value="">Select an interview</option>
              {interviews.map((interview) => (
                <option key={interview._id} value={interview._id}>
                  {interview.interview_name}
                </option>
              ))}
            </select>
            {errors.interview_id && (
              <p className="text-sm mt-1 italic text-red-600">{errors.interview_id}</p>
            )}
            {interviews.length === 0 && !fetchingInterviews && (
              <p className="text-sm mt-1 italic text-gray-600">No interviews available.</p>
            )}
          </div>

          {/* Question Bank Name */}
          <div>
            <label className="block text-gray-700 font-medium">Question Bank Name</label>
            <input
              type="text"
              name="questionBank_name"
              value={formData.questionBank_name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-black focus:ring-[#37B74]"
              placeholder="e.g., Css fall"
            />
            {errors.questionBank_name && (
              <p className="text-sm mt-1 italic text-red-600">{errors.questionBank_name}</p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-gray-700 font-medium">Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-black focus:ring-[#37B74]"
              placeholder="e.g., 45"
              min="1"
            />
            {errors.duration && (
              <p className="text-sm mt-1 italic text-red-600">{errors.duration}</p>
            )}
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-gray-700 font-medium">Difficulty Level</label>
            <select
              name="difficulty_level"
              value={formData.difficulty_level}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-black focus:ring-[#37B74]"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            {errors.difficulty_level && (
              <p className="text-sm mt-1 italic text-red-600">{errors.difficulty_level}</p>
            )}
          </div>

          {/* Question Type */}
          <div>
            <label className="block text-gray-700 font-medium">Question Type</label>
            <select
              name="question_Type"
              value={formData.question_Type}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-black focus:ring-[#37B74]"
            >
              <option value="Multiple Choice">Multiple Choice</option>
              <option value="Coding">Coding</option>
              <option value="Open-Ended">Open-Ended</option>
            </select>
            {errors.question_Type && (
              <p className="text-sm mt-1 italic text-red-600">{errors.question_Type}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-black focus:ring-[#37B74]"
              placeholder="e.g., This question bank includes HTML, CSS, and JS questions."
              rows={4}
            />
            {errors.description && (
              <p className="text-sm mt-1 italic text-red-600">{errors.description}</p>
            )}
          </div>

          {/* What to Expect */}
          <div>
            <label className="block text-gray-700 font-medium">What to Expect (comma-separated)</label>
            <textarea
              name="what_to_exhibit"
              value={formData.what_to_exhibit}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-black focus:ring-[#37B74]"
              placeholder="e.g., HTML fundamentals, CSS Flex/Grid, JavaScript variables and functions"
              rows={3}
            />
            {errors.what_to_exhibit && (
              <p className="text-sm mt-1 italic text-red-600">{errors.what_to_exhibit}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center w-full flex justify-center items-center">
            <button
              type="submit"
              disabled={loading || fetchingInterviews}
              className="flex items-center justify-center gap-2 px-6 py-2 text-white bg-[#37B874] rounded-lg hover:bg-[#2e9b64] transition-colors disabled:opacity-50"
            >
              {loading ? <LoaderCircle className="animate-spin w-4 h-4" /> : null}
              Create Question Bank
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuestionBank;