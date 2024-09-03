import React, { useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode'; // Import the qrcode library

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const generateAccountNumber = async () => {
        let accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        const querySnapshot = await getDocs(collection(db, 'users'));
        let isUnique = !querySnapshot.docs.some(doc => doc.data().accountNumber === accountNumber);

        while (!isUnique) {
            accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
            isUnique = !querySnapshot.docs.some(doc => doc.data().accountNumber === accountNumber);
        }

        return accountNumber;
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const accountNumber = await generateAccountNumber();

            // Generate QR code data URL using qrcode library
            const qrCodeDataUrl = await QRCode.toDataURL(email);

            await setDoc(doc(db, 'users', user.uid), {
                email: email,
                name: name,
                accountNumber: accountNumber,
                balance: 2000,
                qrCode: qrCodeDataUrl // Store the QR code data URL
            });

            navigate('/dashboard');
        } catch (error) {
            console.error('Error signing up:', error.message);
            if (error.code === 'auth/email-already-in-use') {
                alert('This email is already in use. Please use a different email or sign in.');
            } else {
                alert('An error occurred during sign up. Please try again.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
                <h2 className="text-white text-3xl font-bold mb-2 text-center">SIGN UP</h2>
                <p className="text-gray-400 text-sm mb-6 text-center">Please enter your details to create an account!</p>
                <form onSubmit={handleSignUp} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                        type="submit"
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md border border-gray-600"
                    >
                        SIGN UP
                    </button>
                </form>
                <p className="text-gray-400 text-sm text-center mt-6">
                    Already have an account? <Link to="/signin" className="text-blue-400 hover:text-blue-300">Sign In</Link>
                </p>
            </div>
        </div>
    );
}

export default SignUp;
