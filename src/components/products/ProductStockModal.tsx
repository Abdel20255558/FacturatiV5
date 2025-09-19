@@ .. @@
 import React, { useState } from 'react';
 import { useData } from '../../contexts/DataContext';
+import { useOrder } from '../../contexts/OrderContext';
 import { X, Package, TrendingUp, TrendingDown, Calendar, BarChart3 } from 'lucide-react';
 import { Product } from '../../types';

 interface ProductStockModalProps {
@@ .. @@
 export default function ProductStockModal({ product, isOpen, onClose }: ProductStockModalProps) {
-  const { stockMovements, invoices } = useData();
+  const { stockMovements } = useData();
+  const { orders } = useOrder();
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

-    // Total des ventes
-    const sales = invoices.reduce((sum, invoice) => {
-      return sum + invoice.items
-        .filter(item => item.description === product.name)
-        .reduce((itemSum, item) => itemSum + item.quantity, 0);
-    }, 0);
+    // Total des commandes livrées
+    const deliveredOrders = orders.reduce((sum, order) => {
+      if (order.status === 'livre') {
+        return sum + order.items
+          .filter(item => item.productName === product.name)
+          .reduce((itemSum, item) => itemSum + item.quantity, 0);
+      }
+      return sum;
+    }, 0);

-    return { currentStock: initialStock + adjustments - sales, initialStock, adjustments, sales };
+    return { currentStock: initialStock + adjustments - deliveredOrders, initialStock, adjustments, deliveredOrders };
   };

-  const { currentStock, initialStock, adjustments, sales } = calculateCurrentStock();
+  const { currentStock, initialStock, adjustments, deliveredOrders } = calculateCurrentStock();

   // Obtenir les mouvements de stock pour ce produit
   const productMovements = stockMovements
     .filter(m => m.productId === product.id)
     .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

-  // Obtenir les ventes pour ce produit
-  const productSales = invoices
-    .filter(invoice => invoice.items.some(item => item.description === product.name))
-    .map(invoice => ({
-      ...invoice,
-      quantity: invoice.items
-        .filter(item => item.description === product.name)
-        .reduce((sum, item) => sum + item.quantity, 0)
+  // Obtenir les commandes pour ce produit
+  const productOrders = orders
+    .filter(order => order.items.some(item => item.productName === product.name) && order.status === 'livre')
+    .map(order => ({
+      ...order,
+      quantity: order.items
+        .filter(item => item.productName === product.name)
+        .reduce((sum, item) => sum + item.quantity, 0),
+      total: order.items
+        .filter(item => item.productName === product.name)
+        .reduce((sum, item) => sum + item.total, 0)
     }))
-    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
+    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

   const formatQuantity = (value: number, unit?: string) => {
     if (!unit) return value.toString();
@@ .. @@
                   <div className="text-2xl font-bold text-red-600">
-                    -{formatQuantity(sales, product.unit)}
+                    -{formatQuantity(deliveredOrders, product.unit)}
                   </div>
-                  <div className="text-sm text-gray-500">Vendues</div>
+                  <div className="text-sm text-gray-500">Commandées</div>
                 </div>
               </div>
@@ .. @@
             {activeTab === 'history' && (
               <div className="space-y-4">
-                <h4 className="font-medium text-gray-900 dark:text-white">Historique des ventes</h4>
-                {productSales.length > 0 ? (
+                <h4 className="font-medium text-gray-900 dark:text-white">Historique des commandes</h4>
+                {productOrders.length > 0 ? (
                   <div className="space-y-2">
-                    {productSales.map((sale) => (
-                      <div key={sale.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
+                    {productOrders.map((order) => (
+                      <div key={order.id} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                         <div className="flex items-center space-x-3">
-                          <TrendingDown className="w-4 h-4 text-red-500" />
+                          <Package className="w-4 h-4 text-blue-500" />
                           <div>
-                            <div className="text-sm font-medium text-gray-900 dark:text-white">
-                              Facture #{sale.number}
+                            <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
+                              Commande #{order.orderNumber}
                             </div>
                             <div className="text-xs text-gray-500 dark:text-gray-400">
-                              {new Date(sale.date).toLocaleDateString('fr-FR')}
+                              {new Date(order.orderDate).toLocaleDateString('fr-FR')}
                             </div>
                           </div>
                         </div>
                         <div className="text-right">
-                          <div className="text-sm font-medium text-red-600">
-                            -{formatQuantity(sale.quantity, product.unit)}
+                          <div className="text-sm font-medium text-blue-600">
+                            -{formatQuantity(order.quantity, product.unit)}
+                          </div>
+                          <div className="text-xs text-gray-500">
+                            {order.total.toLocaleString()} MAD
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
-                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">Aucune vente enregistrée</p>
+                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">Aucune commande livrée</p>
                 )}
               </div>
             )}