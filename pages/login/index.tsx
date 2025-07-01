import Image from "next/image";
import React, {useState} from "react";
import loginImage from "@/public/login-image.jpg";
import RootLayout from "@/components/layouts/layout.component";
import logo from "@/public/logo.png";
import {useRouter} from "next/router";
import {signIn} from "next-auth/react";
import Loading from "@/components/loading.component";
import {CheckCircleIcon, XCircleIcon} from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Login() {
  const router = useRouter();

  // Retrieve optional "confirmed" url parameter
  const {confirmed} = router.query;

  // Local state properties
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function renderConfirmationStatus() {
    // Check if "isConfirmed" value is provided
    if (confirmed) {
      if (confirmed === "true") {
        return (
          <div className="my-3 px-4 py-3 bg-green-50 border border-green-200 rounded-md ">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">
                  Email address successfully confirmed!
                </p>
              </div>
            </div>
          </div>
        );
      } else if (confirmed === "false") {
        return (
          <div className="my-3 px-4 py-3 bg-red-50 border border-red-200 rounded-md ">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-600">
                  Email address could not be confirmed!
                </p>
              </div>
            </div>
          </div>
        );
      }
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

  function onFormSubmit(e) {
    e.preventDefault();
    // Render loading spinner to indicate activity
    setLoading(true);

    signIn("investor-login", {
      redirect: false,
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value
      // @ts-ignore
    }).then(({error}) => {
      if (error) {
        console.error(error);
        setLoading(false);
        setError(error);
      } else {
        router.push("/available-offerings");
      }
    });
  }

  return (
    <RootLayout title="Login | Black Plum">
      <div className="flex h-full justify-center items-center bg-gray-100">
        <div className="flex bg-white border rounded-lg shadow-lg overflow-hidden">
          <div
            className="flex flex-1 flex-col justify-center px-4 py-10 sm:px-6 lg:flex-none lg:px-10 xl:px-10 space-y-10">
            <a href="/" className="mx-auto">
              <span className="sr-only">Your Company</span>
              <Image
                src={logo}
                alt="Logo"
                width={200}
              />
            </a>

            <div className="mx-auto w-80 lg:w-96">
              <div className="text-center">
                <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">
                  Log into your Account
                </h2>
                <p className="mt-2 leading-6 text-gray-500">
                  Not a member?{' '}
                  <a href="/register" className="font-semibold text-blue-500 hover:text-blue-600">
                    Register
                  </a>
                </p>
              </div>

              <div className="mt-6">
                {/* Render Confirmation Status message */}
                {renderConfirmationStatus()}

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

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
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
                        className="block w-full rounded-md border-0 py-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {renderError()}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      />
                      <label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-gray-700">
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm leading-6">
                      <a href="/password/reset" className="font-semibold text-blue-500 hover:text-blue-500">
                        Forgot password?
                      </a>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{height: 40}}
                      className="flex w-full justify-center items-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                      {loading ? <Loading/> : "Login"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="hidden sm:block relative w-[410px] bg-gray-200">
            <Image
              src={loginImage}
              alt="Hero Image"
              className="object-cover"
              fill
            />
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
