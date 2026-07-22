import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Search, SlidersHorizontal, ArrowRight, RefreshCw, ChevronDown, CheckCircle2, XCircle, Sparkles, Shield, Heart } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Notification State
  const [toast, setToast] = useState(null);

  const categories = ['Sedan', 'SUV', 'Hatchback', 'Truck'];
  const defaultCarCover = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800';

  // Debouncing effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (debouncedSearchQuery) params.search = debouncedSearchQuery;
      if (selectedCategory) params.category = selectedCategory;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const response = await api.get('/vehicles/search', { params });
      const allVehicles = response.data.data.vehicles;
      setVehicles(allVehicles);

      // Slice first 3 items for Featured Vehicles section on initial load or if not filtering
      if (!debouncedSearchQuery && !selectedCategory && !minPrice && !maxPrice) {
        setFeaturedVehicles(allVehicles.slice(0, 3));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  // Fetch when debounced query or any other filters change
  useEffect(() => {
    fetchVehicles();
  }, [debouncedSearchQuery, selectedCategory, minPrice, maxPrice]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  return (
    <div className="bg-white text-zinc-900 min-h-screen">
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

      {/* 1. Full-Screen Volvo-Style Hero Section */}
      <div className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden bg-zinc-50 border-b border-zinc-150">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1920"
            alt="Silver Luxury Car"
            className="w-full h-full object-cover opacity-75 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent opacity-90"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center px-6 mt-16">
          <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-zinc-400 mb-6 block">
            DriveElite Recharge
          </span>
          <h1 className="text-5xl sm:text-8xl font-display font-light tracking-tight text-zinc-950 mb-6 leading-none">
            Scandinavian luxury. <br />
            <span className="font-extrabold text-zinc-900">Pure electric.</span>
          </h1>
          <p className="max-w-md mx-auto text-xs sm:text-sm text-zinc-500 font-light tracking-wide leading-relaxed mb-12">
            Designed for safety. Engineered for responsiveness. Our next generation of luxury vehicles is built to protect the environment and those inside.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#inventory-section"
              className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-9 py-4.5 rounded-full text-xs uppercase tracking-widest transition-all duration-300 hover:scale-105 shadow-sm shadow-zinc-900/10"
            >
              Explore Fleet
            </a>
            <a
              href="#why-choose-us"
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold px-9 py-4.5 rounded-full text-xs uppercase tracking-widest transition-all duration-300"
            >
              Our Vision
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-1 opacity-50 z-10 animate-bounce">
          <span className="text-[8px] uppercase font-bold tracking-widest text-zinc-400">Scroll</span>
          <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
        </div>
      </div>

      {/* 2. Featured Vehicles Section */}
      {!loading && featuredVehicles.length > 0 && (
        <div className="bg-white py-24 border-b border-zinc-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-[9px] uppercase font-bold tracking-[0.25em] text-zinc-450">Curated Selection</span>
              <h2 className="text-3xl sm:text-4xl font-display font-light text-zinc-950 mt-2">
                Featured <span className="font-extrabold text-zinc-900">Models</span>
              </h2>
              <div className="h-[2px] w-12 bg-zinc-200 mx-auto mt-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {featuredVehicles.map((car) => (
                <Link
                  to={`/vehicle/${car._id}`}
                  key={car._id}
                  className="group flex flex-col justify-between overflow-hidden pb-4 hover:opacity-95 transition-all duration-300"
                >
                  <div className="h-48 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-100 relative">
                    <img
                      src={car.imageUrl || defaultCarCover}
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
                    />
                  </div>
                  <div className="mt-5 flex justify-between items-start">
                    <div>
                      <h3 className="font-display font-bold text-lg text-zinc-900">{car.model}</h3>
                      <p className="text-xs text-zinc-400 font-light mt-0.5">{car.make} / {car.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-zinc-800">${car.price.toLocaleString()}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Search & Vehicle Inventory Section */}
      <div id="inventory-section" className="bg-zinc-50/30 py-28 border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[9px] uppercase font-bold tracking-[0.25em] text-zinc-450">Active Catalog</span>
            <h2 className="text-3xl sm:text-4xl font-display font-light text-zinc-950 mt-2">
              Browse <span className="font-extrabold text-zinc-900">Inventory</span>
            </h2>
            <div className="h-[2px] w-12 bg-zinc-200 mx-auto mt-4"></div>
          </div>

          {/* Sleek Horizontal Filter Toolbar */}
          <div className="bg-white border border-zinc-150 rounded-2xl p-5 shadow-sm mb-16 max-w-5xl mx-auto">
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search model, make, or category e.g. Camry, Tesla, SUV..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl pl-10 pr-4 py-3 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                />
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
              </div>

              {/* Category selection */}
              <div className="relative min-w-[165px]">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-4 py-3 text-xs text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget Min/Max */}
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min ($)"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-20 bg-zinc-50 border border-zinc-200/80 rounded-xl px-3 py-3 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
                <span className="text-zinc-300 text-xs">to</span>
                <input
                  type="number"
                  placeholder="Max ($)"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-20 bg-zinc-50 border border-zinc-200/80 rounded-xl px-3 py-3 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-all cursor-pointer flex items-center justify-center space-x-2 text-xs font-bold uppercase tracking-wider"
                  title="Reset Filters"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="lg:hidden">Reset</span>
                </button>
              </div>
            </form>
          </div>

          {/* Catalog Showcase Results */}
          <div id="inventory-results">
            {loading ? (
              <div className="flex flex-col items-center justify-center min-h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zinc-400"></div>
                <p className="mt-4 text-zinc-400 text-[10px] tracking-widest uppercase">Syncing catalog lists...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 border border-zinc-200 bg-zinc-50 rounded-2xl p-6">
                <p className="text-zinc-500 text-sm font-medium">{error}</p>
              </div>
            ) : vehicles.length === 0 ? (
              <div className="text-center py-20 border border-zinc-200 bg-zinc-50 rounded-2xl p-6">
                <h3 className="font-display font-semibold text-lg text-zinc-800 mb-2">No Matching Vehicles</h3>
                <p className="text-zinc-400 text-xs">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 max-w-6xl mx-auto">
                {vehicles.map((car) => {
                  const isOutOfStock = car.quantity === 0;
                  return (
                    <Link
                      to={`/vehicle/${car._id}`}
                      key={car._id}
                      className="group flex flex-col justify-between overflow-hidden relative pb-6 border-b border-zinc-100 hover:border-zinc-300 transition-all duration-300"
                    >
                      <div>
                        {/* Large Simplified Image Showcase */}
                        <div className="h-64 w-full rounded-xl overflow-hidden bg-zinc-50 border border-zinc-100 relative">
                          <img
                            src={car.imageUrl || defaultCarCover}
                            alt={`${car.make} ${car.model}`}
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                          />
                          
                          {/* Sold Out badge */}
                          {isOutOfStock && (
                            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
                              <span className="text-[9px] uppercase font-bold tracking-[0.25em] px-3 py-1.5 rounded-lg border border-zinc-300 bg-white text-zinc-600 shadow-sm">
                                Sold Out
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Card Meta */}
                        <div className="mt-6 flex justify-between items-start">
                          <div>
                            <span className="text-[9px] uppercase font-semibold tracking-widest text-zinc-400">
                              {car.category}
                            </span>
                            <h3 className="font-display font-bold text-xl text-zinc-900 group-hover:text-zinc-600 transition-colors duration-200 mt-0.5">
                              {car.model}
                            </h3>
                            <p className="text-xs text-zinc-500 font-light mt-0.5">{car.make}</p>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-[9px] uppercase font-semibold tracking-widest text-zinc-400">MSRP starting at</span>
                            <div className="font-display font-bold text-lg text-zinc-800 mt-0.5">
                              ${car.price.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Link */}
                      <div className="mt-6 flex items-center space-x-1.5 text-xs text-zinc-400 group-hover:text-zinc-800 transition-colors">
                        <span className="font-bold tracking-widest uppercase text-[10px]">Learn More</span>
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-300 text-zinc-500" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Why Choose Us Section (Luxury values, Volvo inspired) */}
      <div id="why-choose-us" className="bg-white py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-[9px] uppercase font-bold tracking-[0.25em] text-zinc-450">Our Commitment</span>
            <h2 className="text-3xl sm:text-4xl font-display font-light text-zinc-950 mt-2">
              Designed around <span className="font-extrabold text-zinc-900">you</span>
            </h2>
            <div className="h-[2px] w-12 bg-zinc-200 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            {/* Value 1 */}
            <div className="space-y-4">
              <div className="inline-flex bg-zinc-50 border border-zinc-100 p-4 rounded-full text-zinc-700 mx-auto">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 font-display">Safety First</h3>
              <p className="text-xs text-zinc-500 font-light leading-relaxed">
                Inherited safety measures protecting drivers, passengers, and pedestrians. Our safety configurations are continuously updated.
              </p>
            </div>

            {/* Value 2 */}
            <div className="space-y-4">
              <div className="inline-flex bg-zinc-50 border border-zinc-100 p-4 rounded-full text-zinc-700 mx-auto">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 font-display">Pure Electric</h3>
              <p className="text-xs text-zinc-500 font-light leading-relaxed">
                Zero tailpipe emissions. Our Recharge line represents a committed approach to environmental sustainability.
              </p>
            </div>

            {/* Value 3 */}
            <div className="space-y-4">
              <div className="inline-flex bg-zinc-50 border border-zinc-100 p-4 rounded-full text-zinc-700 mx-auto">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 font-display">Scandinavian Design</h3>
              <p className="text-xs text-zinc-500 font-light leading-relaxed">
                Simple forms, luxurious space, and tactile sustainable materials combine to form an interior cabin centered on comfort.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
