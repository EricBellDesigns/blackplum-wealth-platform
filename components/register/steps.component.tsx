import {CheckIcon} from "@heroicons/react/24/solid";

const steps = [
  {name: "Account Details"},
  {name: "Questionnaire"},
  {name: "Verify Email"}
];

export default function Steps({activeStep}) {
  return (
    <nav aria-label="Progress" className="sm:max-w-[600px] bg-white cursor-default">
      <ol role="list" className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="relative md:flex md:flex-1">
            {stepIdx < activeStep ? (
              <div className="group flex w-full items-center">
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 group-hover:bg-blue-600">
                    <CheckIcon className="h-6 w-6 text-white" aria-hidden="true"/>
                  </span>
                  <span className="ml-4 text-sm font-medium text-gray-900 whitespace-nowrap">{step.name}</span>
                </span>
              </div>
            ) : stepIdx === activeStep ? (
              <div className="flex items-center px-6 py-4 text-sm font-medium" aria-current="step">
                <span
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-500">
                  <span className="text-blue-500">{stepIdx + 1}</span>
                </span>
                <span className="ml-4 text-sm font-medium text-blue-500 whitespace-nowrap">{step.name}</span>
              </div>
            ) : (
              <div className="group flex items-center">
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400">
                    <span className="text-gray-500 group-hover:text-gray-900">{stepIdx + 1}</span>
                  </span>
                  <span className="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900 whitespace-nowrap">{step.name}</span>
                </span>
              </div>
            )}

            {stepIdx !== steps.length - 1 ? (
              <>
                {/* Arrow separator for lg screens and up */}
                <div className="absolute right-0 top-0 hidden h-full w-5 md:block" aria-hidden="true">
                  <svg
                    className="h-full w-full text-gray-300"
                    viewBox="0 0 22 80"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 -2L20 40L0 82"
                      vectorEffect="non-scaling-stroke"
                      stroke="currentcolor"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
