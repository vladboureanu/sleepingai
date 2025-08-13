'use client';

import { useState } from 'react';

export default function CreditsPage({ onNavigate, darkMode = false }) {
  const [pickedCredits, setPickedCredits] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [basketItems, setBasketItems] = useState([
    { id: 1, credits: 50, price: 9.99, quantity: 1 },
    { id: 2, credits: 25, price: 5.99, quantity: 1 }
  ]);

  const packages = [
    { credits: 10, price: 2.99 },
    { credits: 25, price: 5.99 },
    { credits: 50, price: 9.99 }
  ];

  const pastTransactions = [
    { credits: '+10', description: 'Purchase (May 21)' },
    { credits: '-1', description: 'Story Generation (May 20)' },
    { credits: '+5', description: 'Promo Code Redeem (May 18)' }
  ];

  const addToBasket = (pack) => {
    const found = basketItems.find(item => item.credits === pack.credits);
    if (found) {
      setBasketItems(basketItems.map(item => 
        item.credits === pack.credits 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setBasketItems([...basketItems, { 
        id: Date.now(), 
        credits: pack.credits, 
        price: pack.price, 
        quantity: 1 
      }]);
    }
    
    setModalVisible(true);
    
    setTimeout(() => {
      setModalVisible(false);
    }, 3000);
  };

  const removeItem = (itemId) => {
    setBasketItems(basketItems.filter(item => item.id !== itemId));
  };

  const changeQuantity = (itemId, newQty) => {
    if (newQty <= 0) {
      removeItem(itemId);
    } else {
      setBasketItems(basketItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQty } : item
      ));
    }
  };

  const getTotal = () => {
    return basketItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  const finishPayment = () => {
    onNavigate?.('payment');
  };

  const signOut = () => {
    onNavigate?.('landing');
  };

  return (
    <>
      {darkMode && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-0 transition-opacity duration-300"></div>
      )}

      <div className={`rounded-2xl shadow-2xl p-4 w-full max-w-6xl mx-auto relative z-10 transition-colors duration-300 ${
        darkMode 
          ? 'bg-gray-800 bg-opacity-90 backdrop-blur-md border border-gray-700' 
          : 'bg-white'
      }`}>
        
        {modalVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`rounded-2xl p-8 max-w-md mx-4 text-center relative transition-colors duration-300 ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
            }`}>
              <button 
                onClick={() => setModalVisible(false)}
                className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className={`text-xl font-medium mb-6 transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`} style={{ textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}>
                Your item was successfully added to cart
              </h3>
              
              <button
                onClick={() => setModalVisible(false)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300"
              >
                View Cart
              </button>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-center mb-3 relative">
          <h2 className={`text-2xl font-medium flex items-center transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`} style={{ textShadow: darkMode ? '2px 2px 6px rgba(0,0,0,0.9)' : '' }}>
            <svg className="w-6 h-6 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
            Credits
          </h2>
          <button 
            onClick={() => onNavigate?.('home')}
            className={`absolute right-0 p-2 rounded-full transition-all duration-200 ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <div className="text-center mb-4">
          <div className={`inline-block px-6 py-3 rounded-lg border transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-600 border-gray-600' 
              : 'bg-gray-100 hover:bg-gray-200 border-gray-200'
          }`}>
            <p className={`font-medium transition-colors duration-300 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`} style={{ textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}>
              You have 12 Credits Remaining
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-16">
          
          <div className="space-y-4 pr-4">
            
            <div>
              <h3 className={`text-lg font-semibold mb-3 transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`} style={{ textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}>
                Top Up Credits
              </h3>
              <div className="space-y-2">
                {packages.map((pkg, index) => (
                  <div key={index} className={`flex items-center justify-between border-b pb-2 pl-8 pr-6 transition-colors duration-300 ${
                    darkMode ? 'border-gray-600' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 transition-colors duration-300 ${
                        darkMode ? 'bg-gray-400' : 'bg-gray-800'
                      }`}></div>
                      <span className={`transition-colors duration-300 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`} style={{ textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}>
                        {pkg.credits} credits - £{pkg.price}
                      </span>
                    </div>
                    <button
                      onClick={() => addToBasket(pkg)}
                      className={`flex items-center transition-colors duration-200 ${
                        darkMode ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'
                      }`}
                    >
                      <span className={`mr-2 transition-colors duration-300 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Buy</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m10-5v6a1 1 0 01-1 1H8a1 1 0 01-1-1v-6" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className={`text-lg font-semibold mb-3 transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`} style={{ textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}>
                Transaction History
              </h3>
              <div className="space-y-2">
                {pastTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center pl-6">
                    <div className={`w-2 h-2 rounded-full mr-3 transition-colors duration-300 ${
                      darkMode ? 'bg-gray-500' : 'bg-gray-400'
                    }`}></div>
                    <span className={`text-sm transition-colors duration-300 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} style={{ textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}>
                      <span className="font-medium">{transaction.credits} credits</span> - {transaction.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3 pl-4">
            
            <div className="flex items-center justify-end">
              <svg className={`w-5 h-5 mr-2 transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m10-5v6a1 1 0 01-1 1H8a1 1 0 01-1-1v-6" />
              </svg>
              <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`} style={{ textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}>
                Cart (2)
              </h3>
            </div>

            <p className={`text-sm transition-colors duration-300 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`} style={{ textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}>
              You have 2 Item in your cart
            </p>

            <div className="space-y-3">
              {basketItems.map((item) => (
                <div key={item.id} className={`flex items-center justify-between border rounded-lg p-3 transition-colors duration-300 ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-700 bg-opacity-50' 
                    : 'border-gray-200'
                }`}>
                  <div className="flex-1">
                    <p className={`font-medium transition-colors duration-300 ${
                      darkMode ? 'text-white' : 'text-gray-800'
                    }`} style={{ textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}>
                      {item.credits} credits
                    </p>
                    <p className={`text-sm transition-colors duration-300 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} style={{ textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}>
                      Credits are bought in packs
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <select 
                      value={item.quantity}
                      onChange={(e) => changeQuantity(item.id, parseInt(e.target.value))}
                      className={`border rounded px-2 py-1 text-sm transition-colors duration-300 ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-600 text-white' 
                          : 'border-gray-300 bg-white text-gray-900'
                      }`}
                    >
                      {[1,2,3,4,5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                    <span className={`font-medium transition-colors duration-300 ${
                      darkMode ? 'text-white' : 'text-gray-800'
                    }`} style={{ textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}>
                      £{(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={`border-t pt-2 transition-colors duration-300 ${
              darkMode ? 'border-gray-600' : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-center mb-3">
                <span className={`text-lg font-semibold mr-8 transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`} style={{ textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}>
                  Total
                </span>
                <span className={`text-lg font-semibold transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`} style={{ textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}>
                  £{getTotal()}
                </span>
              </div>

              <button
                onClick={finishPayment}
                disabled={basketItems.length === 0}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                  basketItems.length > 0 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : darkMode
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Complete Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}