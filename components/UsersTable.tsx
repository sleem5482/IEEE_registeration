"use client";

import React from "react";
import Button from "./Button";

export interface User {
  id: number;
  nameAr: string;
  nameEn: string;
  phone: string;
  email: string;
  level: string;
  status: "pending" | "accepted" | "rejected";
}

interface UsersTableProps {
  users: User[];
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
}

export default function UsersTable({ users, onAccept, onReject }: UsersTableProps) {
  const getStatusBadge = (status: User["status"]) => {
    const styles = {
      pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
      accepted: "bg-green-500/20 text-green-300 border-green-500/50",
      rejected: "bg-red-500/20 text-red-300 border-red-500/50",
    };

    const labels = {
      pending: "Pending",
      accepted: "Accepted",
      rejected: "Rejected",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-xl shadow-xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-white/20">
                <th className="px-4 py-3 text-left text-sm font-semibold text-white/90">ID</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-white/90">
                  Arabic Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white/90">
                  English Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white/90">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white/90">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white/90">Level</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white/90">Status</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-white/90">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-white/10 hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-4 text-white/80">{user.id}</td>
                  <td className="px-4 py-4 text-white/80 text-right" dir="rtl">
                    {user.nameAr}
                  </td>
                  <td className="px-4 py-4 text-white/80">{user.nameEn}</td>
                  <td className="px-4 py-4 text-white/80">{user.phone}</td>
                  <td className="px-4 py-4 text-white/80">{user.email}</td>
                  <td className="px-4 py-4 text-white/80">{user.level}</td>
                  <td className="px-4 py-4">{getStatusBadge(user.status)}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="success"
                        onClick={() => onAccept(user.id)}
                        disabled={user.status === "accepted"}
                        className="px-4 py-2 text-sm"
                      >
                        Accept
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => onReject(user.id)}
                        disabled={user.status === "rejected"}
                        className="px-4 py-2 text-sm"
                      >
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

