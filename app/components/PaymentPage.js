'use client';

import { useState } from 'react';

export default function PaymentPage({ onNavigate, darkMode = false }) {
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [holderName, setHolderName] = useState('');
  const [region, setRegion] = useState('United Kingdom');
  const [zipCode, setZipCode] = useState('');
  const [paymentDone, setPaymentDone] = useState(false);

  const processPayment = () => {
    console.log('Processing payment...');
    setPaymentDone(true);
  };

  const formatCard = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const updateCardNum = (e) => {
    const formatted = formatCard(e.target.value);
    if (formatted.length <= 19) {
      setCardNum(formatted);
    }
  };

  const formatDate = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const updateExpiry = (e) => {
    const formatted = formatDate(e.target.value);
    if (formatted.length <= 5) {
      setExpiry(formatted);
    }
  };

  return (
    <>
      {darkMode && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-0 transition-opacity duration-300"></div>
      )}

      <div className={`backdrop-blur-md rounded-3xl shadow-2xl border transition-all duration-300 p-4 max-w-5xl mx-auto relative z-10 ${
        darkMode 
          ? 'bg-gray-800 bg-opacity-90 border-gray-700' 
          : 'bg-white bg-opacity-90 border-white border-opacity-30'
      }`}>
        
        <div className="flex items-center justify-center mb-4">
          <h1 className={`text-xl font-light text-center tracking-tight transition-colors duration-300 flex items-center ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`} style={{ textShadow: darkMode ? '2px 2px 6px rgba(0,0,0,0.9)' : '' }}>
            <svg className="w-6 h-6 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
            Payment Details
          </h1>
          <button 
            onClick={() => onNavigate('credits')}
            className={`absolute top-4 right-4 backdrop-blur-sm rounded-xl p-2 transition-all duration-300 shadow-lg border ${
              darkMode
                ? 'bg-gray-800 bg-opacity-80 border-gray-700 hover:bg-opacity-90 text-gray-300'
                : 'bg-white bg-opacity-80 border-white border-opacity-30 hover:bg-opacity-90 text-gray-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="space-y-4 px-2">
          
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                darkMode ? 'text-gray-200' : 'text-gray-600'
              }`} style={{ textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}>
                Card information
              </label>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="1234 1234 1234 1234"
                  value={cardNum}
                  onChange={updateCardNum}
                  className={`w-full px-3 py-2 border rounded-t-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-300 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  <div className="w-8 h-5 bg-white border border-gray-300 rounded text-blue-600 text-xs flex items-center justify-center font-bold">
                    VISA
                  </div>
                  <div className="w-8 h-5 bg-black rounded flex items-center justify-center relative">
                    <div className="w-2 h-2 bg-red-500 rounded-full absolute" style={{left: '50%', transform: 'translateX(-75%)'}}></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full absolute" style={{left: '50%', transform: 'translateX(-25%)'}}></div>
                    <div className="w-1 h-2 bg-orange-500 rounded-full absolute" style={{left: '50%', transform: 'translateX(-50%)'}}></div>
                  </div>
                  <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                    AMEX
                  </div>
                </div>
              </div>
              
              <div className="flex">
                <input
                  type="text"
                  placeholder="MM / YY"
                  value={expiry}
                  onChange={updateExpiry}
                  className={`flex-1 px-3 py-2 border border-t-0 border-r-0 rounded-bl-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-300 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="CVC"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                    className={`w-full px-3 py-2 border border-t-0 rounded-br-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className={`w-4 h-4 transition-colors duration-300 ${
                      darkMode ? 'text-gray-400' : 'text-gray-400'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                darkMode ? 'text-gray-200' : 'text-gray-600'
              }`} style={{ textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}>
                Cardholder name
              </label>
              <input
                type="text"
                placeholder="Full name on card"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-300 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                darkMode ? 'text-gray-200' : 'text-gray-600'
              }`} style={{ textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}>
                Country or region
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className={`w-full px-3 py-2 border rounded-t-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-300 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Spain">Spain</option>
                <option value="Italy">Italy</option>
              </select>
              
              <input
                type="text"
                placeholder="Postcode"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className={`w-full px-3 py-2 border border-t-0 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-300 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            <button
              onClick={processPayment}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Pay
            </button>
            
          </div>
          
          <div className="hidden lg:block">
            {paymentDone ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h3 className={`text-lg font-medium text-center transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`} style={{ textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}>
                  Payment Successful
                </h3>
                
                <button className={`flex items-center justify-center px-4 py-2 border rounded-lg transition-all duration-300 ${
                  darkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Get PDF Receipt
                </button>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          
        </div>
      </div>
    </>
  );
}