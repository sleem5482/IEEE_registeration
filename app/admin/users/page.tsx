"use client";

import React, { useState } from "react";
import UsersTable, { type User } from "@/components/UsersTable";

const mockUsers: User[] = [
  {
    id: 1,
    nameAr: "سليم هاشم",
    nameEn: "Sleem Hashem",
    phone: "01012345678",
    email: "sleem@example.com",
    level: "3",
    status: "pending",
  },
  {
    id: 2,
    nameAr: "أحمد علي",
    nameEn: "Ahmed Ali",
    phone: "01198765432",
    email: "ahmed@example.com",
    level: "2",
    status: "accepted",
  },
  {
    id: 3,
    nameAr: "فاطمة محمد",
    nameEn: "Fatima Mohamed",
    phone: "01234567890",
    email: "fatima@example.com",
    level: "4",
    status: "pending",
  },
  {
    id: 4,
    nameAr: "محمد حسن",
    nameEn: "Mohamed Hassan",
    phone: "01567890123",
    email: "mohamed@example.com",
    level: "1",
    status: "rejected",
  },
  {
    id: 5,
    nameAr: "سارة أحمد",
    nameEn: "Sara Ahmed",
    phone: "01098765432",
    email: "sara@example.com",
    level: "3",
    status: "pending",
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);

  const handleAccept = (id: number) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, status: "accepted" as const } : user
      )
    );
  };

  const handleReject = (id: number) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, status: "rejected" as const } : user
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a0066] via-[#3b0f85] to-[#4f00b5] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Users Dashboard</h1>
          <p className="text-white/70">Manage user registrations and approvals</p>
        </div>

        <UsersTable users={users} onAccept={handleAccept} onReject={handleReject} />
      </div>
    </div>
  );
}

