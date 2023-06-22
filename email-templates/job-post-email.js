const JobPostEmail = (a) =>{


    return(
        `<p><b>JOB TITLE:</b></p>
        <p>${a.jobPostData.jobTitle}</p>
        

        <p><b>JOB SUMMARY:</b></p>
        <p>${a.jobPostData.jobSummary}</p>
        

        <p style="display:${a.salary === ''? 'none': 'block'}"><b>SALARY:</b></p>
        <p>${a.salary}</p>
  
        <p><b>RESPONSIBILITIES:</b></p>
        <ul>
        ${a.jobPostData.responsibilities.map(i=>{
            return `<li>${i}</li>`
        })}
        </ul>

        <p><b>QUALIFICATIONS:</b></p>
        <ul>
        ${a.jobPostData.qualifications.map(i=>{
            return `<li>${i}</li>`
        })}
        </ul>

        <p><b>REQUIREMENTS:</b></p>
        <ul>
        ${a.jobPostData.requirements.map(i=>{
            return `<li>${i}</li>`
        })}
       </ul>

       <p><b>PREFERRED SKILLS:</b></p>
        <ul>
        ${a.jobPostData.preferredSkills.map(i=>{
            return `<li>${i}</li>`
        })}
       </ul>
 
       <p><b>EDUCATION AND EXPERIENCE:</b></p>
        <ul>
        ${a.jobPostData.educationAndExperience.map(i=>{
            return `<li>${i}</li>`
        })}
       </ul>

       <p><b>BENEFITS:</b></p>
       <ul>
       ${a.jobPostData.benefits.map(i=>{
           return `<li>${i}</li>`
       })}
      </ul>

      <p><b>EQUAL OPPORTUNITY:</b></p>
        <p>${a.jobPostData.equalOpportunity}</p>

    <p><b>ADA COMPLIANT:</b></p>
    <p>${a.jobPostData.adaCompliant}</p>

    <p><b>CONCLUSION:</b></p>
    <p>${a.jobPostData.conclusion}</p>

        `
    )
}

exports.JobPostEmail = JobPostEmail;