"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { convertToBase64 } from "@/lib/fileUtils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthSuccess from "@/components/AuthSuccess";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "customer",
    companyName: "",
    registrationNumber: "",
    contactNumber: "",
    companyAddress: "",
  });

  const [certificateFile, setCertificateFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let isValid = true;
    switch (name) {
      case "email":
        isValid = emailRegex.test(value);
        break;
      case "password":
        isValid = passwordRegex.test(value);
        break;
      case "confirmPassword":
        isValid = value === formData.password;
        break;
      default:
        isValid = value.trim() !== "";
    }
    setFieldErrors((prev) => ({ ...prev, [name]: !isValid }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/png", "image/jpeg"];
      if (!validTypes.includes(file.type)) {
        setError("Only PNG and JPG images are allowed.");
        setCertificateFile(null);
        return;
      }
      if (file.size > 1024 * 1024) {
        setError("Image must be 1MB or smaller.");
        setCertificateFile(null);
        return;
      }
      setError("");
      setCertificateFile(file);
    }
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      throw new Error("All fields are required.");
    }
    if (!emailRegex.test(formData.email)) {
      throw new Error("Please enter a valid email.");
    }
    if (!passwordRegex.test(formData.password)) {
      throw new Error(
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character."
      );
    }
    if (formData.password !== formData.confirmPassword) {
      throw new Error("Passwords do not match.");
    }
    if (formData.userType === "provider") {
      if (
        !formData.companyName ||
        !formData.registrationNumber ||
        !formData.contactNumber ||
        !formData.companyAddress
      ) {
        throw new Error("All company details are required.");
      }
      if (!certificateFile) {
        throw new Error("Certificate image is required.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      validateForm();
      
      let certificate_url = null;
      if (formData.userType === "provider" && certificateFile) {
        certificate_url = await convertToBase64(certificateFile);
      }

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          certificate_url
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account.");
      }

      setSuccessMessage(data.message);
      setRedirectUrl(data.redirectUrl);
      setSuccess(true);
    } catch (error) {
      console.error("Signup error:", error);
      setError(error.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <AuthSuccess message={successMessage} redirectUrl={redirectUrl} />;
  }

  const RequiredAsterisk = () => <span className="text-red-500">*</span>;

  
           

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-primary-green p-6 text-center">
              <h2 className="text-2xl font-bold text-white">Create an Account</h2>
            </div>
            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <RequiredAsterisk />
                  </label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    autoComplete="off"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <RequiredAsterisk />
                  </label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    autoComplete="off"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <RequiredAsterisk />
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="off"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password <RequiredAsterisk />
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="off"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password <RequiredAsterisk />
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="off"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-2 text-gray-500"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">I am a: <RequiredAsterisk /></label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="userType"
                        value="customer"
                        checked={formData.userType === "customer"}
                        onChange={handleChange}
                        autoComplete="off"
                        className="mr-2"
                      />
                      Customer
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="userType"
                        value="provider"
                        checked={formData.userType === "provider"}
                        onChange={handleChange}
                        autoComplete="off"
                        className="mr-2"
                      />
                      Service Provider
                    </label>
                  </div>
                </div>

                {formData.userType === "provider" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name <RequiredAsterisk />
                      </label>
                      <input
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        autoComplete="off"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Registration Number/NTN <RequiredAsterisk />
                      </label>
                      <input
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        autoComplete="off"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Number <RequiredAsterisk />
                      </label>
                      <input
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        autoComplete="off"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Address <RequiredAsterisk />
                      </label>
                      <textarea
                        name="companyAddress"
                        value={formData.companyAddress}
                        onChange={handleChange}
                        autoComplete="off"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Certificate of Incorporation (PNG/JPG, ≤ 1MB) <RequiredAsterisk />
                      </label>
                      <input
                        type="file"
                        accept="image/png,image/jpeg"
                        onChange={handleFileChange}
                        autoComplete="off"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Only PNG or JPG image. Max size: 1MB.
                      </p>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 px-4 rounded-md text-white bg-primary-green hover:bg-green-700 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {loading ? "Signing up..." : "Sign Up"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <a href="/signin" className="font-medium text-primary-green hover:underline">
                    Sign in
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
