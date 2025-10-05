import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from './utils/api';

export default function HostGame() {
  const navigate = useNavigate();
  const { sport } = useParams();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    maxPlayers: 4,
    skillLevel: 'beginner',
    contactInfo: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const sportDisplay = sport ? sport.split("-").map(s => s[0].toUpperCase() + s.slice(1)).join(" ") : "Sport";

  // Validation functions
  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        if (!value.trim()) return 'Game title is required';
        if (value.length < 3) return 'Title must be at least 3 characters';
        if (value.length > 50) return 'Title must be less than 50 characters';
        return '';
      case 'location':
        if (!value.trim()) return 'Location is required';
        if (value.length < 3) return 'Location must be at least 3 characters';
        return '';
      case 'date':
        if (!value) return 'Date is required';
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) return 'Date cannot be in the past';
        return '';
      case 'time':
        if (!value) return 'Time is required';
        return '';
      case 'maxPlayers':
        if (value < 2) return 'Must allow at least 2 players';
        if (value > 20) return 'Maximum 20 players allowed';
        return '';
      case 'contactInfo':
        if (!value.trim()) return 'Contact info is required';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const processedValue = name === 'maxPlayers' ? parseInt(value) || 4 : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Validate the field
    const error = validateField(name, processedValue);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));

    // Check overall form validity
    checkFormValidity();
  };

  const checkFormValidity = () => {
    const errors = Object.values(validationErrors);
    const hasErrors = errors.some(error => error !== '');
    const hasRequiredFields = formData.title.trim() && formData.location.trim() && 
                             formData.date && formData.time && formData.contactInfo.trim();
    
    setIsFormValid(!hasErrors && hasRequiredFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) return;

    try {
      setShowSuccessAlert(true);

      // Get current user from localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      const gameData = {
        title: formData.title,
        description: formData.description,
        sport: sport,
        location: formData.location,
        date: formData.date,
        time: formData.time,
        maxPlayers: formData.maxPlayers,
        skillLevel: formData.skillLevel,
        contactInfo: formData.contactInfo,
        hostId: currentUser.id,
        hostName: currentUser.name
      };

      const savedGame = await apiClient.createGame(gameData);
      console.log('Game created:', savedGame);

      setTimeout(() => {
        setShowSuccessAlert(false);
        navigate(`/join/${sport}`);
      }, 2000);

    } catch (error) {
      console.error('Failed to create game:', error);
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        navigate(`/join/${sport}`);
      }, 2000);
    }
  };

  // Styles
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

  const cardStyle = {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    width: '100%',
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#16a34a',
    textAlign: 'center',
    marginBottom: '10px',
  };

  const subtitleStyle = {
    fontSize: '1.1rem',
    color: '#718096',
    textAlign: 'center',
    marginBottom: '30px',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const labelStyle = {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '5px',
  };

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

  const errorMessageStyle = {
    color: '#ef4444',
    fontSize: '0.875rem',
    marginTop: '5px',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '15px',
    marginTop: '30px',
    justifyContent: 'center',
  };

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
    opacity: isFormValid ? 1 : 0.5,
  };

  const secondaryButtonStyle = {
    ...primaryButtonStyle,
    backgroundColor: '#e2e8f0',
    color: '#4a5568',
    opacity: 1,
  };

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
  };

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

  return (
    <>
      {/* Success Alert */}
      {showSuccessAlert && (
        <div style={overlayStyle}>
          <div style={successAlertStyle}>
            <span>✅</span>
            Game created successfully!
          </div>
        </div>
      )}

      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Host a {sportDisplay} Game</h1>
          <p style={subtitleStyle}>
            Create a game and invite players to join you
          </p>
          
          <form style={formStyle} onSubmit={handleSubmit}>
            <div style={inputGroupStyle}>
              <label style={labelStyle} htmlFor="title">Game Title</label>
              <input
                style={inputStyle}
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter game title"
                maxLength={50}
                required
              />
              {validationErrors.title && (
                <div style={errorMessageStyle}>{validationErrors.title}</div>
              )}
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle} htmlFor="description">Description (Optional)</label>
              <textarea
                style={{...inputStyle, minHeight: '80px', resize: 'vertical'}}
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your game..."
                maxLength={200}
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle} htmlFor="location">Location</label>
              <input
                style={inputStyle}
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Where will the game be played?"
                required
              />
              {validationErrors.location && (
                <div style={errorMessageStyle}>{validationErrors.location}</div>
              )}
            </div>

            <div style={{display: 'flex', gap: '15px'}}>
              <div style={{...inputGroupStyle, flex: 1}}>
                <label style={labelStyle} htmlFor="date">Date</label>
                <input
                  style={inputStyle}
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
                {validationErrors.date && (
                  <div style={errorMessageStyle}>{validationErrors.date}</div>
                )}
              </div>

              <div style={{...inputGroupStyle, flex: 1}}>
                <label style={labelStyle} htmlFor="time">Time</label>
                <input
                  style={inputStyle}
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                />
                {validationErrors.time && (
                  <div style={errorMessageStyle}>{validationErrors.time}</div>
                )}
              </div>
            </div>

            <div style={{display: 'flex', gap: '15px'}}>
              <div style={{...inputGroupStyle, flex: 1}}>
                <label style={labelStyle} htmlFor="maxPlayers">Max Players</label>
                <input
                  style={inputStyle}
                  type="number"
                  id="maxPlayers"
                  name="maxPlayers"
                  value={formData.maxPlayers}
                  onChange={handleInputChange}
                  min="2"
                  max="20"
                  required
                />
                {validationErrors.maxPlayers && (
                  <div style={errorMessageStyle}>{validationErrors.maxPlayers}</div>
                )}
              </div>

              <div style={{...inputGroupStyle, flex: 1}}>
                <label style={labelStyle} htmlFor="skillLevel">Skill Level</label>
                <select
                  style={inputStyle}
                  id="skillLevel"
                  name="skillLevel"
                  value={formData.skillLevel}
                  onChange={handleInputChange}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle} htmlFor="contactInfo">Contact Information</label>
              <input
                style={inputStyle}
                type="text"
                id="contactInfo"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleInputChange}
                placeholder="Phone number or email"
                required
              />
              {validationErrors.contactInfo && (
                <div style={errorMessageStyle}>{validationErrors.contactInfo}</div>
              )}
            </div>

            <div style={buttonContainerStyle}>
              <button
                type="button"
                style={secondaryButtonStyle}
                onClick={() => navigate(`/sport/${sport}`)}
              >
                Back
              </button>
              
              <button
                type="submit"
                style={primaryButtonStyle}
                disabled={!isFormValid}
              >
                Create Game
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}