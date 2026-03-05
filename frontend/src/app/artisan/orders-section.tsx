import { motion, AnimatePresence } from 'framer-motion';
import { Eye, X } from 'lucide-react';
import { formatCurrency, getStatusColor } from '@/utils/helpers';

export function OrdersSection({ 
  activeTab, 
  artisanOrders, 
  selectedOrder, 
  setSelectedOrder, 
  showOrderModal, 
  setShowOrderModal,
  loadingOrderId,
  setLoadingOrderId
}: any) {
  if (activeTab !== 'orders') return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-harar-brown mb-8">Order Management</h1>

        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-harar-sand">
                  <th className="text-left py-4 px-4 text-harar-brown font-semibold">Order ID</th>
                  <th className="text-left py-4 px-4 text-harar-brown font-semibold">Customer</th>
                  <th className="text-left py-4 px-4 text-harar-brown font-semibold">Items</th>
                  <th className="text-left py-4 px-4 text-harar-brown font-semibold">Total</th>
                  <th className="text-left py-4 px-4 text-harar-brown font-semibold">Status</th>
                  <th className="text-left py-4 px-4 text-harar-brown font-semibold">Payment</th>
                  <th className="text-left py-4 px-4 text-harar-brown font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {artisanOrders.map((order: any) => (
                  <tr key={order.id} className="border-b border-harar-sand/50 hover:bg-harar-sand/20">
                    <td className="py-4 px-4 font-medium text-harar-brown">{order.id}</td>
                    <td className="py-4 px-4 text-harar-brown/70">{order.buyerName}</td>
                    <td className="py-4 px-4 text-harar-brown/70">{order.products.length}</td>
                    <td className="py-4 px-4 text-harar-brown font-semibold">{formatCurrency(order.total)}</td>
                    <td className="py-4 px-4">
                      <select
                        value={order.status}
                        onChange={async (e) => {
                          setLoadingOrderId(order.id);
                          const newStatus = e.target.value;
                          try {
                            await fetch(`http://localhost:8000/api/orders/${order.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ status: newStatus })
                            });
                            order.status = newStatus;
                          } catch (error) { console.error('Status update error:', error); }
                          setLoadingOrderId(null);
                        }}
                        disabled={loadingOrderId === order.id}
                        className="px-3 py-1 rounded-lg text-xs font-semibold border border-harar-sand bg-white text-harar-brown"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                        className="flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showOrderModal && selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOrderModal(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-harar-sand px-6 py-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-harar-brown">Order Details</h2>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="p-2 hover:bg-harar-sand rounded-lg transition"
                  >
                    <X className="h-6 w-6 text-harar-brown" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Order Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-harar-brown/60">Order ID</label>
                      <p className="text-lg font-semibold text-harar-brown">{selectedOrder.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-harar-brown/60">Order Date</label>
                      <p className="text-lg font-semibold text-harar-brown">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Buyer Details */}
                  <div className="bg-harar-sand/20 rounded-xl p-4">
                    <h3 className="font-semibold text-harar-brown mb-3">Buyer Details</h3>
                    <div className="space-y-2">
                      <p><span className="text-harar-brown/60">Name:</span> <span className="font-semibold text-harar-brown">{selectedOrder.buyerName}</span></p>
                      <p><span className="text-harar-brown/60">Email:</span> <span className="font-semibold text-harar-brown">{selectedOrder.buyerEmail || 'N/A'}</span></p>
                      <p><span className="text-harar-brown/60">Phone:</span> <span className="font-semibold text-harar-brown">{selectedOrder.buyerPhone || 'N/A'}</span></p>
                      <p><span className="text-harar-brown/60">Address:</span> <span className="font-semibold text-harar-brown">{selectedOrder.buyerAddress || 'N/A'}</span></p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold text-harar-brown mb-3">Items</h3>
                    <div className="space-y-2">
                      {selectedOrder.products.map((product: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-harar-sand/10 rounded-lg">
                          <div>
                            <p className="font-semibold text-harar-brown">{product.name}</p>
                            <p className="text-sm text-harar-brown/60">Qty: {product.quantity}</p>
                          </div>
                          <p className="font-semibold text-harar-brown">{formatCurrency(product.price * product.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Status */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-harar-brown/60">Order Status</label>
                      <select
                        value={selectedOrder.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          setSelectedOrder({ ...selectedOrder, status: newStatus });
                          try {
                            await fetch(`http://localhost:8000/api/orders/${selectedOrder.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ status: newStatus })
                            });
                          } catch (error) { console.error('Status update error:', error); }
                        }}
                        className="w-full mt-2 px-3 py-2 rounded-lg border border-harar-sand bg-white text-harar-brown font-semibold"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-harar-brown/60">Payment Status</label>
                      <p className="text-lg font-semibold text-harar-brown mt-2">{selectedOrder.paymentStatus}</p>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-harar-gold/10 rounded-xl p-4 flex justify-between items-center">
                    <span className="text-lg font-semibold text-harar-brown">Total Amount</span>
                    <span className="text-2xl font-bold text-harar-gold">{formatCurrency(selectedOrder.total)}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setShowOrderModal(false)}
                      className="flex-1 px-6 py-3 border-2 border-harar-sand rounded-xl text-harar-brown font-semibold hover:bg-harar-sand transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
