import { Link } from "react-router-dom";
import { Star } from "lucide-react";

const Home = () => {
  return (
    <main className="bg-black text-white">
      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-purple-700 to-purple-900 py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            Empower Your Company’s Collaboration
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-3xl mx-auto">
            A comprehensive platform for meetings, events, learning, and team entertainment —
            all unified in one powerful solution for modern organizations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/signup"
              className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition transform hover:scale-105"
            >
              Get Started
            </Link>
            <Link
              to="/signin"
              className="bg-white text-purple-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 bg-gray-950">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-purple-400 font-semibold mb-4 tracking-wide">
            OUR FEATURES
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-10">
            Everything Your Team Needs
          </h3>
          <p className="text-gray-400 mb-16 max-w-3xl mx-auto">
            Streamline collaboration, boost productivity, and strengthen team
            bonds with our comprehensive ecosystem.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "📹",
                title: "Online Meetings",
                text: "Host seamless video conferences and collaborate in real-time with your team.",
              },
              {
                icon: "🎉",
                title: "Company Events",
                text: "Plan, organize, and manage corporate events efficiently on one platform.",
              },
              {
                icon: "📚",
                title: "Learning Platform",
                text: "Access educational materials and resources to upskill your team.",
              },
              {
                icon: "🎮",
                title: "Team Building",
                text: "Foster strong team bonds with entertainment and interactive activities.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-8 text-left hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-400">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-purple-400 font-semibold mb-4 tracking-wide">
            TESTIMONIALS
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-10">
            Trusted by Teams Everywhere
          </h3>
          <p className="text-gray-400 mb-16 max-w-3xl mx-auto">
            See what our customers are saying about Nexium.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Nexium has transformed how our team collaborates. Everything we need is now in one place.",
                name: "Sarah Johnson",
                title: "HR Director, TechCorp",
              },
              {
                quote:
                  "The most user-friendly platform we’ve used. Our team meetings are more productive than ever.",
                name: "Michael Chen",
                title: "Project Manager, InnovateSoft",
              },
              {
                quote:
                  "From company events to training, this platform does it all. A game-changer for our organization.",
                name: "Aisha Patel",
                title: "CEO, FutureWorks",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
              >
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="italic text-gray-300 mb-6">"{t.quote}"</p>
                <p className="font-semibold">{t.name}</p>
                <p className="text-gray-400">{t.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION SECTION */}
      <section className="bg-purple-700 py-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Transform Your Team’s Collaboration?
          </h2>
          <p className="text-lg mb-8 text-gray-200">
            Join thousands of companies already using Nexium to boost engagement
            and streamline operations.
          </p>
          <Link
            to="/signup"
            className="bg-white text-purple-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
