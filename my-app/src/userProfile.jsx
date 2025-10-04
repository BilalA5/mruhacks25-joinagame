import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    sportPreferences: '',
    skillLevel: 'beginner'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save user data (you can implement this later)
    console.log('User data:', formData);
    navigate("/");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  // Main container style
  const containerStyle = {
    minHeight: '100vh',
    width: '100vw',
    background: 'linear-gradient(180deg, #ffffff 0%, #f7fdf8 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Poppins, Arial, sans-serif',
    padding: '20px',
    boxSizing: 'border-box',
  };

  // Card style
  const cardStyle = {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    maxWidth: '500px',
    width: '100%',
    backdropFilter: 'blur(10px)',
  };

  // Title style
  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: '10px',
    background: 'linear-gradient(180deg, #ffffff 0%, #f7fdf8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  // Subtitle style
  const subtitleStyle = {
    fontSize: '1.1rem',
    color: '#718096',
    textAlign: 'center',
    marginBottom: '30px',
    fontWeight: '400',
  };

  // Form style
  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  };

  // Input group style
  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  // Label style
  const labelStyle = {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '5px',
  };

  // Input style
  const inputStyle = {
    padding: '15px',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
    fontSize: '1rem',
    fontFamily: 'Poppins, Arial, sans-serif',
    transition: 'all 0.3s ease',
    outline: 'none',
    backgroundColor: '#f8fafc',
  };

  // Input focus style (will be applied via onFocus/onBlur)
  const inputFocusStyle = {
    ...inputStyle,
    borderColor: '#667eea',
    backgroundColor: '#ffffff',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
  };

  // Select style
  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
  };

  // Button container style
  const buttonContainerStyle = {
    display: 'flex',
    gap: '15px',
    marginTop: '30px',
    justifyContent: 'center',
  };

  // Primary button style
  const primaryButtonStyle = {
    padding: '15px 30px',
    borderRadius: '12px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    fontFamily: 'Poppins, Arial, sans-serif',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
    minWidth: '120px',
  };

  // Secondary button style
  const secondaryButtonStyle = {
    ...primaryButtonStyle,
    backgroundColor: '#e2e8f0',
    color: '#4a5568',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>User Profile</h1>
        <p style={subtitleStyle}>
          Tell us about yourself to get matched with the perfect games
        </p>
        
        <form style={formStyle} onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <label style={labelStyle} htmlFor="name">Full Name</label>
            <input
              style={inputStyle}
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
              onFocus={(e) => {
                Object.assign(e.target.style, inputFocusStyle);
              }}
              onBlur={(e) => {
                Object.assign(e.target.style, inputStyle);
              }}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle} htmlFor="phone">Phone Number</label>
            <input
              style={inputStyle}
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              onFocus={(e) => {
                Object.assign(e.target.style, inputFocusStyle);
              }}
              onBlur={(e) => {
                Object.assign(e.target.style, inputStyle);
              }}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle} htmlFor="sportPreferences">Favorite Sports</label>
            <input
              style={inputStyle}
              type="text"
              id="sportPreferences"
              name="sportPreferences"
              value={formData.sportPreferences}
              onChange={handleInputChange}
              placeholder="e.g., Pickleball, Table Tennis, Handball"
              onFocus={(e) => {
                Object.assign(e.target.style, inputFocusStyle);
              }}
              onBlur={(e) => {
                Object.assign(e.target.style, inputStyle);
              }}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle} htmlFor="skillLevel">Skill Level</label>
            <select
              style={selectStyle}
              id="skillLevel"
              name="skillLevel"
              value={formData.skillLevel}
              onChange={handleInputChange}
              onFocus={(e) => {
                Object.assign(e.target.style, inputFocusStyle);
              }}
              onBlur={(e) => {
                Object.assign(e.target.style, inputStyle);
              }}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div style={buttonContainerStyle}>
            <button
              type="button"
              style={secondaryButtonStyle}
              onClick={handleBackToHome}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#cbd5e0';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#e2e8f0';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Back to Home
            </button>
            
            <button
              type="submit"
              style={primaryButtonStyle}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#5a67d8';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#667eea';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
              }}
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}