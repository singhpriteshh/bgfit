import SEO from "../components/SEO";

export default function FAQ() {
  const faqs = [
    {
      question: "What is your shipping policy?",
      answer:
        "We offer free standard shipping on all orders over ₹999. Orders are typically processed within 24 hours and delivered within 7-14 business days.",
    },
    {
      question: "How do I track my order?",
      answer:
        "Once your order ships, you will receive an email with a tracking number and a link to monitor your delivery status in real-time.",
    },
    {
      question: "Can I return or exchange my items?",
      answer:
        'Yes! We offer a 15-day "No Questions Asked" return policy. Items must be unworn and have original tags attached.',
    },
    {
      question: "Are your sizes true to fit?",
      answer:
        'Most of our products have a "relaxed athletic fit." We recommend checking the Size Guide on the product details page before ordering.',
    },
  ];

  return (
    <div className="bg-white min-h-[60vh] py-16 md:py-24">
      <SEO
        title="FAQ – BgFit.in | Frequently Asked Questions"
        description="Find answers to common questions about BgFit.in orders, shipping, returns, sizing, and more. Get help with your premium streetwear and fitness clothing purchases."
        keywords="bgfit FAQ, frequently asked questions, shipping policy, return policy, size guide, order tracking, bgfit help, bgfit customer support"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-center text-gray-900 mb-16 tracking-wide">
          How can we help?
        </h1>

        <div className="space-y-12">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-100 pb-12 last:border-0"
            >
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-4 font-display">
                {faq.question}
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
