import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  User, 
  ArrowRight, 
  BookOpen, 
  Clock, 
  ArrowUpCircle, 
  Users, 
  X, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  Radio, 
  ThumbsUp, 
  Send, 
  MessageSquare, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import ForgotPasswordModal from './ForgotPasswordModal';

export default function LoginPage({ onLoginSuccess, onDirectDashboardPreview }) {
  // Credentials & Form States
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('admin'); // 'admin' | 'operator'

  // Errors & Loading
  const [fieldErrors, setFieldErrors] = useState({ username: '', password: '' });
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Modals
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [activeInfoModal, setActiveInfoModal] = useState(null); // 'support' | 'roadmap' | 'releases' | 'community'

  // Interactive Roadmap votes state
  const [roadmapVotes, setRoadmapVotes] = useState({
    feature1: 142,
    feature2: 98,
    feature3: 215,
  });
  const [votedItems, setVotedItems] = useState({});

  // Interactive Community Chat state
  const [communityMessages, setCommunityMessages] = useState([
    { id: 1, user: 'Marcus Vance', role: 'Floor Lead', time: '10:14 AM', text: 'Dock 2 inbound volume cleared ahead of schedule with DSTGT bypass.' },
    { id: 2, user: 'Dr. Sarah Lin', role: 'ML Engineer', time: '10:22 AM', text: 'DSTGT Attention heatmaps on Aisle B are showing 87% confidence now.' },
    { id: 3, user: 'Devon Patel', role: 'Fleet Dispatcher', time: '10:28 AM', text: 'AGV-03 reroute test completed with zero aisle conflict.' },
  ]);
  const [newMessageText, setNewMessageText] = useState('');

  // Quick autofill handler
  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setGeneralError('');
    setFieldErrors({ username: '', password: '' });
    if (role === 'admin') {
      setUsername('admin');
      setPassword('Admin@123');
    } else {
      setUsername('operator');
      setPassword('User@123');
    }
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setGeneralError('');
    const errors = { username: '', password: '' };
    let hasErr = false;

    if (!username.trim()) {
      errors.username = 'Please enter your username or email';
      hasErr = true;
    }
    if (!password.trim()) {
      errors.password = 'Please enter your password';
      hasErr = true;
    }

    if (hasErr) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const user = username.trim().toLowerCase();
      const pass = password.trim();

      if (user === 'admin' && pass === 'Admin@123') {
        onLoginSuccess({
          username: 'admin',
          role: 'admin',
          displayName: 'Warehouse System Admin',
          email: 'admin@twinflow.ai',
          accessLevel: 'Full Administrative & Topology Access',
        });
      } else if (user === 'operator' && pass === 'User@123') {
        onLoginSuccess({
          username: 'operator',
          role: 'user',
          displayName: 'Floor Lead Operator',
          email: 'operator@twinflow.ai',
          accessLevel: 'Real-time Congestion Monitoring',
        });
      } else {
        setGeneralError('Invalid username or password. Check demo credentials above.');
      }
    }, 600);
  };

  // Roadmap voting interaction
  const handleVote = (key) => {
    if (votedItems[key]) return;
    setRoadmapVotes((prev) => ({ ...prev, [key]: prev[key] + 1 }));
    setVotedItems((prev) => ({ ...prev, [key]: true }));
  };

  // Send message interaction in community modal
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;
    setCommunityMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        user: 'You (Operator)',
        role: 'Live Session',
        time: 'Just now',
        text: newMessageText.trim(),
      },
    ]);
    setNewMessageText('');
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white selection:bg-slate-900 selection:text-white font-sans antialiased">
      
      {/* ========================================================================= */}
      {/* LEFT HALF: CLEAN WHITE MINIMALIST LOGIN (MATCHING REFERENCE IMAGE)        */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-1/2 min-h-screen bg-white flex flex-col justify-between p-6 sm:p-10 lg:p-16 relative">
        
        {/* Top Header spacer (for symmetry) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-semibold text-slate-500">
              TwinFlow Kernel v1.0 • Online
            </span>
          </div>

          {/* Quick Demo Jump */}
          {onDirectDashboardPreview && (
            <button
              onClick={() => onDirectDashboardPreview('admin')}
              className="text-xs font-bold text-slate-600 hover:text-slate-950 transition-colors flex items-center space-x-1"
            >
              <span>Instant Preview</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Center Main Form Container */}
        <div className="w-full max-w-sm mx-auto my-auto py-8">
          
          {/* Geometric Ribbon Logo Mark (Exact Match to Reference Icon) */}
          <div className="w-12 h-12 mx-auto mb-5 flex items-center justify-center">
            <svg viewBox="0 0 44 44" className="w-full h-full drop-shadow-sm" fill="none">
              <path 
                d="M14 8L22 4L30 8V20L22 24L14 20V8Z" 
                fill="#0f172a" 
              />
              <path 
                d="M22 24L30 20V32L22 36L14 32V24L22 28Z" 
                fill="#334155" 
              />
              <path 
                d="M22 14L28 11V23L22 26V14Z" 
                fill="#10b981" 
                opacity="0.9"
              />
            </svg>
          </div>

          {/* Headline & Subtitle */}
          <h1 className="text-3xl sm:text-[34px] font-black text-slate-950 tracking-tight text-center leading-tight">
            Welcome back
          </h1>
          <p className="text-sm text-slate-500 text-center mt-1.5 font-normal">
            Please enter your details.
          </p>

          {/* Interactive Role Selector Pills (High UX Interactivity) */}
          <div className="mt-6 mb-5 p-1 rounded-2xl bg-slate-100 flex items-center space-x-1">
            <button
              type="button"
              onClick={() => handleSelectRole('admin')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedRole === 'admin'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              System Admin
            </button>
            <button
              type="button"
              onClick={() => handleSelectRole('operator')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedRole === 'operator'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Floor Operator
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* General Error Banner */}
            {generalError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-fadeIn">
                {generalError}
              </div>
            )}

            {/* Email / Username Input */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Email
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setFieldErrors({ ...fieldErrors, username: '' });
                }}
                placeholder="Enter your email or username"
                className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                  fieldErrors.username 
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                    : 'border-slate-200 focus:border-slate-950 focus:ring-1 focus:ring-slate-950'
                }`}
              />
              {fieldErrors.username && (
                <span className="text-[11px] text-rose-600 mt-1 block font-medium">
                  {fieldErrors.username}
                </span>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors({ ...fieldErrors, password: '' });
                  }}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all pr-11 ${
                    fieldErrors.password 
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                      : 'border-slate-200 focus:border-slate-950 focus:ring-1 focus:ring-slate-950'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <span className="text-[11px] text-rose-600 mt-1 block font-medium">
                  {fieldErrors.password}
                </span>
              )}
            </div>

            {/* Remember me & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-slate-950 focus:ring-slate-950 cursor-pointer"
                />
                <span className="font-medium text-slate-700">Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="font-bold text-slate-950 hover:underline"
              >
                Forgot Password
              </button>
            </div>

            {/* Submit Button (Exact Match) */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-slate-950 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-md active:scale-[0.99] flex items-center justify-center space-x-2 disabled:opacity-75 cursor-pointer mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Submit</span>
              )}
            </button>

            {/* Sign up / Free Trial Link */}
            <div className="text-center pt-2">
              <span className="text-xs text-slate-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveInfoModal('support')}
                  className="font-bold text-slate-950 underline hover:text-slate-700 transition-colors"
                >
                  Request a free trial
                </button>
              </span>
            </div>

          </form>
        </div>

        {/* Bottom Left Branding Pill (Matching "presented by" in reference) */}
        <div className="pt-4 flex items-center justify-start">
          <div className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-full bg-slate-50 border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">presented by</span>
            <div className="flex items-center space-x-1.5 font-bold text-slate-950 text-xs">
              {/* Stylized M/T Icon */}
              <div className="w-5 h-5 rounded-lg bg-slate-950 text-mint-400 flex items-center justify-center font-black text-[10px] shadow-2xs">
                TF
              </div>
              <span className="font-extrabold tracking-tight">TwinFlow AI</span>
            </div>
          </div>
        </div>

      </div>


      {/* ========================================================================= */}
      {/* RIGHT HALF: SLEEK CHARCOAL / SLATE GREY WITH 4 REFINED ACTION CARDS       */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-1/2 min-h-screen bg-gradient-to-b from-[#1d2026] via-[#17191e] to-[#121317] relative flex flex-col justify-between p-8 sm:p-12 lg:p-20 text-white overflow-hidden border-l border-slate-800/50">
        
        {/* Subtle Ambient Radial Lighting (Soft slate & graphite glow) */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-slate-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-36 left-28 w-80 h-80 bg-slate-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header bar on grey side */}
        <div className="relative z-10 flex items-center justify-between pb-6">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-300 shadow-2xs">
              <Activity className="w-4 h-4 text-slate-300" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-100 block tracking-tight">Spatio-Temporal Graph Twin</span>
              <span className="text-[10px] text-slate-400 font-mono">DSTGT Inference Engine</span>
            </div>
          </div>

          <div className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] font-mono text-slate-300 flex items-center space-x-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
            <span>Telemetry 14ms</span>
          </div>
        </div>

        {/* Middle Stack: 4 Action Cards (Premium Matte Charcoal / Slate Grey Styling) */}
        <div className="relative z-10 w-full max-w-md mx-auto my-auto space-y-3.5">
          
          {/* CARD 1: Support Center */}
          <button
            type="button"
            onClick={() => setActiveInfoModal('support')}
            className="w-full group p-4 sm:p-5 rounded-2xl bg-[#232730] hover:bg-[#2a2f3a] border border-[#2f3442] hover:border-slate-500/70 transition-all duration-200 flex items-center justify-between text-left shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-[#2b303c] border border-[#383f4f] flex items-center justify-center text-slate-300 group-hover:text-white group-hover:bg-[#343a49] transition-all shrink-0 shadow-2xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-white transition-colors">
                  Visit our Support Center
                </h3>
                <p className="text-xs text-slate-400 group-hover:text-slate-300 mt-0.5 line-clamp-1 transition-colors">
                  Get guidance from our Support & Dispatch team.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-3" />
          </button>

          {/* CARD 2: Product Roadmap */}
          <button
            type="button"
            onClick={() => setActiveInfoModal('roadmap')}
            className="w-full group p-4 sm:p-5 rounded-2xl bg-[#232730] hover:bg-[#2a2f3a] border border-[#2f3442] hover:border-slate-500/70 transition-all duration-200 flex items-center justify-between text-left shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-[#2b303c] border border-[#383f4f] flex items-center justify-center text-slate-300 group-hover:text-white group-hover:bg-[#343a49] transition-all shrink-0 shadow-2xs">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-white transition-colors">
                  View our Product Roadmap
                </h3>
                <p className="text-xs text-slate-400 group-hover:text-slate-300 mt-0.5 line-clamp-1 transition-colors">
                  Browse and vote on upcoming AI & 3D features.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-3" />
          </button>

          {/* CARD 3: Latest Releases */}
          <button
            type="button"
            onClick={() => setActiveInfoModal('releases')}
            className="w-full group p-4 sm:p-5 rounded-2xl bg-[#232730] hover:bg-[#2a2f3a] border border-[#2f3442] hover:border-slate-500/70 transition-all duration-200 flex items-center justify-between text-left shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-[#2b303c] border border-[#383f4f] flex items-center justify-center text-slate-300 group-hover:text-white group-hover:bg-[#343a49] transition-all shrink-0 shadow-2xs">
                <ArrowUpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-white transition-colors">
                  Check out the latest releases
                </h3>
                <p className="text-xs text-slate-400 group-hover:text-slate-300 mt-0.5 line-clamp-1 transition-colors">
                  See new 3D WebGL engine & Aisle B prediction updates.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-3" />
          </button>

          {/* CARD 4: Community / Slack */}
          <button
            type="button"
            onClick={() => setActiveInfoModal('community')}
            className="w-full group p-4 sm:p-5 rounded-2xl bg-[#232730] hover:bg-[#2a2f3a] border border-[#2f3442] hover:border-slate-500/70 transition-all duration-200 flex items-center justify-between text-left shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-[#2b303c] border border-[#383f4f] flex items-center justify-center text-slate-300 group-hover:text-white group-hover:bg-[#343a49] transition-all shrink-0 shadow-2xs">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-white transition-colors">
                  Join our Dispatch Community
                </h3>
                <p className="text-xs text-slate-400 group-hover:text-slate-300 mt-0.5 line-clamp-1 transition-colors">
                  Discuss with warehouse operators & ML engineers.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-3" />
          </button>

        </div>

        {/* Bottom Footer Info on grey side */}
        <div className="relative z-10 pt-6 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80">
          <span>Protected by Enterprise TLS 1.3</span>
          <span className="font-mono">Cluster: US-East-1</span>
        </div>

      </div>


      {/* ========================================================================= */}
      {/* INTERACTIVE MODALS FOR THE 4 ACTION CARDS (HIGH USER ENGAGEMENT)          */}
      {/* ========================================================================= */}

      {/* 1. SUPPORT CENTER MODAL */}
      {activeInfoModal === 'support' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 text-slate-900 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950">TwinFlow Support Center</h3>
                  <p className="text-xs text-slate-500">24/7 Warehouse Floor Guidance & Documentation</p>
                </div>
              </div>
              <button
                onClick={() => setActiveInfoModal(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900">How does DSTGT predict congestion?</h4>
                <p className="text-slate-600 leading-relaxed">
                  The model combines Spatial GNN (tracking aisle rack connections) with Temporal Transformers (analyzing AGV queue history) to forecast bottlenecks 15–60 minutes in advance with 87% accuracy.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900">How do I test the 3D Digital Twin?</h4>
                <p className="text-slate-600 leading-relaxed">
                  Log in as <strong>System Admin</strong> or click "Instant Preview" to access the Three.js 60 FPS viewport, toggle Attention Heatmaps, and inspect moving AMRs.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
                <div>
                  <span className="font-bold block">Need Emergency Floor Assistance?</span>
                  <span className="text-[11px] text-emerald-700">Dispatch Hotline: +1 (800) 555-TWIN</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px]">
                  Priority Call
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveInfoModal(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Close Guidance
              </button>
            </div>
          </div>
        </div>
      )}


      {/* 2. PRODUCT ROADMAP MODAL (WITH INTERACTIVE VOTING!) */}
      {activeInfoModal === 'roadmap' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 text-slate-900 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950">Product Roadmap</h3>
                  <p className="text-xs text-slate-500">Vote on features for upcoming TwinFlow releases</p>
                </div>
              </div>
              <button
                onClick={() => setActiveInfoModal(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {[
                {
                  key: 'feature1',
                  title: 'Multi-Warehouse Federation & Fleet Sync',
                  tag: 'Q2 2026',
                  desc: 'Synchronize multiple distribution centers with global inventory predictive balancing.',
                },
                {
                  key: 'feature2',
                  title: 'Autonomous Drone Barcode Verification',
                  tag: 'Q3 2026',
                  desc: 'Deploy ceiling-docked quadcopters for automated night-time cycle counting.',
                },
                {
                  key: 'feature3',
                  title: 'Voice-Activated Lead Dispatch Commands',
                  tag: 'Q3 2026',
                  desc: 'Enable headsets to trigger dynamic AGV bypass and emergency stops via speech.',
                },
              ].map((f) => (
                <div key={f.key} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs font-bold text-slate-900">{f.title}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-mono font-semibold">
                        {f.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{f.desc}</p>
                  </div>

                  <button
                    onClick={() => handleVote(f.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shrink-0 ${
                      votedItems[f.key]
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{roadmapVotes[f.key]}</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Click vote buttons to influence priority</span>
              <button
                onClick={() => setActiveInfoModal(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}


      {/* 3. LATEST RELEASES MODAL */}
      {activeInfoModal === 'releases' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 text-slate-900 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                  <ArrowUpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950">Release Notes v1.0</h3>
                  <p className="text-xs text-slate-500">DSTGT Digital Twin Platform General Availability</p>
                </div>
              </div>
              <button
                onClick={() => setActiveInfoModal(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    v1.0.4 Hotfix
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">Today</span>
                </div>
                <h4 className="font-bold text-slate-900">3D Architecture Spec & Attention Heatmap Alignment</h4>
                <p className="text-slate-600 leading-relaxed">
                  Integrated Aisle A, Aisle B, and Packing station spatial nodes directly into the WebGL Three.js render pipeline with glowing edge paths and Block 6 Explainability HUD.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
                    v1.0.0 Stable
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">October 2026</span>
                </div>
                <h4 className="font-bold text-slate-900">Dynamic Spatio-Temporal Graph Transformer Launch</h4>
                <p className="text-slate-600 leading-relaxed">
                  Introduced sub-15ms edge inference, real-time AMR fleet tracking, and automated What-If bypass simulations.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveInfoModal(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Close Changelog
              </button>
            </div>
          </div>
        </div>
      )}


      {/* 4. DISPATCH COMMUNITY MODAL (INTERACTIVE LIVE CHAT FEED!) */}
      {activeInfoModal === 'community' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 text-slate-900 space-y-4 shadow-2xl border border-slate-200 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950">Floor Dispatch Network</h3>
                  <p className="text-xs text-slate-500">Live operator channel • 42 warehouse leads online</p>
                </div>
              </div>
              <button
                onClick={() => setActiveInfoModal(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages Feed */}
            <div className="flex-1 overflow-y-auto space-y-2.5 p-2 bg-slate-50 rounded-2xl border border-slate-100">
              {communityMessages.map((m) => (
                <div key={m.id} className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center space-x-1.5">
                      <strong className="text-slate-900 font-bold">{m.user}</strong>
                      <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[9px] font-mono">
                        {m.role}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{m.time}</span>
                  </div>
                  <p className="text-xs text-slate-700">{m.text}</p>
                </div>
              ))}
            </div>

            {/* Interactive Send Message Form */}
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2 shrink-0 pt-1">
              <input
                type="text"
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                placeholder="Broadcast operational note to dispatch..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-950"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center space-x-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      )}


      {/* FORGOT PASSWORD MODAL */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />

    </div>
  );
}
