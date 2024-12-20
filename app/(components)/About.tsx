import React from "react";

const AboutTool: React.FC = () => {
  return (
    <section className="bg-white shadow-md rounded-lg p-6 mt-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        About This Tool
      </h2>
      <p className="text-gray-600 mb-6">
        This financial dashboard app helps users track their accounts, 
        optimize credit card payments, and stay informed about their financial health. 
        Whether managing personal finances or streamlining workflows, 
        this tool is designed to simplify your experience and provide actionable insights.
      </p>

      <h3 className="text-xl font-semibold text-gray-800 mb-3">FAQ</h3>
      <div className="mb-6 space-y-4">
        <div>
          <h4 className="font-semibold text-gray-700">Who is this tool for?</h4>
          <p className="text-gray-600">
            This app is perfect for individuals who want to better understand 
            and manage their finances, as well as hiring managers and clients 
            seeking innovative tech solutions for financial planning.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700">
            How can this tool benefit hiring managers?
          </h4>
          <p className="text-gray-600">
            Hiring managers can see my expertise in creating user-friendly, 
            data-driven applications, demonstrating problem-solving skills and 
            proficiency in modern tech stacks.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700">Can I customize this tool?</h4>
          <p className="text-gray-600">
            Absolutely! The app is modular and can be tailored to suit different 
            workflows and financial needs. Contact me for details.
          </p>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-3">Contact Me</h3>
      <p className="text-gray-600 mb-4">
        Interested in learning more or collaborating? Reach out via LinkedIn, 
        GitHub, or email!
      </p>
      <div className="flex space-x-4">
        <a
          href="https://www.linkedin.com/in/your-profile"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-2xl"
          aria-label="LinkedIn"
        >
          <i className="fab fa-linkedin"></i>
        </a>
        <a
          href="https://github.com/your-profile"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-800 hover:text-gray-900 text-2xl"
          aria-label="GitHub"
        >
          <i className="fab fa-github"></i>
        </a>
        <a
          href="mailto:your-email@example.com"
          className="text-red-600 hover:text-red-800 text-2xl"
          aria-label="Email"
        >
          <i className="fas fa-envelope"></i>
        </a>
      </div>
    </section>
  );
};

export default AboutTool;
