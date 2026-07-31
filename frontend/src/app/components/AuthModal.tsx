"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  X, Mail, Lock, User, ArrowRight, CheckCircle2,
  Sparkles, ShieldCheck, GitBranch, Briefcase, Users, Building,
  Trophy, Upload, Check, Globe, RefreshCw, ChevronDown, Eye, EyeOff,
  GraduationCap, Phone, MapPin, Award, FileText, Layers
} from "lucide-react";

const LinkedinIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  inline?: boolean;
}

export default function AuthModal({ isOpen, onClose, inline = false }: AuthModalProps) {
  const router = useRouter();

  // Navigation Mode: "login" | "register_step1" | "register_step2" | "ai_onboarding"
  const [mode, setMode] = useState<"login" | "register_step1" | "register_step2" | "ai_onboarding">("login");
  const [role, setRole] = useState<"candidate" | "recruiter" | "organization">("candidate");

  // Visibility Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Step 1 Common Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 2 Candidate Fields
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("United States");
  const [city, setCity] = useState("");
  const [currentStatus, setCurrentStatus] = useState<"Student" | "Fresher" | "Working Professional" | "Freelancer">("Working Professional");
  const [companyOrCollege, setCompanyOrCollege] = useState("");
  const [degree, setDegree] = useState("");
  const [branch, setBranch] = useState("");
  const [gradYear, setGradYear] = useState("2025");
  const [preferredRole, setPreferredRole] = useState("AI Backend Engineer");
  const [expectedSalary, setExpectedSalary] = useState("$120,000 / yr");
  const [skillsText, setSkillsText] = useState("Python, FastAPI, Next.js, Docker, PostgreSQL");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [resumeName, setResumeName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeName(file.name);
      if (!skillsText || skillsText === "Python, FastAPI, Next.js, Docker, PostgreSQL") {
        setSkillsText("Python, FastAPI, Next.js, Docker, React, PyTorch, PostgreSQL, AWS");
      }
    }
  };

  // Step 2 Recruiter Fields
  const [designation, setDesignation] = useState("Lead Technical Recruiter");
  const [workEmail, setWorkEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [industry, setIndustry] = useState("Artificial Intelligence & Software");
  const [companySize, setCompanySize] = useState("50-200 employees");
  const [headquarters, setHeadquarters] = useState("San Francisco, CA");
  const [companyDesc, setCompanyDesc] = useState("");
  const [linkedinCompanyUrl, setLinkedinCompanyUrl] = useState("");
  const [regNumber, setRegNumber] = useState("");

  // Step 2 Organization Fields
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState<"College" | "Community" | "Startup" | "NGO" | "Developer Group" | "Incubator">("Community");
  const [orgWebsite, setOrgWebsite] = useState("");
  const [foundedYear, setFoundedYear] = useState("2022");
  const [location, setLocation] = useState("");
  const [orgDesc, setOrgDesc] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactDesignation, setContactDesignation] = useState("");
  const [discordUrl, setDiscordUrl] = useState("");

  // AI Onboarding Stepper State
  const [aiStep, setAiStep] = useState(1);

  if (!isOpen) return null;

  // --- Handlers ---
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("apex_token", data.access_token);
        localStorage.setItem("user_email", email);
        localStorage.setItem("user_role", data.role || role);
        setLoading(false);
        redirectToRoleDashboard();
      } else {
        const err = await res.json();
        setErrorMsg(err.detail || "Invalid login credentials.");
        setLoading(false);
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg("Connection error to auth server.");
    }
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }
    if (!agreeTerms) {
      setErrorMsg("Please agree to the Terms & Conditions and Privacy Policy.");
      return;
    }
    setErrorMsg("");
    setMode("register_step2");
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // 1. Register candidate user in DB
      const regRes = await fetch("http://localhost:8000/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
          role: role
        })
      });

      if (!regRes.ok) {
        const err = await regRes.json();
        if (err.detail !== "Email already registered") {
          setErrorMsg(err.detail || "Registration failed.");
          setLoading(false);
          return;
        }
      }

      // 2. Log in user to obtain JWT token
      const loginRes = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password })
      });

      if (loginRes.ok) {
        const tokenData = await loginRes.json();
        localStorage.setItem("apex_token", tokenData.access_token);
        localStorage.setItem("user_email", email);
        localStorage.setItem("user_role", role);

        // 3. Save Candidate details to database
        if (role === "candidate") {
          const cleanGithub = githubUrl.replace("https://github.com/", "").replace("github.com/", "").replace("https://", "").replace("/", "");
          await fetch("http://localhost:8000/api/v1/candidate/profile/edit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${tokenData.access_token}`
            },
            body: JSON.stringify({
              full_name: `${firstName} ${lastName}`.trim() || email.split("@")[0],
              title: preferredRole || "Software Engineer",
              bio: `${currentStatus} at ${companyOrCollege || 'Tech Community'}.`,
              location: location || "Remote",
              github_username: cleanGithub,
              linkedin_url: linkedinUrl,
              availability: "open",
              salary_expectation: expectedSalary || "$120,000 / yr"
            })
          });
        }
      }

      setLoading(false);
      startAiOnboarding();
    } catch (err: any) {
      setLoading(false);
      setErrorMsg("Could not connect to database server.");
    }
  };

  const startAiOnboarding = () => {
    setMode("ai_onboarding");
    setAiStep(1);

    const interval = setInterval(() => {
      setAiStep((prev) => {
        if (prev >= 4) {
          clearInterval(interval);
          setTimeout(() => redirectToRoleDashboard(), 800);
          return 4;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const redirectToRoleDashboard = () => {
    if (role === "candidate") router.push("/candidate");
    else if (role === "recruiter") router.push("/recruiter");
    else router.push("/organization");
    onClose();
  };

  const cardElement = (
    <div className="relative w-full max-w-[480px] my-auto bg-white/10 backdrop-blur-3xl border border-white/25 rounded-[36px] p-6 md:p-7 text-white font-sans shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.4),0_30px_70px_rgba(0,0,0,0.55)] z-10 transition-all max-h-[85vh] overflow-y-auto custom-scrollbar">
      
      {/* Grab Handle Indicator */}
      <div className="w-12 h-1 bg-white/35 rounded-full mx-auto mb-4" />

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition backdrop-blur-md border border-white/20"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Error Message */}
      {errorMsg && (
        <div className="mb-4 p-2.5 rounded-2xl bg-red-500/20 border border-red-500/40 text-xs text-red-200 font-medium text-center backdrop-blur-md">
          {errorMsg}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 1: COMMON LOGIN FORM                                                  */}
      {/* ========================================================================= */}
      {mode === "login" && (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white tracking-wide">Welcome Back</h3>
            <p className="text-xs text-white/80 font-light">Sign in to your ApexTalent AI identity.</p>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-white/90 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/50 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/50 backdrop-blur-md transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/90 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/50 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/50 backdrop-blur-md transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-white/60 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-white/80">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-white rounded"
                />
                <span>Remember Me</span>
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset link sent to your email!"); }} className="text-white/80 hover:text-white underline transition">
                Forgot Password?
              </a>
            </div>
          </div>

          {/* Login Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm shadow-xl transition hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer border border-white/40"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> : "Sign In →"}
            </button>
          </div>

          {/* Social Login Divider */}
          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/20" /></div>
            <span className="relative px-3 bg-[#0d1322]/80 backdrop-blur-md text-[10px] text-white/70 uppercase font-semibold tracking-wider rounded-full">Or Continue With</span>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={handleLoginSubmit}
              className="py-2 px-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-medium text-white flex items-center justify-center gap-1.5 backdrop-blur-md transition"
            >
              <Globe className="w-3.5 h-3.5 text-blue-300" />
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={async () => {
                const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
                try {
                  const res = await fetch(`${API}/api/v1/auth/github/url`);
                  if (res.ok) {
                    const data = await res.json();
                    if (data.auth_url) {
                      window.location.href = data.auth_url;
                      return;
                    }
                  }
                } catch (e) {}
                window.location.href = `${API}/api/v1/auth/github`;
              }}
              className="py-2 px-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-medium text-white flex items-center justify-center gap-1.5 backdrop-blur-md transition cursor-pointer"
            >
              <GitBranch className="w-3.5 h-3.5 text-purple-300" />
              <span>GitHub</span>
            </button>
            <button
              type="button"
              onClick={handleLoginSubmit}
              className="py-2 px-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-medium text-white flex items-center justify-center gap-1.5 backdrop-blur-md transition"
            >
              <LinkedinIcon className="w-3.5 h-3.5 text-blue-400" />
              <span>LinkedIn</span>
            </button>
          </div>

          {/* Footer Switcher */}
          <div className="text-center pt-3 border-t border-white/15 text-xs text-white/80">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => { setMode("register_step1"); setErrorMsg(""); }}
              className="text-white font-bold underline hover:text-amber-200 transition"
            >
              Create Account
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: REGISTRATION STEP 1 (Common For Everyone)                          */}
      {/* ========================================================================= */}
      {mode === "register_step1" && (
        <form onSubmit={handleStep1Submit} className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white tracking-wide">Create Account (Step 1 of 2)</h3>
            <p className="text-xs text-white/80 font-light">Join the AI Talent Intelligence Platform.</p>
          </div>

          <div className="space-y-3 pt-1">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-medium text-white/90 mb-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Alex"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/50 backdrop-blur-md transition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/90 mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Mercer"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/50 backdrop-blur-md transition"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-medium text-white/90 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@company.com"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/50 backdrop-blur-md transition"
                required
              />
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-medium text-white/90 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3.5 pr-8 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/50 backdrop-blur-md transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-3 text-white/60 hover:text-white transition"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/90 mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3.5 pr-8 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/50 backdrop-blur-md transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-3 text-white/60 hover:text-white transition"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-medium text-white/90 mb-1.5">Choose Your Platform Role</label>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-white/10 border border-white/20 text-xs backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setRole("candidate")}
                  className={`py-2 px-2 rounded-xl font-medium transition text-center flex flex-col items-center gap-1 ${role === "candidate" ? "bg-white text-slate-950 font-bold shadow-lg" : "text-white/80 hover:text-white"}`}
                >
                  <span className="text-sm">👤</span>
                  <span className="text-[11px]">Candidate</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("recruiter")}
                  className={`py-2 px-2 rounded-xl font-medium transition text-center flex flex-col items-center gap-1 ${role === "recruiter" ? "bg-white text-slate-950 font-bold shadow-lg" : "text-white/80 hover:text-white"}`}
                >
                  <span className="text-sm">🏢</span>
                  <span className="text-[11px]">Recruiter</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("organization")}
                  className={`py-2 px-2 rounded-xl font-medium transition text-center flex flex-col items-center gap-1 ${role === "organization" ? "bg-white text-slate-950 font-bold shadow-lg" : "text-white/80 hover:text-white"}`}
                >
                  <span className="text-sm">🎓</span>
                  <span className="text-[11px]">Community</span>
                </button>
              </div>
            </div>

            {/* Agreement Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-white/80 leading-snug">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="accent-white rounded mt-0.5"
                  required
                />
                <span>I agree to the Terms & Conditions and Privacy Policy</span>
              </label>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm shadow-xl transition hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer border border-white/40"
            >
              Continue to {role === "candidate" ? "Candidate" : role === "recruiter" ? "Recruiter" : "Organization"} Profile →
            </button>
          </div>

          {/* Social Signup Options */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={startAiOnboarding}
              className="py-2 px-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-medium text-white flex items-center justify-center gap-1.5 backdrop-blur-md transition"
            >
              <Globe className="w-3.5 h-3.5 text-blue-300" />
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={startAiOnboarding}
              className="py-2 px-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-medium text-white flex items-center justify-center gap-1.5 backdrop-blur-md transition"
            >
              <GitBranch className="w-3.5 h-3.5 text-purple-300" />
              <span>GitHub</span>
            </button>
            <button
              type="button"
              onClick={startAiOnboarding}
              className="py-2 px-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-medium text-white flex items-center justify-center gap-1.5 backdrop-blur-md transition"
            >
              <LinkedinIcon className="w-3.5 h-3.5 text-blue-400" />
              <span>LinkedIn</span>
            </button>
          </div>

          {/* Footer Switcher */}
          <div className="text-center pt-3 border-t border-white/15 text-xs text-white/80">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => { setMode("login"); setErrorMsg(""); }}
              className="text-white font-bold underline hover:text-amber-200 transition"
            >
              Sign In
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: REGISTRATION STEP 2 (Role Specific Profile Setup)                  */}
      {/* ========================================================================= */}
      {mode === "register_step2" && (
        <form onSubmit={handleStep2Submit} className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/15 pb-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                STEP 2 OF 3: {role.toUpperCase()} PROFILE
              </span>
              <h3 className="text-sm font-bold text-white">Complete Information</h3>
            </div>
            <button
              type="button"
              onClick={startAiOnboarding}
              className="text-xs text-white/70 hover:text-white underline font-medium"
            >
              Skip & Finish Later →
            </button>
          </div>

          {/* CANDIDATE STEP 2 FIELDS */}
          {role === "candidate" && (
            <div className="space-y-3 text-xs max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-white/80 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-1">City / Country</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="San Francisco, USA"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-white/80 mb-1">Current Status</label>
                  <select
                    value={currentStatus}
                    onChange={(e: any) => setCurrentStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0d1322] border border-white/20 text-white"
                  >
                    <option value="Student">Student</option>
                    <option value="Fresher">Fresher</option>
                    <option value="Working Professional">Working Professional</option>
                    <option value="Freelancer">Freelancer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/80 mb-1">College / Company</label>
                  <input
                    type="text"
                    value={companyOrCollege}
                    onChange={(e) => setCompanyOrCollege(e.target.value)}
                    placeholder="Stanford / Google"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-white/80 mb-1">Preferred Role</label>
                  <input
                    type="text"
                    value={preferredRole}
                    onChange={(e) => setPreferredRole(e.target.value)}
                    placeholder="AI Backend Engineer"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-1">Expected Salary</label>
                  <input
                    type="text"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
                    placeholder="$120k - $150k"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 mb-1">Technical Skills & Frameworks</label>
                <input
                  type="text"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  placeholder="Python, FastAPI, Next.js, PyTorch"
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-white/80 mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="github.com/developer"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="linkedin.com/in/dev"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                  />
                </div>
              </div>

              {/* Resume Upload Box */}
              <div>
                <label className="block text-white/80 mb-1">Resume Upload (PDF / DOCX)</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleResumeUpload}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3.5 border border-dashed border-white/30 rounded-2xl text-center space-y-1.5 bg-white/10 cursor-pointer hover:bg-white/20 transition active:scale-[0.99] backdrop-blur-md group"
                >
                  <Upload className="w-5 h-5 text-amber-300 mx-auto group-hover:scale-110 transition-transform" />
                  <p className="text-white text-xs font-semibold">
                    {resumeName ? `✓ Selected: ${resumeName}` : "Drag & Drop Resume PDF or click to browse"}
                  </p>
                  <span className="text-[10px] text-white/70 block">
                    {resumeName ? "Resume attached for AI skills & telemetry extraction" : "Auto-extracts skills, experience & verified score"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* RECRUITER STEP 2 FIELDS */}
          {role === "recruiter" && (
            <div className="space-y-3 text-xs max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-white/80 mb-1">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Lead Technical Recruiter"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-1">Work Email</label>
                  <input
                    type="email"
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                    placeholder="recruiter@company.com"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-white/80 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Apex Technologies"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-1">Company Website</label>
                  <input
                    type="text"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    placeholder="https://company.ai"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-white/80 mb-1">Industry</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="Artificial Intelligence"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-1">Company Size</label>
                  <input
                    type="text"
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    placeholder="50-200 employees"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 mb-1">LinkedIn Company Page</label>
                <input
                  type="text"
                  value={linkedinCompanyUrl}
                  onChange={(e) => setLinkedinCompanyUrl(e.target.value)}
                  placeholder="linkedin.com/company/apextech"
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                />
              </div>
            </div>
          )}

          {/* ORGANIZATION STEP 2 FIELDS */}
          {role === "organization" && (
            <div className="space-y-3 text-xs max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-white/80 mb-1">Organization Name</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="Developer Community HQ"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-1">Organization Type</label>
                  <select
                    value={orgType}
                    onChange={(e: any) => setOrgType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0d1322] border border-white/20 text-white"
                  >
                    <option value="College">College</option>
                    <option value="Community">Community</option>
                    <option value="Startup">Startup</option>
                    <option value="NGO">NGO</option>
                    <option value="Developer Group">Developer Group</option>
                    <option value="Incubator">Incubator</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-white/80 mb-1">Website URL</label>
                  <input
                    type="text"
                    value={orgWebsite}
                    onChange={(e) => setOrgWebsite(e.target.value)}
                    placeholder="https://community.org"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="New York, USA"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 mb-1">Contact Person Name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Jordan Vance"
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                />
              </div>
            </div>
          )}

          {/* Stepper Actions */}
          <div className="pt-3 flex justify-between gap-3 border-t border-white/15">
            <button
              type="button"
              onClick={() => setMode("register_step1")}
              className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold shadow-lg transition"
            >
              Proceed to AI Onboarding →
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* MODE 4: AI ONBOARDING SEQUENCE (Exact Matching Prompt Specification)       */}
      {/* ========================================================================= */}
      {mode === "ai_onboarding" && (
        <div className="space-y-5 py-4 text-center animate-in fade-in duration-300">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
              AI TELEMETRY INITIALIZATION
            </span>
            <h3 className="text-lg font-bold text-white">
              Setting Up Your {role.toUpperCase()} Space
            </h3>
          </div>

          {/* Dynamic Stepper Sequence Cards based on Role */}
          <div className="space-y-2 text-left pt-2">
            {role === "candidate" && [
              { num: 1, text: "Upload & Extract Resume Telemetry", icon: Upload },
              { num: 2, text: "Connect GitHub Codebase Repositories", icon: GitBranch },
              { num: 3, text: "Connect LinkedIn Professional Network", icon: LinkedinIcon },
              { num: 4, text: "AI Builds Talent Score™ Profile", icon: Sparkles }
            ].map((s) => (
              <div
                key={s.num}
                className={`p-3 rounded-2xl border transition flex items-center justify-between text-xs ${
                  s.num < aiStep
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-200"
                    : s.num === aiStep
                    ? "bg-white/15 border-white/30 text-white shadow-lg animate-pulse"
                    : "bg-white/5 border-white/10 text-white/40"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <s.icon className="w-4 h-4" />
                  <span className="font-medium">{s.text}</span>
                </div>
                {s.num < aiStep ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : s.num === aiStep ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
                ) : null}
              </div>
            ))}

            {role === "recruiter" && [
              { num: 1, text: "Verify Corporate Email & Business Entity", icon: ShieldCheck },
              { num: 2, text: "Configure Enterprise Hiring Roster", icon: Users },
              { num: 3, text: "Generate AI Job Specs & Sandbox", icon: Briefcase },
              { num: 4, text: "Recruiter Command Center Ready", icon: Sparkles }
            ].map((s) => (
              <div
                key={s.num}
                className={`p-3 rounded-2xl border transition flex items-center justify-between text-xs ${
                  s.num < aiStep
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-200"
                    : s.num === aiStep
                    ? "bg-white/15 border-white/30 text-white shadow-lg animate-pulse"
                    : "bg-white/5 border-white/10 text-white/40"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <s.icon className="w-4 h-4" />
                  <span className="font-medium">{s.text}</span>
                </div>
                {s.num < aiStep ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : s.num === aiStep ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
                ) : null}
              </div>
            ))}

            {role === "organization" && [
              { num: 1, text: "Verify Community & Organization Details", icon: Building },
              { num: 2, text: "Setup Event & Hackathon Infrastructure", icon: Trophy },
              { num: 3, text: "Configure Leaderboard & Team Builder", icon: Layers },
              { num: 4, text: "Community HQ Portal Activated", icon: Sparkles }
            ].map((s) => (
              <div
                key={s.num}
                className={`p-3 rounded-2xl border transition flex items-center justify-between text-xs ${
                  s.num < aiStep
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-200"
                    : s.num === aiStep
                    ? "bg-white/15 border-white/30 text-white shadow-lg animate-pulse"
                    : "bg-white/5 border-white/10 text-white/40"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <s.icon className="w-4 h-4" />
                  <span className="font-medium">{s.text}</span>
                </div>
                {s.num < aiStep ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : s.num === aiStep ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
                ) : null}
              </div>
            ))}
          </div>

          <p className="text-xs text-white/70 animate-pulse pt-2">
            {aiStep < 4 ? "Calculating verified telemetry parameters..." : "Redirecting to your dashboard..."}
          </p>
        </div>
      )}

    </div>
  );

  if (inline) {
    return cardElement;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300">
      <div 
        className="fixed inset-0 bg-cover bg-center filter blur-md scale-105 transition duration-700 brightness-75"
        style={{ backgroundImage: "url('/community_bg.png')" }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60 backdrop-blur-xl" />
      {cardElement}
    </div>
  );
}
