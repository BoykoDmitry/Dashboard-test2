import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Header: React.FC = () => {
  const { account, logout, isAuthenticated } = useAuth();
  
  // Check if we're in development mode with mock data
  const isDev = import.meta.env.DEV;
  const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';
  const showAuthenticatedUI = isAuthenticated || (isDev && useMockData);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Get user display name or email
  const getUserDisplayName = () => {
    if (isDev && useMockData) return 'Dev User';
    if (!account) return 'Admin User';
    return account.name || account.username || 'Admin User';
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-0" as="header" role="banner">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          Onboarding Admin Dashboard
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Dashboard
            </Nav.Link>
          </Nav>
          {showAuthenticatedUI && (
            <Nav className="ms-auto">
              <NavDropdown 
                title={`👤 ${getUserDisplayName()}`} 
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.ItemText>
                  <small className="text-muted">Signed in as:</small><br />
                  <strong>{
                    isDev && useMockData 
                      ? 'dev@example.com' 
                      : (account?.username || 'Unknown')
                  }</strong>
                </NavDropdown.ItemText>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  🚪 Sign Out
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;