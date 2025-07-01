import Image from "next/image";
import React, {useState} from "react";
import RootLayout from "@/components/layouts/layout.component";
import adminLoginImage from "@/public/admin-login-image.png";
import logo from "@/public/logo.png";
import {signIn} from "next-auth/react";
import {useRouter} from "next/router";
import Loading from "@/components/loading.component";

export default function AdminLogin() {
  const router = useRouter();

  // Local state properties
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function onFormSubmit(e: any) {
    e.preventDefault();
    // Render loading spinner to indicate activity
    setLoading(true);

    signIn("admin-login", {
      redirect: false,
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
      // @ts-ignore
    }).then(({error}) => {
      if (error) {
        console.error(error);
        setLoading(false);
        setError(error);
      } else {
        router.push("/admin/offerings");
      }
    });
  }

  function renderError() {
    if (error) {
      return (
        <p className="text-base text-red-500 text-center font-medium">
          {error}
        </p>
      );
    }
  }

  return (
    <RootLayout title="Admin Login | BlackPlum">
      <div className="flex min-h-screen py-5 bg-gray-100 items-center justify-center">
        {/* Container element */}
        <div className="flex flex-col items-center space-y-8">
          {/* Logo Image */}
          <a href="/" className="mx-auto mb-5">
            <span className="sr-only">Your Company</span>
            <Image
              src={logo}
              alt="Logo"
              width={250}
            />
          </a>

          <div className="flex relative overflow-hidden rounded-md shadow-lg">
            {/* Left Box Side */}
            <div className="hidden min-[780px]:flex flex-col w-[300px] px-5 py-7 items-center bg-slate-600">
              <h4 className="text-2xl font-semibold text-white text-center">
                Welcome
              </h4>

              <p className="mt-3 text-base font-medium text-white text-center">
                Log into the Admin Dashboard to view, create, edit and delete available offerings.
              </p>

              <Image src={adminLoginImage} alt="Admin Login Image" className="mt-auto" width={200}/>
            </div>

            {/* Right Box Side */}
            <div className="flex flex-col bg-white px-6 sm:px-10 py-8 space-y-4 items-center">
              {/* Headline and Sub-headline elements */}
              <h3 className="text-3xl font-bold text-slate-600 text-center">
                Admin Login
              </h3>
              <h4 className="text-lg font-normal text-center text-gray-600">
                Access Admin Dashboard to create and<br/>
                manage available offerings, and more.
              </h4>

              <form onSubmit={onFormSubmit} className="flex flex-col w-full px-5 space-y-6">
                <div>
                  <label htmlFor="email" className="block font-medium leading-6 text-gray-900">
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
                      className="block w-full rounded-md border-0 py-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block font-medium leading-6 text-gray-900">
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="***********"
                      required
                      className="block w-full rounded-md border-0 py-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:leading-6"
                    />
                  </div>
                </div>

                {/* Error Message */}
                {renderError()}

                <div className="mx-auto">
                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{width: 115, height: 40}}
                    className="bg-slate-600 hover:bg-slate-700 text-white font-bold mb-4 py-2 px-8 rounded focus:outline-none focus:shadow-outline">
                    {loading ? <Loading /> : "Log In"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
