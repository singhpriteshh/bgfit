import {
  Activity,
  Heart,
  Users,
  Award,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

const About = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-secondary overflow-hidden py-32">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-20 filter grayscale contrast-125"
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Gym background"
          />
          <div className="absolute inset-0 bg-secondary/80 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter text-white mb-6 uppercase">
            Empowering Your{" "}
            <span className="text-primary block md:inline">
              Fitness Journey
            </span>
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            At BgFitStore, fitness is not just a destination, but a lifestyle.
            We engineer premium gear to help you perform at your best, every
            single day.
            <br />
            <span className="font-bold text-white mt-4 block">
              Bold. Resilient. Unstoppable.
            </span>
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div className="relative mb-12 lg:mb-0">
              <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-primary -mt-4 -ml-4 hidden lg:block"></div>
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <img
                  className="w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                  alt="Training"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>
              </div>
              <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-secondary -mb-4 -mr-4 hidden lg:block"></div>
            </div>

            <div>
              <h2 className="text-primary font-bold tracking-widest uppercase mb-2 text-sm">
                Our Origin
              </h2>
              <h3 className="text-4xl font-display font-bold text-gray-900 mb-6 uppercase">
                The Story
              </h3>
              <div className="prose prose-lg text-gray-500">
                <p>
                  Founded in 2024,{" "}
                  <span className="text-gray-900 font-bold">BgFitStore</span>{" "}
                  started with a simple mission: to bridge the gap between
                  high-performance athletic wear and everyday style. What began
                  as a passion project in a small garage has grown into a
                  community-driven brand trusted by athletes worldwide.
                </p>
                <p>
                  We obsess over details. From fabric selection to stitch
                  patterns, everything we create is designed to withstand the
                  toughest workouts while looking great on the street. We aren't
                  just selling clothes; we're fueling confidence.
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <blockquote className="italic text-gray-600 text-lg">
                  "Quality is never an accident. It is always the result of high
                  intention, sincere effort, intelligent direction and skillful
                  execution."
                </blockquote>
                <p className="mt-4 font-display font-bold text-secondary uppercase tracking-wide">
                  — The BgFitStore Team
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-primary font-bold tracking-widest uppercase mb-2 text-sm">
              Our DNA
            </h2>
            <h3 className="text-4xl font-display font-bold text-gray-900 uppercase">
              Why Choose Us?
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Premium Quality",
                description:
                  "Crafted with high-performance fabrics that endure the toughest sessions.",
                icon: Award,
              },
              {
                name: "Community First",
                description:
                  "Join thousands of fitness enthusiasts who support and motivate each other.",
                icon: Users,
              },
              {
                name: "Latest Trends",
                description:
                  "Stay ahead of the curve with designs that blend fashion and function.",
                icon: TrendingUp,
              },
              {
                name: "Secure Shopping",
                description:
                  "Your data is protected with industry-standard encryption and security.",
                icon: ShieldCheck,
              },
              {
                name: "Health Focused",
                description:
                  "Promoting a holistic approach to health and physical well-being.",
                icon: Heart,
              },
              {
                name: "Peak Performance",
                description:
                  "Gear designed to help you break personal records and reach new heights.",
                icon: Activity,
              },
            ].map((feature) => (
              <div
                key={feature.name}
                className="bg-white p-8 border border-gray-100 hover:border-primary transition-colors duration-300 group"
              >
                <div className="inline-flex items-center justify-center p-3 rounded-md bg-secondary text-white group-hover:bg-primary transition-colors mb-6">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h4 className="text-xl font-display font-bold text-gray-900 mb-3 uppercase">
                  {feature.name}
                </h4>
                <p className="text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
