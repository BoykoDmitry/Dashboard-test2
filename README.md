# Onboarding Admin Dashboard

A comprehensive React + TypeScript admin dashboard for monitoring bank client onboarding processes with Azure AD authentication, interactive charts, and real-time data management.

## 🚀 Features

### Authentication & Security
- **Azure AD Integration**: Full MSAL authentication with development bypass mode
- **Protected Routes**: All dashboard routes require authentication
- **Token Management**: Automatic token refresh and secure API calls

### Dashboard Overview
- **KPI Tiles**: Real-time metrics for total processes, success rate, pending reviews, and average completion time
- **Interactive Charts**: 
  - Daily metrics line chart showing process trends over time
  - Outcome distribution donut chart with success/failure rates
- **Responsive Design**: Bootstrap-based responsive layout

### Data Management
- **Paginated Table**: Efficient display of onboarding processes with sorting and filtering
- **Advanced Filtering**: Filter by status, outcome, date range, and search by phone/email
- **Process Details**: Detailed view for individual onboarding processes
- **Copy-to-Clipboard**: Easy copying of process IDs and sensitive data

### Accessibility Features
- **WCAG 2.1 Compliance**: Full keyboard navigation and screen reader support
- **ARIA Labels**: Comprehensive labeling for all interactive elements
- **Focus Management**: Clear focus indicators and skip links
- **Reduced Motion**: Respects user preferences for reduced motion
- **High Contrast**: Support for high contrast mode

### Error Handling & UX
- **Loading States**: Skeleton loaders and spinners for all async operations
- **Error Boundaries**: Graceful error handling with retry mechanisms
- **Toast Notifications**: User feedback for actions like copying data
- **Offline Support**: Graceful degradation when API is unavailable

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router v6
- **UI Framework**: React Bootstrap
- **Charts**: Chart.js with react-chartjs-2
- **Authentication**: Microsoft MSAL (Azure AD)
- **Build Tool**: Vite
- **Styling**: Bootstrap 5 + Custom CSS
- **Date Handling**: date-fns
- **API Integration**: Custom TypeScript client based on OpenAPI spec

## 📁 Project Structure

```
src/
├── auth/                   # Authentication configuration
│   ├── authConfig.ts      # MSAL configuration
│   ├── AuthContext.tsx    # React context for auth state
│   └── useApiClient.ts    # Authenticated API client hook
├── components/            # Reusable UI components
│   ├── DailyChart.tsx     # Daily metrics line chart
│   ├── OutcomeChart.tsx   # Outcome distribution donut chart
│   ├── ProcessTable.tsx   # Main data table with filtering
│   ├── Header.tsx         # Navigation header
│   ├── LoadingSpinner.tsx # Loading state component
│   ├── ErrorAlert.tsx     # Error display component
│   ├── AccessibleTable.tsx # Accessible table wrapper
│   └── ProtectedRoute.tsx # Route protection wrapper
├── pages/                 # Main application pages
│   ├── Dashboard.tsx      # Main dashboard page
│   └── ProcessDetails.tsx # Individual process details
├── types/                 # TypeScript type definitions
│   └── api.ts            # API types from OpenAPI spec
├── utils/                 # Utility functions
│   └── mockData.ts       # Development mock data
├── styles/               # Custom styling
│   └── accessibility.css # Accessibility enhancements
└── App.tsx               # Main application component
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Azure AD application registration (for production)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Dashboard-test2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Azure AD configuration:
   ```env
   VITE_AZURE_CLIENT_ID=your-client-id
   VITE_AZURE_TENANT_ID=your-tenant-id
   VITE_API_BASE_URL=https://your-api-endpoint.com
   VITE_DEV_MODE=true  # Set to false for production
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   - Development: http://localhost:12000
   - The app will automatically open in your browser

## 🔧 Configuration

### Azure AD Setup
1. Register a new application in Azure AD
2. Configure redirect URIs for your domain
3. Enable implicit flow for tokens
4. Update `src/auth/authConfig.ts` with your tenant and client IDs

### API Integration
- The application uses a TypeScript client generated from the OpenAPI specification
- Update `VITE_API_BASE_URL` in your environment variables
- API client automatically handles authentication headers

### Development Mode
- Set `VITE_DEV_MODE=true` to bypass Azure AD authentication
- Uses comprehensive mock data for development and testing
- All features work without backend connectivity

## 📊 Mock Data

The application includes 150+ mock onboarding processes with:
- Realistic customer data (masked for privacy)
- Various process statuses and outcomes
- Date ranges spanning several months
- Different completion times and review states

## 🎨 Customization

### Styling
- Bootstrap 5 variables can be customized in `src/styles/`
- Custom CSS for accessibility and branding
- Responsive breakpoints configured for mobile-first design

### Charts
- Chart.js configuration in component files
- Customizable colors, animations, and interactions
- Responsive design with proper ARIA labeling

### Data Filtering
- Configurable filter options in `ProcessTable.tsx`
- Extensible search functionality
- Custom date range pickers

## 🧪 Testing

### Manual Testing Checklist
- [ ] Authentication flow (login/logout)
- [ ] Dashboard KPIs display correctly
- [ ] Charts render and are interactive
- [ ] Table sorting and filtering work
- [ ] Process details page loads
- [ ] Copy-to-clipboard functionality
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Mobile responsiveness
- [ ] Error states display properly

### Accessibility Testing
- Use browser dev tools accessibility audits
- Test with keyboard-only navigation
- Verify screen reader compatibility
- Check color contrast ratios
- Test with reduced motion preferences

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables for Production
```env
VITE_AZURE_CLIENT_ID=production-client-id
VITE_AZURE_TENANT_ID=production-tenant-id
VITE_API_BASE_URL=https://production-api.com
VITE_DEV_MODE=false
```

### Hosting Recommendations
- **Azure Static Web Apps**: Native Azure AD integration
- **Netlify/Vercel**: Easy deployment with environment variables
- **AWS S3 + CloudFront**: Scalable static hosting

## 🔒 Security Considerations

- All API calls include authentication headers
- Sensitive data is masked in the UI
- HTTPS required for production Azure AD
- Environment variables for configuration
- No sensitive data in client-side code

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (including accessibility)
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check the browser console for errors
2. Verify environment configuration
3. Test with development mode enabled
4. Review Azure AD application settings

## 🔄 Version History

- **v1.0.0**: Initial release with full dashboard functionality
  - Azure AD authentication
  - Interactive charts and KPIs
  - Comprehensive data table
  - Full accessibility support
  - Mobile-responsive design