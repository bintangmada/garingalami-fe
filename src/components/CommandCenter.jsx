import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit2, Trash2, Search, X, Save, Loader2, 
  Image as ImageIcon, ChevronRight, LogOut, 
  BarChart3, Layers, Compass, TrendingUp, 
  ShoppingBag, AlertCircle, Calendar, ArrowRight,
  Monitor, Settings, Database, Briefcase,
  Activity, PieChart, Info, Bell, ShieldCheck,
  FileText, Clock, Users, MousePointer2,
  CheckCircle, ArrowUp, ArrowDown, ChevronDown, Filter,
  CheckCircle2, AlertTriangle
} from 'lucide-react';
import axios from 'axios';

// ==========================================
// 🚀 COMMAND CENTER v5.0 [TITANIUM ELITE]
// ==========================================
console.log("%c 🚀 COMMAND CENTER v5.0 ACTIVE ", "background: #1A1A1A; color: #10b981; font-weight: bold; padding: 15px; border: 2px solid #10b981;");

const CommandCenter = ({ onLogout, onProductChange }) => {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('boss_active_tab') || 'insights';
  });

  useEffect(() => {
    localStorage.setItem('boss_active_tab', activeTab);
  }, [activeTab]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [logs, setLogs] = useState([]);
  const [isLogsLoading, setIsLogsLoading] = useState(false);
  const [analytics, setAnalytics] = useState({ dailyVisits: [], totalToday: 0 });
  const [stats, setStats] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // Custom Elegant Notification States
  const [toasts, setToasts] = useState([]);
  const [confirmConfig, setConfirmConfig] = useState(null);
  const [activePopover, setActivePopover] = useState(null);
  
  const [isConfirmingSave, setIsConfirmingSave] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  
  // DataTable Advanced States
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [columnFilters, setColumnFilters] = useState({
    name: '',
    category: '',
    price: '',
    quota: '',
    status: 'all'
  });

  const adminUser = localStorage.getItem('admin_user') || 'Admin';

  const [formData, setFormData] = useState({
    name: '',
    category: 'Classic',
    price: '',
    quota: '',
    status: 'all',
    description: '',
    mainImageUrl: '',
    expiryDate: ''
  });

  const categories = ['Classic', 'Exotic', 'Crunchy', 'Wellness'];

  useEffect(() => {
    fetchProducts();
    fetchLogs();
    fetchAnalytics();
        fetchStats();
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchAnalytics();
        fetchStats();

    // Set up real-time polling (every 3 seconds)
    const interval = setInterval(() => {
      if (activeTab === 'insights') {
        fetchAnalytics();
        fetchStats();
      } else if (activeTab === 'logs') {
        fetchLogs();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeTab]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setEditingProduct(null);
        setIsAddingNew(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const triggerConfirm = (title, message, onConfirm, type = 'danger') => {
    setConfirmConfig({ title, message, onConfirm, type });
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/analytics/stats');
      setAnalytics(response.data);
    } catch (err) {
      console.error("Analytics fetch failed", err);
    }
  };

  const fetchLogs = async () => {
    setIsLogsLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/admin/logs');
      setLogs(response.data);
    } catch (err) {
      console.error("Logs fetch failed", err);
    } finally {
      setIsLogsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/products/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchProducts = async (page = currentPage) => {
    setIsLoading(true);
    try {
      // Send page and size as params
      const response = await axios.get(`http://localhost:8080/api/products?page=${page}&size=${pageSize}`);
      setProducts(response.data.content); // Access 'content' field from Page object
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch when page changes
  useEffect(() => {
    fetchProducts();
  }, [currentPage, pageSize]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const response = await axios.post('http://localhost:8080/api/upload', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setFormData({ ...formData, mainImageUrl: response.data });
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed. Make sure the backend is running.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectProduct = (product) => {
    setIsAddingNew(false);
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      category: product.category || 'Classic',
      price: product.price || '',
      quota: product.quota || '',
      description: product.description || '',
      mainImageUrl: product.mainImageUrl || '',
      expiryDate: product.expiryDate || ''
    });
  };

  const handleStartNew = () => {
    setEditingProduct(null);
    setIsAddingNew(true);
    setFormData({ name: '', category: 'Classic', price: '', quota: '',
    status: 'all', description: '', mainImageUrl: '', expiryDate: '' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isConfirmingSave) {
      setIsConfirmingSave(true);
      setTimeout(() => setIsConfirmingSave(false), 3000); // Reset after 3s
      return;
    }

    setIsSaving(true);
    try {
      const headers = { 'X-Admin-User': adminUser };
      if (editingProduct) {
        await axios.put(`http://localhost:8080/api/products/admin/${editingProduct.id}`, formData, { headers });
        showToast("Archetype updated successfully", "success");
      } else {
        await axios.post('http://localhost:8080/api/products/admin', formData, { headers });
        showToast("New archetype registered to core", "success");
      }
      
      // Real-time synchronization
      if (onProductChange) onProductChange();
      
      await fetchProducts();
      await fetchStats();
      await fetchLogs();
      setEditingProduct(null);
      setIsAddingNew(false);
      setIsConfirmingSave(false);
    } catch (err) {
      showToast("Core synchronization failed", "error");
    } finally {
      setIsSaving(false);
    }
  };

          const executeToggleStatus = async (product) => {
    try {
      await axios.patch(`http://localhost:8080/api/products/admin/${product.id}/toggle`, {}, {
        headers: { 'X-Admin-User': adminUser }
      });
      showToast('Registry status updated', 'success');
      await fetchProducts(currentPage);
      await fetchStats();
      if (onProductChange) onProductChange();
    } catch (err) {
      showToast('Synchronization failed', 'error');
    }
  };

  const handleToggleStatus = async (product) => {
    setConfirmConfig({
      title: product.active ? 'Archive Archetype?' : 'Activate Archetype?',
      message: product.active 
        ? `Are you sure you want to move "${product.name}" to the archive? It will be hidden from the public catalog.` 
        : `Are you sure you want to reactivate "${product.name}"? It will be visible to all customers again.`,
      confirmLabel: product.active ? 'Yes, Archive' : 'Yes, Activate',
      confirmColor: product.active ? 'bg-rose-500' : 'bg-[#2D5A27]',
      onConfirm: async () => {
        try {
          await axios.patch(`http://localhost:8080/api/products/admin/${product.id}/toggle`, {}, {
            headers: { 'X-Admin-User': adminUser }
          });
          showToast('Registry status updated', 'success');
          await fetchProducts(currentPage);
          await fetchStats();
          if (onProductChange) onProductChange();
        } catch (err) {
          showToast('Synchronization failed', 'error');
        }
        setConfirmConfig(null);
      }
    });
  };


      const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await axios.patch(`http://localhost:8080/api/products/admin/${id}/toggle`, {}, {
        headers: { 'X-Admin-User': adminUser }
      });
      showToast('Product archived successfully');
      
      if (onProductChange) onProductChange();
      await fetchProducts(currentPage);
      await fetchStats();
      
      setEditingProduct(null);
      setIsAddingNew(false);
      setIsConfirmingDelete(false);
    } catch (err) {
      console.error('Archive failed detailed error:', err.response?.data || err.message);
      showToast('Failed to archive product', 'error');
    }
  };



  const handleLogoutWithWarning = () => {
    setShowLogoutConfirm(true);
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesName = p.name.toLowerCase().includes(columnFilters.name.toLowerCase());
      const matchesCat = p.category.toLowerCase().includes(columnFilters.category.toLowerCase());
      const matchesPrice = columnFilters.price === '' || p.price?.toString().includes(columnFilters.price);
      const matchesQuota = columnFilters.quota === '' || p.quota?.toString().includes(columnFilters.quota);
      
      const matchesStatus = columnFilters.status === "all" ? true : (columnFilters.status === "active" ? product.active : !product.active);
      return matchesSearch && matchesName && matchesCat && matchesPrice && matchesQuota && matchesStatus;
    })
    .sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="flex h-screen bg-[#FDFDFD] text-[#1A1A1A] overflow-hidden font-sans selection:bg-[#2D5A27] selection:text-white">
      
      {/* LEFT NAVIGATION */}
      <nav className="w-20 h-full bg-white border-r border-[#F0F0F0] flex flex-col items-center py-12 z-50">
        <div className="mb-20">
          <button 
            onClick={() => setActiveTab('insights')}
            className="w-10 h-10 bg-[#2D5A27]/[0.03] border border-[#2D5A27]/10 rounded-2xl flex items-center justify-center text-[#2D5A27] hover:bg-[#2D5A27] hover:text-white transition-all duration-500 group"
          >
            <Compass size={20} strokeWidth={1.5} className="group-hover:rotate-45 transition-transform duration-500" />
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-10">
          {[
            { id: 'insights', icon: Activity },
            { id: 'inventory', icon: Database },
            { id: 'logs', icon: FileText },
            { id: 'settings', icon: Settings }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`p-3 rounded-xl transition-all duration-500 relative group
                ${activeTab === item.id ? 'text-[#2D5A27]' : 'text-[#A0A0A0] hover:text-[#2D5A27]'}`}
            >
              <div className={`p-3 rounded-xl transition-all duration-500 relative
                ${activeTab === item.id ? 'bg-[#2D5A27]/[0.06] shadow-[0_0_20px_rgba(45,90,39,0.1)]' : 'group-hover:bg-[#FAFAFA]'}`}>
                <item.icon 
                  size={20} 
                  strokeWidth={activeTab === item.id ? 2.5 : 1.5} 
                  className={`transition-all duration-500 ${activeTab === item.id ? 'drop-shadow-[0_0_8px_rgba(45,90,39,0.4)]' : ''}`}
                />
              </div>
            </button>
          ))}
        </div>
      </nav>

      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <header className="h-24 px-12 flex items-center justify-between bg-white/40 backdrop-blur-sm border-b border-[#F8F8F8] sticky top-0 z-40">
           <div className="space-y-1">
              <h1 className="text-[12px] font-black uppercase tracking-[0.4em] text-[#2D5A27]">Atelier Console</h1>
              <p className="text-[9px] text-[#A0A0A0] font-bold uppercase tracking-[0.2em]">Management & Insights</p>
           </div>
           
           <div className="flex items-center gap-8">
              <div className="hidden md:flex items-center gap-6 border-r border-[#F0F0F0] pr-8">
                 <div className="text-right">
                    <p className="text-[8px] font-bold text-[#A0A0A0] uppercase tracking-tighter mb-0.5">Status</p>
                    <div className="flex items-center gap-2 justify-end">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#2D5A27]" />
                      <p className="text-[10px] font-black text-[#2D5A27] uppercase tracking-widest">Active</p>
                    </div>
                 </div>
              </div>
              
              <button className="w-10 h-10 rounded-xl bg-[#FAFAFA] border border-[#F0F0F0] flex items-center justify-center text-[#A0A0A0] hover:text-[#2D5A27] transition-all">
                 <Bell size={18} strokeWidth={1.5} />
              </button>
              
              
                    <div className="relative">
                <button 
                  onClick={handleLogoutWithWarning}
                  className="w-10 h-10 rounded-xl bg-[#FAFAFA] text-[#A0A0A0] border border-[#F0F0F0] flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all active:scale-95"
                >
                   <LogOut size={18} strokeWidth={1.5} />
                </button>

                <AnimatePresence>
                  {showLogoutConfirm && (
                    <>
                      <div className="fixed inset-0 z-[100]" onClick={() => setShowLogoutConfirm(false)} />
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-[280px] bg-white rounded-[2rem] p-8 shadow-2xl border border-[#F2F2F2] z-[101] overflow-hidden"
                      >
                         <div className="space-y-6 text-center">
                            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto">
                               <AlertCircle size={24} />
                            </div>
                            <div className="space-y-2">
                               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1A1A1A]">Confirm Exit</h3>
                               <p className="text-[9px] font-bold text-[#A0A0A0] uppercase tracking-wider">Terminate session?</p>
                            </div>
                            <div className="flex gap-2">
                               <button 
                                 onClick={() => setShowLogoutConfirm(false)}
                                 className="flex-1 bg-[#F8F9FA] text-[#A0A0A0] py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#F2F2F2] transition-all"
                               >
                                 No
                               </button>
                               <button 
                                 onClick={async () => {
                                   try {
                                     await axios.get(`http://localhost:8080/api/auth/logout?user=${adminUser}`);
                                   } catch (err) {
                                     console.error("Logout log failed", err);
                                   }
                                   onLogout();
                                 }}
                                 className="flex-1 bg-red-500 text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all"
                               >
                                 Yes
                               </button>
                            </div>
                         </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
           </div>
        </header>

        <main className="flex-1 p-6 lg:p-6 bg-[#FAFAFA] overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {activeTab === 'insights' ? (
              <motion.div 
                key="insights"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="flex-1 flex flex-col gap-8 w-full"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
                  {[
                    { label: 'Revenue Trend', value: 'Rp 16.7M', icon: TrendingUp },
                    { label: 'Registry Load', value: products.length, icon: Layers },
                    { label: 'Unique Visitors', value: analytics.totalToday, icon: Users },
                    { label: 'Active Orders', value: '24', icon: ShoppingBag }
                  ].map((kpi, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-[#F2F2F2] hover:border-[#2D5A27]/20 transition-all duration-500 group flex items-center gap-6">
                       <div className="w-10 h-10 bg-[#FAFAFA] rounded-xl flex items-center justify-center text-[#A0A0A0] group-hover:bg-[#2D5A27]/[0.04] group-hover:text-[#2D5A27] transition-all duration-500">
                          <kpi.icon size={18} strokeWidth={1.5} />
                       </div>
                       <div className="space-y-0.5">
                          <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#A0A0A0]">{kpi.label}</p>
                          <div className="flex items-baseline gap-2">
                             <h3 className="text-lg font-black tracking-tight text-[#1A1A1A]">{kpi.value}</h3>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
                   <div className="lg:col-span-2 bg-white rounded-3xl border border-[#F2F2F2] p-8 space-y-8 flex flex-col">
                      <div className="flex justify-between items-end shrink-0">
                         <div>
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]">Market Performance</h4>
                            <p className="text-[9px] text-[#A0A0A0] font-bold mt-1 uppercase tracking-widest">Global Analytics</p>
                         </div>
                      </div>
                      <div className="flex-1 flex items-end justify-between gap-4 min-h-0 pb-2">
                        {[45, 75, 55, 95, 85, 110, 90, 65, 80, 100].map((val, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-4 h-full justify-end group">
                             <motion.div 
                               initial={{ height: 0 }}
                               animate={{ height: `${val}%` }}
                               transition={{ delay: i * 0.1, duration: 1.2 }}
                               className="w-full max-w-[12px] bg-[#F8F8F8] group-hover:bg-[#2D5A27]/20 transition-all duration-300 rounded-t-lg"
                             />
                          </div>
                        ))}
                      </div>
                   </div>

                   <div className="flex flex-col gap-8">
                      <div className="flex-1 bg-[#2D5A27] rounded-3xl p-8 text-white flex flex-col justify-between overflow-hidden relative group">
                         <div className="space-y-4 relative z-10">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                               <AlertCircle size={20} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-light">
                               <span className="font-black italic underline decoration-white/20">{products.filter(p => p.quota < 15).length} pieces</span> with critical stock levels.
                            </h3>
                         </div>
                         <button 
                            onClick={() => setActiveTab('inventory')}
                            className="w-full bg-white text-[#2D5A27] py-4 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#F2F2F2] transition-all relative z-10"
                         >
                            Manage Inventory
                         </button>
                      </div>
                   </div>
                </div>
              </motion.div>
            ) : activeTab === 'inventory' ? (
              <motion.div 
                key="inventory"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative flex flex-col w-full h-[calc(100vh-140px)]"
              >
                                {/* STATS OVERVIEW */}
                {stats && (
                  <div className="grid grid-cols-4 gap-6 mb-8 shrink-0">
                    {[
                      { label: 'Total Archetypes', value: stats.totalActive, icon: Database, color: 'text-blue-500', bg: 'bg-blue-50' },
                      { label: 'Stock Volume', value: stats.totalStock?.toLocaleString(), icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                      { label: 'Category Spread', value: stats.categoryCount, icon: Layers, color: 'text-amber-500', bg: 'bg-amber-50' },
                      { label: 'Inactive Archetypes', value: stats.archivedCount, icon: Trash2, color: 'text-rose-500', bg: 'bg-rose-50' }
                    ].map((stat, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white border border-[#F2F2F2] p-6 rounded-[2rem] flex items-center gap-5 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl`}>
                          <stat.icon size={20} />
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#A0A0A0]">{stat.label}</p>
                          <h4 className="text-[18px] font-black text-[#1A1A1A] mt-1">{stat.value}</h4>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                {/* ACTION BAR */}
                <div className="mb-6 flex items-center justify-between gap-6 shrink-0">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#1A1A1A] rounded-2xl text-white shadow-xl shadow-black/10">
                        <Database size={20} />
                      </div>
                      <div>
                        <h3 className="text-[14px] font-black uppercase tracking-[0.3em] text-[#1A1A1A]">Master Inventory</h3>
                        <p className="text-[9px] text-[#A0A0A0] font-bold uppercase tracking-widest mt-1">Direct Catalog Access Suite</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                                          
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#CCCCCC]" size={16} />
                        <input 
                          type="text" 
                          placeholder="Global ID / Name Search..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="bg-white border border-[#F0F0F0] rounded-2xl pl-12 pr-6 py-4 text-[11px] font-bold tracking-wider focus:outline-none focus:border-[#2D5A27]/30 transition-all text-[#1A1A1A] placeholder:text-[#CCCCCC] w-96 shadow-sm"
                        />
                      </div>
                                          
                      <button 
                        onClick={handleStartNew}
                        className="bg-[#2D5A27] hover:bg-[#1A5A27] text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] transition-all shadow-xl shadow-[#2D5A27]/20 flex items-center gap-3"
                      >
                        <Plus size={16} />
                        Register Archetype
                      </button>
                   </div>
                </div>

                {/* THE TABLE CORE */}
                <div className="flex-1 bg-white rounded-[2.5rem] border border-[#F2F2F2] flex flex-col overflow-hidden shadow-sm">
                   <div className="flex-1 overflow-auto custom-scrollbar">
                      <table className="w-full text-left border-separate border-spacing-0">
                        <thead className="sticky top-0 bg-white/95 backdrop-blur-md z-30">
                          <tr>
                                                        <th className="px-6 py-4 border-b border-[#F8F8F8] text-[10px] font-black uppercase tracking-widest text-[#1A1A1A] bg-[#FAFAFA]/20">Status</th>
                            <th className="px-6 py-4 border-b border-[#F8F8F8] text-[10px] font-black uppercase tracking-widest text-[#1A1A1A] bg-[#FAFAFA]/20">
                              <button onClick={() => requestSort('name')} className="flex items-center gap-2 hover:text-[#2D5A27] transition-colors">
                                Product Designation {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                              </button>
                            </th>
                            <th className="px-6 py-4 border-b border-[#F8F8F8] text-[10px] font-black uppercase tracking-widest text-[#1A1A1A] bg-[#FAFAFA]/20">
                              <button onClick={() => requestSort('category')} className="flex items-center gap-2 hover:text-[#2D5A27] transition-colors">
                                Category Class {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                              </button>
                            </th>
                            <th className="px-6 py-4 border-b border-[#F8F8F8] text-[10px] font-black uppercase tracking-widest text-[#1A1A1A] bg-[#FAFAFA]/20">
                              <button onClick={() => requestSort('price')} className="flex items-center gap-2 hover:text-[#2D5A27] transition-colors">
                                Valuation {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                              </button>
                            </th>
                            <th className="px-6 py-4 border-b border-[#F8F8F8] text-[10px] font-black uppercase tracking-widest text-[#1A1A1A] bg-[#FAFAFA]/20">
                              <button onClick={() => requestSort('quota')} className="flex items-center gap-2 hover:text-[#2D5A27] transition-colors">
                                Inventory {sortConfig.key === 'quota' && (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                              </button>
                            </th>
                            <th className="px-6 py-4 border-b border-[#F8F8F8] text-[10px] font-black uppercase tracking-widest text-[#1A1A1A] bg-[#FAFAFA]/20">Status & Cycle</th>
                          </tr>
                          <tr className="bg-[#FAFAFA]/50">
                            <td className="px-6 py-2 border-b border-[#F8F8F8]">
                              <select 
                                value={columnFilters.status}
                                onChange={(e) => setColumnFilters({...columnFilters, status: e.target.value})}
                                className="w-full bg-white border border-[#F0F0F0] rounded-xl px-4 py-2.5 text-[10px] font-bold focus:outline-none focus:border-[#2D5A27]/30"
                              >
                                <option value="all">All Status</option>
                                <option value="active">Active Only</option>
                                <option value="inactive">Archived Only</option>
                              </select>
                            </td>
                            <td className="px-6 py-2 border-b border-[#F8F8F8]">
                              <input 
                                placeholder="Filter name..."
                                value={columnFilters.name}
                                onChange={(e) => setColumnFilters({...columnFilters, name: e.target.value})}
                                className="w-full bg-white border border-[#F0F0F0] rounded-xl px-4 py-2.5 text-[10px] font-bold focus:outline-none focus:border-[#2D5A27]/30"
                              />
                            </td>
                            <td className="px-6 py-2 border-b border-[#F8F8F8]">
                              <select 
                                value={columnFilters.category}
                                onChange={(e) => setColumnFilters({...columnFilters, category: e.target.value})}
                                className="w-full bg-white border border-[#F0F0F0] rounded-xl px-4 py-2.5 text-[10px] font-bold focus:outline-none"
                              >
                                <option value="">All Archetypes</option>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </td>
                            <td className="px-6 py-2 border-b border-[#F8F8F8]">
                              <input 
                                placeholder="Price range..."
                                value={columnFilters.price}
                                onChange={(e) => setColumnFilters({...columnFilters, price: e.target.value})}
                                className="w-full bg-white border border-[#F0F0F0] rounded-xl px-4 py-2.5 text-[10px] font-bold focus:outline-none"
                              />
                            </td>
                            <td className="px-6 py-2 border-b border-[#F8F8F8]">
                              <input 
                                placeholder="Stock level..."
                                value={columnFilters.quota}
                                onChange={(e) => setColumnFilters({...columnFilters, quota: e.target.value})}
                                className="w-full bg-white border border-[#F0F0F0] rounded-xl px-4 py-2.5 text-[10px] font-bold focus:outline-none"
                              />
                            </td>
                            <td className="px-6 py-2 border-b border-[#F8F8F8]">
                               <div className="text-center text-[8px] font-black text-[#D0D0D0] uppercase tracking-widest">Active Filters</div>
                            </td>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F8F8F8]">
                          {filteredProducts.map((p) => (
                            <tr 
                              key={p.id}
                              onClick={() => handleSelectProduct(p)}
                              className={`hover:bg-[#2D5A27]/[0.03] transition-colors cursor-pointer group
                                ${editingProduct?.id === p.id ? 'bg-[#2D5A27]/[0.05]' : ''}`}
                            >
                                                            <td className="px-6 py-4">
                                                                <div className="relative inline-block">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setActivePopover(p.id); }}
                                    title={p.active ? "Deactivate Product" : "Activate Product"}
                                    className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer hover:scale-105 active:scale-95 ${p.active ? "bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-600 hover:text-white" : "bg-rose-50 text-rose-500 border border-rose-100 hover:bg-rose-500 hover:text-white"}`}
                                  >
                                    {p.active ? "Active" : "Archived"}
                                  </button>

                                  <AnimatePresence>
                                    {activePopover === p.id && (
                                      <>
                                        <div className="fixed inset-0 z-[50]" onClick={(e) => { e.stopPropagation(); setActivePopover(null); }} />
                                        <motion.div 
                                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                          animate={{ opacity: 1, y: 0, scale: 1 }}
                                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-[200px] bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-[#F0F0F0] p-4 z-[60] text-center"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <p className="text-[9px] font-black uppercase tracking-wider text-[#1A1A1A] mb-3">{p.active ? 'Archive this?' : 'Activate this?'}</p>
                                          <div className="flex gap-2">
                                            <button 
                                              onClick={() => setActivePopover(null)}
                                              className="flex-1 py-2 rounded-lg bg-[#FAFAFA] text-[#A0A0A0] text-[8px] font-black uppercase tracking-widest hover:bg-[#F2F2F2]"
                                            >
                                              No
                                            </button>
                                            <button 
                                              onClick={() => {
                                                executeToggleStatus(p);
                                                setActivePopover(null);
                                              }}
                                              className={`flex-1 py-2 rounded-lg text-white text-[8px] font-black uppercase tracking-widest ${p.active ? 'bg-rose-500' : 'bg-[#2D5A27]'}`}
                                            >
                                              Yes
                                            </button>
                                          </div>
                                          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white" />
                                        </motion.div>
                                      </>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-5">
                                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#F0F0F0] bg-white group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                    <img src={p.mainImageUrl || p.image} className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                    <h4 className="text-[12px] font-black text-[#1A1A1A]">{p.name}</h4>
                                    <p className="text-[10px] text-[#A0A0A0] font-bold uppercase tracking-tighter">ID: {p.id}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-3 py-1.5 rounded-lg bg-[#FAFAFA] text-[#2D5A27] text-[9px] font-black uppercase tracking-widest border border-[#F0F0F0]">
                                  {p.category}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-[13px] font-black text-[#1A1A1A]">
                                Rp {p.price?.toLocaleString()}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex-1 h-1.5 w-16 bg-[#F8F8F8] rounded-full overflow-hidden border border-[#F0F0F0]">
                                    <div 
                                      className={`h-full rounded-full transition-all duration-1000 ${p.quota < 20 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'}`} 
                                      style={{ width: `${Math.min(100, (p.quota / 100) * 100)}%` }}
                                    />
                                  </div>
                                  <span className={`text-[10px] font-black ${p.quota < 20 ? 'text-red-500' : 'text-[#1A1A1A]'}`}>
                                    {p.quota} <span className="text-[#A0A0A0]">Units</span>
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex gap-8">
                                  <div className="space-y-1">
                                    <p className="text-[8px] font-black text-[#D0D0D0] uppercase tracking-tighter">Registered</p>
                                    <p className="text-[10px] font-bold text-[#1A1A1A] tabular-nums">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}</p>
                                  </div>
                                  <div className="space-y-1 border-l border-[#F0F0F0] pl-6">
                                    <p className="text-[8px] font-black text-[#2D5A27] uppercase tracking-tighter">Updated</p>
                                    <p className="text-[10px] font-bold text-[#1A1A1A] tabular-nums">{p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : '-'}</p>
                                  </div>
                                  {p.expiryDate && (
                                    <div className="space-y-1 border-l border-[#F0F0F0] pl-6">
                                      <p className="text-[8px] font-black text-amber-500 uppercase tracking-tighter">Expiry</p>
                                      <p className="text-[10px] font-bold text-[#1A1A1A] tabular-nums">{new Date(p.expiryDate).toLocaleDateString()}</p>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-3">
                                                                  <div className="relative inline-block">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setActivePopover(p.id); }}
                                    title={p.active ? "Deactivate Product" : "Activate Product"}
                                    className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer hover:scale-105 active:scale-95 ${p.active ? "bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-600 hover:text-white" : "bg-rose-50 text-rose-500 border border-rose-100 hover:bg-rose-500 hover:text-white"}`}
                                  >
                                    {p.active ? "Active" : "Archived"}
                                  </button>

                                  <AnimatePresence>
                                    {activePopover === p.id && (
                                      <>
                                        <div className="fixed inset-0 z-[50]" onClick={(e) => { e.stopPropagation(); setActivePopover(null); }} />
                                        <motion.div 
                                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                          animate={{ opacity: 1, y: 0, scale: 1 }}
                                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-[200px] bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-[#F0F0F0] p-4 z-[60] text-center"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <p className="text-[9px] font-black uppercase tracking-wider text-[#1A1A1A] mb-3">{p.active ? 'Archive this?' : 'Activate this?'}</p>
                                          <div className="flex gap-2">
                                            <button 
                                              onClick={() => setActivePopover(null)}
                                              className="flex-1 py-2 rounded-lg bg-[#FAFAFA] text-[#A0A0A0] text-[8px] font-black uppercase tracking-widest hover:bg-[#F2F2F2]"
                                            >
                                              No
                                            </button>
                                            <button 
                                              onClick={() => {
                                                executeToggleStatus(p);
                                                setActivePopover(null);
                                              }}
                                              className={`flex-1 py-2 rounded-lg text-white text-[8px] font-black uppercase tracking-widest ${p.active ? 'bg-rose-500' : 'bg-[#2D5A27]'}`}
                                            >
                                              Yes
                                            </button>
                                          </div>
                                          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white" />
                                        </motion.div>
                                      </>
                                    )}
                                  </AnimatePresence>
                                </div>
                                  <button 
                                    onClick={() => setEditingProduct(p)}
                                    className="p-3 bg-white border border-[#F0F0F0] text-[#A0A0A0] rounded-xl hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-all shadow-sm"
                                    title="Modify Archetype"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                </div>
                              </td>

                            </tr>
                          ))}
                        </tbody>
                      </table>
                   </div>
                   {/* FOOTER */}
                   <div className="px-6 py-4 border-t border-[#F8F8F8] flex items-center justify-between bg-[#FAFAFA]/30 shrink-0">
                       <p className="text-[10px] text-[#A0A0A0] font-bold uppercase tracking-[0.2em]">
                         Showing <span className="text-[#1A1A1A]">{products.length}</span> of <span className="text-[#1A1A1A]">{totalElements}</span> Core Entries
                       </p>
                       <div className="flex items-center gap-2">
                         <button 
                           onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                           disabled={currentPage === 0}
                           className={`w-10 h-10 rounded-xl border border-[#F0F0F0] flex items-center justify-center transition-all ${currentPage === 0 ? 'text-[#CCCCCC] cursor-not-allowed' : 'text-[#A0A0A0] hover:bg-white'}`}
                         >
                           <ChevronRight size={18} className="rotate-180" />
                         </button>
                         
                         {[...Array(totalPages)].map((_, i) => (
                           <button 
                             key={i}
                             onClick={() => setCurrentPage(i)}
                             className={`w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-black transition-all
                               ${currentPage === i 
                                 ? 'bg-[#1A1A1A] text-white shadow-lg' 
                                 : 'border border-[#F0F0F0] text-[#A0A0A0] hover:bg-white'}`}
                           >
                             {i + 1}
                           </button>
                         ))}

                         <button 
                           onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                           disabled={currentPage === totalPages - 1}
                           className={`w-10 h-10 rounded-xl border border-[#F0F0F0] flex items-center justify-center transition-all ${currentPage === totalPages - 1 ? 'text-[#CCCCCC] cursor-not-allowed' : 'text-[#A0A0A0] hover:bg-white'}`}
                         >
                           <ChevronRight size={18} />
                         </button>
                       </div>
                    </div>
                </div>

                {/* SLIDING INSPECTOR DRAWER */}
                <AnimatePresence>
                  {(editingProduct || isAddingNew) && (
                    <>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => {setEditingProduct(null); setIsAddingNew(false);}}
                        className="fixed inset-0 z-[100] bg-black/10 backdrop-blur-[2px]"
                      />
                      <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 bottom-0 w-[550px] z-[101] bg-white border-l border-[#F2F2F2] shadow-[-20px_0_60px_rgba(0,0,0,0.05)] flex flex-col"
                      >
                         <div className="px-8 py-10 border-b border-[#F8F8F8] flex items-center justify-between bg-[#FAFAFA]/50 shrink-0">
                            <div className="flex items-center gap-5">
                               <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] flex items-center justify-center text-white shadow-lg">
                                  {isAddingNew ? <Plus size={24} /> : <Edit2 size={24} />}
                               </div>
                               <div>
                                  <h4 className="text-[13px] font-black uppercase tracking-[0.4em] text-[#1A1A1A]">Entry Inspector</h4>
                                  <p className="text-[9px] text-[#A0A0A0] font-black uppercase tracking-widest mt-1.5">
                                    {isAddingNew ? 'Initializing New core' : `Modifying Archive: ${editingProduct?.id}`}
                                  </p>
                               </div>
                            </div>
                            <button 
                              onClick={() => {setEditingProduct(null); setIsAddingNew(false);}}
                              className="w-12 h-12 rounded-full border border-[#F0F0F0] flex items-center justify-center text-[#A0A0A0] hover:text-red-500 hover:border-red-100 transition-all"
                            >
                               <X size={20} />
                            </button>
                         </div>

                         <div className="flex-1 overflow-y-auto custom-scrollbar p-12">
                            <form id="inspector-form" onSubmit={handleSave} className="space-y-16">
                               <div className="space-y-4">
                                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#A0A0A0]">Visual Identity</label>
                                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                                  <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-video rounded-[2.5rem] border-2 border-dashed border-[#F0F0F0] bg-[#FAFAFA] relative overflow-hidden group cursor-pointer hover:border-[#2D5A27]/20 transition-all shadow-inner"
                                  >
                                     {isUploading && (
                                       <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
                                          <Loader2 className="animate-spin text-[#2D5A27]" size={28} />
                                          <p className="text-[9px] font-black uppercase tracking-widest text-[#2D5A27]">Uploading Asset...</p>
                                       </div>
                                     )}
                                     {(formData.mainImageUrl || formData.image) ? (
                                       <img src={formData.mainImageUrl || formData.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                     ) : (
                                       <div className="w-full h-full flex flex-col items-center justify-center text-[#DEDEDE]">
                                          <ImageIcon size={48} strokeWidth={1} />
                                          <p className="text-[9px] font-black uppercase tracking-widest mt-4">Select Product Asset</p>
                                       </div>
                                     )}
                                  </div>
                               </div>

                               <div className="space-y-12">
                                  <div className="space-y-3">
                                     <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#A0A0A0]">Archetype Designation</label>
                                     <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-transparent border-b-2 border-[#F2F2F2] py-4 text-[22px] font-black focus:border-[#2D5A27] outline-none transition-colors placeholder:text-[#EEEEEE]" placeholder="ENTER NAME" />
                                  </div>

                                  <div className="grid grid-cols-2 gap-10">
                                     <div className="space-y-3">
                                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#A0A0A0]">Valuation (IDR)</label>
                                        <input required type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-transparent border-b-2 border-[#F2F2F2] py-4 text-[18px] font-black focus:border-[#2D5A27] outline-none transition-colors" />
                                     </div>
                                     <div className="space-y-3">
                                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#A0A0A0]">Stock Registry</label>
                                        <input required type="number" value={formData.quota} onChange={(e) => setFormData({...formData, quota: e.target.value})} className="w-full bg-transparent border-b-2 border-[#F2F2F2] py-4 text-[18px] font-black focus:border-[#2D5A27] outline-none transition-colors" />
                                     </div>
                                  </div>

                                  <div className="space-y-6">
                                     <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#A0A0A0]">Classification</label>
                                     <div className="flex flex-wrap gap-3">
                                        {categories.map(cat => (
                                          <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setFormData({...formData, category: cat})}
                                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                                              ${formData.category === cat 
                                                ? 'bg-[#1A1A1A] text-white shadow-xl shadow-black/20 scale-105' 
                                                : 'bg-[#FAFAFA] text-[#A0A0A0] border border-[#F0F0F0] hover:bg-white'}`}
                                          >
                                            {cat}
                                          </button>
                                        ))}
                                     </div>
                                  </div>

                                  <div className="space-y-4">
                                     <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#A0A0A0]">Expiry Cycle</label>
                                     <input 
                                        type="date" 
                                        value={formData.expiryDate ? formData.expiryDate.split('T')[0] : ''} 
                                        onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} 
                                        className="w-full bg-[#FAFAFA] border border-[#F0F0F0] rounded-2xl px-6 py-4 text-[12px] font-bold focus:bg-white focus:border-[#2D5A27]/20 outline-none transition-all shadow-sm" 
                                     />
                                  </div>

                                  <div className="space-y-4">
                                     <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#A0A0A0]">Technical Narrative</label>
                                     <textarea 
                                        value={formData.description} 
                                        onChange={(e) => setFormData({...formData, description: e.target.value})} 
                                        rows={5}
                                        placeholder="Define the essence of this archetype..."
                                        className="w-full bg-[#FAFAFA] border border-[#F0F0F0] rounded-[2rem] p-8 text-[13px] font-medium leading-relaxed focus:bg-white focus:border-[#2D5A27]/20 outline-none transition-all resize-none shadow-inner"
                                     />
                                  </div>
                               </div>
                            </form>
                         </div>

                          <div className="p-12 border-t border-[#F8F8F8] bg-[#FAFAFA]/50 space-y-4 shrink-0">
                             {/* SAVE SECTION */}
                             {!isConfirmingSave ? (
                                <button 
                                   form="inspector-form"
                                   disabled={isSaving || isConfirmingDelete}
                                   type="button"
                                   onClick={() => { setIsConfirmingSave(true); setIsConfirmingDelete(false); }}
                                   className={`w-full py-6 rounded-[2rem] text-white text-[11px] font-black uppercase tracking-[0.5em] transition-all duration-300 flex items-center justify-center gap-4 ${isConfirmingDelete ? 'bg-gray-100 text-gray-300 shadow-none pointer-events-none' : 'bg-[#1A1A1A] hover:bg-[#2D5A27] shadow-black/10'}`}
                                >
                                   {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                   {isSaving ? "Synchronizing..." : "Commit To Registry"}
                                </button>
                             ) : (
                                <div className="flex gap-2 animate-in fade-in zoom-in duration-200">
                                   <button 
                                      type="button"
                                      onClick={() => setIsConfirmingSave(false)}
                                      className="flex-1 py-6 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-[2rem] hover:bg-gray-200 transition-all"
                                   >
                                      Batal
                                   </button>
                                   <button 
                                      form="inspector-form"
                                      type="submit"
                                      className="flex-[2.5] py-6 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-[2rem] hover:bg-amber-600 shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 animate-pulse"
                                   >
                                      <CheckCircle2 size={18} />
                                      Ya, Simpan Perubahan
                                   </button>
                                </div>
                             )}

                             {/* DELETE SECTION */}
                             {editingProduct && (
                                !isConfirmingDelete ? (
                                   <button 
                                      type="button"
                                      disabled={isSaving || isConfirmingSave}
                                      onClick={() => { setIsConfirmingDelete(true); setIsConfirmingSave(false); }}
                                      className={`w-full py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 border ${isConfirmingSave ? 'bg-gray-50 text-gray-200 border-gray-100 shadow-none pointer-events-none' : 'bg-red-50 text-red-500 border-red-100 hover:bg-red-500 hover:text-white'}`}
                                   >
                                      <Trash2 size={18} />
                                      Move to Archive
                                   </button>
                                ) : (
                                   <div className="flex gap-2 animate-in fade-in zoom-in duration-200">
                                      <button 
                                         type="button"
                                         onClick={() => setIsConfirmingDelete(false)}
                                         className="flex-1 py-5 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-[2rem] hover:bg-gray-200 transition-all"
                                      >
                                         Batal
                                      </button>
                                      <button 
                                         type="button"
                                         onClick={(e) => handleDelete(e, editingProduct.id)}
                                         className="flex-[2.5] py-5 bg-red-700 text-white text-[10px] font-black uppercase tracking-widest rounded-[2rem] hover:bg-red-800 shadow-xl shadow-red-700/40 flex items-center justify-center gap-2 animate-pulse"
                                      >
                                         <AlertTriangle size={18} />
                                         Ya, Arsipkan Produk
                                      </button>
                                   </div>
                                )
                             )}
                          </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : activeTab === 'logs' ? (
              <motion.div 
                key="logs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-[1200px] mx-auto bg-white rounded-3xl border border-[#F2F2F2] overflow-hidden flex flex-col h-[calc(100vh-250px)]"
              >
                <div className="p-8 border-b border-[#F8F8F8] flex items-center justify-between">
                  <div>
                    <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-[#1A1A1A]">Activity Registry</h3>
                    <p className="text-[9px] text-[#A0A0A0] font-bold uppercase tracking-wider mt-1">Comprehensive Archive of Atelier Operations</p>
                  </div>
                  <button onClick={fetchLogs} className="p-3 hover:bg-[#FAFAFA] rounded-xl transition-all">
                    <Clock size={16} className={isLogsLoading ? 'animate-spin' : ''} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                   {logs.length === 0 ? (
                     <div className="flex flex-col items-center justify-center h-full opacity-20 gap-4">
                        <FileText size={48} strokeWidth={1} />
                        <p className="text-[10px] font-black uppercase tracking-widest">No activities recorded yet</p>
                     </div>
                   ) : (
                     <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-[#F8F8F8]">
                           <tr>
                              <th className="px-10 py-5 text-[9px] font-black uppercase tracking-widest text-[#A0A0A0]">Administrator</th>
                              <th className="px-10 py-5 text-[9px] font-black uppercase tracking-widest text-[#A0A0A0]">Action</th>
                              <th className="px-10 py-5 text-[9px] font-black uppercase tracking-widest text-[#A0A0A0]">Details</th>
                              <th className="px-10 py-5 text-[9px] font-black uppercase tracking-widest text-[#A0A0A0]">Timestamp</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F8F8F8]">
                           {logs.map((log) => (
                             <tr key={log.id} className="hover:bg-[#FAFAFA]/50 transition-colors group">
                                <td className="px-6 py-4">
                                   <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-lg bg-[#2D5A27]/[0.04] flex items-center justify-center text-[#2D5A27] text-[10px] font-black">
                                         {log.adminUsername?.charAt(0).toUpperCase()}
                                      </div>
                                      <span className="text-[11px] font-bold text-[#1A1A1A]">{log.adminUsername}</span>
                                   </div>
                                </td>
                                <td className="px-6 py-4">
                                   <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter
                                      ${log.action === 'LOGIN' ? 'bg-[#2D5A27]/[0.05] text-[#2D5A27]' : 
                                        log.action === 'LOGIN_FAILED' || log.action === 'DELETE_PRODUCT' ? 'bg-red-50 text-red-500' : 
                                        'bg-blue-50 text-blue-500'}`}>
                                      {log.action}
                                   </span>
                                </td>
                                <td className="px-6 py-4 text-[11px] text-[#A0A0A0] font-medium max-w-[400px] truncate">{log.details}</td>
                                <td className="px-6 py-4 text-[10px] font-bold text-[#D0D0D0] tabular-nums">
                                   {new Date(log.timestamp).toLocaleString('id-ID')}
                                </td>
                             </tr>
                           ))}
                        </tbody>
                     </table>
                   )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="settings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-40 space-y-8 opacity-20"
              >
                <Settings size={64} strokeWidth={1} />
                <p className="text-[11px] font-black uppercase tracking-[0.4em]">System Configuration Locked</p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* GLOBAL CONFIRMATION DIALOG */}
      <AnimatePresence>
        {confirmConfig && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmConfig(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden p-10 text-center"
            >
              <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center 
                ${confirmConfig.type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-[#2D5A27]/10 text-[#2D5A27]'}`}>
                <AlertCircle size={32} />
              </div>
              <h4 className="text-[14px] font-black uppercase tracking-[0.3em] text-[#1A1A1A] mb-4">{confirmConfig.title}</h4>
              <p className="text-[11px] text-[#A0A0A0] font-bold leading-relaxed mb-10">{confirmConfig.message}</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setConfirmConfig(null)}
                  className="flex-1 py-4 rounded-xl bg-[#FAFAFA] text-[#A0A0A0] text-[10px] font-black uppercase tracking-widest hover:bg-[#F2F2F2] transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    confirmConfig.onConfirm();
                    setConfirmConfig(null);
                  }}
                  className={`flex-1 py-4 rounded-xl text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg
                    ${confirmConfig.confirmColor || (confirmConfig.type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-[#2D5A27] hover:bg-[#1A5A27] shadow-[#2D5A27]/20')}`}
                >
                  {confirmConfig.confirmLabel || 'Confirm'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NOTIFICATION TOASTS */}
      <div className="fixed top-10 right-10 z-[1100] flex flex-col gap-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="pointer-events-auto"
            >
              <div className={`px-8 py-5 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center gap-5 border-2 min-w-[350px] backdrop-blur-xl
                ${toast.type === 'success' 
                  ? 'bg-emerald-50/90 border-emerald-100/50 text-emerald-900' 
                  : 'bg-rose-50/90 border-rose-100/50 text-rose-900'}`}>
                
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                  ${toast.type === 'success' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'}`}>
                  {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                </div>

                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
                    {toast.type === 'success' ? 'CORE SYNCHRONIZED' : 'SYSTEM EXCEPTION'}
                  </p>
                  <p className="text-[12px] font-bold mt-0.5 leading-snug">{toast.message}</p>
                </div>

                <button 
                  onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} 
                  className={`p-2 rounded-lg transition-colors
                    ${toast.type === 'success' ? 'hover:bg-emerald-200/50 text-emerald-400' : 'hover:bg-rose-200/50 text-rose-400'}`}
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default CommandCenter;
