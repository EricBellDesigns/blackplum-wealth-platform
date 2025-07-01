import {ArrowPathIcon, CloudArrowUpIcon, FingerPrintIcon, LockClosedIcon} from "@heroicons/react/24/outline";

const features = [
  {
    name: "Vetted Opportunities",
    description:
      "Every investment opportunity undergoes rigorous due diligence. We evaluate sponsors, analyze markets, and review financials to present only the best deals.",
    icon: FingerPrintIcon,
  },
  {
    name: "Lower Minimums",
    description:
      "Access institutional-quality real estate investments typically reserved for large investors. Start investing with minimums as low as $5,000.",
    icon: CloudArrowUpIcon,
  },
  {
    name: "Full Transparency",
    description:
      "Track your investments in real-time. Access detailed offering documents, financial reports, and performance updates through your secure dashboard.",
    icon: LockClosedIcon,
  },
  {
    name: "Passive Income",
    description:
      "Earn regular distributions from cash-flowing properties. Build wealth through appreciation while experienced operators handle day-to-day management.",
    icon: ArrowPathIcon,
  },
]

export default function HowItWorks() {
  return (
    <div id="about" className="bg-gray-900 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How It Works
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            BlackPlum simplifies real estate investing for accredited investors. 
            Browse vetted opportunities, invest online, and track your portfolio performance 
            all in one secure platform.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-white">
                  <div
                    className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true"/>
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-300">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
