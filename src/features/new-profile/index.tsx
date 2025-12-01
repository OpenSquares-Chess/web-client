import React, { useState } from 'react';

interface ProfileProps {
    onSubmit: (username: string, imageLink: string) => void;
}

function NewProfile({ onSubmit }: ProfileProps) {
  const [username, setUsername] = useState('');
  const [imageLink, setImageLink] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(username, imageLink);
  };

  const isValidImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(url);
  };

  return (
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-center text-xl font-semibold text-gray-800">
          Welcome! Complete your profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Profile Image Link (optional)</label>
            <input
              type="url"
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="Enter image URL (optional)"
              value={imageLink}
              onChange={(e) => setImageLink(e.target.value)}
            />
          </div>

          {imageLink && isValidImage(imageLink) && (
            <div className="mt-2 flex justify-center">
              <img
                src={imageLink}
                alt="Profile Preview"
                className="h-24 w-24 rounded-full border border-gray-200 object-cover shadow-sm"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-2 text-sm text-white hover:bg-blue-700 transition-colors"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewProfile;
