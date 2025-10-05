import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiClient from "./utils/api";

export default function UserProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    skillLevel: 'beginner'
  });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [selectedSport, setSelectedSport] = useState('pickleball'); // default fallback
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    phone: '',
    skillLevel: ''
  });
  const [fieldStates, setFieldStates] = useState({
    name: 'neutral',
    phone: 'neutral',
    skillLevel: 'neutral'
  });
  const [isFormValid, setIsFormValid] = useState(false);

  // Get the selected sport from the previous page
  useEffect(() => {
    const sportFromState = location.state?.selectedSport;
    if (sportFromState) {
      setSelectedSport(sportFromState);
    }
  }, [location.state]);

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) return 'Name is required';
    if (name.length < 2) return 'Name must be at least 2 characters';
    if (name.length > 50) return 'Name must be less than 50 characters';
    if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name can only contain letters and spaces';
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone) return ''; // optional field
    if (!/^\d+$/.test(phone)) return 'Phone can only contain numbers';
    if (phone.length !== 10) return 'Phone must be exactly 10 digits';
    return '';
  };


  const checkFormValidity = () => {
    const errors = Object.values(validationErrors);
    const hasErrors = errors.some(error => error !== '');
    const hasRequiredFields = formData.name.trim();
    
    setIsFormValid(!hasErrors && hasRequiredFields);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate specific field
    let error = '';
    switch(name) {
      case 'name':
        error = validateName(value);
        break;
      case 'phone':
        error = validatePhone(value);
        break;
    }
    
    // Update validation errors
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    // Update field state
    setFieldStates(prev => ({
      ...prev,
      [name]: error ? 'invalid' : (value ? 'valid' : 'neutral')
    }));
    
    // Check overall form validity
    setTimeout(checkFormValidity, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation check
    if (!isFormValid) {
      return;
    }
    
    try {
      // Show success animation
      setShowSuccessAlert(true);
      
      // Prepare user data for backend
      const userData = {
        name: formData.name,
        phone: formData.phone,
        skillLevel: formData.skillLevel,
        selectedSport: selectedSport,
        preferences: {
          favoriteSports: [selectedSport],
          skillLevel: formData.skillLevel
        }
      };
      
      // Save to backend
      const savedUser = await apiClient.createUser(userData);
      console.log('User saved to backend:', savedUser);
      
      // Also save to localStorage for quick access
      localStorage.setItem('currentUser', JSON.stringify(savedUser));
      
      // Hide alert and redirect after animation
      setTimeout(() => {
        setShowSuccessAlert(false);
        // Navigate to HostOrJoin with the selected sport
        navigate(`/sport/${selectedSport}`);
      }, 2000);
      
    } catch (error) {
      console.error('Failed to save user:', error);
      // Still show success animation but log the error
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        navigate(`/sport/${selectedSport}`);
      }, 2000);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  // Main container style
  const containerStyle = {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(180deg, #ffffff 0%, #f7fdf8 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Poppins, Arial, sans-serif',
    padding: '20px',
    boxSizing: 'border-box',
    overflowY: 'auto',
    overflowX: 'hidden',
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
    backgroundColor: '#16a34a',
    color: 'white',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    fontFamily: 'Poppins, Arial, sans-serif',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(22, 163, 74, 0.3)',
    minWidth: '120px',
  };

  // Secondary button style
  const secondaryButtonStyle = {
    ...primaryButtonStyle,
    backgroundColor: '#e2e8f0',
    color: '#4a5568',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  };

  // Success alert styles
  const successAlertStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#10b981',
    color: 'white',
    padding: '20px 40px',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
    fontSize: '1.2rem',
    fontWeight: '600',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    animation: showSuccessAlert ? 'slideInScale 0.5s ease-out' : 'slideOutScale 0.5s ease-out',
  };

  // Overlay style
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
    display: showSuccessAlert ? 'block' : 'none',
  };

  // Enhanced input styling based on validation state
  const getInputStyle = (fieldName) => {
    const baseStyle = inputStyle;
    const fieldState = fieldStates[fieldName];
    
    switch(fieldState) {
      case 'valid':
        return {
          ...baseStyle,
          borderColor: '#10b981',
          backgroundColor: '#f0fdf4'
        };
      case 'invalid':
        return {
          ...baseStyle,
          borderColor: '#ef4444',
          backgroundColor: '#fef2f2'
        };
      default:
        return baseStyle;
    }
  };

  // Error message styling
  const errorMessageStyle = {
    color: '#ef4444',
    fontSize: '0.875rem',
    marginTop: '5px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  };

return (
    <>
      {/* CSS Animations */}
      <style>
        {`
          @keyframes slideInScale {
            0% {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.5);
            }
            100% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }
          
          @keyframes slideOutScale {
            0% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
            100% {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.5);
            }
          }
          
          @keyframes checkmark {
            0% {
              stroke-dashoffset: 100;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }
          
          .success-checkmark {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
            animation: checkmark 0.8s ease-out 0.3s forwards;
          }
        `}
      </style>

      {/* Success Alert Overlay */}
      {showSuccessAlert && (
        <div style={overlayStyle}>
          <div style={successAlertStyle}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path className="success-checkmark" d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            Profiled Settings Saved.
          </div>
        </div>
      )}

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
              style={getInputStyle('name')}
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              maxLength={50}
              required
              onFocus={(e) => {
                Object.assign(e.target.style, inputFocusStyle);
              }}
              onBlur={(e) => {
                Object.assign(e.target.style, getInputStyle('name'));
              }}
            />
            {validationErrors.name && (
              <div style={errorMessageStyle}>
                {validationErrors.name}
              </div>
            )}
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle} htmlFor="phone">Phone Number</label>
            <input
              style={getInputStyle('phone')}
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter 10 digit phone number"
              maxLength={10}
              onFocus={(e) => {
                Object.assign(e.target.style, inputFocusStyle);
              }}
              onBlur={(e) => {
                Object.assign(e.target.style, getInputStyle('phone'));
              }}
            />
            {validationErrors.phone && (
              <div style={errorMessageStyle}>
                {validationErrors.phone}
              </div>
            )}
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
                e.target.style.backgroundColor = '#f7fdf8';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Back to Home
            </button>
            
            <button
              type="submit"
              style={{
                ...primaryButtonStyle,
                opacity: isFormValid ? 1 : 0.5,
                cursor: isFormValid ? 'pointer' : 'not-allowed'
              }}
              disabled={!isFormValid}
              onMouseEnter={(e) => {
                if (isFormValid) {
                  e.target.style.backgroundColor = '#f7fdf8';
                  e.target.style.color = '#2d3748';
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.25)';
                  e.target.style.transition = 'all 0.25s ease-in-out';
                }
              }}
              onMouseLeave={(e) => {
                if (isFormValid) {
                  e.target.style.backgroundColor = '#2d3748';
                  e.target.style.color = '#f7fdf8';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)';
                  e.target.style.transition = 'all 0.25s ease-in-out';
                }
              }}
            >
              Save Profile
            </button>
          </div>
            </form>
        </div>
    </div>
    </>
  );
}
