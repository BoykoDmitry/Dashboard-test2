import React from 'react';
import { Spinner } from 'react-bootstrap';

interface LoadingSpinnerProps {
  size?: 'sm' | 'lg';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'sm', 
  text = 'Loading...', 
  className = '' 
}) => {
  return (
    <div className={`d-flex align-items-center ${className}`}>
      <Spinner animation="border" size={size} className="me-2" />
      <span>{text}</span>
    </div>
  );
};

export default LoadingSpinner;