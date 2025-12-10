    "use client";

    import React, { createContext, useContext, useState, useEffect } from "react";
    import { api, User } from "@/lib/api";
    import { LoginFormData, RegisterFormData } from "@/lib/validation";
    import { useRouter } from "next/navigation";

    interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (data: LoginFormData) => Promise<void>;
    register: (data: RegisterFormData | FormData) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (user: User) => void;
    }

    const AuthContext = createContext<AuthContextType | undefined>(undefined);

    export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Check for existing session on mount
    useEffect(() => {
        const checkAuth = async () => {
        try {
            const currentUser = api.getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            console.error("Auth check failed:", error);
        } finally {
            setIsLoading(false);
        }
        };
        checkAuth();
    }, []);

    const login = async (data: LoginFormData) => {
        setIsLoading(true);
        try {
        const loggedUser = await api.login(data);
        setUser(loggedUser);
        router.push("/"); // Redirect to home/dashboard
        } finally {
        setIsLoading(false);
        }
    };

    const register = async (data: RegisterFormData | FormData) => {
        setIsLoading(true);
        try {
        const newUser = await api.register(data);
        setUser(newUser);
        //router.push("/"); // Optional: Redirect or show success
        } finally {
        setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
        await api.logout();
        setUser(null);
        router.push("/login");
        } finally {
        setIsLoading(false);
        }
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
        {children}
        </AuthContext.Provider>
    );
    }

    export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
    }
