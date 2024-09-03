// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc, collection, addDoc, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { QrReader } from 'react-qr-reader';

function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [recipientEmail, setRecipientEmail] = useState('');
    const [amount, setAmount] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [transferMethod, setTransferMethod] = useState('email');
    const [showQrReader, setShowQrReader] = useState(false);
    const [scannedEmail, setScannedEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            const unsubscribeUser = onSnapshot(userDocRef, (doc) => {
                if (doc.exists()) {
                    setUserData(doc.data());
                }
            });

            const q = query(collection(db, 'transactions'), where('userId', '==', user.uid));
            const unsubscribeTransactions = onSnapshot(q, (querySnapshot) => {
                const transactionsData = querySnapshot.docs.map(doc => doc.data());
                setTransactions(transactionsData);
            });

            return () => {
                unsubscribeUser();
                unsubscribeTransactions();
            };
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handleTransfer = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        const recipientEmailToUse = transferMethod === 'email' ? recipientEmail : scannedEmail;
        const recipientQuery = query(collection(db, 'users'), where('email', '==', recipientEmailToUse));
        const recipientSnapshot = await getDocs(recipientQuery);

        if (!recipientSnapshot.empty) {
            const recipientDoc = recipientSnapshot.docs[0];
            const recipientData = recipientDoc.data();

            if (userData.balance >= amount && amount > 0) {
                const newSenderBalance = userData.balance - Number(amount);
                const newRecipientBalance = recipientData.balance + Number(amount);

                // Update sender's balance
                await updateDoc(doc(db, 'users', user.uid), {
                    balance: newSenderBalance
                });

                // Update recipient's balance
                await updateDoc(doc(db, 'users', recipientDoc.id), {
                    balance: newRecipientBalance
                });

                // Log transaction for sender
                await addDoc(collection(db, 'transactions'), {
                    userId: user.uid,
                    type: 'sent',
                    amount: Number(amount),
                    to: recipientEmailToUse,
                    timestamp: new Date(),
                });

                // Log transaction for recipient
                await addDoc(collection(db, 'transactions'), {
                    userId: recipientDoc.id,
                    type: 'received',
                    amount: Number(amount),
                    from: user.email,
                    timestamp: new Date(),
                });

                setRecipientEmail('');
                setScannedEmail('');
                setAmount('');
                setShowQrReader(false);
            } else {
                alert('Insufficient balance or invalid amount');
            }
        } else {
            alert('Recipient not found');
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-600 to-blue-500 text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Banking App</h1>
                    <button 
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Log Out
                    </button>
                </div>
                
                {userData && (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column - User Details */}
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold mb-4">Welcome, {userData.name}</h2>
            <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400">Email</p>
                <p className="font-semibold">{userData.email}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400">Account Number</p>
                <p className="font-semibold">{userData.accountNumber}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400">Balance</p>
                <p className="font-semibold text-green-400">${userData.balance}</p>
            </div>
        </div>
        
        {/* Right Column - QR Code */}
        <div className="flex items-center justify-center">
            <div className="bg-gray-700 p-4 rounded-lg flex flex-col items-center">
                <p className="text-gray-400 mb-2">Your QR Code</p>
                {userData.qrCode && (
                    <img src={userData.qrCode} alt="QR Code" className="w-48 h-48" />
                )}
            </div>
        </div>
    </div>
)}


                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-bold mb-4">Transfer Money</h3>
                        <div className="mb-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio"
                                    name="transferMethod"
                                    value="email"
                                    checked={transferMethod === 'email'}
                                    onChange={() => setTransferMethod('email')}
                                />
                                <span className="ml-2">Send by Email</span>
                            </label>
                            <label className="inline-flex items-center ml-6">
                                <input
                                    type="radio"
                                    className="form-radio"
                                    name="transferMethod"
                                    value="qr"
                                    checked={transferMethod === 'qr'}
                                    onChange={() => setTransferMethod('qr')}
                                />
                                <span className="ml-2">Scan QR Code</span>
                            </label>
                        </div>
                        {transferMethod === 'email' ? (
                            <form onSubmit={handleTransfer} className="space-y-4">
                                <input
                                    type="email"
                                    placeholder="Recipient Email"
                                    value={recipientEmail}
                                    onChange={(e) => setRecipientEmail(e.target.value)}
                                    required
                                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="number"
                                    placeholder="Amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button 
                                    type="submit"
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                >
                                    Transfer
                                </button>
                            </form>
                        ) : (
                            <div>
                                {showQrReader ? (
                                    <QrReader
                                        onResult={(result, error) => {
                                            if (result) {
                                                setScannedEmail(result?.text);
                                                setShowQrReader(false);
                                            }
                                            if (error) {
                                                console.error(error);
                                            }
                                        }}
                                        style={{ width: '100%' }}
                                    />
                                ) : (
                                    <button
                                        onClick={() => setShowQrReader(true)}
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Scan QR Code
                                    </button>
                                )}
                                {scannedEmail && (
                                    <form onSubmit={handleTransfer} className="space-y-4 mt-4">
                                        <input
                                            type="email"
                                            value={scannedEmail}
                                            readOnly
                                            className="w-full bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-3"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Amount"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            required
                                            className="w-full bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button 
                                            type="submit"
                                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Transfer
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-bold mb-4">Transaction History</h3>
                        <div className="overflow-y-auto max-h-64">
                            <ul className="space-y-2">
                                {transactions.sort((a, b) => b.timestamp - a.timestamp).map((transaction, index) => (
                                    <li key={index} className="bg-gray-700 p-3 rounded-lg">
                                        <p className={transaction.type === 'sent' ? 'text-red-400' : 'text-green-400'}>
                                            {transaction.type === 'sent' 
                                                ? `Sent $${transaction.amount} to ${transaction.to}` 
                                                : `Received $${transaction.amount} from ${transaction.from}`
                                            }
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {transaction.timestamp instanceof Date 
                                                ? transaction.timestamp.toLocaleString() 
                                                : new Date(transaction.timestamp.seconds * 1000).toLocaleString()
                                            }
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;