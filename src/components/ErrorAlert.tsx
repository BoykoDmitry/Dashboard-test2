import React from 'react';
import { Alert, Button } from 'react-bootstrap';

interface ErrorAlertProps {
  error: string | Error;
  onRetry?: () => void;
  className?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onRetry, className = '' }) => {
  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <Alert variant="danger" className={className}>
      <Alert.Heading>⚠️ Error</Alert.Heading>
      <p className="mb-0">{errorMessage}</p>
      {onRetry && (
        <div className="mt-3">
          <Button variant="outline-danger" size="sm" onClick={onRetry}>
            🔄 Try Again
          </Button>
        </div>
      )}
    </Alert>
  );
};

export default ErrorAlert;