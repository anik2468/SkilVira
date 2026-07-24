import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import AuthBranding from "../../components/auth/AuthBranding";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return alert("Please fill all fields.");
    }

    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match.");
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "student",
        }
      );

      alert("Registration Successful! Please Login.");

      navigate("/login/student");

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Registration Failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">

      <AuthBranding />

      <div className="flex flex-1 items-center justify-center p-6">

        <Card className="w-full max-w-md p-8">

          <div className="mb-8 text-center">

            <h1 className="text-4xl font-bold text-[#111827]">
              Student Registration
            </h1>

            <p className="mt-3 text-gray-500">
              Create your SkilVira Student Account
            </p>

          </div>

          <div className="space-y-5">

            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />

            <Input
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />

            <Input
              type="password"
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />

            <Input
              type="password"
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              required
            />

            <Button
              className="w-full"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </Button>

          </div>

          <p className="mt-8 text-center text-gray-500">

            Already have an account?

            <Link
              to="/login/student"
              className="ml-2 font-semibold text-[#D4AF37] hover:underline"
            >
              Login
            </Link>

          </p>

        </Card>

      </div>

    </div>
  );
};

export default Register;