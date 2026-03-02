'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Building, Banknote, CheckCircle } from 'lucide-react';

interface PaymentMethodProps {
  onSelect: (method: string) => void;
}

export default function PaymentMethod({ onSelect }: PaymentMethodProps) {
  const [selected, setSelected] = useState('');

  const methods = [
    { id: 'telebirr', name: 'Telebirr', icon: Smartphone, color: 'bg-blue-500' },
    { id: 'cbe', name: 'CBE Birr', icon: Building, color: 'bg-green-600' },
    { id: 'bank', name: 'Bank Transfer', icon: CreditCard, color: 'bg-purple-600' },
    { id: 'cash', name: 'Cash on Delivery', icon: Banknote, color: 'bg-orange-600' },
  ];

  const handleSelect = (id: string) => {
    setSelected(id);
    onSelect(id);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {methods.map((method) => (
        <motion.button
          key={method.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelect(method.id)}
          className={`relative p-6 rounded-xl border-2 transition ${
            selected === method.id
              ? 'border-harar-gold bg-harar-gold/5'
              : 'border-harar-sand hover:border-harar-clay'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${method.color} text-white`}>
              <method.icon className="h-6 w-6" />
            </div>
            <span className="font-semibold text-harar-brown">{method.name}</span>
          </div>
          {selected === method.id && (
            <CheckCircle className="absolute top-4 right-4 h-6 w-6 text-harar-gold" />
          )}
        </motion.button>
      ))}
    </div>
  );
}
