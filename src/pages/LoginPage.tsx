import React, { useState } from "react";

import { useAuth } from "../services/useAuth";
import { DocumentTextIcon } from "../icons/DocumentTextIcon";
import { useToast } from "../services/useToast";
import { getServerMessage } from "../services/utilities";
const LoginPage: React.FC = () => {
  const { login: contextLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await contextLogin({ email, password });
      addToast("Đăng nhập thành công", "success");
    } catch (err: any) {
      const message = getServerMessage(err);
      addToast(message, "error");
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <DocumentTextIcon className="h-10 w-10 text-indigo-500" />
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Dashboard Đề Xuất
            </h1>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Đăng Nhập
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mt-2 mb-6">
            Đăng nhập bằng email và password
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-wait transition-colors"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-slate-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                Or
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => {}}
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-wait transition-colors"
            >
              Sign In as Guest
            </button>
          </div>
        </div>
      </div>
      <style>{`
              .form-input {
                  display: block; width: 100%; padding: 0.625rem 0.75rem; border: 1px solid rgb(209, 213, 219); border-radius: 0.5rem; background-color: rgb(249, 250, 251); color: rgb(17, 24, 39); transition: all 0.2s;
              }
              .dark .form-input {
                  border-color: rgb(51, 65, 85); background-color: rgb(30, 41, 59); color: rgb(226, 232, 240);
              }
              .form-input:focus {
                  outline: 2px solid transparent; outline-offset: 2px; box-shadow: 0 0 0 2px var(--tw-ring-color), 0 0 0 0 #0000; border-color: rgb(99, 102, 241); --tw-ring-color: rgb(99, 102, 241);
              }
            `}</style>
    </div>
  );
};

export default LoginPage;
