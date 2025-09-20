import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Info, 
  X, 
  History, 
  RotateCcw, 
  Edit, 
  Trash2, 
  Eye,
  HelpCircle,
  Lightbulb,
  Target,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export default function ProductActionsGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const actions = [
    {
      id: 'history',
      icon: History,
      title: 'Aperçu Stock',
      description: 'Visualisez l\'historique complet du stock avec graphiques et timeline détaillée',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-700',
      features: [
        'Graphique d\'évolution temporelle',
        'Timeline avec date et heure exactes',
        'Détails des commandes liées',
        'Export CSV de l\'historique',
        'Calcul automatique du stock actuel'
      ]
    },
    {
      id: 'adjust',
      icon: RotateCcw,
      title: 'Rectifier Stock',
      description: 'Ajustez le stock pour corriger les erreurs ou mettre à jour l\'inventaire',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-700',
      features: [
        'Ajouter du stock (réception marchandise)',
        'Retirer du stock (perte, casse, vol)',
        'Définir un nouveau stock (inventaire)',
        'Motifs prédéfinis pour traçabilité',
        'Date et heure exactes de rectification'
      ]
    },
    {
      id: 'edit',
      icon: Edit,
      title: 'Modifier Produit',
      description: 'Modifiez les informations du produit (prix, catégorie, seuils)',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      borderColor: 'border-amber-200 dark:border-amber-700',
      features: [
        'Modifier nom et catégorie',
        'Ajuster prix d\'achat et vente',
        'Changer l\'unité de mesure',
        'Définir stock minimum',
        'Activer/désactiver le produit'
      ]
    },
    {
      id: 'delete',
      icon: Trash2,
      title: 'Supprimer Produit',
      description: 'Supprimez définitivement un produit du catalogue',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-700',
      features: [
        'Suppression définitive du produit',
        'Confirmation de sécurité requise',
        'Historique de stock conservé',
        'Impact sur commandes existantes',
        'Action irréversible'
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <>
      {/* Bouton d'aide flottant */}
      <motion.div 
        className="fixed bottom-6 right-6 z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
          variants={pulseVariants}
          animate="pulse"
          title="Guide des actions produits"
        >
          <HelpCircle className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
        </motion.button>
      </motion.div>

      {/* Modal d'aide */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
              <motion.div
                className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-2xl rounded-2xl"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <motion.div 
                        className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Lightbulb className="w-6 h-6" />
                      </motion.div>
                      <div>
                        <h2 className="text-2xl font-bold">🎯 Guide des Actions Produits</h2>
                        <p className="text-sm opacity-90">Découvrez toutes les fonctionnalités disponibles</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-8">
                  {/* Introduction */}
                  <motion.div 
                    className="text-center mb-8"
                    variants={itemVariants}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      Maîtrisez la Gestion de vos Produits
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Chaque produit dispose de 4 actions principales. Cliquez sur une action pour découvrir ses fonctionnalités.
                    </p>
                  </motion.div>

                  {/* Actions Grid */}
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    variants={itemVariants}
                  >
                    {actions.map((action) => {
                      const Icon = action.icon;
                      const isActive = activeAction === action.id;
                      
                      return (
                        <motion.div
                          key={action.id}
                          className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                            isActive 
                              ? `${action.borderColor} ${action.bgColor} shadow-lg scale-105` 
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md'
                          }`}
                          onClick={() => setActiveAction(isActive ? null : action.id)}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-start space-x-4">
                            <motion.div 
                              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                isActive ? 'bg-white shadow-md' : action.bgColor
                              }`}
                              whileHover={{ rotate: 5 }}
                            >
                              <Icon className={`w-6 h-6 ${action.color}`} />
                            </motion.div>
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                {action.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                {action.description}
                              </p>
                              
                              <AnimatePresence>
                                {isActive && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                                      <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
                                        <Target className="w-4 h-4 text-green-600" />
                                        <span>Fonctionnalités incluses :</span>
                                      </h5>
                                      <ul className="space-y-2">
                                        {action.features.map((feature, index) => (
                                          <motion.li
                                            key={index}
                                            className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                          >
                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                          </motion.li>
                                        ))}
                                      </ul>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>

                  {/* Workflow Section */}
                  <motion.div 
                    className="mt-8 bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-teal-200 dark:border-teal-700"
                    variants={itemVariants}
                  >
                    <h4 className="font-bold text-teal-900 dark:text-teal-100 mb-4 flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5" />
                      <span>🔄 Workflow Recommandé</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-teal-200 dark:border-teal-600">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-white font-bold">1</span>
                        </div>
                        <p className="text-sm font-medium text-teal-800 dark:text-teal-200">Créer le produit</p>
                        <p className="text-xs text-teal-600 dark:text-teal-300">Avec stock initial</p>
                      </div>
                      <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-teal-200 dark:border-teal-600">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-white font-bold">2</span>
                        </div>
                        <p className="text-sm font-medium text-teal-800 dark:text-teal-200">Suivre l'évolution</p>
                        <p className="text-xs text-teal-600 dark:text-teal-300">Via aperçu stock</p>
                      </div>
                      <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-teal-200 dark:border-teal-600">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-white font-bold">3</span>
                        </div>
                        <p className="text-sm font-medium text-teal-800 dark:text-teal-200">Rectifier si besoin</p>
                        <p className="text-xs text-teal-600 dark:text-teal-300">Inventaire, pertes</p>
                      </div>
                      <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-teal-200 dark:border-teal-600">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-white font-bold">4</span>
                        </div>
                        <p className="text-sm font-medium text-teal-800 dark:text-teal-200">Optimiser</p>
                        <p className="text-xs text-teal-600 dark:text-teal-300">Prix, seuils</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Tips Section */}
                  <motion.div 
                    className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-700"
                    variants={itemVariants}
                  >
                    <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-4 flex items-center space-x-2">
                      <Lightbulb className="w-5 h-5" />
                      <span>💡 Conseils d'Utilisation</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-amber-900 dark:text-amber-100">Stock Faible</p>
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                              Utilisez "Rectifier Stock" pour réapprovisionner quand le stock passe sous le seuil minimum.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Eye className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-amber-900 dark:text-amber-100">Suivi Régulier</p>
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                              Consultez l'"Aperçu Stock" régulièrement pour anticiper les ruptures.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <Package className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-amber-900 dark:text-amber-100">Inventaire Physique</p>
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                              Effectuez des inventaires réguliers et utilisez "Définir" pour corriger les écarts.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <TrendingUp className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-amber-900 dark:text-amber-100">Optimisation</p>
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                              Analysez les graphiques pour optimiser vos seuils et prix de vente.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Important Note */}
                  <motion.div 
                    className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700"
                    variants={itemVariants}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <Info className="w-6 h-6 text-green-600" />
                      <h4 className="font-bold text-green-900 dark:text-green-100">ℹ️ Information Importante</h4>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-600">
                      <p className="text-sm text-green-800 dark:text-green-200 leading-relaxed">
                        <strong>🔗 Gestion de Stock Liée aux Commandes :</strong> Le stock est automatiquement géré par les commandes. 
                        Quand une commande est marquée "livrée", le stock est débité. Si elle est "annulée", le stock est restauré. 
                        Les factures n'impactent plus le stock - elles servent uniquement pour la comptabilité.
                      </p>
                    </div>
                  </motion.div>

                  {/* Bouton de fermeture */}
                  <motion.div 
                    className="text-center mt-8"
                    variants={itemVariants}
                  >
                    <button
                      onClick={() => setIsOpen(false)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <CheckCircle className="w-5 h-5" />
                        <span>Parfait, j'ai compris !</span>
                      </span>
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}