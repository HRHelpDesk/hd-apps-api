export const JobPostEmail = (a) =>{


    return(
        `<p><b>JOB TITLE:</b></p>
        <p>${a.jobPostData.jobTitle}</p>
        
        <br></br>
        <p><b>JOB SUMMARY:</b></p>
        <p>${a.jobPostData.jobSummary}</p>
        
        <br></br>
        <p><b>SALARY:</b></p>
        <p>${a.salary}</p>
        <br></br>
        <p><b>RESPONSIBILITIES:</b></p>
        <ul>
        ${a.jobPostData.responsibilities.map(i=>{
            return (<li>{i}</li>)
        })}
        </ul>
        <br></br>
        <p><b>QUALIFICATIONS:</b></p>
        <ul>
        ${a.jobPostData.qualifications.map(i=>{
            return (<li>{i}</li>)
        })}
        </ul>
        <br></br>
        <p><b>REQUIREMENTS:</b></p>
        <ul>
        ${a.jobPostData.requirements.map(i=>{
            return (<li>{i}</li>)
        })}
       </ul>
       <br></br>
       <p><b>PREFERRED SKILLS:</b></p>
        <ul>
        ${a.jobPostData.preferredSkills.map(i=>{
            return (<li>{i}</li>)
        })}
       </ul>
       <br></br>
       <p><b>EDUCATION AND EXPERIENCE:</b></p>
        <ul>
        ${a.jobPostData.educationAndExperience.map(i=>{
            return (<li>{i}</li>)
        })}
       </ul>
       <br></br>
       <p><b>BENEFITS:</b></p>
       <ul>
       ${a.jobPostData.benefits.map(i=>{
           return (<li>{i}</li>)
       })}
      </ul>
      <br></br>
      <p><b>EQUAL OPPORTUNITY:</b></p>
        <p>${a.jobPostData.equalOpportunity}</p>
<br></br>
    <p><b>ADA COMPLIANT:</b></p>
    <p>${a.jobPostData.adaCompliant}</p>
<br></br>
    <p><b>CONCLUSION:</b></p>
    <p>${a.jobPostData.conclusion}</p>

        `
    )
}