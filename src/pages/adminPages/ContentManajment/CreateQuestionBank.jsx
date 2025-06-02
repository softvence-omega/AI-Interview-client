import React, { useState, useEffect, useRef } from 'react';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthProvider';
import useApi from '../../../hook/apiHook';

const CreateQuestionBank = ({ interviewUploadReload, setInterviwUploadReload }) => {
  const { user } = useAuth();
  const { request } = useApi();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    interview_id: '',
    questionBank_name: '',
    duration: '',
    difficulty_level: 'Intermediate',
    question_Type: 'Multiple Choice',
    description: '',
    what_to_expect: [], // Store as array
  });
  const [whatToExpectInput, setWhatToExpectInput] = useState(''); // Store raw input string
  const [file, setFile] = useState(null);
  const [previewUrlQB, setPreviewUrlQB] = useState(null);
  const [errors, setErrors] = useState({
    interview_id: '',
    questionBank_name: '',
    duration: '',
    difficulty_level: '',
    question_Type: '',
    description: '',
    what_to_expect: '',
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
      setInterviwUploadReload(false);
    } else {
      setFetchingInterviews(false);
    }
  }, [user?.approvalToken, interviewUploadReload, setInterviwUploadReload]);

  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (previewUrlQB) {
        URL.revokeObjectURL(previewUrlQB);
      }
    };
  }, [previewUrlQB]);

  const handleInputChangeQB = (e) => {
    const { name, value } = e.target;
    if (name === 'what_to_expect') {
      // Update raw input string
      setWhatToExpectInput(value);
      // Convert to array for formData
      const valueArray = value
        .split(',')
        .map((item) => item.trim().toLowerCase())
        .filter((item) => item);
      setFormData((prev) => ({ ...prev, [name]: valueArray }));
      console.log('what_to_expect array:', valueArray); // Debugging
    } else {
      setFormData((prev) => ({ ...prev, [name]: value ?? '' }));
    }
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChangeQB = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && !['image/jpeg', 'image/png'].includes(selectedFile.type)) {
      setErrors((prev) => ({ ...prev, file: 'Only JPEG or PNG files are allowed.' }));
      setFile(null);
      setPreviewUrlQB(null);
    } else if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, file: 'File size must be under 5MB.' }));
      setFile(null);
      setPreviewUrlQB(null);
    } else {
      setFile(selectedFile);
      setErrors((prev) => ({ ...prev, file: '' }));
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrlQB(url);
    }
  };

  const validateFormQB = () => {
    let isValid = true;
    const newErrors = {
      interview_id: '',
      questionBank_name: '',
      duration: '',
      difficulty_level: '',
      question_Type: '',
      description: '',
      what_to_expect: '',
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
    if (!formData.what_to_expect.length) {
      newErrors.what_to_expect = 'At least one item is required in What to Expect.';
      isValid = false;
    }
    if (!file) {
      newErrors.file = 'An image file is required.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmitQB = async (e) => {
    e.preventDefault();

    if (!user?.approvalToken) {
      toast.error('You must be logged in to create a question bank.');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    if (!validateFormQB()) {
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
      what_to_expect: formData.what_to_expect, // Send as array
    };
    data.append('data', JSON.stringify(jsonData));
    if (file) {
      data.append('file', file);
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
          what_to_expect: [], // Reset to empty array
        });
        setWhatToExpectInput(''); // Reset input string
        setFile(null);
        setPreviewUrlQB(null);
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
      <h2 className="text-2xl font-bold mb-6 text-center text-black">Create Position</h2>
      <div className="p-6 rounded-lg shadow-md bg-white">
        <form onSubmit={handleSubmitQB} className="space-y-4">
          {/* Image File */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Image File</label>
            <div
              className="md:w-[300px] lg:w-[300px] h-[200px] border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer relative overflow-hidden"
              onClick={() => fileInputRef.current.click()}
            >
              {previewUrlQB ? (
                <img
                  src={previewUrlQB}
                  alt="Question bank preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-gray-500">Click to upload image</span>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileChangeQB}
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
              onChange={handleInputChangeQB}
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
            <label className="block text-gray-700 font-medium">Position Name</label>
            <input
              type="text"
              name="questionBank_name"
              value={formData.questionBank_name}
              onChange={handleInputChangeQB}
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
              onChange={handleInputChangeQB}
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
              onChange={handleInputChangeQB}
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
              onChange={handleInputChangeQB}
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
              onChange={handleInputChangeQB}
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
              name="what_to_expect"
              value={whatToExpectInput} // Use raw input string
              onChange={handleInputChangeQB}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-black focus:ring-[#37B74]"
              placeholder="e.g., HTML fundamentals, CSS Flex/Grid, JavaScript variables and functions"
              rows={3}
            />
            {errors.what_to_expect && (
              <p className="text-sm mt-1 italic text-red-600">{errors.what_to_expect}</p>
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
              Create Position
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuestionBank;