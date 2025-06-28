import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthProvider';
import { FaArrowRight } from 'react-icons/fa';
import useApi from '../../../hook/apiHook';
import LoadingCircle from '../../../reuseable/LoadingCircle';

const IncompleateInterviews = () => {
  const { user } = useAuth();
  const AuthorizationToken = user?.approvalToken;
  const { request } = useApi();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        const res = await request({
          endpoint: '/interview/getIncompleteInterviews',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${AuthorizationToken}`,
          },
        });
        if (res.ok) {
          setInterviews(res.data?.body || []);
          setError(null);
        } else {
          throw new Error(res.message || 'Failed to fetch incomplete interviews');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch incomplete interviews');
        console.error('Error fetching interviews:', err);
      } finally {
        setLoading(false);
      }
    };

    if (AuthorizationToken) {
      fetchInterviews();
    } else {
      setError('No authorization token available');
      setLoading(false);
    }
  }, [AuthorizationToken]);

  const InterviewCard = ({ interview }) => {
    return (
      <div
        className="flex items-center bg-[#FFEB3B] rounded-xl shadow-md p-4 w-[260px] border border-yellow-400 hover:scale-105 transition-transform cursor-pointer"
        onClick={() => navigate(`${interview._id}`)}
      >
        {/* Left Image */}
        <div className="w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 mr-4">
          <img
            src={interview.img}
            alt={interview.interview_name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Content */}
        <div className="flex flex-col justify-between flex-1">
          <h2 className="text-md font-semibold text-gray-900 leading-tight">
            {interview.interview_name || 'No name available'}
          </h2>
          <p className="text-sm text-gray-700">
            {interview.total_Positions || 'N/A'} Job Title
          </p>

          {/* Resume Button */}
          <button
            className="mt-2 w-fit bg-white border border-green-500 text-green-600 text-sm font-semibold rounded-full px-4 py-1 flex items-center gap-1 hover:bg-green-100 transition-colors"
          >
            Resume <span className="text-green-600">⟳</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="text-black max-w-4xl mx-auto px-6">
      {loading && <LoadingCircle />}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && (
        <div className="max-w-4xl mx-auto mt-8">
          <div className="max-w-4xl mx-auto mb-16">
            <h1 className="text-2xl lg:text-3xl font-bold mb-4 text-[#37B874] text-center tracking-wide">
              Incomplete Interviews
            </h1>

            {/* Scrollable Container */}
            <div className="flex gap-4 overflow-x-auto scroll-smooth pb-2 scrollbar-hide">
              {interviews.length > 0 ? (
                interviews.map((interview) => (
                  <div key={interview._id} className="flex-shrink-0">
                    <InterviewCard interview={interview} />
                  </div>
                ))
              ) : (
                <p>No incomplete interviews available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncompleateInterviews;
