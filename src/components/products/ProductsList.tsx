import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useOrder } from '../../contexts/OrderContext';
import { useLanguage } from '../../contexts/LanguageContext';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import StockAdjustmentModal from './StockAdjustmentModal';
import StockHistoryModal from './StockHistoryModal';
import { Plus, Search, Edit, Trash2, AlertTriangle, Package, RotateCcw, History, TrendingUp, TrendingDown, Info, HelpCircle } from 'lucide-react';
import StockOverviewWidget from './StockOverviewWidget';
import StockAlertsWidget from './StockAlertsWidget';


export default function ProductsList() {
  const { t } = useLanguage();
  const { products, deleteProduct, stockMovements } = useData();
  const { orders } = useOrder();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [adjustingStock, setAdjustingStock] = useState<string | null>(null);
  const [viewingHistory, setViewingHistory] = useState<string | null>(null);
  const [showActionsHelp, setShowActionsHelp] = useState(false);

  // Calculer le stock restant selon la formule : Stock Initial + Rectifications - Ventes
  const calculateCurrentStock = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return 0;

    // Stock initial
    const initialStock = product.initialStock || 0;

    // Total des rectifications (ajustements)
    const adjustments = stockMovements
      .filter(m => m.productId === productId && m.type === 'adjustment')
      .reduce((sum, m) => sum + m.quantity, 0);

    // Total des commandes livrées (uniquement les commandes, pas les factures)
    const deliveredOrders = orders.reduce((sum, order) => {
      if (order.status === 'livre') {
        return sum + order.items
          .filter(item => item.productName === product.name)
          .reduce((itemSum, item) => itemSum + item.quantity, 0);
      }
      return sum;
    }, 0);

    return initialStock + adjustments - deliveredOrders;
  };

  // Calculer les statistiques des commandes pour un produit
  const getProductOrderStats = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return { ordersCount: 0, totalOrdered: 0, totalOrderValue: 0 };

    let totalOrdered = 0;
    let totalOrderValue = 0;
    let ordersCount = 0;
    const ordersSet = new Set();

    orders.forEach(order => {
      if (order.status === 'livre') {
        let hasProduct = false;
        order.items.forEach(item => {
          if (item.productName === product.name) {
            totalOrdered += item.quantity;
            totalOrderValue += item.total;
            hasProduct = true;
          }
        });
        if (hasProduct) {
          ordersSet.add(order.id);
        }
      }
    });

    ordersCount = ordersSet.size;
    return { ordersCount, totalOrdered, totalOrderValue };
  };

  // Obtenir la dernière commande d'un produit
  const getLastOrderInfo = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return null;

    let lastOrder = null;
    let lastQuantity = 0;

    orders.forEach(order => {
      if (order.status === 'livre') {
        order.items.forEach(item => {
          if (item.productName === product.name) {
            if (!lastOrder || new Date(order.orderDate) > new Date(lastOrder)) {
              lastOrder = order.orderDate;
              lastQuantity = item.quantity;
            }
          }
        });
      }
    });

    return lastOrder ? { date: lastOrder, quantity: lastQuantity } : null;
  };

  const getStatusBadge = (product: typeof products[0]) => {
    const currentStock = calculateCurrentStock(product.id);
    if (currentStock <= 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Rupture
        </span>
      );
    }
    if (currentStock <= product.minStock) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Stock Faible
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        En Stock
      </span>
    );
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      deleteProduct(id);
    }
  };

  const handleEditProduct = (id: string) => {
    setEditingProduct(id);
  };

  const getLastStockAdjustment = (productId: string) => {
    const summary = getProductStockSummary(productId);
    if (!summary || summary.totalAdjustments === 0) return null;
    
    return {
      quantity: summary.totalAdjustments,
      date: summary.lastMovementDate
    };
  };

  const formatQuantity = (quantity: number, unit: string) => {
    return quantity.toLocaleString();
  };

  const getProductStockSummary = (productId: string) => {
    const movements = stockMovements.filter(m => m.productId === productId);
    if (movements.length === 0) return null;

    const totalAdjustments = movements
      .filter(m => m.type === 'adjustment')
      .reduce((sum, m) => sum + m.quantity, 0);

    const lastMovement = movements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    return {
      totalAdjustments,
      lastMovementDate: lastMovement.date
    };
  };

  return (
    <>
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('products')}</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Produit</span>
        </button>
      </div>

      {/* Search and Stats */}
      <StockOverviewWidget />
      <StockAlertsWidget />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Rechercher par nom, SKU ou catégorie..."
              />
            </div>
          </div>
        </div>
        
      
        
      
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Prix Achat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Prix Vente HT
                </th>
              
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Stock Initial
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Commandes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Stock Restant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Stock Rectif
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <span>Actions</span>
                    <div className="relative">
                      <button
                        onMouseEnter={() => setShowActionsHelp(true)}
                        onMouseLeave={() => setShowActionsHelp(false)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                      >
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                      
                      {showActionsHelp && (
                        <div className="absolute top-6 left-0 z-50 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 animate-fade-in">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
                            <Info className="w-4 h-4 text-blue-600" />
                            <span>Guide des Actions</span>
                          </h4>
                          <div className="space-y-3 text-sm">
                            <div className="flex items-center space-x-3">
                              <History className="w-4 h-4 text-purple-600" />
                              <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">Aperçu Stock</p>
                                <p className="text-gray-600 dark:text-gray-300">Voir l'historique complet et les graphiques</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <RotateCcw className="w-4 h-4 text-blue-600" />
                              <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">Rectifier Stock</p>
                                <p className="text-gray-600 dark:text-gray-300">Ajuster le stock (entrée/sortie)</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Edit className="w-4 h-4 text-amber-600" />
                              <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">Modifier</p>
                                <p className="text-gray-600 dark:text-gray-300">Éditer les informations du produit</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Trash2 className="w-4 h-4 text-red-600" />
                              <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">Supprimer</p>
                                <p className="text-gray-600 dark:text-gray-300">Supprimer définitivement le produit</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((product) => {
                const orderStats = getProductOrderStats(product.id);
                const currentStock = calculateCurrentStock(product.id);
                const lastAdjustment = getLastStockAdjustment(product.id);
                const lastOrder = getLastOrderInfo(product.id);
                
                return (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{product.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-900 dark:text-white">{product.purchasePrice.toLocaleString()} MAD</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {product.salePrice.toLocaleString()} MAD
                  </td>
                 
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
    {formatQuantity(product.initialStock || 0, product.unit)} {product.unit || 'unité'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                Min: {formatQuantity(product.minStock || 0, product.unit)} {product.unit || 'unité'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {orderStats.ordersCount} commande{orderStats.ordersCount > 1 ? 's' : ''}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatQuantity(orderStats.totalOrdered, product.unit)} {product.unit || 'unité'} • {orderStats.totalOrderValue.toLocaleString()} MAD
                    </div>
                    {lastOrder && (
                      <div className="text-xs text-blue-600 dark:text-blue-400">
                        Dernière: {new Date(lastOrder.date).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${
                        currentStock <= product.minStock ? 'text-red-600' : 'text-gray-900 dark:text-white'
                      }`}>
                        {formatQuantity(currentStock, product.unit)} {product.unit || 'unité'}
                      </span>
                      {currentStock <= product.minStock && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    {currentStock <= 0 && (
                      <div className="text-xs text-red-600 dark:text-red-400 font-medium">Rupture de stock</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {lastAdjustment ? (
                      <div className="text-sm">
                        <span className={`font-medium ${lastAdjustment.quantity >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {lastAdjustment.quantity > 0 ? '+' : ''}        {formatQuantity(lastAdjustment.quantity, product.unit)} {product.unit || 'unité'}

                        </span>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          le {new Date(lastAdjustment.date).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 dark:text-gray-500">Aucune rectif</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(product)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => setViewingHistory(product.id)}
                        className="text-purple-600 hover:text-purple-700 transition-colors"
                        title="Aperçu Stock"
                      >
                        <History className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setAdjustingStock(product.id)}
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                        title="Rectifier Stock"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditProduct(product.id)}
                        className="text-amber-600 hover:text-amber-700 transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Aucun produit trouvé</p>
          </div>
        )}
      </div>

      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      {editingProduct && (
        <EditProductModal
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          product={products.find(p => p.id === editingProduct)!}
        />
      )}

      {adjustingStock && (
        <StockAdjustmentModal
          isOpen={!!adjustingStock}
          onClose={() => setAdjustingStock(null)}
          product={products.find(p => p.id === adjustingStock)!}
          currentStock={calculateCurrentStock(adjustingStock)}
        />
      )}

      {viewingHistory && (
        <StockHistoryModal
          isOpen={!!viewingHistory}
          onClose={() => setViewingHistory(null)}
          product={products.find(p => p.id === viewingHistory)!}
        />
      )}
    </div>
    </>
  );
}
