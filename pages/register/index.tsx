import Steps from "@/components/register/steps.component";
import RootLayout from "@/components/layouts/layout.component";
import logo from "@/public/logo.png";
import Image from "next/image";
import React, {useState} from "react";
import AccountDetails from "@/components/register/account-details.component";
import SuitabilityQuestionnaire from "@/components/register/suitability-questionnaire.component";
import EmailVerification from "@/components/register/email-verification.component";

export interface Account {
  name: string
  email: string
  password: string
  company: string
}

export interface UpdatedProps {
  [property: string]: FormDataEntryValue;
}

export default function Register() {
  // Local state properties
  const [step, setStep] = useState(0);
  const [account, setAccount] = useState<Account>();

  function updateAccount(updatedProps: UpdatedProps) {
    // Merge the original account with new properties
    const updatedAccount = Object.assign({}, account, updatedProps);

    console.log("########");
    console.log("UPDATED ACCOUNT:");
    console.log(updatedAccount);
    console.log("########");

    // Update "account" local state property
    setAccount(updatedAccount);
    return updatedAccount;
  }

  function nextStep() {
    // Navigate to the next step
    setStep(step + 1);
  }

  function renderStep() {
    switch (step) {
      case 0:
        return (
          <AccountDetails
            updateAccount={updateAccount}
            nextStep={nextStep}
          />
        );
      case 1:
        return (
          <SuitabilityQuestionnaire
            updateAccount={updateAccount}
            nextStep={nextStep}
            account={account}
          />
        );
      case 2:
        return (
          <EmailVerification />
        );
    }
  }

  return (
    <RootLayout title="Register | Black Plum">
      <div
        className="flex min-h-full flex-1 flex-col justify-center items-center py-12 sm:px-6 lg:px-8 bg-gray-100 space-y-8">
        <a href="/" className="mx-auto">
          <span className="sr-only">Your Company</span>
          <Image
            src={logo}
            alt="Logo"
            width={250}
          />
        </a>

        {/* Registration Stepper */}
        <Steps activeStep={step} />

        {/* Render Active Registration Step */}
        {renderStep()}

        <p className="mt-8 text-center text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="font-semibold leading-6 text-blue-500 hover:text-blue-600">
            Login
          </a>
        </p>
      </div>
    </RootLayout>
  );
}
