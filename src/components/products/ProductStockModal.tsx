import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useOrder } from '../../contexts/OrderContext';
import { X, Package, TrendingUp, TrendingDown, Calendar, BarChart3 } from 'lucide-react';
import { Product } from '../../types';

interface ProductStockModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductStockModal({ product, isOpen, onClose }: ProductStockModalProps) {
  const { stockMovements } = useData();
  const { orders } = useOrder();
  const [activeTab, setActiveTab] = useState<'overview' | 'movements' | 'history'>('overview');

  if (!isOpen || !product) return null;

  // Calculer le stock actuel selon la formule correcte
  const calculateCurrentStock = () => {
    // Stock initial
    const initialStock = product.initialStock || 0;

    // Total des rectifications
    const adjustments = stockMovements
      .filter(m => m.productId === product.id && m.type === 'adjustment')
      .reduce((sum, m) => sum + m.quantity, 0);

    // Total des commandes livrées
    const deliveredOrders = orders.reduce((sum, order) => {
      if (order.status === 'livre') {
        return sum + order.items
          .filter(item => item.productName === product.name)
          .reduce((itemSum, item) => itemSum + item.quantity, 0);
      }
      return sum;
    }, 0);

    return { currentStock: initialStock + adjustments - deliveredOrders, initialStock, adjustments, deliveredOrders };
  };

  const { currentStock, initialStock, adjustments, deliveredOrders } = calculateCurrentStock();

  // Obtenir les mouvements de stock pour ce produit
  const productMovements = stockMovements
    .filter(m => m.productId === product.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Obtenir les commandes pour ce produit
  const productOrders = orders
    .filter(order => order.items.some(item => item.productName === product.name) && order.status === 'livre')
    .map(order => ({
      ...order,
      quantity: order.items
        .filter(item => item.productName === product.name)
        .reduce((sum, item) => sum + item.quantity, 0),
      total: order.items
        .filter(item => item.productName === product.name)
        .reduce((sum, item) => sum + item.total, 0)
    }))
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

  const formatQuantity = (value: number, unit?: string) => {
    if (!unit) return value.toString();
    
    // Pour les unités de poids (kg, g)
    if (unit === 'kg' || unit === 'g') {
      if (unit === 'kg' && value < 1) {
        return `${(value * 1000).toFixed(0)}g`;
      }
      return `${value}${unit}`;
    }
    
    // Pour les autres unités
    return `${value} ${unit}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Package className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Stock - {product.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gestion et historique du stock
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveTab('movements')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'movements'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Mouvements
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Historique
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Package className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatQuantity(currentStock, product.unit)}
                    </div>
                    <div className="text-sm text-gray-500">Stock actuel</div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <BarChart3 className="w-8 h-8 text-gray-600" />
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-gray-600">
                      {formatQuantity(initialStock, product.unit)}
                    </div>
                    <div className="text-sm text-gray-500">Stock initial</div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-green-600">
                      +{formatQuantity(adjustments, product.unit)}
                    </div>
                    <div className="text-sm text-gray-500">Rectifications</div>
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <TrendingDown className="w-8 h-8 text-red-600" />
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-red-600">
                      -{formatQuantity(deliveredOrders, product.unit)}
                    </div>
                    <div className="text-sm text-gray-500">Commandées</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Informations produit</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Nom:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{product.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Unité:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{product.unit || 'Unité'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Prix unitaire:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{product.price.toLocaleString()} MAD</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Valeur stock actuel:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {(currentStock * product.price).toLocaleString()} MAD
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'movements' && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Mouvements de stock</h4>
              {productMovements.length > 0 ? (
                <div className="space-y-2">
                  {productMovements.map((movement) => (
                    <div key={movement.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {movement.type === 'adjustment' ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {movement.type === 'adjustment' ? 'Rectification' : 'Sortie'}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(movement.date).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          movement.quantity > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {movement.quantity > 0 ? '+' : ''}{formatQuantity(movement.quantity, product.unit)}
                        </div>
                        {movement.reason && (
                          <div className="text-xs text-gray-500">{movement.reason}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">Aucun mouvement enregistré</p>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Historique des commandes</h4>
              {productOrders.length > 0 ? (
                <div className="space-y-2">
                  {productOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Package className="w-4 h-4 text-blue-500" />
                        <div>
                          <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            Commande #{order.orderNumber}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(order.orderDate).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-blue-600">
                          -{formatQuantity(order.quantity, product.unit)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.total.toLocaleString()} MAD
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">Aucune commande livrée</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}