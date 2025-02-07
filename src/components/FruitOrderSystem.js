import React, { useState } from 'react';
import { ShoppingBasket, Store, ClipboardList, ShoppingCart } from 'lucide-react';

const FruitOrderSystem = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState({});
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const fruits = [
    { id: 1, name: 'Pommes', unit: 'kg', price: 2.5, image: '🍎' },
    { id: 2, name: 'Bananes', unit: 'kg', price: 1.8, image: '🍌' },
    { id: 3, name: 'Oranges', unit: 'kg', price: 2.0, image: '🍊' },
    { id: 4, name: 'Poires', unit: 'kg', price: 2.3, image: '🍐' },
    { id: 5, name: 'Raisins', unit: 'kg', price: 4.5, image: '🍇' },
    { id: 6, name: 'Fraises', unit: 'kg', price: 5.0, image: '🍓' },
    { id: 7, name: 'Kiwis', unit: 'kg', price: 3.5, image: '🥝' },
    { id: 8, name: 'Mangues', unit: 'pièce', price: 2.0, image: '🥭' },
    { id: 9, name: 'Ananas', unit: 'pièce', price: 3.5, image: '🍍' },
    { id: 10, name: 'Pastèques', unit: 'pièce', price: 5.0, image: '🍉' },
    { id: 11, name: 'Melons', unit: 'pièce', price: 4.0, image: '🍈' },
    { id: 12, name: 'Citrons', unit: 'kg', price: 1.5, image: '🍋' },
    { id: 13, name: 'Pêches', unit: 'kg', price: 3.8, image: '🍑' },
    { id: 14, name: 'Cerises', unit: 'kg', price: 6.0, image: '🍒' },
    { id: 15, name: 'Noix de Coco', unit: 'pièce', price: 3.0, image: '🥥' }
  ];

  const updateOrderQuantity = (fruitId, quantity) => {
    setCurrentOrder(prev => ({
      ...prev,
      [fruitId]: quantity
    }));
  };

  const submitOrder = () => {
    if (!customerName || !customerPhone) {
      alert('Veuillez saisir votre nom et votre téléphone');
      return;
    }

    const orderItems = Object.entries(currentOrder)
      .filter(([, quantity]) => quantity > 0)
      .map(([fruitId, quantity]) => ({
        fruit: fruits.find(f => f.id === parseInt(fruitId)),
        quantity: parseFloat(quantity)
      }));

    if (orderItems.length === 0) {
      alert('Veuillez sélectionner au moins un fruit');
      return;
    }

    const newOrder = {
      id: Date.now(),
      customerName,
      customerPhone,
      items: orderItems,
      date: new Date().toLocaleString('fr-FR'),
      status: 'en attente'
    };

    setOrders([...orders, newOrder]);
    setCurrentOrder({});
    setCustomerName('');
    setCustomerPhone('');
    alert('Commande envoyée avec succès !');
  };

  const getTotalsByFruit = () => {
    const totals = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const { fruit, quantity } = item;
        totals[fruit.id] = (totals[fruit.id] || 0) + quantity;
      });
    });
    return totals;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Store className="w-8 h-8 text-green-500" />
            Système de Commande de Fruits
          </h1>
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            {isAdmin ? 'Vue Client' : 'Vue Admin'}
          </button>
        </div>

        {isAdmin ? (
          // Vue Admin
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-blue-500" />
              Résumé des Commandes
            </h2>
            
            {/* Totaux par Fruit */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Totaux à Acheter:</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(getTotalsByFruit()).map(([fruitId, total]) => {
                  const fruit = fruits.find(f => f.id === parseInt(fruitId));
                  return (
                    <div key={fruitId} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{fruit.image}</span>
                        <div className="text-right">
                          <p className="font-medium">{fruit.name}</p>
                          <p className="text-gray-600">
                            {total.toLocaleString('fr-FR')} {fruit.unit}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Liste des Commandes */}
            <div>
              <h3 className="text-lg font-medium mb-4">Commandes Individuelles:</h3>
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-gray-600">{order.customerPhone}</p>
                      </div>
                      <p className="text-sm text-gray-500">{order.date}</p>
                    </div>
                    <div className="mt-2">
                      {order.items.map((item, idx) => (
                        <p key={idx} className="text-sm">
                          {item.fruit.image} {item.fruit.name}: {item.quantity.toLocaleString('fr-FR')} {item.fruit.unit}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Vue Client
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-green-500" />
              Passer une Commande
            </h2>

            {/* Données Client */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Votre téléphone"
                />
              </div>
            </div>

            {/* Liste des Fruits */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {fruits.map(fruit => (
                <div key={fruit.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{fruit.image}</span>
                    <span className="text-gray-500">{fruit.price.toLocaleString('fr-FR')}€/{fruit.unit}</span>
                  </div>
                  <p className="font-medium mb-2">{fruit.name}</p>
                  <input
                    type="number"
                    min="0"
                    step={fruit.unit === 'kg' ? '0.5' : '1'}
                    value={currentOrder[fruit.id] || ''}
                    onChange={(e) => updateOrderQuantity(fruit.id, e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder={`Quantité (${fruit.unit})`}
                  />
                </div>
              ))}
            </div>

            {/* Bouton Envoyer */}
            <button
              onClick={submitOrder}
              className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
            >
              <ShoppingBasket className="w-5 h-5" />
              Envoyer la Commande
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FruitOrderSystem;