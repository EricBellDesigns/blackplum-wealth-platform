const navigation = {
  main: [
    {name: "Home", href: "/"},
    {name: "Available Offerings", href: "/available-offerings"},
    {name: "About", href: "/#about"},
    {name: "Contact Us", href: "/#contact-us"},
    {name: "Sign In", href: "/login"}
  ],
  legal: [
    {name: "Privacy Policy", href: "/privacy-policy"},
    {name: "Terms of Service", href: "/terms-of-service"}
  ]
}

export default function Footer() {
  return (
    <footer className="flex w-full bg-gray-900">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
          {navigation.main.map((item) => (
            <div key={item.name} className="pb-6">
              <a href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                {item.name}
              </a>
            </div>
          ))}
        </nav>
        <div className="mt-10 border-t border-gray-700 pt-8">
          <nav className="flex justify-center space-x-10" aria-label="Footer">
            {navigation.legal.map((item) => (
              <a key={item.name} href={item.href} className="text-sm leading-6 text-gray-400 hover:text-gray-300">
                {item.name}
              </a>
            ))}
          </nav>
        </div>
        <p className="mt-10 text-center text-xs leading-5 text-gray-400">
          &copy; {new Date().getFullYear()} BlackPlum, Inc. All rights reserved.
        </p>
        <p className="mt-4 text-center text-xs leading-5 text-gray-400">
          This platform is only available to accredited investors. Securities offered through BlackPlum are not FDIC insured and may lose value.
        </p>
      </div>
    </footer>
  );
}
