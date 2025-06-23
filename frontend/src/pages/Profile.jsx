import { useEffect, useState } from "react";
import Header from "../components/Header";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch user", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/upload-profile-picture`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setUploadStatus("Upload successful!");
        fetchUser(); // refresh profile pic
      } else {
        setUploadStatus(data.detail || "Upload failed");
      }
    } catch (err) {
      setUploadStatus("Upload failed");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#132418] text-white px-6 py-20 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-josefin font-bold text-yellow-700 mb-6">
          Your Profile
        </h1>

        {!user ? (
          <p className="text-white/70 text-lg font-inter">Loading...</p>
        ) : (
          <div className="mt-6 space-y-6 text-center font-inter text-lg w-full max-w-lg">
            {user.picture && (
              <div className="flex justify-center">
                <img
                  src={`${import.meta.env.VITE_API_URL}${user.picture}`}
                  alt="Profile"
                  className="w-36 h-36 rounded-full object-cover border-4 border-yellow-700 shadow-md"
                />
              </div>
            )}

            <div className="mt-4 space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-sm text-white file:bg-yellow-700 file:border-none file:px-4 file:py-2 file:rounded-md"
              />
              <button
                onClick={handleUpload}
                className="bg-yellow-700 hover:bg-yellow-800 px-6 py-2 rounded-md text-white"
              >
                Upload
              </button>
              {uploadStatus && <p className="text-sm text-yellow-400">{uploadStatus}</p>}
            </div>

            <div className="space-y-2 mt-6">
              <p><strong>Name:</strong> {user.name || "N/A"}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Verified:</strong> {user.is_verified ? "Yes" : "No"}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
