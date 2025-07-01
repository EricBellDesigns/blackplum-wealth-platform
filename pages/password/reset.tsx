import Image from "next/image";
import React, {useState} from "react";
import RootLayout from "@/components/layouts/layout.component";
import logo from "@/public/logo.png";
import {useRouter} from "next/router";
import Loading from "@/components/loading.component";
import axiosInstance from "@/services/api.services";
import {CheckCircleIcon} from "@heroicons/react/20/solid";

export default function PasswordReset() {
  const router = useRouter();

  // Local state properties
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function renderStatus() {
    // Check if status is successful
    if (success) {
      return (
        <div className="my-3 px-4 py-3 bg-green-50 border border-green-200 rounded-md ">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">
                Password reset link successfully sent!
              </p>
            </div>
          </div>
        </div>
      );
    }
  }

  function renderError() {
    if (error) {
      return (
        <p className="text-sm text-red-500 text-center font-medium">
          {error}
        </p>
      );
    }
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    // Render loading spinner to indicate activity
    setLoading(true);

    // Retrieve provided values
    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    try {
      // Request a password reset from API
      await axiosInstance.post("/api/password/reset", formProps);

      // Reset the form values
      e.target.reset();

      // Update local state properties
      setLoading(false);
      setSuccess(true);
      setError("");
    } catch (e: any) {
      // Retrieve validation errors returned by API
      const {error} = e.response.data;
      // Set error message to display on the page
      setError(error);
      // Hide loading spinner and render status message
      setLoading(false);
      setSuccess(false);
    }
  }

  return (
    <RootLayout title="Password Reset | Black Plum">
      <div className="flex flex-col h-full justify-center items-center bg-gradient-to-b from-blue-500 from-0% to-gray-50 to-50%">
        <div className="flex bg-white border rounded-lg shadow-lg overflow-hidden">
          <div
            className="flex flex-1 flex-col justify-center px-4 py-10 sm:px-6 lg:flex-none lg:px-10 xl:px-10 space-y-8">
            <a href="/" className="mx-auto">
              <span className="sr-only">Your Company</span>
              <Image
                src={logo}
                alt="Logo"
                width={200}
              />
            </a>

            <div className="mx-auto w-80">
              <div className="text-center">
                <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">
                  Reset Password
                </h2>
                <p className="mt-2 leading-6 text-gray-500">
                  Enter your email address and we'll send<br />
                  you a link to reset your password.
                </p>
              </div>

              <div className="mt-6">
                {/* Render Password Reset Status message */}
                {renderStatus()}

                <form onSubmit={onFormSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="example@domain.com"
                        required
                        className="block w-full rounded-md border-0 py-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {renderError()}

                  <button
                    type="submit"
                    disabled={loading}
                    style={{height: 40}}
                    className="flex w-full justify-center items-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    {loading ? <Loading/> : "Submit"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-gray-500">
          Don't have an account?{" "}
          <a href="/register" className="font-semibold leading-6 text-blue-500 hover:text-blue-600">
            Register
          </a>
        </p>
      </div>
    </RootLayout>
  );
}
