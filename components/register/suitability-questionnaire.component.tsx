import React, {useState} from "react";
import {Account, UpdatedProps} from "../../pages/register";
import axios from "axios";
import Loading from "@/components/loading.component";

interface SuitabilityQuestionnaireProps {
  account: Account
  updateAccount: (arg1: UpdatedProps) => Account
  nextStep: () => void
}

interface Checkbox {
  value: string;
  checked: boolean;
}

const CALIFORNIA_RESIDENT_OPTIONS = [
  {
    value: "individual_california_resident",
    title: "I'm investing as an individual and my principal residence is in California."
  },
  {
    value: "entity_california_resident",
    title: "I'm investing as an entity whose principal place of business is in California."
  },
  {
    value: "non_california_resident",
    title: "I'm not a Californian Resident."
  }
];

const SUITABILITY_OPTIONS = [
  {
    value: "investment_comprehension",
    title: "I have the capacity to understand the fundamental aspects of the investment, by reason of my educational, " +
      "business, or financial experience."
  },
  {
    value: "economic_risk_acceptance",
    title: "I can bear the economic risk of the investment, acknowledging the investment is subject to risk of loss " +
      "of principal and monthly income."
  },
  {
    value: "trust_deed_investment_suitability",
    title: "The investment in notes secured by Trust Deeds is suitable and appropriate for me, given my investment " +
      "objectives, portfolio structure, and financial situation. Relevant information I have considered for this " +
      "purpose includes, at least, my age, investment objectives, investment experience, income, net worth, financial " +
      "situation, and other current and planned investments."
  }
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SuitabilityQuestionnaire({account, updateAccount, nextStep}: SuitabilityQuestionnaireProps) {
  // Local state properties
  const [loading, setLoading] = useState(false);
  const [residencyStatus, setResidencyStatus] = useState("");
  const [investingExperience, setInvestingExperience] = useState("");
  const [investingExperienceYears, setInvestingExperienceYears] = useState<number>();
  const [checkboxes, setCheckboxes] = useState<Checkbox[]>([
    {value: "investment_qualifications", checked: false},
    {value: "investment_comprehension", checked: false},
    {value: "economic_risk_acceptance", checked: false},
    {value: "trust_deed_investment_suitability", checked: false}
  ]);

  async function submitUser(e) {
    e.preventDefault();

    // Render loading spinner to indicate activity
    setLoading(true);

    // Combine account object and questionnaire values
    const payload = Object.assign({}, account, {
      residency_status: residencyStatus,
      investing_experience: investingExperience,
      investing_experience_years: investingExperienceYears
    });

    try {
      // Request Plaid Link token
      await axios.post("/api/auth/register", payload);

      // Hide loading spinner
      setLoading(false);

      console.log("Successfully exchanged public token for access token!");
      // Continue to the next step
      nextStep();
    } catch (error) {
      console.error(error);

      // Hide loading spinner
      setLoading(false);
    }
  }

  const handleResidencyStatusChange = (e) => {
    // Function to handle radio option selection
    setResidencyStatus(e.target.value);
  };

  const handleInvestingExperienceChange = (e) => {
    // Function to handle radio option selection
    setInvestingExperience(e.target.value);
  };

  const handleInvestingExperienceYearsChange = (e) => {
    const numYears = parseInt(e.target.value);
    // Function to handle radio option selection
    setInvestingExperienceYears(numYears);
  };

  // Function to update checkbox state
  function updateCheckboxState(value: string, checked: boolean) {
    // Map over checkboxes array and update the state
    const updatedCheckboxes = checkboxes.map(function (checkbox) {
      return checkbox.value === value
        ? Object.assign({}, checkbox, {checked: checked})
        : checkbox;
    });
    // Set the updated state
    setCheckboxes(updatedCheckboxes);
  }

  function isFormValid() {
    // Check if residencyStatus and investingExperience are not empty
    if (!residencyStatus || !investingExperience) {
      return false;
    }

    // Check if investingExperienceYears is not empty when investingExperience is "experienced_trust_deed_investor"
    if (investingExperience === "experienced_trust_deed_investor" && !investingExperienceYears) {
      return false;
    }

    // Check if all checkboxes are checked
    return checkboxes.every((checkbox) => checkbox.checked);
  }

  // Check if all checkboxes are checked
  const formValid = isFormValid();

  return (
    <div className="sm:w-[700px] bg-white px-6 pt-8 pb-10 border shadow-lg rounded-lg sm:px-12">
      <form className="flex flex-col items-center space-y-8" onSubmit={submitUser}>
        <div className="space-y-8 divide-y-2">
          <div className="space-y-5">
            <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Investor Suitability Questionnaire
            </h2>
            <p className="mt-2 leading-6 text-gray-900 text-center">
              BlackPlum Investors must be Qualified California Residents that meet<br/>
              Bureau of Real Estate (CA BRE form 870) Suitability requirements.
            </p>
            <p className="mt-2 leading-6 text-gray-900 text-center">
              The questions below provide an initial assessment of suitability<br/>
              to enable us to approve your account access. I certify that<br/>
              I'm a suitable investor because: <i>(check all that apply)</i>
            </p>
          </div>

          {/* California Resident Question */}
          <div className="pt-6">
            <label className="text-base font-semibold text-gray-900 underline">
              California Resident
            </label>
            <fieldset className="mt-4">
              <legend className="sr-only">California Resident</legend>
              <div className="space-y-4">
                {CALIFORNIA_RESIDENT_OPTIONS.map((californiaResidentOption, idx: number) => (
                  <div key={idx} className="flex">
                    <input
                      type="radio"
                      id={californiaResidentOption.value}
                      name={californiaResidentOption.value}
                      value={californiaResidentOption.value}
                      checked={residencyStatus === californiaResidentOption.value}
                      onChange={handleResidencyStatusChange}
                      className="h-4 w-4 mt-1 border-gray-300 text-blue-500 focus:ring-blue-500"
                    />
                    <label htmlFor={californiaResidentOption.value}
                           className="ml-3 block font-medium leading-6 text-gray-900">
                      {californiaResidentOption.title}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>

          {/* Qualification of Income or Net Worth Question */}
          <div className="pt-6 space-y-4">
            <label className="text-base font-semibold text-gray-900 underline">
              Qualification of Income or Net Worth
            </label>
            <p className="font-medium leading-6 text-gray-900">
              Investors must meet one or both of the qualifications of income or net worth:
            </p>
            <ul className="list-disc pl-5">
              <li>
                My investment in the transaction does not exceed 10% of my net worth, exclusive of home, furnishings,
                and
                automobiles.
              </li>
              <li>
                My investment in the transaction does not exceed 10% of my adjusted gross income for federal income tax
                purposes for my last tax year or, in the alternative, as estimated for the current year.
              </li>
            </ul>

            <div className="relative flex items-start">
              <div className="flex h-6 items-center">
                <input
                  type="checkbox"
                  id="investment_qualifications"
                  name="investment_qualifications"
                  className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  onChange={(e) => updateCheckboxState("investment_qualifications", e.target.checked)}
                />
              </div>
              <div className="ml-3 leading-6">
                <label htmlFor="investment_qualifications" className="font-medium text-gray-900">
                  I certify that any individual investment I pledge will meet one or both of the qualifications of
                  income
                  or net worth above.
                </label>
              </div>
            </div>
          </div>

          {/* Knowledge, Experience and Suitability Question */}
          <div className="pt-6">
            <div className="flex flex-col space-y-2">
              <label className="text-base font-semibold text-gray-900 underline">
                Knowledge, Experience and Suitability
              </label>
              <div
                className="items-center rounded-md bg-yellow-100 px-2 py-1 font-medium text-yellow-800 space-x-1 border-2 border-yellow-600/20">
                <span className="text-gray-800 font-semibold">Notice:</span>
                <span className="text-yellow-800">
                  You must have all three boxes checked.
                </span>
              </div>
            </div>

            <fieldset className="mt-4">
              <legend className="sr-only">Knowledge, Experience and Suitability</legend>
              <div className="space-y-4">
                {SUITABILITY_OPTIONS.map((suitabilityOption, idx: number) => (
                  <div key={idx} className="flex">
                    <input
                      type="checkbox"
                      id={suitabilityOption.value}
                      name={suitabilityOption.value}
                      className="h-4 w-4 mt-1 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      onChange={(e) => updateCheckboxState(suitabilityOption.value, e.target.checked)}
                    />
                    <label htmlFor={suitabilityOption.value}
                           className="ml-3 block font-medium leading-6 text-gray-900">
                      {suitabilityOption.title}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>

          {/* Experience investing in Trust Deeds Question */}
          <div className="pt-6">
            <label className="text-base font-semibold text-gray-900 underline">
              Experience investing in Trust Deeds
            </label>
            <fieldset className="mt-4">
              <legend className="sr-only">Experience investing in Trust Deeds</legend>
              <div className="space-y-4">
                <div className="flex">
                  <input
                    type="radio"
                    id="experienced_trust_deed_investor"
                    name="experienced_trust_deed_investor"
                    value="experienced_trust_deed_investor"
                    checked={investingExperience === "experienced_trust_deed_investor"}
                    onChange={handleInvestingExperienceChange}
                    className="h-4 w-4 mt-1.5 border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor="experienced_trust_deed_investor"
                         className="ml-3 block font-medium leading-6 text-gray-900">
                    I have invested in Trust Deeds and have
                    <input
                      min={1}
                      type="number"
                      style={{width: 75}}
                      id="experience_years"
                      name="experience_years"
                      onChange={handleInvestingExperienceYearsChange}
                      className="rounded-md border-0 py-1 mx-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                      placeholder="10"
                    />
                    years of experience investing in Trust Deeds.
                  </label>
                </div>

                <div className="flex">
                  <input
                    type="radio"
                    id="new_trust_deed_investor"
                    name="new_trust_deed_investor"
                    value="new_trust_deed_investor"
                    checked={investingExperience === "new_trust_deed_investor"}
                    onChange={handleInvestingExperienceChange}
                    className="h-4 w-4 mt-1 border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor="new_trust_deed_investor"
                         className="ml-3 block font-medium leading-6 text-gray-900">
                    I'm new to Trust Deed Investing
                  </label>
                </div>
              </div>
            </fieldset>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={!formValid || loading}
            style={{width: 160, height: 40}}
            className={classNames(
              formValid
                ? "bg-gray-800 hover:bg-gray-800/90"
                : "bg-gray-500",
              "flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            )}
          >
            {loading ? <Loading /> : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
