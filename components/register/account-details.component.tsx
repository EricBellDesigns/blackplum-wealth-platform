import React from "react";
import {UpdatedProps} from "../../pages/register";

interface AccountDetailsProps {
  updateAccount: (arg1: UpdatedProps) => void
  nextStep: () => void
}

export default function AccountDetails({updateAccount, nextStep}: AccountDetailsProps) {
  function onSubmit(e) {
    e.preventDefault();

    // Retrieve provided values
    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    // Update local account object with account details
    updateAccount(formProps);

    // Continue to next step
    nextStep();
  }

  return (
    <div className="w-[350px] lg:w-[480px] bg-white px-6 pt-8 pb-10 border shadow-lg rounded-lg sm:px-12">
      <form className="space-y-5" onSubmit={onSubmit}>
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Provide Account Details
        </h2>
        <p className="mt-2 leading-6 text-gray-700 text-center">
          The credentials provided below<br/>
          will be used for login.
        </p>
        <div>
          <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
            Full Name
          </label>
          <div className="mt-2">
            <input
              id="name"
              name="name"
              placeholder="John Doe"
              autoComplete="full_name"
              type="text"
              required
              className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

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
              className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
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
              className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
