import React from 'react'
import { useAuthStore } from '../store/useAuthStore';

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname:"",
    email:"",
    password:""
  })  

  const {signup,isSigningUp} = useAuthStore()

  const validateForm = ()=>{}

  const handleSubmit = (e)=>{
    e.preventDefault();
  }

  return (
    <div>
      
    </div>
  )
}

export default SignUpPage