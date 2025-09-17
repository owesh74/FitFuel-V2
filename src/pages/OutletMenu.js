import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext'; // Import the cart context

const OutletMenu = () => {
  const { id } = useParams();
  const [outlet, setOutlet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('itemName');
  const [sortOrder, setSortOrder] = useState('asc');

  // Get the addToCart function from our global context
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchOutletMenu = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/outlets/${id}`);
        setOutlet(res.data);
      } catch (err) {
        toast.error('Failed to fetch menu.');
      } finally {
        setLoading(false);
      }
    };
    fetchOutletMenu();
  }, [id]);

  const filteredAndSortedMenu = outlet?.menu ? outlet.menu
    .filter(item => 
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      
      if (typeof aVal === 'string') {
        return sortOrder === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }) : [];

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) {
      return (
        <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        </svg>
      );
    }
    return sortOrder === 'asc' ? (
      <svg className="w-4 h-4 ml-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
    ) : (
      <svg className="w-4 h-4 ml-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-8">
            <div className="text-center space-y-4">
              <div className="h-10 bg-white/50 rounded-xl w-64 mx-auto"></div>
              <div className="h-6 bg-white/50 rounded-xl w-96 mx-auto"></div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6">
              <div className="h-12 bg-gray-200 rounded-xl mb-6"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex space-x-4">
                    <div className="h-4 bg-gray-200 rounded flex-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!outlet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Menu Not Found</h2>
          <p className="text-gray-600">Sorry, we couldn't find this outlet's menu.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{outlet.name}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{outlet.description}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl mb-8 p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Search menu items..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200 shadow-sm" />
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">{filteredAndSortedMenu.length} item{filteredAndSortedMenu.length !== 1 ? 's' : ''} found</span>
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
          {filteredAndSortedMenu.length === 0 ? (
            <div className="text-center py-16">
               <h3 className="text-lg font-semibold text-gray-800 mb-2">No items found</h3>
               <p className="text-gray-600">Try adjusting your search terms.</p>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50 border-b border-gray-200">
                    <tr>
                      {[
                        { key: 'itemName', label: 'Item Name' }, { key: 'calories', label: 'Calories' }, { key: 'protein', label: 'Protein (g)' }, { key: 'carbs', label: 'Carbs (g)' }, { key: 'fat', label: 'Fat (g)' }
                      ].map(({ key, label }) => (
                        <th key={key} onClick={() => handleSort(key)} className="py-4 px-6 text-left text-sm font-semibold text-gray-800 cursor-pointer hover:bg-blue-50/50 transition-colors select-none">
                          <div className="flex items-center">{label}{getSortIcon(key)}</div>
                        </th>
                      ))}
                      <th className="py-4 px-6 text-center text-sm font-semibold text-gray-800">Add</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/50">
                    {filteredAndSortedMenu.map((item) => (
                      <tr key={item._id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="py-4 px-6 font-medium text-gray-800">{item.itemName}</td>
                        <td className="py-4 px-6"><span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium bg-orange-50 text-orange-700 shadow-sm">{item.calories}</span></td>
                        <td className="py-4 px-6"><span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-700 shadow-sm">{item.protein}</span></td>
                        <td className="py-4 px-6"><span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 shadow-sm">{item.carbs}</span></td>
                        <td className="py-4 px-6"><span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium bg-purple-50 text-purple-700 shadow-sm">{item.fat}</span></td>
                        <td className="py-4 px-6 text-center">
                           <button onClick={() => addToCart(item)} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-110 shadow-lg font-bold">
                            +
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="md:hidden p-4 space-y-4">
                {filteredAndSortedMenu.map((item) => (
                  <div key={item._id} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 hover:shadow-lg transition-all relative">
                    <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">{item.itemName}</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-orange-50/80 rounded-lg p-3 shadow-sm">
                           <div className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-1">Calories</div>
                           <div className="text-lg font-semibold text-orange-800">{item.calories}</div>
                        </div>
                        <div className="bg-emerald-50/80 rounded-lg p-3 shadow-sm">
                           <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-1">Protein</div>
                           <div className="text-lg font-semibold text-emerald-800">{item.protein}g</div>
                        </div>
                        <div className="bg-blue-50/80 rounded-lg p-3 shadow-sm">
                           <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Carbs</div>
                           <div className="text-lg font-semibold text-blue-800">{item.carbs}g</div>
                        </div>
                        <div className="bg-purple-50/80 rounded-lg p-3 shadow-sm">
                           <div className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">Fat</div>
                           <div className="text-lg font-semibold text-purple-800">{item.fat}g</div>
                        </div>
                    </div>
                     <button onClick={() => addToCart(item)} className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full w-9 h-9 flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-110 shadow-lg font-bold">
                      +
                     </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutletMenu;