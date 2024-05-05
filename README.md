# OAUTH-React-Node

Built with React.js, Bootstrap, Node.js (Express.js) and MongoDB.

## Setup Instructions

### 1. Configure .env Files

Before using the code, ensure to configure the `.env` files for both the front-end and back-end.

### 2. Integrating Components

To integrate the required components (`useMain` and `useAuth`) using `useContext`, follow these steps:

- **Option 1: Full Integration**
  1. Copy the component files (`MainComponent.js` and `AuthProvider.js`).
  2. Import and wrap your components in `index.js` as follows:
     ```jsx
     <MainComponent>
       <AuthProvider>
         {/* Your App Components Here */}
       </AuthProvider>
     </MainComponent>
     ```

- **Option 2: Partial Integration**
  - If you don't need `MainComponent`, copy the necessary functions (`Toast`, `showPreloader`, `setShowPreloader`) from `useMain.js` and replace the corresponding code in `useAuth.js`.

### 3. Front-End Configuration

Copy the `AuthPages` folder into your front-end project.

### 4. Copy Essential Folders

Copy the following folders from this repository to your project directory:
- `controllers`
- `middleware`
- `models`
- `routes`
- `services`

### 5. Modify Server Configuration

Make necessary modifications to `server.js` to suit your project requirements.

### 6. Update Front-End App

Modify `App.js` in your front-end project to integrate with the back-end services and authentication.

---

These steps outline the process to set up and integrate the provided components and functionalities into your project.
  
**Features:**

-   Authentication (Sign Up/Sign In)
-   Google login
-   Facebook login
-   More features coming soon
