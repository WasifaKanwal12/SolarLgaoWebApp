import { useState } from "react";
import { FiX, FiEye, FiEyeOff } from "react-icons/fi";

export default function LinkCredentialsModal({ isOpen, onClose, onLink, email, loading }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    
    if (!password) {
      setError("Please enter your password");
      return;
    }

    try {
      await onLink(password);
    } catch (err) {
      setError(err.message || "Failed to link accounts. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Link Your Account</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            <FiX size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <p className="mb-4 text-gray-600">
          The email <span className="font-semibold">{email}</span> is already registered with Google. 
          Please enter your password to link your accounts.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="link-password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="link-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(""); // Clear error when typing
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1} // Prevent button from being focusable
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green ${
                !password ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!password || loading}
            >
              {loading ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Linking...
                </span>
              ) : "Link Accounts"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}