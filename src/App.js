// src/App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard';
import { auth } from './firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';

function App() {
    const [user] = useAuthState(auth);

    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                {user && <Route path="/dashboard" element={<Dashboard userData={user} />} />}
                <Route path="/" element={<SignIn />} />
            </Routes>
        </Router>
    );
}

export default App;
