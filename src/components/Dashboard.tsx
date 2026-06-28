import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  BarChart as ReBarChart, Bar, AreaChart as ReAreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, Users, Percent, DollarSign, Calendar, Hotel, Shield,
  Settings, CheckCircle, XCircle, Trash2, Edit3, Plus, ArrowRight,
  Filter, Search, Download, AlertTriangle, FileText, UploadCloud, Eye, RefreshCw, Clock
} from 'lucide-react';
import { Room, RoomCategory, Booking, Payment, User, Staff, CMSConfig } from '../types.ts';

export const Dashboard: React.FC = () => {
  const { token, dbUser } = useAuth();
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'metrics' | 'rooms' | 'bookings' | 'customers' | 'payments' | 'staff' | 'cms'>('metrics');

  // Core Data Lists
  const [metrics, setMetrics] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [popularRooms, setPopularRooms] = useState<any[]>([]);
  
  const [roomsList, setRoomsList] = useState<Room[]>([]);
  const [categoriesList, setCategoriesList] = useState<RoomCategory[]>([]);
  const [bookingsList, setBookingsList] = useState<Booking[]>([]);
  const [customersList, setCustomersList] = useState<any[]>([]);
  const [paymentsList, setPaymentsList] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [cmsConfig, setCmsConfig] = useState<CMSConfig | null>(null);

  const [loading, setLoading] = useState(true);

  // Filters & Searches
  const [bookingFilter, setBookingFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'cancelled'>('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [roomFilter, setRoomFilter] = useState<'all' | 'available' | 'occupied' | 'maintenance'>('all');

  // PMS Modal State & Forms
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [roomForm, setRoomForm] = useState({
    roomNumber: '',
    categoryId: '',
    status: 'available',
    floor: 'First Floor'
  });

  // Category Modal State & Forms
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState<RoomCategory | null>(null);
  const [catForm, setCatForm] = useState({
    name: '',
    description: '',
    basePrice: '',
    capacity: '',
    amenities: '',
    images: ''
  });

  // Staff Modal State & Forms
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [staffForm, setStaffForm] = useState({
    email: '',
    name: '',
    phone: '',
    department: 'Front Desk',
    shift: 'Day',
    salary: '',
    roleId: '3' // Receptionist default
  });

  // CMS Editor State
  const [cmsForm, setCmsForm] = useState({
    heroTitle: '',
    heroSubtitle: '',
    hotelStory: ''
  });

  // Loader / Actions status
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch admin content
  const loadAdminData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // 1. Fetch Overview metrics
      const ovRes = await fetch('/api/admin/overview', { headers: { 'Authorization': `Bearer ${token}` } });
      if (ovRes.ok) {
        const ovData = await ovRes.json();
        setMetrics(ovData.metrics);
        setChartData(ovData.monthlyData);
        setPopularRooms(ovData.popularRooms);
      }

      // 2. Fetch Rooms
      const rRes = await fetch('/api/admin/rooms', { headers: { 'Authorization': `Bearer ${token}` } });
      if (rRes.ok) {
        const rData = await rRes.json();
        setRoomsList(rData);
      }

      // 3. Fetch Categories
      const cRes = await fetch('/api/admin/categories', { headers: { 'Authorization': `Bearer ${token}` } });
      if (cRes.ok) {
        const cData = await cRes.json();
        setCategoriesList(cData);
      }

      // 4. Fetch Bookings
      const bRes = await fetch('/api/admin/bookings', { headers: { 'Authorization': `Bearer ${token}` } });
      if (bRes.ok) {
        const bData = await bRes.json();
        setBookingsList(bData);
      }

      // 5. Fetch Customers
      const uRes = await fetch('/api/admin/customers', { headers: { 'Authorization': `Bearer ${token}` } });
      if (uRes.ok) {
        const uData = await uRes.json();
        setCustomersList(uData);
      }

      // 6. Fetch Payments
      const pRes = await fetch('/api/admin/payments', { headers: { 'Authorization': `Bearer ${token}` } });
      if (pRes.ok) {
        const pData = await pRes.json();
        setPaymentsList(pData);
      }

      // 7. Fetch Staff
      const sRes = await fetch('/api/admin/staff', { headers: { 'Authorization': `Bearer ${token}` } });
      if (sRes.ok) {
        const sData = await sRes.json();
        setStaffList(sData);
      }

      // 8. Fetch CMS configurations
      const cmsRes = await fetch('/api/cms');
      if (cmsRes.ok) {
        const cmsData = await cmsRes.json();
        setCmsConfig(cmsData);
        setCmsForm({
          heroTitle: cmsData.heroTitle,
          heroSubtitle: cmsData.heroSubtitle,
          hotelStory: cmsData.hotelStory
        });
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadAdminData();
    }
  }, [token, activeTab]);

  // --- ACTIONS ---

  // Booking Actions
  const handleApproveBooking = async (id: number) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/bookings/${id}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) loadAdminData();
    } catch (err) { console.error(err); }
  };

  const handleRejectBooking = async (id: number) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/bookings/${id}/reject`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) loadAdminData();
    } catch (err) { console.error(err); }
  };

  const handleCancelBooking = async (id: number) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/bookings/${id}/cancel`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) loadAdminData();
    } catch (err) { console.error(err); }
  };

  // Payment Verification
  const handleVerifyPayment = async (id: number) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/payments/${id}/verify`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) loadAdminData();
    } catch (err) { console.error(err); }
  };

  const handleRejectPayment = async (id: number) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/payments/${id}/reject`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) loadAdminData();
    } catch (err) { console.error(err); }
  };

  // Customer lock/unlock
  const handleToggleCustomerStatus = async (id: number) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/customers/${id}/toggle-disabled`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) loadAdminData();
    } catch (err) { console.error(err); }
  };

  // Save Room (Add / Edit)
  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setActionLoading(true);
    try {
      const url = editingRoom ? `/api/admin/rooms/${editingRoom.id}` : '/api/admin/rooms';
      const method = editingRoom ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          roomNumber: roomForm.roomNumber,
          categoryId: parseInt(roomForm.categoryId),
          status: roomForm.status,
          floor: roomForm.floor
        })
      });

      if (res.ok) {
        setShowRoomModal(false);
        setEditingRoom(null);
        setRoomForm({ roomNumber: '', categoryId: '', status: 'available', floor: 'First Floor' });
        loadAdminData();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to persist room record.');
      }
    } catch (err) { console.error(err); }
    finally { setActionLoading(false); }
  };

  const handleDeleteRoom = async (id: number) => {
    if (!token || !window.confirm('Delete this room asset record permanently?')) return;
    try {
      const res = await fetch(`/api/admin/rooms/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) loadAdminData();
      else {
        const d = await res.json();
        alert(d.error || 'Cannot delete room.');
      }
    } catch (err) { console.error(err); }
  };

  // Save Category (Add / Edit)
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setActionLoading(true);
    try {
      const url = editingCat ? `/api/admin/categories/${editingCat.id}` : '/api/admin/categories';
      const method = editingCat ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: catForm.name,
          description: catForm.description,
          basePrice: parseFloat(catForm.basePrice) * 100, // to cents
          capacity: parseInt(catForm.capacity),
          amenities: catForm.amenities.split(',').map(a => a.trim()),
          images: catForm.images.split(',').map(i => i.trim()),
        })
      });

      if (res.ok) {
        setShowCatModal(false);
        setEditingCat(null);
        setCatForm({ name: '', description: '', basePrice: '', capacity: '', amenities: '', images: '' });
        loadAdminData();
      }
    } catch (err) { console.error(err); }
    finally { setActionLoading(false); }
  };

  // Save Staff (Add / Edit)
  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setActionLoading(true);
    try {
      const url = editingStaff ? `/api/admin/staff/${editingStaff.id}` : '/api/admin/staff';
      const method = editingStaff ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: staffForm.email,
          name: staffForm.name,
          phone: staffForm.phone,
          department: staffForm.department,
          shift: staffForm.shift,
          salary: parseFloat(staffForm.salary) * 100, // monthly salary in cents
          roleId: parseInt(staffForm.roleId)
        })
      });

      if (res.ok) {
        setShowStaffModal(false);
        setEditingStaff(null);
        setStaffForm({ email: '', name: '', phone: '', department: 'Front Desk', shift: 'Day', salary: '', roleId: '3' });
        loadAdminData();
      }
    } catch (err) { console.error(err); }
    finally { setActionLoading(false); }
  };

  const handleDeleteStaff = async (id: number) => {
    if (!token || !window.confirm('Remove staff credentials permanently?')) return;
    try {
      const res = await fetch(`/api/admin/staff/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) loadAdminData();
    } catch (err) { console.error(err); }
  };

  // Save CMS configurations
  const handleSaveCMS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await fetch('/api/admin/cms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cmsForm)
      });
      if (res.ok) {
        alert('CMS Config saved successfully!');
        loadAdminData();
      }
    } catch (err) { console.error(err); }
  };

  const handlePrintReport = () => {
    window.print();
  };

  // Filter Bookings list
  const filteredBookings = bookingsList.filter(item => {
    const matchesFilter = bookingFilter === 'all' || item.status === bookingFilter;
    const matchesSearch = bookingSearch === '' || 
      item.user?.name.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      item.user?.email.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      item.room?.roomNumber.includes(bookingSearch) ||
      item.id.toString() === bookingSearch;
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-[#f5f2ed] min-h-screen text-[#1a1a1a] flex">
      
      {/* Sidebar Rail */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 bg-white border-r border-[#d9d5ce] p-6 flex flex-col justify-between flex-shrink-0 shadow-sm"
      >
        <div className="space-y-8">
          <div>
            <span className="font-serif text-xl font-bold tracking-tight text-[#1a1a1a] block">Sovereign Admin</span>
            <span className="font-mono text-[9px] text-[#c5a059] block tracking-widest uppercase mt-0.5 font-semibold">Operational Hub</span>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'metrics', label: 'Overview Metrics', icon: TrendingUp },
              { id: 'rooms', label: 'Room Management', icon: Hotel },
              { id: 'bookings', label: 'Bookings PMS', icon: Calendar },
              { id: 'payments', label: 'Payment Desk', icon: DollarSign },
              { id: 'customers', label: 'Guests Records', icon: Users },
              { id: 'staff', label: 'Staff Directory', icon: Shield },
              { id: 'cms', label: 'CMS Information', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-colors text-left ${
                    activeTab === tab.id 
                      ? 'bg-[#c5a059] text-white shadow-md shadow-[#c5a059]/20' 
                      : 'text-gray-500 hover:text-black hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </motion.button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-[#d9d5ce] pt-4 text-[10px] text-gray-500 font-mono">
          <span>Signed in as Admin:</span>
          <span className="text-[#1a1a1a] block font-sans font-semibold mt-1 truncate">{dbUser?.name}</span>
        </div>
      </motion.aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        
        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh] text-sm text-gray-500 font-mono gap-3">
            <RefreshCw className="h-5 w-5 animate-spin text-[#c5a880]" />
            Loading estate database...
          </div>
        ) : (
          <>
            
            {/* Tab 1: Overview Metrics & Analytics Charts */}
            {activeTab === 'metrics' && metrics && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-bold font-serif text-[#1a1a1a] tracking-tight">PMS Executive Overview</h2>
                  <p className="text-xs text-gray-500 mt-1">Real-time revenue, guest check-in occupancy, and sales analytics charts.</p>
                </div>

                {/* Metrics Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Cumulative Revenue', value: `$${(metrics.totalRevenue / 100).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                    { label: 'Occupancy Rate', value: `${metrics.occupancyRate}%`, icon: Percent, color: 'text-[#c5a059] bg-[#c5a059]/10 border-[#c5a059]/20' },
                    { label: 'Pending Bookings', value: metrics.pendingBookings, icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-200' },
                    { label: 'Total Guests', value: metrics.totalCustomers, icon: Users, color: 'text-blue-600 bg-blue-50 border-blue-200' },
                  ].map((card, idx) => (
                    <motion.div 
                      whileHover={{ y: -5 }}
                      key={idx} 
                      className={`border p-6 rounded-2xl flex items-center justify-between shadow-sm bg-white cursor-pointer ${card.color}`}
                    >
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block">{card.label}</span>
                        <span className="text-2xl font-bold font-sans mt-2 block text-[#1a1a1a]">{card.value}</span>
                      </div>
                      <div className="p-3 bg-black/5 rounded-xl border border-black/5">
                        <card.icon className="h-5 w-5" />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Recharts Analytics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Revenue Growth Chart */}
                  <div className="lg:col-span-2 bg-[#12141c] border border-[#2d3139]/40 p-6 rounded-2xl">
                    <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest mb-6">Revenue & Booking Occupancy Performance</h3>
                    <div className="h-80 w-full font-mono text-[11px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReAreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#c5a880" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#c5a880" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1f232d" />
                          <XAxis dataKey="month" stroke="#6b7280" />
                          <YAxis stroke="#6b7280" />
                          <Tooltip contentStyle={{ backgroundColor: '#161920', border: '1px solid #2d3139' }} />
                          <Legend />
                          <Area type="monotone" dataKey="revenue" stroke="#c5a880" fillOpacity={1} fill="url(#colorRev)" name="Revenue ($)" />
                          <Area type="monotone" dataKey="occupancy" stroke="#10b981" fillOpacity={0} name="Occupancy (%)" />
                        </ReAreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Popular Suite Categories */}
                  <div className="bg-[#12141c] border border-[#2d3139]/40 p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest mb-6">Popular Suite Categories</h3>
                      <div className="h-64 w-full text-[10px] font-mono">
                        <ResponsiveContainer width="100%" height="100%">
                          <ReBarChart data={popularRooms} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#1f232d" />
                            <XAxis type="number" stroke="#6b7280" />
                            <YAxis type="category" dataKey="name" stroke="#6b7280" width={100} />
                            <Tooltip contentStyle={{ backgroundColor: '#161920', border: '1px solid #2d3139' }} />
                            <Bar dataKey="bookings" fill="#c5a880" radius={[0, 4, 4, 0]} name="Bookings" />
                          </ReBarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="border-t border-[#2d3139]/30 pt-4 flex justify-between items-center text-xs text-gray-400">
                      <span>Top suite:</span>
                      <span className="font-bold text-[#c5a880]">Deluxe Ocean Suite</span>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* Tab 2: Room & Categories PMS */}
            {activeTab === 'rooms' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center border-b border-[#2d3139]/30 pb-6">
                  <div>
                    <h2 className="text-2xl font-bold font-sans text-white tracking-tight">Suite Property Management (PMS)</h2>
                    <p className="text-xs text-gray-400 mt-1">Configure room inventory, clean/occupied statuses, and luxury categories.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingRoom(null);
                        setRoomForm({ roomNumber: '', categoryId: categoriesList[0]?.id.toString() || '', status: 'available', floor: 'First Floor' });
                        setShowRoomModal(true);
                      }}
                      className="bg-[#c5a880] text-[#0f1115] px-4 py-2.5 rounded-xl text-xs font-semibold uppercase flex items-center gap-2 shadow-lg shadow-[#c5a880]/10"
                    >
                      <Plus className="h-4 w-4" />
                      Add Room Asset
                    </button>
                    <button
                      onClick={() => {
                        setEditingCat(null);
                        setCatForm({ name: '', description: '', basePrice: '', capacity: '', amenities: '', images: '' });
                        setShowCatModal(true);
                      }}
                      className="bg-[#1c202a] border border-[#2d3139] text-gray-300 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Configure Category
                    </button>
                  </div>
                </div>

                {/* Rooms Catalog */}
                <div className="bg-[#12141c] border border-[#2d3139]/40 rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-[#2d3139]/40 flex justify-between items-center bg-[#191d26]/40">
                    <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Interactive Inventory Sheet</span>
                    <span className="text-xs text-gray-500 font-mono">{roomsList.length} rooms total</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#2d3139]/30 text-[10px] font-mono uppercase tracking-widest text-gray-400 bg-[#161920]/20">
                          <th className="p-4">Suite / Number</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Floor / Level</th>
                          <th className="p-4">Occupancy Status</th>
                          <th className="p-4 text-right">Property Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2d3139]/20 text-xs">
                        {roomsList.map((r) => (
                          <tr key={r.id} className="hover:bg-[#161920]/30 transition-colors">
                            <td className="p-4 font-bold font-mono text-[#c5a880]">Suite {r.roomNumber}</td>
                            <td className="p-4">{r.categoryName || 'Unassigned'}</td>
                            <td className="p-4 text-gray-300">{r.floor}</td>
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider font-mono ${
                                r.status === 'available' ? 'bg-[#10b981]/10 text-[#10b981]' : r.status === 'occupied' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'
                              }`}>
                                {r.status}
                              </span>
                            </td>
                            <td className="p-4 text-right flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingRoom(r);
                                  setRoomForm({
                                    roomNumber: r.roomNumber,
                                    categoryId: r.categoryId.toString(),
                                    status: r.status,
                                    floor: r.floor
                                  });
                                  setShowRoomModal(true);
                                }}
                                className="p-2 text-gray-400 hover:text-white hover:bg-[#20242d] rounded-lg transition-colors"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteRoom(r.id)}
                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-[#20242d] rounded-lg transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Bookings Management */}
            {activeTab === 'bookings' && (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#2d3139]/30 pb-6 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold font-sans text-white tracking-tight">Bookings Reservation PMS</h2>
                    <p className="text-xs text-gray-400 mt-1">Approve reservation requests, allocate luxury suites, and generate invoices.</p>
                  </div>
                  <button 
                    onClick={handlePrintReport}
                    className="bg-[#1c202a] border border-[#2d3139] text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 self-start"
                  >
                    <Download className="h-4 w-4" />
                    Print Bookings Audit Report
                  </button>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#12141c] border border-[#2d3139]/40 p-4 rounded-xl">
                  <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    {[
                      { id: 'all', label: 'All Requests' },
                      { id: 'pending', label: 'Pending Verification' },
                      { id: 'approved', label: 'Approved stays' },
                      { id: 'cancelled', label: 'Cancelled' },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => setBookingFilter(btn.id as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          bookingFilter === btn.id 
                            ? 'bg-[#c5a880]/10 text-[#c5a880] border border-[#c5a880]/30' 
                            : 'text-gray-400 hover:text-white bg-[#1c202a]/40 border border-[#2d3139]/30'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  {/* Search */}
                  <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <input 
                      type="text" 
                      placeholder="Search name, email, suite ID..."
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      className="w-full bg-[#181a22] border border-[#2d3139] rounded-xl pl-9 pr-4 py-2 text-xs text-gray-300 outline-none focus:border-[#c5a880] transition-colors"
                    />
                  </div>
                </div>

                {/* Bookings Table list */}
                <div className="bg-[#12141c] border border-[#2d3139]/40 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#2d3139]/30 text-[10px] font-mono uppercase tracking-widest text-gray-400 bg-[#161920]/20">
                          <th className="p-4">ID / Suite</th>
                          <th className="p-4">Customer Name</th>
                          <th className="p-4">Arrival & Departure Dates</th>
                          <th className="p-4">Special Demands</th>
                          <th className="p-4">Total Settled</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Verification Desk</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2d3139]/20 text-xs">
                        {filteredBookings.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-gray-500 font-mono">No reservations matching filter.</td>
                          </tr>
                        ) : (
                          filteredBookings.map((b) => (
                            <tr key={b.id} className="hover:bg-[#161920]/30 transition-all">
                              <td className="p-4 font-mono">
                                <span className="text-[#c5a880] font-bold">#{b.id}</span>
                                <span className="block text-[10px] text-gray-500 mt-0.5">Room {b.room?.roomNumber}</span>
                              </td>
                              <td className="p-4">
                                <span className="font-bold block text-gray-200">{b.user?.name}</span>
                                <span className="text-[10px] text-gray-500 block truncate max-w-[150px] mt-0.5">{b.user?.email}</span>
                              </td>
                              <td className="p-4">
                                <span className="font-bold text-gray-300 block">{b.checkIn}</span>
                                <span className="text-[10px] text-gray-500 mt-0.5 block font-mono">to {b.checkOut}</span>
                              </td>
                              <td className="p-4 max-w-[150px] truncate" title={b.specialRequests || 'None'}>
                                {b.specialRequests || <span className="text-gray-600 font-mono">None</span>}
                              </td>
                              <td className="p-4 font-bold font-sans text-gray-200">
                                ${(b.totalPrice / 100).toLocaleString()}
                              </td>
                              <td className="p-4">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold ${
                                  b.status === 'approved' ? 'bg-[#10b981]/10 text-[#10b981]' : b.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-400'
                                }`}>
                                  {b.status}
                                </span>
                              </td>
                              <td className="p-4 text-right flex justify-end gap-2">
                                {b.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleApproveBooking(b.id)}
                                      className="bg-[#10b981]/15 hover:bg-[#10b981]/25 border border-[#10b981]/30 text-[#10b981] p-1.5 rounded-lg transition-colors"
                                      title="Approve stay allocation"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleRejectBooking(b.id)}
                                      className="bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 p-1.5 rounded-lg transition-colors"
                                      title="Decline stay request"
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </button>
                                  </>
                                )}
                                {b.status === 'approved' && (
                                  <button
                                    onClick={() => handleCancelBooking(b.id)}
                                    className="text-gray-400 hover:text-red-400 border border-[#2d3139] hover:bg-red-500/5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider"
                                  >
                                    Cancel Booking
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Payments Desk */}
            {activeTab === 'payments' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold font-sans text-white tracking-tight">Direct Payment Desk</h2>
                  <p className="text-xs text-gray-400 mt-1">Verify manual bank swift confirmation receipts and match customer invoices.</p>
                </div>

                <div className="bg-[#12141c] border border-[#2d3139]/40 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#2d3139]/30 text-[10px] font-mono uppercase tracking-widest text-gray-400 bg-[#161920]/20">
                          <th className="p-4">Invoice / ID</th>
                          <th className="p-4">Transfer Details</th>
                          <th className="p-4">Settled Amount</th>
                          <th className="p-4">Receipt Copy</th>
                          <th className="p-4">Verification State</th>
                          <th className="p-4 text-right">Audit Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2d3139]/20 text-xs">
                        {paymentsList.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-gray-500 font-mono">No bank receipts submitted for verification.</td>
                          </tr>
                        ) : (
                          paymentsList.map((p) => (
                            <tr key={p.id} className="hover:bg-[#161920]/30 transition-all">
                              <td className="p-4 font-mono">
                                <span className="font-bold text-gray-200">#PAY-{p.id}</span>
                                <span className="block text-[10px] text-gray-500 mt-0.5">Booking ID: #{p.bookingId}</span>
                              </td>
                              <td className="p-4">
                                <span className="font-bold block text-gray-300">{p.paymentMethod}</span>
                                <span className="text-[10px] text-gray-500 block mt-0.5">{p.user?.name} ({p.user?.email})</span>
                              </td>
                              <td className="p-4 font-bold font-sans text-gray-200">
                                ${(p.amount / 100).toLocaleString()}
                              </td>
                              <td className="p-4">
                                {p.receiptUrl ? (
                                  <a 
                                    href={p.receiptUrl} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 text-[#c5a880] hover:underline"
                                  >
                                    <Eye className="h-3.5 w-3.5" /> View Receipt
                                  </a>
                                ) : (
                                  <span className="text-gray-600">Missing</span>
                                )}
                              </td>
                              <td className="p-4">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold ${
                                  p.status === 'verified' ? 'bg-[#10b981]/10 text-[#10b981]' : p.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-400'
                                }`}>
                                  {p.status}
                                </span>
                              </td>
                              <td className="p-4 text-right flex justify-end gap-2">
                                {p.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleVerifyPayment(p.id)}
                                      className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-[#10b981] px-3.5 py-1.5 rounded-lg font-semibold uppercase tracking-wider text-[10px]"
                                    >
                                      Verify & Approve
                                    </button>
                                    <button
                                      onClick={() => handleRejectPayment(p.id)}
                                      className="text-red-400 hover:text-red-300 border border-red-500/10 hover:bg-red-500/5 px-2.5 py-1.5 rounded-lg font-semibold uppercase tracking-wider text-[10px]"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Customers Records */}
            {activeTab === 'customers' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold font-sans text-white tracking-tight">Sovereign Guests & Staff Accounts</h2>
                  <p className="text-xs text-gray-400 mt-1">Audit customer booking logs, spending statistics, and account locks.</p>
                </div>

                <div className="bg-[#12141c] border border-[#2d3139]/40 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#2d3139]/30 text-[10px] font-mono uppercase tracking-widest text-gray-400 bg-[#161920]/20">
                          <th className="p-4">Guest Info</th>
                          <th className="p-4">Permissions Role</th>
                          <th className="p-4">Total Bookings</th>
                          <th className="p-4">Cumulative Spend</th>
                          <th className="p-4 text-right">Access Controls</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2d3139]/20 text-xs">
                        {customersList.map((c) => (
                          <tr key={c.id} className="hover:bg-[#161920]/30 transition-all">
                            <td className="p-4">
                              <span className="font-bold text-gray-200 block">{c.name}</span>
                              <span className="text-[10px] text-gray-500 block mt-0.5">{c.email}</span>
                            </td>
                            <td className="p-4">
                              <span className="font-mono bg-white/5 border border-white/5 px-2.5 py-1 rounded text-[10.5px] uppercase tracking-wider">{c.role}</span>
                            </td>
                            <td className="p-4 font-mono">{c.bookingsCount} bookings</td>
                            <td className="p-4 font-bold font-sans text-gray-200">${(c.totalSpent / 100).toLocaleString()}</td>
                            <td className="p-4 text-right flex justify-end">
                              {c.role !== 'super_admin' ? (
                                <button
                                  onClick={() => handleToggleCustomerStatus(c.id)}
                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider border transition-colors ${
                                    c.disabled 
                                      ? 'bg-emerald-500/10 border-emerald-500/20 text-[#10b981]' 
                                      : 'bg-red-500/10 border-red-500/20 text-red-400'
                                  }`}
                                >
                                  {c.disabled ? 'Enable Account' : 'Disable Account'}
                                </button>
                              ) : (
                                <span className="text-[10px] text-gray-500 font-mono uppercase italic">Protected</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 6: Staff Directory */}
            {activeTab === 'staff' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center border-b border-[#2d3139]/30 pb-6">
                  <div>
                    <h2 className="text-2xl font-bold font-sans text-white tracking-tight">Staff Credentials Directory</h2>
                    <p className="text-xs text-gray-400 mt-1">Manage remote hotel employees, assign shifts, departments, and payroll details.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingStaff(null);
                      setStaffForm({ email: '', name: '', phone: '', department: 'Front Desk', shift: 'Day', salary: '', roleId: '3' });
                      setShowStaffModal(true);
                    }}
                    className="bg-[#c5a880] text-[#0f1115] px-4 py-2.5 rounded-xl text-xs font-semibold uppercase flex items-center gap-2 shadow-lg shadow-[#c5a880]/10"
                  >
                    <Plus className="h-4 w-4" />
                    Register Staff Credentials
                  </button>
                </div>

                <div className="bg-[#12141c] border border-[#2d3139]/40 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#2d3139]/30 text-[10px] font-mono uppercase tracking-widest text-gray-400 bg-[#161920]/20">
                          <th className="p-4">Name / Contact</th>
                          <th className="p-4">Department</th>
                          <th className="p-4">Assigned Shift</th>
                          <th className="p-4">System Role</th>
                          <th className="p-4">Monthly Salary</th>
                          <th className="p-4 text-right">Audit Credentials</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2d3139]/20 text-xs">
                        {staffList.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-gray-500 font-mono">No staff profiles found. Register credentials above!</td>
                          </tr>
                        ) : (
                          staffList.map((s) => (
                            <tr key={s.id} className="hover:bg-[#161920]/30 transition-all">
                              <td className="p-4">
                                <span className="font-bold text-gray-200 block">{s.name}</span>
                                <span className="text-[10px] text-gray-500 block mt-0.5">{s.email}</span>
                              </td>
                              <td className="p-4">{s.department}</td>
                              <td className="p-4 text-gray-300 font-mono">{s.shift} Shift</td>
                              <td className="p-4">
                                <span className="font-mono bg-white/5 px-2 py-0.5 rounded text-[10px] uppercase text-[#c5a880] font-bold">{s.role}</span>
                              </td>
                              <td className="p-4 font-bold font-sans">${(s.salary / 100).toLocaleString()}/mo</td>
                              <td className="p-4 text-right flex justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setEditingStaff(s);
                                    setStaffForm({
                                      email: s.email || '',
                                      name: s.name || '',
                                      phone: s.phone || '',
                                      department: s.department,
                                      shift: s.shift,
                                      salary: (s.salary / 100).toString(),
                                      roleId: s.roleId ? s.roleId.toString() : '3'
                                    });
                                    setShowStaffModal(true);
                                  }}
                                  className="p-2 text-gray-400 hover:text-white hover:bg-[#20242d] rounded-lg transition-colors"
                                >
                                  <Edit3 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteStaff(s.id)}
                                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-[#20242d] rounded-lg transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 7: CMS Configurations */}
            {activeTab === 'cms' && (
              <div className="space-y-8 max-w-3xl">
                <div>
                  <h2 className="text-2xl font-bold font-sans text-white tracking-tight">CMS Content Manager</h2>
                  <p className="text-xs text-gray-400 mt-1">Directly overwrite customer-facing home layouts, hero captions, and story passages.</p>
                </div>

                <form onSubmit={handleSaveCMS} className="bg-[#12141c] border border-[#2d3139]/40 p-6 rounded-2xl space-y-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1.5 font-bold">Hero Showcase Title</label>
                    <input 
                      type="text"
                      value={cmsForm.heroTitle}
                      onChange={(e) => setCmsForm({ ...cmsForm, heroTitle: e.target.value })}
                      className="w-full bg-[#181a22] border border-[#2d3139] text-gray-200 p-3 rounded-xl text-xs outline-none focus:border-[#c5a880]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1.5 font-bold">Hero Captive Subtitle</label>
                    <textarea 
                      rows={2}
                      value={cmsForm.heroSubtitle}
                      onChange={(e) => setCmsForm({ ...cmsForm, heroSubtitle: e.target.value })}
                      className="w-full bg-[#181a22] border border-[#2d3139] text-gray-200 p-3 rounded-xl text-xs outline-none focus:border-[#c5a880] resize-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1.5 font-bold">The Heritage Story passage</label>
                    <textarea 
                      rows={6}
                      value={cmsForm.hotelStory}
                      onChange={(e) => setCmsForm({ ...cmsForm, hotelStory: e.target.value })}
                      className="w-full bg-[#181a22] border border-[#2d3139] text-gray-200 p-3 rounded-xl text-xs outline-none focus:border-[#c5a880] resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#c5a880] to-[#e6d5b8] text-[#0f1115] px-6 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-transform hover:scale-[1.01]"
                  >
                    Save CMS Overwrite
                  </button>
                </form>
              </div>
            )}

          </>
        )}

      </main>

      {/* --- MODALS --- */}

      {/* 1. Room Modal */}
      {showRoomModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSaveRoom} className="bg-[#12141c] border border-[#2d3139] rounded-2xl overflow-hidden max-w-sm w-full shadow-2xl">
            <div className="bg-gradient-to-r from-[#c5a880] to-[#e6d5b8] p-5 text-[#0f1115]">
              <h4 className="text-sm font-bold uppercase tracking-wider">{editingRoom ? 'Edit Room Asset' : 'Add Room Asset'}</h4>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1 font-bold">Room Suite Number</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. 303"
                  value={roomForm.roomNumber}
                  onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                  className="w-full bg-[#181a22] border border-[#2d3139] text-gray-300 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1 font-bold">Suite Category</label>
                <select
                  value={roomForm.categoryId}
                  onChange={(e) => setRoomForm({ ...roomForm, categoryId: e.target.value })}
                  className="w-full bg-[#181a22] border border-[#2d3139] text-gray-300 px-3.5 py-2.5 rounded-xl text-xs outline-none"
                >
                  {categoriesList.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1 font-bold">Floor Level</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Third Floor"
                  value={roomForm.floor}
                  onChange={(e) => setRoomForm({ ...roomForm, floor: e.target.value })}
                  className="w-full bg-[#181a22] border border-[#2d3139] text-gray-300 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1 font-bold">Cleaning / Occupancy status</label>
                <select
                  value={roomForm.status}
                  onChange={(e) => setRoomForm({ ...roomForm, status: e.target.value })}
                  className="w-full bg-[#181a22] border border-[#2d3139] text-gray-300 px-3.5 py-2.5 rounded-xl text-xs outline-none"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRoomModal(false)}
                  className="w-1/3 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl text-xs font-semibold uppercase"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 bg-[#c5a880] text-[#0f1115] py-2.5 rounded-xl text-xs font-bold uppercase hover:opacity-90 transition-opacity"
                >
                  {actionLoading ? 'Saving...' : 'Save Room'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* 2. Category Modal */}
      {showCatModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSaveCategory} className="bg-[#12141c] border border-[#2d3139] rounded-2xl overflow-hidden max-w-md w-full shadow-2xl">
            <div className="bg-gradient-to-r from-[#c5a880] to-[#e6d5b8] p-5 text-[#0f1115]">
              <h4 className="text-sm font-bold uppercase tracking-wider">Configure Suite Category</h4>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1 font-bold">Category Name</label>
                <input 
                  type="text" required placeholder="e.g. Royal Ocean Suite"
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  className="w-full bg-[#181a22] border border-[#2d3139] text-gray-300 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1 font-bold">Luxury Description</label>
                <textarea 
                  required rows={3} placeholder="A premium villa sanctuary..."
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  className="w-full bg-[#181a22] border border-[#2d3139] text-gray-300 p-3 rounded-xl text-xs outline-none focus:border-[#c5a880]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1 font-bold">Base Price ($)</label>
                  <input 
                    type="number" required placeholder="e.g. 500"
                    value={catForm.basePrice}
                    onChange={(e) => setCatForm({ ...catForm, basePrice: e.target.value })}
                    className="w-full bg-[#181a22] border border-[#2d3139] text-gray-300 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-[#c5a880]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1 font-bold">Maximum Capacity</label>
                  <input 
                    type="number" required placeholder="e.g. 4"
                    value={catForm.capacity}
                    onChange={(e) => setCatForm({ ...catForm, capacity: e.target.value })}
                    className="w-full bg-[#181a22] border border-[#2d3139] text-gray-300 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1 font-bold">Amenities (comma separated)</label>
                <input 
                  type="text" placeholder="WiFi, Private Pool, Freestanding Tub, Ocean View"
                  value={catForm.amenities}
                  onChange={(e) => setCatForm({ ...catForm, amenities: e.target.value })}
                  className="w-full bg-[#181a22] border border-[#2d3139] text-gray-300 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1 font-bold">Photo URLs (comma separated)</label>
                <input 
                  type="text" placeholder="https://unsplash.com/... , https://unsplash.com/..."
                  value={catForm.images}
                  onChange={(e) => setCatForm({ ...catForm, images: e.target.value })}
                  className="w-full bg-[#181a22] border border-[#2d3139] text-gray-300 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-[#c5a880]"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCatModal(false)}
                  className="w-1/3 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl text-xs font-semibold uppercase"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 bg-[#c5a880] text-[#0f1115] py-2.5 rounded-xl text-xs font-bold uppercase hover:opacity-90 transition-opacity"
                >
                  {actionLoading ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* 3. Staff Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSaveStaff} className="bg-[#12141c] border border-[#2d3139] rounded-2xl overflow-hidden max-w-sm w-full shadow-2xl">
            <div className="bg-gradient-to-r from-[#c5a880] to-[#e6d5b8] p-5 text-[#0f1115]">
              <h4 className="text-sm font-bold uppercase tracking-wider">{editingStaff ? 'Edit Staff Profile' : 'Register Staff Credentials'}</h4>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1 font-bold">Email Address</label>
                <input 
                  type="email" required placeholder="staff@sovereign.com"
                  disabled={!!editingStaff}
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                  className="w-full bg-[#181a22] border border-[#2d3139] text-gray-300 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-[#c5a880] disabled:opacity-55"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1 font-bold">Full Name</label>
                <input 
                  type="text" required placeholder="Alexandra Mercer"
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  className="w-full bg-[#181a22] border border-[#2d3139] text-gray-300 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1 font-bold">Mobile Number</label>
                <input 
                  type="text" placeholder="+33 607 555 100"
                  value={staffForm.phone}
                  onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                  className="w-full bg-[#181a22] border border-[#2d3139] text-gray-300 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-[#c5a880]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1 font-bold">Department</label>
                  <select
                    value={staffForm.department}
                    onChange={(e) => setStaffForm({ ...staffForm, department: e.target.value })}
                    className="w-full bg-[#181a22] border border-[#2d3139] text-gray-300 px-3.5 py-2.5 rounded-xl text-xs outline-none"
                  >
                    <option value="Management">Management</option>
                    <option value="Front Desk">Front Desk</option>
                    <option value="Housekeeping">Housekeeping</option>
                    <option value="F&B">F&B Dining</option>
                    <option value="Finance">Accounting</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1 font-bold">Assigned Shift</label>
                  <select
                    value={staffForm.shift}
                    onChange={(e) => setStaffForm({ ...staffForm, shift: e.target.value })}
                    className="w-full bg-[#181a22] border border-[#2d3139] text-gray-300 px-3.5 py-2.5 rounded-xl text-xs outline-none"
                  >
                    <option value="Day">Day Shift</option>
                    <option value="Night">Night Shift</option>
                    <option value="Swing">Swing Shift</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1 font-bold">Monthly Salary ($)</label>
                  <input 
                    type="number" required placeholder="4200"
                    value={staffForm.salary}
                    onChange={(e) => setStaffForm({ ...staffForm, salary: e.target.value })}
                    className="w-full bg-[#181a22] border border-[#2d3139] text-gray-300 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1 font-bold">System Access Role</label>
                  <select
                    value={staffForm.roleId}
                    onChange={(e) => setStaffForm({ ...staffForm, roleId: e.target.value })}
                    className="w-full bg-[#181a22] border border-[#2d3139] text-gray-300 px-3.5 py-2.5 rounded-xl text-xs outline-none"
                  >
                    <option value="1">Super Admin</option>
                    <option value="2">Hotel Manager</option>
                    <option value="3">Receptionist</option>
                    <option value="4">Accountant</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowStaffModal(false)}
                  className="w-1/3 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl text-xs font-semibold uppercase"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 bg-[#c5a880] text-[#0f1115] py-2.5 rounded-xl text-xs font-bold uppercase hover:opacity-90 transition-opacity"
                >
                  {actionLoading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
