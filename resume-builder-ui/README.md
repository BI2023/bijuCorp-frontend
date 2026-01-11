# Resume Builder React UI

A professional, production-ready Resume Builder SaaS UI built with React, designed to integrate with a Django REST API backend.

## Features

- **Public Template Gallery**: Browse resume templates without logging in
- **Django Authentication**: Seamless integration with Django login/signup pages
- **Resume Builder**: Two-column layout with live preview
- **Multiple Templates**: Classic, Modern, and Minimal resume designs
- **Wallet System**: Add money, check balance, view transactions
- **PDF Generation**: Generate professional PDFs with wallet integration
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Protected Routes**: Smart authentication flow with Django redirects

## Tech Stack

- **React 18** - UI Library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Context API** - Global state management

## Project Structure

```
src/
├── api/                    # API integration layer
│   ├── axiosInstance.js   # Configured Axios instance with interceptors
│   ├── auth.api.js        # Authentication endpoints
│   ├── wallet.api.js      # Wallet & transactions endpoints
│   └── resume.api.js      # Resume management endpoints
├── components/
│   ├── common/            # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   └── Loader.jsx
│   ├── layout/            # Layout components
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   └── resume/            # Resume-specific components
│       ├── ResumeForm.jsx
│       ├── ResumePreview.jsx
│       ├── TemplateSelector.jsx
│       └── templates/
│           ├── Classic.jsx
│           ├── Modern.jsx
│           └── Minimal.jsx
├── pages/
│   ├── Home.jsx           # Public landing page with template gallery
│   └── dashboard/         # Protected dashboard pages
│       ├── Dashboard.jsx
│       ├── ResumeBuilder.jsx
│       ├── MyResumes.jsx
│       ├── Wallet.jsx
│       └── Transactions.jsx
├── context/               # React Context providers
│   ├── AuthContext.jsx
│   └── WalletContext.jsx
├── routes/
│   └── ProtectedRoute.jsx
├── utils/
│   ├── constants.js       # App-wide constants
│   └── helpers.js         # Utility functions
├── App.jsx                # Main app component with routing
└── main.jsx               # React entry point
```

## Prerequisites

- Node.js 16+ and npm/yarn
- Django REST API backend running (see backend setup)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd resume-builder-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your Django API and authentication URLs:
   ```
   VITE_API_BASE_URL=http://localhost:8000/api
   VITE_DJANGO_LOGIN_URL=http://localhost:8000/auth/login
   VITE_DJANGO_SIGNUP_URL=http://localhost:8000/auth/signup
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The app will open at `http://localhost:3000`

## Build for Production

```bash
npm run build
# or
yarn build
```

The production build will be in the `dist/` folder.

## Connecting to Django Backend

This React app integrates with your existing Django authentication system. Users will be redirected to your Django login/signup pages when authentication is required.

### Authentication Flow
1. Users browse templates on the public homepage
2. When they select a template, the app checks authentication status
3. Unauthenticated users are redirected to your Django login page with a `next` parameter
4. After successful login in Django, users are redirected back to the React app
5. Django must set JWT tokens that the React app can access

### Required Django Setup

**Important:** Your Django backend must:
1. Set JWT tokens in a way the React app can access them (localStorage, cookies, or URL params)
2. Support CORS for your React app domain
3. Redirect back to React app after successful authentication

Example redirect after Django login:
```python
# In your Django login view after successful authentication
return redirect(f"{REACT_APP_URL}?access_token={access_token}&refresh_token={refresh_token}")
```

Then the React app can capture these tokens:
```javascript
// In your React app (already handled in AuthContext)
const params = new URLSearchParams(window.location.search);
const access = params.get('access_token');
const refresh = params.get('refresh_token');
if (access) {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
}
```

### Required Django API Endpoints

Your Django backend should expose these endpoints:

#### Authentication
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/user/` - Get current user profile
- `PATCH /api/auth/user/` - Update user profile
- `POST /api/auth/token/refresh/` - Refresh JWT token

#### Wallet
- `GET /api/wallet/balance/` - Get wallet balance
- `POST /api/wallet/add-money/` - Add money to wallet
- `GET /api/wallet/transactions/` - Get transaction history

#### Resumes
- `GET /api/resumes/` - List all resumes
- `POST /api/resumes/` - Create new resume
- `GET /api/resumes/:id/` - Get single resume
- `PUT /api/resumes/:id/` - Update resume
- `DELETE /api/resumes/:id/` - Delete resume
- `POST /api/resumes/:id/generate-pdf/` - Generate PDF (returns blob)
- `GET /api/resumes/templates/` - Get available templates

### Expected API Response Formats

**Login Response:**
```json
{
  "access": "jwt_access_token",
  "refresh": "jwt_refresh_token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

**Resume Object:**
```json
{
  "id": 1,
  "title": "Software Engineer Resume",
  "template": "modern",
  "content": {
    "personal": { ... },
    "summary": { ... },
    "experience": [ ... ],
    "education": [ ... ],
    "skills": [ ... ],
    "projects": [ ... ]
  },
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-02T00:00:00Z"
}
```

## Key Features Explained

### Authentication Flow
- Users redirected to Django login/signup pages
- JWT tokens received from Django after authentication
- Tokens stored in localStorage for API calls
- Automatic token refresh on 401 errors
- Protected routes redirect to Django login
- Context API for global auth state

### Resume Builder
- Two-column layout: form on left, live preview on right
- Dynamic form sections with add/remove capability
- Real-time preview updates
- Template switching without data loss
- Auto-save functionality

### Wallet Integration
- Check balance before PDF generation
- Add money via modal
- Transaction history with detailed view
- Balance displayed in navbar

### PDF Generation
- Checks wallet balance before generating
- Deducts cost from wallet
- Downloads PDF automatically
- Uses Django/WeasyPrint on backend

## Customization

### Changing Colors
Edit `src/index.css` to modify the CSS variables:
```css
:root {
  --primary: #2563eb;
  --secondary: #f1f5f9;
  /* ... other colors */
}
```

### Adding New Templates
1. Create a new template component in `src/components/resume/templates/`
2. Import it in `ResumePreview.jsx`
3. Add it to the templates object

### Modifying PDF Cost
Edit `src/utils/constants.js`:
```javascript
export const PDF_GENERATION_COST = 5 // Change this value
```

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure your Django backend has CORS headers configured:
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",  # Vite dev server
]
```

### Authentication Integration
If users aren't being authenticated after Django login:
1. Verify Django is passing JWT tokens back to React (via URL params, localStorage, or cookies)
2. Check that tokens are being stored in localStorage
3. Ensure `VITE_DJANGO_LOGIN_URL` and `VITE_DJANGO_SIGNUP_URL` are correctly set
4. Verify CORS is properly configured in Django

### Token Refresh Issues
Check that your Django backend supports the `/api/auth/token/refresh/` endpoint with the correct payload format.

## License

Proprietary - All Rights Reserved

## Support

For issues or questions, please contact the development team.
