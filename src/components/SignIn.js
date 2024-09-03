// src/components/SignIn.js
import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
// import './SignIn.css';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error signing in:', error);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center p-4">
            {/* <h1 className="text-white text-4xl font-bold mb-8  min-h-screen  flex items-center justify-center p-4">UNLIMITED MONEY BANK</h1> */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
                <h2 className="text-white text-3xl font-bold mb-2 text-center">LOGIN</h2>
                <p className="text-gray-400 text-sm mb-6 text-center">Please enter your login and password!</p>
                <div className="mb-4">
                    <input
                        type="email"
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="password"
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button 
                    onClick={handleSignIn} 
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md mt-6 border border-gray-600"
                >
                    LOGIN
                </button>
                <p className="text-gray-400 text-sm text-center mt-6">
                    Don't have an account? <Link to="/signup" className="text-blue-400 hover:text-blue-300">Sign Up</Link>
                </p>
            </div>
            <footer/>
        </div>
    );

    // return (
    //     <div className="min-h-screen bg-gradient-to-r from-purple-600 to-blue-500 flex flex-col items-center justify-center p-4">
    //         <h1 className="text-white text-4xl font-bold mb-8 text-center">UNLIMITED MONEY BANK</h1>
    //         <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
    //             <h2 className="text-white text-3xl font-bold mb-2 text-center">LOGIN</h2>
    //             <p className="text-gray-400 text-sm mb-6 text-center">Please enter your login and password!</p>
    //             <div className="mb-4">
    //                 <input
    //                     type="email"
    //                     className="w-full bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    //                     placeholder="Email"
    //                     value={email}
    //                     onChange={(e) => setEmail(e.target.value)}
    //                 />
    //             </div>
    //             <div className="mb-4">
    //                 <input
    //                     type="password"
    //                     className="w-full bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    //                     placeholder="Password"
    //                     value={password}
    //                     onChange={(e) => setPassword(e.target.value)}
    //                 />
    //             </div>
    //             <button 
    //                 onClick={handleSignIn} 
    //                 className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md mt-6 border border-gray-600"
    //             >
    //                 LOGIN
    //             </button>
    //             <p className="text-gray-400 text-sm text-center mt-6">
    //                 Don't have an account? <Link to="/signup" className="text-blue-400 hover:text-blue-300">Sign Up</Link>
    //             </p>
    //         </div>
    //     </div>
    // );
}

export default SignIn;
