// src/components/TransferMoney.js
import React, { useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';

function TransferMoney() {
    const [recipientEmail, setRecipientEmail] = useState('');
    const [amount, setAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleTransfer = async () => {
        if (isProcessing) return;

        const user = auth.currentUser;
        if (!user) {
            alert('You need to sign in first!');
            return;
        }

        if (!recipientEmail || !amount) {
            alert('Please fill in all fields.');
            return;
        }

        if (!isValidEmail(recipientEmail)) {
            alert('Please enter a valid email address.');
            return;
        }

        const transferAmount = parseFloat(amount);

        if (isNaN(transferAmount) || transferAmount <= 0) {
            alert('Please enter a valid positive amount.');
            return;
        }

        if (recipientEmail === user.email) {
            alert('You cannot transfer money to yourself.');
            return;
        }

        try {
            setIsProcessing(true);
            const senderDocRef = doc(db, 'users', user.uid);
            const senderDoc = await getDoc(senderDocRef);

            if (!senderDoc.exists) {
                alert('Sender not found!');
                setIsProcessing(false);
                return;
            }

            const senderBalance = senderDoc.data().balance;

            if (senderBalance < transferAmount) {
                alert('Insufficient balance!');
                setIsProcessing(false);
                return;
            }

            // Find recipient by email
            const recipientQuery = query(collection(db, 'users'), where('email', '==', recipientEmail));
            const recipientSnapshot = await getDocs(recipientQuery);
            if (recipientSnapshot.empty) {
                alert('Recipient not found!');
                setIsProcessing(false);
                return;
            }

            const recipientDocRef = recipientSnapshot.docs[0].ref;
            const recipientDoc = recipientSnapshot.docs[0].data();

            // Update sender and recipient balances
            await updateDoc(senderDocRef, { balance: senderBalance - transferAmount });
            await updateDoc(recipientDocRef, { balance: recipientDoc.balance + transferAmount });

            // Log transaction history (Placeholder)
            // This would typically include both sender and recipient details along with timestamp, etc.
            await addDoc(collection(db, 'transactions'), {
                sender: user.email,
                recipient: recipientEmail,
                amount: transferAmount,
                timestamp: new Date()
            });

            alert('Transfer successful!');
            setRecipientEmail('');
            setAmount('');
        } catch (error) {
            alert('An error occurred during the transfer.');
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div>
            <h2>Transfer Money</h2>
            <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="Recipient Email"
            />
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
            />
            <button onClick={handleTransfer} disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Transfer'}
            </button>
        </div>
    );
}

export default TransferMoney;
