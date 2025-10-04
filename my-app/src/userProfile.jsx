import React from "react";
import { useNavigate } from "react-router-dom";

//create our expo
export default function UserProfile() {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/profile");
  };
  //styling for our user's profile
const userProfileStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };
  
  
  const userProfileTitleStyle = {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  };
  
  const userProfileSubtitleStyle = {
    fontSize: "1rem",
    fontWeight: "normal",
  };
  
  const userProfileButtonStyle = {
    marginTop: "1rem",
    padding: "1rem",
    borderRadius: "0.5rem",
    backgroundColor: "blue",
    color: "white",
  };
  
  const userProfileInputStyle = {
    marginTop: "1rem",
    padding: "1rem",
    borderRadius: "0.5rem",
    border: "1px solid #ccc",
  };
  
  const userProfileLabelStyle = {
    marginTop: "1rem",
    fontSize: "1rem",
    fontWeight: "bold",
  };
  
  const userProfileFormStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  }
  
  return (
      <div> 
          <div style={userProfileStyle}>
              <h1 style={userProfileTitleStyle}>User Profile</h1>
              <p style={userProfileSubtitleStyle}>Please fill out the following information</p>
              <form style={userProfileFormStyle}>
                  <label style={userProfileLabelStyle}>Name</label>
                  <input style={userProfileInputStyle} type="text" />
              </form>
              <button style={userProfileButtonStyle} onClick={handleSubmit}>Submit</button>
          </div>
          <div style={userProfileStyle}>
              <h1 style={userProfileTitleStyle}>User Profile</h1>
              <p style={userProfileSubtitleStyle}>Please fill out the following information</p>
              <form style={userProfileFormStyle}>
                  <label style={userProfileLabelStyle}>Name</label>
                  <input style={userProfileInputStyle} type="text" />
              </form>
              <button style={userProfileButtonStyle} onClick={handleSubmit}>Submit</button>
          </div>
      </div>
  )
}

