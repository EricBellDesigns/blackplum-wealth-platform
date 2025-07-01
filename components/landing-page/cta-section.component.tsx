export default function CtaSection() {
  return (
    <div className="bg-blue-600">
      <div className="px-6 sm:px-6 py-16 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Start Investing?
            <br />
            Join BlackPlum Today.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-200">
            Access exclusive real estate investment opportunities and start building your portfolio 
            with as little as $5,000. Join hundreds of accredited investors already on the platform.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/register"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Get started
            </a>
            <a href="/available-offerings" className="text-sm font-semibold leading-6 text-white">
              View offerings <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
