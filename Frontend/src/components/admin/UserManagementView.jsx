import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  ShieldCheck, 
  User, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Trash2, 
  KeyRound, 
  Power, 
  RefreshCw, 
  AlertTriangle, 
  X, 
  Check, 
  Copy, 
  Lock,
  Sparkles
} from 'lucide-react';

export default function UserManagementView({ 
  currentUser, 
  onShowToast, 
  onLogAction 
}) {
  // Initial 8 users matching the requirement: Total 8 | Admins 2 | Users 6 | Disabled 1
  const [users, setUsers] = useState([
    {
      id: 'USR-01',
      name: 'Sarah Lin',
      username: 'admin',
      role: 'Admin',
      status: 'Active',
      lastLogin: 'Just now',
      email: 'admin@twinflow.ai',
      forcePasswordChange: false
    },
    {
      id: 'USR-02',
      name: 'David Chen',
      username: 'david.chen',
      role: 'Admin',
      status: 'Active',
      lastLogin: '2 hours ago',
      email: 'd.chen@twinflow.ai',
      forcePasswordChange: false
    },
    {
      id: 'USR-03',
      name: 'Sam Haddad',
      username: 'sam.haddad',
      role: 'User',
      status: 'Active',
      lastLogin: '15 mins ago',
      email: 'sam.haddad@twinflow.ai',
      forcePasswordChange: false
    },
    {
      id: 'USR-04',
      name: 'Marcus Vance',
      username: 'marcus.vance',
      role: 'User',
      status: 'Active',
      lastLogin: '1 hour ago',
      email: 'm.vance@twinflow.ai',
      forcePasswordChange: false
    },
    {
      id: 'USR-05',
      name: 'Elena Rostova',
      username: 'elena.rostova',
      role: 'User',
      status: 'Active',
      lastLogin: 'Yesterday',
      email: 'e.rostova@twinflow.ai',
      forcePasswordChange: false
    },
    {
      id: 'USR-06',
      name: 'Ramesh Kumar',
      username: 'ramesh.kumar',
      role: 'User',
      status: 'Active',
      lastLogin: '3 days ago',
      email: 'r.kumar@twinflow.ai',
      forcePasswordChange: true
    },
    {
      id: 'USR-07',
      name: 'Lucas Mayer',
      username: 'lucas.mayer',
      role: 'User',
      status: 'Active',
      lastLogin: '5 days ago',
      email: 'l.mayer@twinflow.ai',
      forcePasswordChange: false
    },
    {
      id: 'USR-08',
      name: 'Maya Patel',
      username: 'maya.patel',
      role: 'User',
      status: 'Disabled',
      lastLogin: '2 weeks ago',
      email: 'm.patel@twinflow.ai',
      forcePasswordChange: true
    }
  ]);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null if adding
  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formRole, setFormRole] = useState('User');
  const [formPassword, setFormPassword] = useState('');
  const [formStatus, setFormStatus] = useState('Active');
  const [formForceChange, setFormForceChange] = useState(true);
  const [usernameError, setUsernameError] = useState('');

  // Confirmation Popups State
  const [confirmDisableTarget, setConfirmDisableTarget] = useState(null);
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState(null);
  const [confirmResetTarget, setConfirmResetTarget] = useState(null);
  const [generatedResetPassword, setGeneratedResetPassword] = useState('');

  // Summary Metrics calculations
  const totalCount = users.length;
  const adminCount = users.filter((u) => u.role === 'Admin').length;
  const userCount = users.filter((u) => u.role === 'User').length;
  const disabledCount = users.filter((u) => u.status === 'Disabled').length;
  const activeAdminCount = users.filter((u) => u.role === 'Admin' && u.status === 'Active').length;

  // Generate random secure temporary password
  const generateTempPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let pwd = 'Tw!';
    for (let i = 0; i < 7; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pwd;
  };

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormName('');
    setFormUsername('');
    setFormRole('User');
    setFormPassword(generateTempPassword());
    setFormStatus('Active');
    setFormForceChange(true);
    setUsernameError('');
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setFormName(user.name);
    setFormUsername(user.username);
    setFormRole(user.role);
    setFormPassword('');
    setFormStatus(user.status);
    setFormForceChange(user.forcePasswordChange || false);
    setUsernameError('');
    setIsModalOpen(true);
  };

  // Handle Form Submit (Add or Edit)
  const handleSubmitForm = (e) => {
    e.preventDefault();
    const cleanUsername = formUsername.trim().toLowerCase();

    // Check unique username
    const isTaken = users.some(
      (u) => u.username.toLowerCase() === cleanUsername && (!editingUser || u.id !== editingUser.id)
    );

    if (isTaken) {
      setUsernameError('Username already taken');
      return;
    }

    if (editingUser) {
      // Rule: Check if trying to demote or disable self
      const isCurrent = editingUser.username === (currentUser?.username || 'admin');
      if (isCurrent && formStatus === 'Disabled') {
        if (onShowToast) onShowToast('Action blocked: Admin cannot disable own account', 'error');
        return;
      }
      if (isCurrent && formRole !== 'Admin') {
        if (onShowToast) onShowToast('Action blocked: Admin cannot revoke own admin privileges', 'error');
        return;
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name: formName.trim(),
                username: cleanUsername,
                role: formRole,
                status: formStatus,
                forcePasswordChange: formForceChange
              }
            : u
        )
      );

      if (onShowToast) onShowToast(`Updated user details for ${formName}`, 'success');
      if (onLogAction) onLogAction(`Edited user: ${cleanUsername} (${formRole})`, 'User Management');
    } else {
      // Add new user
      const newUser = {
        id: `USR-${String(users.length + 1).padStart(2, '0')}`,
        name: formName.trim(),
        username: cleanUsername,
        role: formRole,
        status: formStatus,
        lastLogin: 'Never',
        email: `${cleanUsername}@twinflow.ai`,
        forcePasswordChange: formForceChange
      };

      setUsers((prev) => [newUser, ...prev]);
      if (onShowToast) onShowToast(`Created user account for ${formName}`, 'success');
      if (onLogAction) onLogAction(`Created user: ${cleanUsername} (${formRole})`, 'User Management');
    }

    setIsModalOpen(false);
  };

  // Execute Toggle Disable/Enable
  const handleTriggerStatusChange = (user) => {
    // Rules verification
    const isCurrent = user.username === (currentUser?.username || 'admin');
    if (isCurrent) {
      if (onShowToast) onShowToast("Action blocked: Admin can't disable own account", 'error');
      return;
    }

    if (user.status === 'Active' && user.role === 'Admin' && activeAdminCount <= 1) {
      if (onShowToast) onShowToast('Action blocked: At least one active admin must remain', 'error');
      return;
    }

    if (user.status === 'Active') {
      // Require popup confirm
      setConfirmDisableTarget(user);
    } else {
      // Enable immediately
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: 'Active' } : u))
      );
      if (onShowToast) onShowToast(`Account enabled for ${user.name}`, 'success');
      if (onLogAction) onLogAction(`Enabled account: ${user.username}`, 'User Management');
    }
  };

  const confirmDisableUser = () => {
    if (!confirmDisableTarget) return;
    const target = confirmDisableTarget;
    setUsers((prev) =>
      prev.map((u) => (u.id === target.id ? { ...u, status: 'Disabled' } : u))
    );
    setConfirmDisableTarget(null);
    if (onShowToast) onShowToast(`User ${target.name} disabled and logged out`, 'success');
    if (onLogAction) onLogAction(`Disabled user account: ${target.username}`, 'User Management');
  };

  // Execute Delete
  const handleTriggerDelete = (user) => {
    const isCurrent = user.username === (currentUser?.username || 'admin');
    if (isCurrent) {
      if (onShowToast) onShowToast("Action blocked: Admin can't delete own account", 'error');
      return;
    }
    if (user.role === 'Admin' && adminCount <= 1) {
      if (onShowToast) onShowToast('Action blocked: At least one active admin must remain', 'error');
      return;
    }
    setConfirmDeleteTarget(user);
  };

  const confirmDeleteUser = () => {
    if (!confirmDeleteTarget) return;
    const target = confirmDeleteTarget;
    setUsers((prev) => prev.filter((u) => u.id !== target.id));
    setConfirmDeleteTarget(null);
    if (onShowToast) onShowToast(`Deleted user ${target.name}`, 'success');
    if (onLogAction) onLogAction(`Deleted user account: ${target.username}`, 'User Management');
  };

  // Execute Reset Password
  const handleTriggerResetPassword = (user) => {
    const temp = generateTempPassword();
    setGeneratedResetPassword(temp);
    setConfirmResetTarget(user);
  };

  const confirmResetPassword = () => {
    if (!confirmResetTarget) return;
    const target = confirmResetTarget;
    setConfirmResetTarget(null);
    if (onShowToast) onShowToast(`Password reset for ${target.name}. New temporary password created.`, 'success');
    if (onLogAction) onLogAction(`Reset password for user: ${target.username}`, 'User Management');
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'All' && u.role !== roleFilter) return false;
    if (statusFilter !== 'All' && u.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchUser = u.username.toLowerCase().includes(q);
      if (!matchName && !matchUser) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12 font-sans text-slate-900">
      
      {/* ========================================================================= */}
      {/* HEADER & SUMMARY CHIPS: Total 8 | Admins 2 | Users 6 | Disabled 1          */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
            <Users className="w-5 h-5 text-mint-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-slate-950 tracking-tight">
                A9. User Access & Permission Management
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 text-[10px] font-bold">
                Admin Console
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Role-based access control, session security, password provisions & audit safeguards
            </p>
          </div>
        </div>

        {/* Dynamic Summary Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
            Total <span className="font-mono text-slate-950 font-black">{totalCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-2xl bg-violet-50 border border-violet-200 text-xs font-bold text-violet-700">
            Admins <span className="font-mono text-violet-950 font-black">{adminCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700">
            Users <span className="font-mono text-emerald-950 font-black">{userCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
            Disabled <span className="font-mono text-rose-950 font-black">{disabledCount}</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TOP BAR: Search, Role Filter, Status Filter, Add User Button             */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 outline-none focus:border-slate-900 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Role Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-bold text-slate-400">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-bold text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Disabled">Disabled</option>
            </select>
          </div>

        </div>

        {/* Add User Button */}
        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shadow-sm transition-all flex items-center space-x-2"
        >
          <UserPlus className="w-4 h-4 text-mint-400" />
          <span>Add User</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* USERS TABLE                                                               */}
      {/* Columns: Name, Username, Role badge, Status badge, Last Login, Actions    */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-4">Username</th>
                <th className="py-4 px-4">Role</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Last Login</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredUsers.map((user) => {
                const isCurrentUser = user.username === (currentUser?.username || 'admin');
                return (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                    
                    {/* Name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs shadow-xs ${
                          user.role === 'Admin'
                            ? 'bg-violet-900 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {user.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-950 flex items-center space-x-2">
                            <span>{user.name}</span>
                            {isCurrentUser && (
                              <span className="px-1.5 py-0.2 rounded-md bg-slate-200 text-slate-700 text-[9px] font-mono font-bold">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Username */}
                    <td className="py-4 px-4 font-mono font-bold text-slate-700">
                      @{user.username}
                    </td>

                    {/* Role Badge (Admin violet / User slate) */}
                    <td className="py-4 px-4">
                      {user.role === 'Admin' ? (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-200 text-[10px] font-extrabold">
                          <ShieldCheck className="w-3 h-3 text-violet-600" />
                          <span>Admin</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold">
                          <User className="w-3 h-3 text-slate-500" />
                          <span>User</span>
                        </span>
                      )}
                    </td>

                    {/* Status Badge (Active emerald / Disabled rose) */}
                    <td className="py-4 px-4">
                      {user.status === 'Active' ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-bold">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          <span>Disabled</span>
                        </span>
                      )}
                    </td>

                    {/* Last Login */}
                    <td className="py-4 px-4 text-slate-500 font-medium">
                      {user.lastLogin}
                    </td>

                    {/* Actions: Edit, Disable/Enable, Reset Password, Delete */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        
                        {/* Edit */}
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors"
                          title="Edit User"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Disable / Enable Toggle */}
                        <button
                          onClick={() => handleTriggerStatusChange(user)}
                          className={`p-1.5 rounded-xl border transition-colors ${
                            user.status === 'Active'
                              ? 'border-slate-200 text-amber-600 hover:bg-amber-50 hover:border-amber-200'
                              : 'border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200'
                          }`}
                          title={user.status === 'Active' ? 'Disable Account' : 'Enable Account'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>

                        {/* Reset Password */}
                        <button
                          onClick={() => handleTriggerResetPassword(user)}
                          className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                          title="Reset Password"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleTriggerDelete(user)}
                          className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD / EDIT USER MODAL                                                     */}
      {/* Full Name, Username (unique check), Role, Temp Password + Generate,       */}
      {/* Status toggle, Force password change on first login                       */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-mint-50 border border-mint-200 text-mint-700 flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5 text-mint-700" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-950">
                    {editingUser ? `Edit Account: ${editingUser.name}` : 'Provision New User'}
                  </h3>
                  <p className="text-xs text-slate-500">Configure credentials, warehouse authority and login constraints</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jessica Chen"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 outline-none focus:border-slate-900"
                />
              </div>

              {/* Username with Unique Check */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. jessica.chen"
                  value={formUsername}
                  onChange={(e) => {
                    setFormUsername(e.target.value);
                    if (usernameError) setUsernameError('');
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-xs font-mono font-bold outline-none ${
                    usernameError ? 'border-rose-500 text-rose-600' : 'border-slate-200 text-slate-800 focus:border-slate-900'
                  }`}
                />
                {usernameError && (
                  <p className="text-[11px] font-bold text-rose-600 mt-1 flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Username already taken</span>
                  </p>
                )}
              </div>

              {/* Role: Admin / User */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Access Role</label>
                <div className="grid grid-cols-2 gap-3">
                  {['User', 'Admin'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFormRole(r)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        formRole === r
                          ? r === 'Admin'
                            ? 'border-violet-600 bg-violet-50 font-black text-violet-950'
                            : 'border-slate-900 bg-slate-50 font-black text-slate-950'
                          : 'border-slate-200 text-slate-600 font-bold hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs">{r}</span>
                        {formRole === r && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                        {r === 'Admin' ? 'Full system, config & model control' : 'Readings, alerts & live twin monitoring'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Temporary Password with Generate Button (only for new or optional edit) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Temporary Password</label>
                  <button
                    type="button"
                    onClick={() => setFormPassword(generateTempPassword())}
                    className="text-[11px] font-bold text-mint-700 hover:text-mint-800 flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Generate New</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder={editingUser ? 'Leave blank to preserve current' : 'Click Generate to create'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono font-bold text-slate-800 outline-none"
                  />
                  {formPassword && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(formPassword);
                        if (onShowToast) onShowToast('Password copied to clipboard', 'info');
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      title="Copy Password"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Status Toggle & Force Change Option */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Account Status</span>
                    <span className="text-[11px] text-slate-500">Allow user to sign in to TwinFlow</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormStatus(formStatus === 'Active' ? 'Disabled' : 'Active')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                      formStatus === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {formStatus}
                  </button>
                </div>

                <label className="flex items-center space-x-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formForceChange}
                    onChange={(e) => setFormForceChange(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-slate-950 focus:ring-slate-950 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Force password change on first login</span>
                    <span className="text-[11px] text-slate-500">Requires entering a personal password upon initial authentication</span>
                  </div>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shadow-sm flex items-center space-x-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-mint-400" />
                  <span>{editingUser ? 'Save Changes' : 'Create User'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONFIRM DISABLE POPUP                                                     */}
      {/* "Are you sure you want to disable this user? They will be logged out"     */}
      {/* ========================================================================= */}
      {confirmDisableTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center space-x-3 text-amber-600">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center font-bold">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-950">Disable User Account?</h3>
                <p className="text-xs text-slate-500">Immediate session termination</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              Are you sure you want to disable this user? <span className="font-bold text-slate-900">{confirmDisableTarget.name}</span> will be logged out immediately.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setConfirmDisableTarget(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDisableUser}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs flex items-center space-x-1.5"
              >
                <Power className="w-3.5 h-3.5" />
                <span>Confirm Disable</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONFIRM DELETE POPUP                                                      */}
      {/* "This action cannot be undone."                                           */}
      {/* ========================================================================= */}
      {confirmDeleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center font-bold">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-950">Delete User Account?</h3>
                <p className="text-xs text-rose-600 font-bold">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              Are you sure you want to delete <span className="font-bold text-slate-900">{confirmDeleteTarget.name}</span> (@{confirmDeleteTarget.username})? All associated access credentials will be permanently erased.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setConfirmDeleteTarget(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs flex items-center space-x-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* RESET PASSWORD POPUP                                                      */}
      {/* "A new temporary password will be generated."                             */}
      {/* ========================================================================= */}
      {confirmResetTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center space-x-3 text-blue-600">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center font-bold">
                <KeyRound className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-950">Reset User Password</h3>
                <p className="text-xs text-slate-500">A new temporary password will be generated.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-bold">New Temporary Password:</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedResetPassword);
                    if (onShowToast) onShowToast('Copied temporary password', 'info');
                  }}
                  className="text-[11px] font-bold text-blue-700 hover:underline flex items-center space-x-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-blue-200 font-mono text-sm font-extrabold text-blue-950 tracking-wider">
                {generatedResetPassword}
              </div>
              <p className="text-[10px] text-slate-500">
                Share this password with {confirmResetTarget.name}. They will be prompted to change it upon signing in.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setConfirmResetTarget(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmResetPassword}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs flex items-center space-x-1.5"
              >
                <Check className="w-3.5 h-3.5 text-mint-400" />
                <span>Confirm & Apply</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
