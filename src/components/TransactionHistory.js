// src/components/TransactionHistory.js
import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

function TransactionHistory() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const q = query(collection(db, 'transactions'), where('sender', '==', user.email));
            const querySnapshot = await getDocs(q);
            const transactionsData = querySnapshot.docs.map(doc => doc.data());

            const qReceived = query(collection(db, 'transactions'), where('recipient', '==', user.email));
            const querySnapshotReceived = await getDocs(qReceived);
            const receivedData = querySnapshotReceived.docs.map(doc => doc.data());

            setTransactions([...transactionsData, ...receivedData]);
        };

        fetchTransactions();
    }, []);

    return (
        <div>
            <h2>Transaction History</h2>
            <table>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Email</th>
                        <th>Amount</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction, index) => (
                        <tr key={index}>
                            <td>{transaction.sender === auth.currentUser.email ? 'Sent' : 'Received'}</td>
                            <td>{transaction.sender === auth.currentUser.email ? transaction.recipient : transaction.sender}</td>
                            <td>${transaction.amount}</td>
                            <td>{new Date(transaction.timestamp.toDate()).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TransactionHistory;
