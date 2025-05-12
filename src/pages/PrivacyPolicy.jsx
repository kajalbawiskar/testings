import React from "react";
import { MdOutlinePrivacyTip } from "react-icons/md";

const PrivacyPolicy = ({ onClose }) => {
  return (
    <div className="bg-white overflow-hidden font-roboto">
      <div className="flex justify-center w-full font-roboto mt-4 relative">
        <div className="max-w-3xl bg-white bg-opacity-75 rounded-lg p-4">
        <button
              className="absolute top-0 right-3 text-gray-500"
              onClick={onClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          <h2 className="text-center text-xl lg:text-4xl font-extrabold text-gray-900 flex justify-center">
            <span className="mr-2">
              <MdOutlinePrivacyTip />
            </span>
            Privacy Policy
          </h2>
          <div className="text-sm lg:text-base mt-4 h-[32rem] text-justify text-gray-500 overflow-y-auto p-6">
            <p className="py-1.5">
              This Privacy Policy explains how Confidanto collects, uses, and
              discloses personal information when you use our web application.
            </p>
            <p className="py-1.5">Information We Collect</p>
            <p className="py-1.5">
              Personal Information: When you sign up for our service or use
              certain features, we may collect personal information such as your
              name, email address, and contact details.
            </p>
            <p className="py-1.5">
              Usage Information: We may collect information about how you
              interact with our web app, including your IP address, browser
              type, pages visited, and timestamps.
            </p>
            <p className="py-1.5">
              Cookies: We use cookies and similar tracking technologies to
              enhance your experience, analyze trends, and personalize content.
              You can control cookies through your browser settings.
            </p>
            <p className="py-1.5">How We Use Your Information</p>
            <p className="py-1.5">
              We may use your personal information for the following purposes:
            </p>
            <p className="py-1.5 ml-6">
              <ul class="list-disc">
                <li>To provide and maintain our web app.</li>
                <li>
                  To personalize your experience and improve our services.
                </li>
                <li>
                  To communicate with you, including responding to inquiries and
                  providing updates.
                </li>
                <li>
                  To analyze usage trends and improve our web app's
                  functionality
                </li>
                and performance.
                <li>
                  To comply with legal obligations and enforce our policies.
                </li>
                <li>Data Sharing and Disclosure</li>
              </ul>
            </p>
            <p className="py-1.5">
              We may share your personal information in the following
              circumstances:
            </p>
            <p className="py-1.5">
              With third-party service providers who assist us in operating our
              web app and delivering services.
              <br />
              With your consent or at your direction, including when you choose
              to share information publicly.
              <br />
              In response to legal requests or to protect our rights, property,
              or safety. In connection with a merger, acquisition, or sale of
              assets, where your information may be transferred as part of the
              transaction.
              <br />
              Data Retention
            </p>
            <p className="py-1.5">
              We retain your personal information for as long as necessary to
              fulfill the purposes outlined in this Privacy Policy unless a
              longer retention period is required or permitted by law.
            </p>
            <p className="py-1.5">Security</p>
            <p className="py-1.5">
              We implement reasonable security measures to protect your personal
              information from unauthorized access, alteration, disclosure, or
              destruction. However, no method of transmission over the internet
              or electronic storage is completely secure, so we cannot guarantee
              absolute security.
            </p>
            <p className="py-1.5">Your Choices</p>
            <p className="py-1.5">
              You can access, update, or delete your personal information by
              contacting us or adjusting your account settings. You may also
              opt-out of receiving promotional communications from us by
              following the instructions in those communications.
            </p>
            <p className="py-1.5">Children's Privacy</p>
            <p className="py-1.5">
              Our web app is not intended for children under the age of 13, and
              we do not knowingly collect personal information from children
              under this age. If you are a parent or guardian and believe your
              child has provided us with personal information, please contact us
              to request deletion.
            </p>
            <p className="py-1.5">Changes to This Privacy Policy</p>
            <p className="py-1.5">
              We may update this Privacy Policy from time to time, and any
              changes will be posted on this page. We encourage you to review
              this Privacy Policy periodically for any updates.
            </p>
            <p className="py-1.5">Contact Us</p>
            <p className="py-1.5">
              If you have any questions or concerns about this Privacy Policy or
              our privacy practices, please contact us at
              contact@confidanto.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
