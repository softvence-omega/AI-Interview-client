import React, { useState } from 'react'
import CreateInterview from './CreateINterview'
import CreateQuestionBank from './CreateQuestionBank'

const CreateInterviewAndPosition = () => {
  const [interviewUploadReload, setInterviwUploadReload]=useState(false)
  return (
    <div>
      <CreateInterview
      setInterviwUploadReload={setInterviwUploadReload}
      />
      <CreateQuestionBank
      interviewUploadReload={interviewUploadReload}
      setInterviwUploadReload={setInterviwUploadReload}
      />
    </div>
  )
}

export default CreateInterviewAndPosition
