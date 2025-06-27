import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  const token = localStorage.getItem("token");

  const fetchUser = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
      setName(data.name || "");
      setEmail(data.email || "");
    } catch (err) {
      console.error("Failed to fetch user", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (uploadStatus) {
      const timer = setTimeout(() => setUploadStatus(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadStatus]);

  useEffect(() => {
    if (saveStatus) {
      const timer = setTimeout(() => setSaveStatus(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    handleUpload(file);
  };

  const handleUpload = async (fileToUpload) => {
    const formData = new FormData();
    formData.append("file", fileToUpload);

    alert(`Uploading file:\nName: ${fileToUpload.name}\nType: ${fileToUpload.type}\nSize: ${fileToUpload.size}`);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/upload-profile-picture`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setUploadStatus("Upload successful!");
        fetchUser();
      } else {
        alert(`Server responded: ${JSON.stringify(data)}`);
        setUploadStatus(data.detail || "Upload failed");
      }
    } catch {
      alert(`Fetch error: ${err}`);
      setUploadStatus("Upload failed");
    }
  };

  const handleSave = async () => {
    setSaveStatus("Saving...");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });
      if (res.ok) {
        setSaveStatus("Profile updated!");
        fetchUser();
      } else {
        const data = await res.json();
        setSaveStatus(data.detail || "Update failed");
      }
    } catch {
      setSaveStatus("Update failed");
    }
  };

  return (
    <>
      <Header />
      <div className="relative min-h-screen bg-[#132418] text-white px-6 py-20 flex flex-col items-center">
        <div className="pointer-events-none absolute inset-0 z-0">
          {/* Vertical lines */}
          <div className="absolute inset-6 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100px_100px]" />
          {/* Horizontal lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100px_100px]" />
        </div>
        <h1 className="text-5xl md:text-6xl font-josefin font-bold text-yellow-700 mb-8">
          Your Profile
        </h1>

        {!user ? (
          <p className="text-white/70 text-lg font-inter">Loading...</p>
        ) : (
          <div className="bg-[#1f3324] animate-fade-in-scale px-8 py-8 rounded-2xl w-full max-w-lg shadow-2xl space-y-8">
            {/* Profile Picture */}
            {user.picture && (
              <div className="relative group w-42 h-42 mx-auto">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-42 h-42 md:bg-yellow-700/20 bg-yellow-700/10 rounded-full blur-3xl z-0" />

                <label className="cursor-pointer">
                  <img
                    src={`${import.meta.env.VITE_API_URL}${user.picture}`}
                    alt="Profile"
                    className="w-42 h-42 rounded-full object-cover border-3 border-yellow-700 shadow-md transition-opacity duration-300"
                  />

                  {/* hover overlay */}
                  <div
                    className="hidden md:flex absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 items-center justify-center transition-opacity duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8 text-white group-hover:animate-wiggle-slight transition duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536M9 13l6.536-6.536a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-1.414a2 2 0 01.586-1.414z"
                      />
                    </svg>
                  </div>

                  {/* mobile pencil button */}
                  <div
                    className="block md:hidden absolute bottom-1 right-3 bg-yellow-700 hover:bg-yellow-800 rounded-full p-1 shadow-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-white transition duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536M9 13l6.536-6.536a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-1.414a2 2 0 01.586-1.414z"
                      />
                    </svg>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </label>
              </div>

            )}
            {uploadStatus && (
              <p className="text-sm text-yellow-700 transition-all duration-300 text-center animate-fade-slide-up">{uploadStatus}</p>
            )}

            {/* Editable Fields */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="px-2 block text-left font-inter font-semibold text-white/80 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-2 py-2 rounded-md bg-[#132418] text-white/70 border font-inter border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-700"
                />
              </div>
              <div>
                <label className="px-2 block text-left font-inter font-semibold text-white/80 mb-1">
                  Email {user.is_verified ? "(Verified)" : "(Unverified)"}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-2 py-2 rounded-md bg-[#132418] text-white/70 border border-white/20 font-inter focus:outline-none focus:ring-2 focus:ring-yellow-700"
                />
              </div>
              <button
                onClick={handleSave}
                className="w-full bg-yellow-700 hover:bg-yellow-800 py-2 rounded-md text-white font-semibold font-inter transition duration-300 flex items-center justify-center cursor-pointer mt-10 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
              {saveStatus && (
                <p className="text-sm text-yellow-700 transition-all duration-300 text-center animate-fade-slide-up">{saveStatus}</p>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
