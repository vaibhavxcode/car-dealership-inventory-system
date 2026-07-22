import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Plus, Edit2, RotateCcw, Trash2, CheckCircle2, XCircle, Package, Link2, UploadCloud, X } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals & Action States
  const [showFormModal, setShowFormModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);

  // Form Fields State
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('Sedan');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Restock Field State
  const [restockAmount, setRestockAmount] = useState('');

  // Notification State
  const [toast, setToast] = useState(null);

  const categories = ['Sedan', 'SUV', 'Hatchback', 'Truck'];
  const defaultCarCover = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800';

  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/vehicles');
      setVehicles(response.data.data.vehicles);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Open modal for Adding Vehicle
  const handleOpenAdd = () => {
    setCurrentVehicle(null);
    setMake('');
    setModel('');
    setCategory('Sedan');
    setPrice('');
    setQuantity('');
    setImageUrl('');
    setShowFormModal(true);
  };

  // Open modal for Editing Vehicle
  const handleOpenEdit = (vehicle) => {
    setCurrentVehicle(vehicle);
    setMake(vehicle.make);
    setModel(vehicle.model);
    setCategory(vehicle.category);
    setPrice(vehicle.price);
    setQuantity(vehicle.quantity);
    setImageUrl(vehicle.imageUrl || '');
    setShowFormModal(true);
  };

  // Open modal for Restock
  const handleOpenRestock = (vehicle) => {
    setCurrentVehicle(vehicle);
    setRestockAmount('');
    setShowRestockModal(true);
  };

  // Form Submit Handler (Add / Edit)
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!make || !model || !category || price === '' || quantity === '') {
      showToast('error', 'Please fill in all required fields');
      return;
    }

    if (Number(price) < 0 || Number(quantity) < 0) {
      showToast('error', 'Price and quantity must be non-negative');
      return;
    }

    const payload = {
      make,
      model,
      category,
      price: Number(price),
      quantity: Number(quantity),
      imageUrl: imageUrl.trim() || undefined,
    };

    try {
      if (currentVehicle) {
        // Edit Mode
        const response = await api.put(`/vehicles/${currentVehicle._id}`, payload);
        const updated = response.data.data.vehicle;
        setVehicles(vehicles.map((v) => (v._id === currentVehicle._id ? updated : v)));
        showToast('success', 'Vehicle updated successfully!');
      } else {
        // Add Mode
        const response = await api.post('/vehicles', payload);
        const created = response.data.data.vehicle;
        setVehicles([created, ...vehicles]);
        showToast('success', 'Vehicle added successfully!');
      }
      setShowFormModal(false);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Operation failed');
    }
  };

  // Restock Submit Handler
  const handleRestockSubmit = async (e) => {
    e.preventDefault();

    if (restockAmount === '' || isNaN(restockAmount)) {
      showToast('error', 'Please provide a valid quantity');
      return;
    }

    const amount = Number(restockAmount);
    if (amount < 0) {
      showToast('error', 'Restock quantity cannot be negative');
      return;
    }

    try {
      const response = await api.post(`/vehicles/${currentVehicle._id}/restock`, { quantity: amount });
      const updated = response.data.data.vehicle;
      
      setVehicles(vehicles.map((v) => (v._id === currentVehicle._id ? updated : v)));
      showToast('success', `Successfully restocked ${amount} units!`);
      setShowRestockModal(false);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Restock failed');
    }
  };

  // Delete Handler
  const handleDelete = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle from inventory?')) {
      return;
    }

    try {
      await api.delete(`/vehicles/${vehicleId}`);
      setVehicles(vehicles.filter((v) => v._id !== vehicleId));
      showToast('success', 'Vehicle deleted successfully!');
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Deletion failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 bg-white text-zinc-900 relative">
      
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div
            className={`flex items-center space-x-3 px-5 py-4 rounded-2xl border shadow-xl backdrop-blur-md bg-white border-zinc-200 text-zinc-800`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <span className="font-sans font-medium text-sm">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 pb-6 border-b border-zinc-100">
        <div>
          <h1 className="text-3xl font-display font-light tracking-tight text-zinc-950 flex items-center space-x-3">
            <Package className="h-7 w-7 text-zinc-700" />
            <span>Inventory Registry</span>
          </h1>
          <p className="mt-2 text-zinc-400 font-light text-xs max-w-xl tracking-wide">
            Add new vehicle designs, adjust price configurations, delete records, and increment stock counts.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-6 py-3.5 rounded-xl transition-all duration-200 shadow-sm text-xs uppercase tracking-wider cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Table Display */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zinc-400"></div>
          <p className="mt-4 text-zinc-400 text-xs tracking-widest uppercase">Syncing inventory registry...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 border border-zinc-200 bg-zinc-50 rounded-2xl p-6">
          <p className="text-zinc-550 text-sm font-medium">{error}</p>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-20 border border-zinc-200 bg-zinc-50 rounded-2xl p-6">
          <Package className="h-10 w-10 text-zinc-400 mx-auto mb-4" />
          <h3 className="font-display font-bold text-lg text-zinc-800">Registry Empty</h3>
          <p className="text-zinc-400 text-xs mt-1">Get started by registry-entering your first vehicle.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden border border-zinc-150 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-150 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  <th className="px-6 py-5">Vehicle Cover</th>
                  <th className="px-6 py-5">Make / Model</th>
                  <th className="px-6 py-5">Category</th>
                  <th className="px-6 py-5">MSRP Price</th>
                  <th className="px-6 py-5">Inventory Stock</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {vehicles.map((car) => (
                  <tr key={car._id} className="hover:bg-zinc-50/50 transition-colors duration-150 text-xs text-zinc-850">
                    <td className="px-6 py-4">
                      <div className="h-12 w-20 rounded-lg overflow-hidden bg-zinc-50 border border-zinc-100">
                        <img
                          src={car.imageUrl || defaultCarCover}
                          alt={`${car.make} ${car.model}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-display font-bold text-zinc-900 text-sm">{car.model}</div>
                      <div className="text-[10px] text-zinc-400 font-semibold tracking-wider uppercase">{car.make}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-zinc-100 text-zinc-600 border border-zinc-200">
                        {car.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-zinc-700">
                      ${car.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {car.quantity === 0 ? (
                        <span className="inline-flex text-[10px] font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                          Sold Out
                        </span>
                      ) : (
                        <span className="inline-flex text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                          {car.quantity} Units
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => handleOpenRestock(car)}
                          title="Restock Inventory"
                          className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-zinc-400 text-zinc-500 hover:text-zinc-800 transition-all cursor-pointer"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(car)}
                          title="Edit Details"
                          className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-zinc-400 text-zinc-500 hover:text-zinc-800 transition-all cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(car._id)}
                          title="Remove Vehicle"
                          className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-red-400 hover:bg-red-50 text-zinc-500 hover:text-red-750 transition-all cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal (Add / Edit) */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-250">
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-xl border border-zinc-150 animate-in zoom-in-95 duration-250">
            <div className="flex items-center justify-between px-6 py-5 bg-zinc-50 border-b border-zinc-150">
              <h3 className="font-display font-bold text-lg text-zinc-900">
                {currentVehicle ? 'Edit Vehicle details' : 'Add New vehicle'}
              </h3>
              <button
                onClick={() => setShowFormModal(false)}
                className="text-zinc-400 hover:text-zinc-800 p-1 rounded-lg hover:bg-zinc-100"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Make / Manufacturer *
                  </label>
                  <input
                    type="text"
                    required
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    placeholder="e.g. Audi"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-3 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Model Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. e-tron"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-3 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-3 text-xs text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Price"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-3 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Initial Stock *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Quantity"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-3 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                  />
                </div>
              </div>

              {/* Image URL with live preview */}
              <div className="border-t border-zinc-100 pt-4 mt-4 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                    <Link2 className="h-3 w-3 text-zinc-400" />
                    <span>Vehicle Image URL</span>
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-3 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                  />
                </div>

                {/* Cloudinary placeholder */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-300 uppercase tracking-wider mb-1 flex items-center space-x-1 opacity-70">
                    <UploadCloud className="h-3 w-3 text-zinc-300" />
                    <span>Direct File Upload</span>
                  </label>
                  <div className="border border-dashed border-zinc-200 rounded-xl p-3 text-center text-[10px] text-zinc-400 bg-zinc-50/50">
                    Cloudinary integration ready (Local Uploads Disabled)
                  </div>
                </div>

                {/* Live image preview */}
                {imageUrl.trim() && (
                  <div>
                    <div className="text-[9px] uppercase font-bold text-zinc-400 mb-1.5">Live image preview</div>
                    <div className="h-28 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-200">
                      <img
                        src={imageUrl.trim()}
                        alt="Vehicle Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultCarCover;
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2.5 pt-5 border-t border-zinc-150 mt-6">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {showRestockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-250">
          <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-xl border border-zinc-150 animate-in zoom-in-95 duration-250">
            <div className="flex items-center justify-between px-6 py-5 bg-zinc-50 border-b border-zinc-150">
              <h3 className="font-display font-bold text-lg text-zinc-900">Restock Inventory</h3>
              <button
                onClick={() => setShowRestockModal(false)}
                className="text-zinc-400 hover:text-zinc-800 p-1 rounded-lg hover:bg-zinc-100"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="p-6 space-y-4">
              <div className="flex items-center space-x-4 bg-zinc-50 border border-zinc-100 p-4 rounded-xl">
                <div className="h-10 w-16 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                  <img
                    src={currentVehicle?.imageUrl || defaultCarCover}
                    alt={currentVehicle?.model}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-bold text-zinc-900 text-sm">{currentVehicle?.make} {currentVehicle?.model}</div>
                  <div className="text-[10px] text-zinc-500">Current Stock: {currentVehicle?.quantity} units</div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Units to Add *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(e.target.value)}
                  placeholder="e.g. 5"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-3 text-xs text-zinc-800 placeholder-zinc-450 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                />
              </div>

              <div className="flex justify-end space-x-2.5 pt-5 border-t border-zinc-150 mt-6">
                <button
                  type="button"
                  onClick={() => setShowRestockModal(false)}
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
                >
                  Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
