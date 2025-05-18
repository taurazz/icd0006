export default function Header() {
  
  return (
    <header className="absolute inset-x-0 top-0 z-50 bg-gray-800">
        <nav className="flex items-center justify-between p-4 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Sports app</span>
              <img className="h-8 w-auto" src="/watching-svgrepo-com.svg" alt="icon" />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-300"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <a href="/" className="text-sm font-semibold text-gray-300">Home</a>
            <a href="/location" className="text-sm font-semibold text-gray-300">Location</a>
            <a href="/session" className="text-sm font-semibold text-gray-300">Session</a>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:gap-x-12 lg:justify-end">
            <a href="/register" className="text-sm font-semibold text-gray-300">Register</a>
            <a href="/login" className="text-sm font-semibold text-gray-300">Log in &rarr;</a>
          </div>
        </nav>
      </header>
  );
}