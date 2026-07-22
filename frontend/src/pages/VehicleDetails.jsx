import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, ShoppingCart, ShieldCheck, Zap, Gauge, CheckCircle2, XCircle } from 'lucide-react';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const defaultCarCover = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200';

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/vehicles');
        const found = response.data.data.vehicles.find((v) => v._id === id);
        
        if (found) {
          setVehicle(found);
        } else {
          setError('Vehicle model not found in our active inventory.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to retrieve vehicle details.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [id]);

  const handlePurchase = async () => {
    try {
      const response = await api.post(`/vehicles/${vehicle._id}/purchase`);
      
      setVehicle((prev) => ({
        ...prev,
        quantity: prev.quantity - 1,
      }));

      showToast('success', response.data.message || 'Acquisition completed successfully! Preparing shipping details.');
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Transaction failed');
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zinc-400"></div>
        <p className="mt-4 text-zinc-400 text-xs tracking-widest uppercase">Opening configuration details...</p>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center bg-white">
        <h2 className="text-3xl font-display font-bold text-zinc-950 mb-4 font-light">Unable to load details</h2>
        <p className="text-zinc-500 mb-8">{error || 'Unable to connect to the fleet registry.'}</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-2 bg-zinc-900 text-white px-6 py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-zinc-800 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Fleet</span>
        </Link>
      </div>
    );
  }

  const isOutOfStock = vehicle.quantity === 0;

  // Mock luxury specs based on category
  const specs = {
    Sedan: { acceleration: '4.7s', topSpeed: '155 mph', range: '348 miles' },
    SUV: { acceleration: '5.2s', topSpeed: '135 mph', range: '312 miles' },
    Truck: { acceleration: '6.5s', topSpeed: '110 mph', range: '290 miles' },
    Hatchback: { acceleration: '6.9s', topSpeed: '120 mph', range: '275 miles' },
  }[vehicle.category] || { acceleration: '5.0s', topSpeed: '130 mph', range: '310 miles' };

  return (
    <div className="bg-white text-zinc-800 min-h-screen relative pb-20">
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

      {/* Main Luxury Layout */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Navigation Action */}
        <div className="mb-10">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer text-xs font-bold uppercase tracking-wider group"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Inventory Fleet</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Side: Image Showcase */}
          <div className="lg:col-span-8 space-y-8">
            <div className="rounded-2xl overflow-hidden shadow-sm bg-zinc-50 border border-zinc-100 aspect-video relative group">
              <img
                src={vehicle.imageUrl || defaultCarCover}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700 ease-out"
              />
            </div>

            {/* Minimal Spec Board */}
            <div className="grid grid-cols-3 gap-4 bg-zinc-50 border border-zinc-100 rounded-2xl p-6 text-center">
              <div>
                <div className="flex justify-center mb-2">
                  <Zap className="h-4.5 w-4.5 text-zinc-400" />
                </div>
                <div className="text-xl sm:text-2xl font-display font-extrabold text-zinc-900">{specs.acceleration}</div>
                <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider mt-1">0-60 mph</div>
              </div>
              <div className="border-x border-zinc-200">
                <div className="flex justify-center mb-2">
                  <Gauge className="h-4.5 w-4.5 text-zinc-400" />
                </div>
                <div className="text-xl sm:text-2xl font-display font-extrabold text-zinc-900">{specs.topSpeed}</div>
                <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider mt-1">Top Speed</div>
              </div>
              <div>
                <div className="flex justify-center mb-2">
                  <ShieldCheck className="h-4.5 w-4.5 text-zinc-400" />
                </div>
                <div className="text-xl sm:text-2xl font-display font-extrabold text-zinc-900">{specs.range}</div>
                <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider mt-1">Est. Range</div>
              </div>
            </div>
          </div>

          {/* Right Side: Configuration Order Card */}
          <div className="lg:col-span-4 bg-white border border-zinc-250 rounded-2xl p-8 shadow-sm space-y-8 sticky top-24">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 bg-zinc-100 border border-zinc-200 px-3.5 py-1.5 rounded-full">
                {vehicle.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-zinc-900 mt-5 leading-none">
                {vehicle.model}
              </h1>
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-1.5">
                Manufactured by {vehicle.make}
              </div>
            </div>

            {/* Description Text */}
            <div className="text-zinc-500 text-xs font-light leading-relaxed border-y border-zinc-100 py-6">
              Experience modern automotive design at its peak. The {vehicle.make} {vehicle.model} combines premium driving dynamics, high-quality sustainable cabin finishes, and instantaneous power distribution. Ready for immediate transport and delivery.
            </div>

            {/* Price and Stock */}
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest">MSRP Starting at</div>
                <div className="text-2xl font-display font-extrabold text-zinc-900 mt-1">
                  ${vehicle.price.toLocaleString()}
                </div>
              </div>

              <div>
                {isOutOfStock ? (
                  <span className="inline-flex text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-50 px-3 py-1.5 rounded-full border border-red-200">
                    Sold Out
                  </span>
                ) : (
                  <span className="inline-flex text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                    {vehicle.quantity} Available
                  </span>
                )}
              </div>
            </div>

            {/* Purchase button */}
            <button
              onClick={handlePurchase}
              disabled={isOutOfStock}
              className={`w-full flex items-center justify-center space-x-2 py-4 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-200 ${
                isOutOfStock
                  ? 'bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed'
                  : 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm cursor-pointer active:scale-[0.98]'
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>{isOutOfStock ? 'Sold Out' : 'Acquire Vehicle'}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
