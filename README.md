# Dynamic Form Application

A React-based application that allows students to log in, register, and fill out dynamically generated forms with section-based navigation and validation.

## 🚀 Features

- **User Authentication**: Simple login/registration with name and roll number
- **Dynamic Form Rendering**: Forms are generated dynamically based on API response
- **Multi-Section Navigation**: Forms are divided into sections with previous/next navigation
- **Validation**: Field validation based on API specifications (required, minLength, maxLength)
- **Section Validation**: Each section is validated separately before advancing
- **Multiple Input Types**: Support for text, email, date, textarea, dropdown, radio, checkbox inputs

## 🛠️ Technologies Used

- React
- TypeScript
- Tailwind CSS for styling

## 📋 Project Structure

```
/src
  /components
    - Login.tsx               # Student login component
    - DynamicForm.tsx         # Main form container component
    - FormSectionComponent.tsx # Individual section renderer
    - FormField.tsx           # Dynamic field renderer
  - App.tsx                   # Main application component
  - api.ts                    # API service for backend communication
  - mockApi.ts                # Mock API service for development
  - types.ts                  # TypeScript interfaces and types
  - index.tsx                 # Application entry point
  - index.css                 # Global styles
```

## 🔧 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dynamic-form-app.git
   cd dynamic-form-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure the API endpoint:
   - Open `src/api.ts` and update the `API_BASE_URL` to your API endpoint
   - For development, you can use the included mock API in `mockApi.ts`

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## ✅ Features Implemented

- [x] User login and registration
- [x] Dynamic form structure
- [x] Section-based navigation
- [x] Field validation based on requirements
- [x] Support for multiple field types
- [x] Form submission handling

## 🔮 Future Improvements

- [ ] Add form progress indicator
- [ ] Implement form data saving (local storage)
- [ ] Add animation for section transitions
- [ ] Implement form submission to backend
- [ ] Add form error summary
- [ ] Add internationalization support

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
