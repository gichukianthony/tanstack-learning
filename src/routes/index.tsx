import { createFileRoute, Link } from '@tanstack/react-router'
import { LandingNavbar } from '@/components/Header'
import { User2, ShieldCheck, BarChart2, MessageCircle } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function Feature({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition w-full max-w-xs mx-auto">
      <div className="mb-4 text-blue-600">{icon}</div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800 text-center">{title}</h3>
      <p className="text-gray-600 text-center text-sm sm:text-base">{description}</p>
    </div>
  )
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      <LandingNavbar />
      <main className="flex-1 flex flex-col items-center justify-center px-2 sm:px-4 pt-8 sm:pt-12 pb-8 w-full pt-20">
        {/* Hero Section */}
        <section className="text-center mb-16 w-full flex flex-col items-center justify-center" style={{ minHeight: '60vh' }}>
          <h1 className="text-4xl xs:text-5xl sm:text-6xl font-extrabold text-blue-800 mb-4 drop-shadow leading-tight">
            The Modern <span className="text-blue-600">CRM</span> for Your Business
          </h1>
          <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Manage customers, services, feedback, and your team—all in one place. Secure, fast, and easy to use.
          </p>
          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center w-full max-w-md mx-auto">
            <Link to="/auth/login" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition text-center">Get Started</Link>
            <Link to="/auth/register" className="bg-white border border-blue-600 text-blue-700 px-8 py-3 rounded-lg font-semibold text-lg shadow hover:bg-blue-50 transition text-center">Create Account</Link>
          </div>
        </section>
        {/* Features Section */}
        <section id="features" className="w-full max-w-6xl mx-auto grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-20 px-2">
          <Feature icon={<User2 size={36} />} title="User Management" description="Easily manage users, roles, and permissions with a few clicks." />
          <Feature icon={<BarChart2 size={36} />} title="Analytics" description="Gain insights with real-time analytics and reporting dashboards." />
          <Feature icon={<ShieldCheck size={36} />} title="Secure & Reliable" description="Your data is protected with enterprise-grade security and backups." />
          <Feature icon={<MessageCircle size={36} />} title="Feedback & Support" description="Collect feedback and provide support to your customers efficiently." />
        </section>
        {/* Pricing Section */}
        <section id="pricing" className="w-full max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">Simple Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center">
              <h3 className="text-xl font-semibold mb-2">Starter</h3>
              <div className="text-4xl font-bold text-blue-600 mb-4">Free</div>
              <ul className="text-gray-700 mb-6 space-y-2 text-center">
                <li>Up to 3 users</li>
                <li>Basic analytics</li>
                <li>Email support</li>
              </ul>
              <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">Get Started</button>
            </div>
            <div className="bg-blue-600 text-white rounded-lg shadow-lg p-8 flex flex-col items-center border-4 border-blue-400 scale-105">
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-4">$19<span className="text-lg font-normal">/mo</span></div>
              <ul className="mb-6 space-y-2 text-center">
                <li>Unlimited users</li>
                <li>Advanced analytics</li>
                <li>Priority support</li>
                <li>Custom roles</li>
              </ul>
              <button className="bg-white text-blue-700 px-6 py-2 rounded hover:bg-blue-50 transition font-semibold">Start Pro</button>
            </div>
            <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <div className="text-4xl font-bold text-blue-600 mb-4">Contact</div>
              <ul className="text-gray-700 mb-6 space-y-2 text-center">
                <li>Custom integrations</li>
                <li>Dedicated support</li>
                <li>SLAs & onboarding</li>
              </ul>
              <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">Contact Us</button>
            </div>
          </div>
        </section>
        {/* Call to Action */}
        <section className="text-center mb-8 w-full">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-2">Ready to get started?</h2>
          <Link to="/auth/register" className="inline-block bg-green-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold text-base sm:text-lg shadow hover:bg-green-700 transition">Sign Up Now</Link>
        </section>
      </main>
      <footer className="text-center text-gray-500 py-4 border-t bg-white/80 mt-auto text-xs sm:text-sm px-2">
        &copy; {new Date().getFullYear()} CRM System. All rights reserved.
      </footer>
    </div>
  )
}
