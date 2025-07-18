import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router';
import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';
import Input from '../components/Input';

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName:"",
    email:"",
    password:""
  })  
  const navigate = useNavigate();
  const {signup,isSigningUp} = useAuthStore()

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if(success === true) signup(formData,navigate);
  };

  return (
    <div className='min-h-screen  grid lg:grid-cols-2'>
      {/* left side */}
      <div className='w-full mt-16 lg:mt-8 max-w-md mx-auto space-y-8'>
        <div className='text-center mb-8'>
          {/* LOGO */}
          <div className='flex flex-col mt-8 lg:mt-18 items-center gap-2 group'>
            <div className='size-12 roundend-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
              <MessageSquare className='size-6 text-primary'/>
            </div>
            <h1 className='text-2xl font-bold mt-2'>Create Account</h1>
            <p className='text-base-content/60'>Get started with your free account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-4 md:px-0">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <User className="size-5 z-2  text-base-content/40" />
                </div>
                <Input
                  typeOfInput="text"
                  placeholderValue="John Doe"
                  value={formData.fullName}
                  changeHandler={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <Mail className="size-5 z-2  text-base-content/40" />
                </div>
                <Input
                  typeOfInput="email"
                  className={`input input-bordered w-full pl-9`}
                  placeholderValue="you@example.com"
                  value={formData.email}
                  changeHandler={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <Lock className="size-5 z-2 text-base-content/40" />
                </div>
                <Input
                  typeOfInput={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-9`}
                  placeholderValue="••••••••"
                  value={formData.password}
                  changeHandler={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary bg-black w-full" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
      </div>

      {/* right side */}
      
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  )
}

export default SignUpPage