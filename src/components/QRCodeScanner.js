// // src/components/QRCodeScanner.js
// import React from 'react';
// import { QrReader } from 'react-qr-reader';

// function QRCodeScanner({ onScan, onClose }) {
//     const handleScan = (result) => {
//         if (result) {
//             onScan(result.text);
//             onClose(); // Close the scanner after successful scan
//         }
//     };

//     return (
//         <div className="qr-scanner-container">
//             <QrReader
//                 constraints={{ facingMode: 'environment' }}
//                 onResult={handleScan}
//                 style={{ width: '100%' }}
//             />
//             <button 
//                 onClick={onClose}
//                 className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
//             >
//                 Close Scanner
//             </button>
//         </div>
//     );
// }

// export default QRCodeScanner;