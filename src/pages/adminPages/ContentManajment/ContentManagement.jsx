import React from 'react'
import ViewAllInterviews from './ViewAllInterviews'
import { useNavigate } from 'react-router-dom'

const ContentManagement = () => {
  const navigate=useNavigate()
  return (
    <div>
    <div className="flex items-start justify-between px-4 py-6 bg-white rounded-md shadow-sm">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Content & Interview Management</h2>
        <p className="text-sm text-gray-500">
          Manage all interviews, job roles and educational resources here.
        </p>
      </div>

      <button
        onClick={() => navigate("addInterviewAndQuestionBank")}
        className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 px-4 rounded flex items-center gap-2"
      >
        Add Interview
        <span className="text-xl leading-none">+</span>
      </button>
    </div>


    
     <ViewAllInterviews/>
    </div>
  )
}

export default ContentManagement
