// src/components/UpgradeWithPaypal.jsx
import { useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function UpgradeWithPaypal({ onClose }) {
  const paypalRef = useRef();

  useEffect(() => {
    let currentUser;

    const initPaypal = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          currentUser = user;

          window.paypal.Buttons({
            style: {
              layout: 'vertical',
              color: 'blue',
              shape: 'rect',
              label: 'paypal',
            },
            createOrder: function (data, actions) {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: '6.00' // USD
                  },
                  description: 'RecruitHub Pro Plan - Monthly Subscription'
                }]
              });
            },
            onApprove: async function (data, actions) {
              await actions.order.capture();
              alert('✅ Payment Successful! Pro plan unlocked.');

              // Set user as paid in Firestore
              if (currentUser) {
                await updateDoc(doc(db, 'users', currentUser.uid), {
                  isPaid: true
                });
              }

              onClose();
              window.location.href = '/dashboard';
            },
            onError: function (err) {
              console.error(err);
              alert('❌ Payment failed. Please try again.');
            }
          }).render(paypalRef.current);
        }
      });
    };

    initPaypal();
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
        <h2 className="text-xl font-bold mb-2 text-indigo-600">Upgrade to Pro</h2>
        <p className="text-sm mb-4 text-gray-600">
          Pay once and get unlimited roles, premium features and support.
        </p>
        <div ref={paypalRef}></div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 text-sm border rounded text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
