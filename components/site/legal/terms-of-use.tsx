"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const TermsOfUse = () => {
  return (
    <Dialog>
      <DialogTrigger render={<button>Terms and conditions</button>} />
      <DialogContent className="sm:max-w-[70%] h-fit max-h-[90vh] overflow-hidden">
        <DialogHeader className="p-5">
          <DialogTitle className={"text-xl sm:text-2xl  font-bold"}>TERMS OF USE</DialogTitle>
          <DialogDescription className={"flex flex-col text-base sm:text-lg text-ink-muted font-semibold"}>
            <span className="">Handwork Expert</span>
            <span className="">Last Updated: April 11, 2026</span>
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto scrollbar-thin text-sm sm:text-base px-5 space-y-3 pb-[20vh]">
          <div className=" space-y-1.5 mb-4">
            <h2 className="font-bold uppercase">AGREEMENT TO OUR LEGAL TERMS</h2>
            <div className=" space-y-4">
              <p>
                We are <b>Handwork Expert</b> (the “Company,” “we,” “us,” or “our”), a product of ATOD TECHNOLOGY
              </p>
              <p>
                We operate the website <a href="http://www.handworkexpert.com" className="font-bold text-blue-900">http://www.handworkexpert.com</a> (the “Site”), the mobile application <b>Handwork Expert</b> (the “App”), and any related products and services that reference or link to these Legal Terms (collectively, the “Services”).
                The Services are intended solely for lawful, legitimate, and appropriate personal or business use.
              </p>
              <p>
                You may contact us via our Email: <a href="mailto:support@handworkexpert.com" className="font-bold text-blue-900">support@handworkexpert.com</a> and <a href="mailto:admin@atodtech.com" className="font-bold text-blue-900">admin@atodtech.com</a>, or use our physical address: 3, igbobi, Fadeyi Lagos.
              </p>
              <p>
                These Terms constitute a legally binding agreement between you (“user” or “you”) and Handwork Expert regarding your access to and use of the Services.
              </p>
              <p>
                By accessing or using the Services, you confirm that you have read, understood, and agreed to these Terms. If you do not agree, you must stop using the Services immediately.
              </p>
              <p>
                These Terms apply only to users who are <b>18 years or older</b>. Users under 18 are not permitted to use the Services.
              </p>
            </div>
          </div>

          <div className=" space-y-1.5 mb-4">
            <h2 className="font-bold uppercase">OUR SERVICES</h2>
            <p className=" mb-4">
              Our services provide a digital platform that connects users with artisans for service requests, bookings, and related activities.
            </p>
            <p className="mb-4">
              We do not guarantee that the Services are appropriate or available for use in all locations. Users accessing the Services from other jurisdictions are responsible for complying with local laws.
            </p>
          </div>
          <div className=" space-y-1.5 mb-4">
            <h2 className="font-bold uppercase">INTELLECTUAL PROPERTY RIGHTS</h2>
            <p className="mb-4">
              All content, branding, design, software, and materials within the Services are owned or licensed by Handwork Expert and are protected by intellectual property laws.
            </p>
            <p className="mb-4">
              You are granted a limited, non-exclusive, non-transferable license to use the Services strictly for personal or internal business use.
            </p>
            <div className="mb-4">
              <p className="mb-1.5">You may not:</p>
              <ul className="mb-2 ml-4">
                <li className="">● Copy, reproduce, or distribute our content without permission</li>
                <li className="">● Modify or create derivative works</li>
                <li className="">● Use our trademarks or branding without authorization</li>
              </ul>
            </div>
          </div>
          <div className=" space-y-1.5 mb-4">
            <h2 className="font-bold uppercase">USER REPRESENTATIONS</h2>
            <div className="mb-4">
              <p className="mb-1.5">
                By using the Services, you confirm that you agree to the following terms:
              </p>
              <ul className="ml-4">
                <li className="">● All information you provide is accurate and up-to-date.</li>
                <li className="">● You are legally capable of entering into this agreement</li>
                <li className="">● You will not use the Services for illegal activities</li>
                <li className="">● You will not access the Services using bots or automated tools</li>
              </ul>
            </div>
            <p>
              We reserve the right to suspend or terminate accounts that violate these Terms
            </p>
          </div>
          <div className=" space-y-1.5 mb-4">
            <h2 className="font-bold uppercase">USER REGISTRATION</h2>
            <p>You may be required to create an account.</p>
            <div className="mb-4">
              <p className="mb-1.5">
                You are responsible for:
              </p>
              <ul className="ml-4">
                <li className="">● Maintaining confidentiality of your login credentials</li>
                <li className="">● All activities carried out under your account</li>
              </ul>
            </div>
            <p>
              We may remove or modify usernames deemed inappropriate.
            </p>
          </div>
          <div className=" space-y-1.5 mb-4">
            <h2 className="font-bold uppercase">PROHIBITED ACTIVITIES</h2>
            <div className="mb-4">
              <p className="mb-1.5">
                You agree not to:
              </p>
              <ul className="ml-4">
                <li className="">● Use the Services for unlawful purposes</li>
                <li className="">● Attempt fraud, hacking, or impersonation</li>
                <li className="">● Disrupt or interfere with platform operations</li>
                <li className="">● Upload malicious software or harmful content</li>
                <li className="">● Scrape or extract data without permission</li>
                <li className="">● Harass or abuse other users or staff</li>
                <li className="">● Use automated systems to access the platform</li>
              </ul>
            </div>
            <p>
              Violation may result in immediate suspension or legal action.
            </p>
          </div>
          <div className=" space-y-1.5 mb-4">
            <h2 className="font-bold uppercase">USER CONTENT</h2>
            <p>
              If you submit content (reviews, feedback, or messages), you grant us permission to use it for operating and improving the Services.
            </p>
            <div className="mb-4">
              <p className="mb-1.5">
                You confirm that:
              </p>
              <ul className="ml-4">
                <li className="">● Your content is lawful and does not infringe on third-party rights</li>
                <li className="">● You are responsible for anything you submit</li>
                <li className="">● We may remove content at our discretion</li>
              </ul>
            </div>
          </div>
          <div className=" space-y-1.5 mb-4">
            <h2 className="font-bold uppercase">MOBILE APP LICENSE</h2>
            <p>
              We grant you a limited, revocable license to install and use the app on devices you own.
            </p>
            <div className="mb-4">
              <p className="mb-1.5">
                You may not:
              </p>
              <ul className="ml-4">
                <li className="">● Reverse engineer or copy the app.</li>
                <li className="">● Use it for competing products</li>
                <li className="">● Modify or distribute the App without permission</li>
              </ul>
            </div>
          </div>

          <div className=" space-y-1.5 mb-4">
            <h2 className="font-bold uppercase">THIRD-PARTY SERVICES</h2>
            <p>
              The Services may integrate third-party platforms (e.g., Google, Apple, and payment providers like Paystack).
            </p>
            <p>We are not responsible for third-party services, privacy practices, or downtime.</p>
          </div>

          <div className=" space-y-1.5 mb-4">
            <h2 className="font-bold uppercase">SERVICES MANAGEMENT</h2>
            <div className="mb-4">
              <p>
                We reserve the right to:
              </p>
              <ul className="ml-4">
                <li className="">● Monitor usage for violations</li>
                <li className="">● Suspend or remove users</li>
                <li className="">● Restrict access to features</li>
                <li className="">● Remove harmful or illegal content</li>
                <li className="">● Ensure platform stability and security</li>
              </ul>
            </div>
          </div>

          <div className=" space-y-1.5 mb-4">
            <h2 className="font-bold uppercase">TERMINATION</h2>
            <div className="mb-4">
              <p>
                We may suspend or terminate your account at any time if:
              </p>
              <ul className="ml-4">
                <li className="">● You violate these terms.</li>
                <li className="">● You engage in fraudulent or harmful activity</li>
                <li className="">● Required by law or security concerns</li>
              </ul>
            </div>
          </div>
          <div className=" space-y-1.5 mb-4">
            <h2 className="font-bold uppercase">TERMINATION</h2>
            <div className="mb-4">
              <p>
                We may suspend or terminate your account at any time if:
              </p>
              <ul className="ml-4">
                <li className="">● You violate these terms.</li>
                <li className="">● You engage in fraudulent or harmful activity</li>
                <li className="">● Required by law or security concerns</li>
              </ul>
            </div>
          </div>

          <div className=" space-y-1.5 mb-4">
            <h2 className="font-bold uppercase">GOVERNING LAW</h2>
            <p>
              These Terms are governed by the laws of the <b>Federal Republic of Nigeria</b>, including the <b>Nigeria Data Protection Act (NDPA) of 2023</b>.
            </p>
          </div>
          
          <div className=" space-y-1.5 mb-4">
            <h2 className="font-bold uppercase">DISPUTE RESOLUTION</h2>
            <p>
              Disputes shall first be resolved through informal negotiation. If unresolved, disputes may be referred to arbitration or competent courts in Nigeria, as permitted by law.
            </p>
          </div>
          
          <div className=" space-y-1.5 mb-4">
            <h2 className="font-bold uppercase">DISCLAIMERS</h2>
            <p>
              The Services are provided on an “as-is” and “as-available” basis.
            </p>
            <div className="">
              <p>We do not guarantee:</p>
              <ul className="ml-4">
                <li className="">● Continuous availability</li>
                <li className="">● Error-free performance</li>
                <li className="">● Accuracy of user-generated content</li>
              </ul>
            </div>
          </div>
          
          <div className=" space-y-1.5 mb-4">
            <h2 className="font-bold uppercase">LIMITATION OF LIABILITY</h2>
            <div className="mb-4">
              <p>
                We are not liable for indirect, incidental, or consequential damages, including:
              </p>
              <ul className="ml-4">
                <li className="">● Loss of income</li>
                <li className="">● Data loss</li>
                <li className="">● Business interruption</li>
              </ul>
            </div>
            <p>Our total liability shall not exceed any amount paid by you to us (if applicable).</p>
          </div>

          <div className=" space-y-1.5 mb-4">
            <h2 className="font-bold uppercase">INDEMNIFICATION</h2>
            <div className="mb-4">
              <p>
                You agree to indemnify Handwork Expert against claims arising from the following:
              </p>
              <ul className="ml-4">
                <li className="">● Your use of the Services</li>
                <li className="">● Violation of these Terms</li>
                <li className="">● Harmful or illegal activity conducted via your account</li>
              </ul>
            </div>
          </div>

          <div className=" space-y-1.5 mb-4">
            <h2 className="font-bold uppercase">USER DATA</h2>
            <p>
              We store and process data to operate the Services.
            </p>
            <p>
              You are responsible for backing up your data. We are not liable for data loss.
            </p>
          </div>
          
          <div className=" space-y-1.5 mb-4">
            <h2 className="font-bold uppercase">ELECTRONIC COMMUNICATIONS</h2>
            <p>
              By using the Services, you agree to receive electronic communications such as emails, notifications, and legal notices.
            </p>
          </div>

          <div className=" space-y-1.5 mb-4">
            <h2 className="font-bold uppercase">CHANGES TO TERMS</h2>
            <p>
              We may update these Terms at any time. If you continue to use the Services, you accept the updated Terms.
            </p>
          </div>
          
          <div className=" space-y-1.5 mb-4">
            <h2 className="font-bold uppercase">CONTACT US</h2>
            <p>
              For support or legal inquiries:
            </p>
            <div className="flex flex-col">
              <h3 className="font-bold">Handwork Expert</h3>
              <span>Phone: +2347072814869</span>
              <span>Email: support@handworkexpert.com</span>
            </div>
          </div>
          
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TermsOfUse