import Image from "next/image";
import React from "react";
import envelope from "@/public/envelope.png";

export default function EmailVerification() {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
      {/* Render Active Registration Step */}
      <div className="bg-white px-6 pt-8 pb-10 border shadow-lg rounded-lg sm:px-12">
        <form className="space-y-5">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Registration Complete!
          </h2>
          <p className="mt-2 leading-6 text-gray-700 text-center">
            Verification email has been sent to your<br/>
            email address. Please verify and<br/>
            activate your account.
          </p>
        </form>

        <Image
          src={envelope}
          alt="Envelope"
          width={300}
          className="mx-auto"
        />
      </div>
    </div>
  );
}
