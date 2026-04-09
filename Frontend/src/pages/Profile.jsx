import React from "react";

const Profile = ({ user }) => {
  const displayName = user?.fullName || user?.name || "User";
  const displayEmail = user?.email || "user@expensetracker.com";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">My Profile</h1>
        <p className="mt-4 text-sm text-slate-500">Name</p>
        <p className="text-base font-medium text-slate-800">{displayName}</p>
        <p className="mt-4 text-sm text-slate-500">Email</p>
        <p className="text-base font-medium text-slate-800">{displayEmail}</p>
      </div>
    </div>
  );
};

export default Profile;
