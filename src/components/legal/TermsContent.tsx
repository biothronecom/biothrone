
import { siteConfig } from "@/lib/config";

export function TermsContent() {
    return (
        <div className="space-y-8 text-muted-foreground">
          <section className="space-y-4">
            <h2 className="text-3xl font-headline text-foreground">1. Acceptance of Terms</h2>
            <p>
              Welcome to {siteConfig.appName}. These Terms of Use and Purchase ("Terms") are a legally binding contract between you and {siteConfig.appName} ("we," "us," "our"). These Terms govern your access to and use of our website, any related digital services, and the purchase of our products and subscriptions. By accessing our website or making a purchase, you acknowledge that you have read, understood, and unconditionally agree to be bound by these Terms in their entirety. If you do not agree with any part of these Terms, you must immediately cease use of this website and refrain from purchasing our products.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-headline text-foreground">2. Purchases and Payment</h2>
            <p>
              When you make a purchase, you agree to provide a valid payment method. We partner with secure third-party payment processors to handle transactions. By providing your payment information, you authorize us and our processor to charge the specified amount to your selected payment method.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-headline text-foreground">3. Subscriptions and Automatic Renewal</h2>
            <p>
                You may choose to purchase products as a one-time transaction or as part of a subscription bundle. By purchasing a bundle with promotional savings, you are purchasing a product coupled with an ongoing digital service for automated delivery, and you explicitly agree to enroll in an automatic renewal subscription plan.
            </p>
            <p>
                This subscription includes automatic delivery of the product bundle four (4) times per year. You will be automatically charged for each shipment using the payment method you provided for the initial purchase. Your subscription will continue indefinitely, and you will be charged for each renewal term until you cancel it. You may cancel your subscription at any time through your account portal or by contacting customer service. You acknowledge and agree that your cancellation will be effective for the next billing cycle and no refunds will be issued for charges already processed.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-headline text-foreground">4. Shipping and Returns Policy</h2>
            <p>
              We aim to process and ship orders promptly. Shipping times may vary based on your location.
            </p>
            <p>
              <strong>All sales are final, non-cancellable, and non-refundable.</strong> Due to the nature of our products, we do not accept returns or exchanges for any reason. Once an order is placed and payment is processed, it cannot be canceled. If you receive a product that is damaged upon arrival, you must contact our customer service within 7 days of receipt with photographic evidence to be eligible for a replacement, which is determined at our sole discretion.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-3xl font-headline text-foreground">5. Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos, images, product names, brand identity, and software, is the exclusive property of {siteConfig.appName} and its licensors and is protected by international copyright and trademark laws. You are strictly forbidden from using, reproducing, or distributing any content without our express prior written permission.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-headline text-foreground">6. Disclaimer of Warranties; Limitation of Liability & Indemnification</h2>
            <p>
              Our products, website, and all related services are provided "as is" and "as available" without any warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that the product will meet your expectations or that the website will be uninterrupted or error-free.
            </p>
            <p>
              To the absolute fullest extent permissible by law, {siteConfig.appName}, its parent company, subsidiaries, affiliates, officers, directors, employees, agents, partners, and suppliers shall not be liable for any indirect, incidental, special, consequential, punitive, or exemplary damages, including but not limited to damages for loss of profits, goodwill, use, data, or other intangible losses, resulting from your use of our website or products. Your sole and exclusive remedy for any dissatisfaction with our products or services is to cancel your subscription and cease using the website.
            </p>
            <p>
              You agree to indemnify, defend, and <strong>hold harmless</strong> {siteConfig.appName} and its subsidiaries, affiliates, officers, directors, employees, agents, and suppliers from any and all claims, liabilities, damages, losses, costs, and expenses, including reasonable attorneys' fees, arising from or in any way related to your use of our products or website, or your violation of these Terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-headline text-foreground">7. Dispute Resolution and Governing Law</h2>
            <p>
                By using this website or purchasing our products, you irrevocably agree that any dispute, claim, or controversy arising out of or relating to these Terms, the website, or the products shall be resolved exclusively through binding, individual mediation.
            </p>
            <p>
                <strong>You explicitly agree to waive your right to a trial by jury. You agree not to ever initiate or participate in a lawsuit in any court to resolve a dispute. You further agree to waive any right to participate as a plaintiff or class member in any purported class action lawsuit, class-wide arbitration, or any other representative proceeding.</strong> The mediation will be administered by a neutral third-party mediator agreed upon by both parties. These Terms shall be governed by and construed in accordance with the laws of the state in which {siteConfig.appName} operates, without regard to its conflict of law principles.
            </p>
          </section>

           <section className="space-y-4">
            <h2 className="text-3xl font-headline text-foreground">8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at our sole discretion at any time. Any changes will be effective immediately upon posting to the website. Your continued use of our site or products after such changes constitutes your unconditional acceptance of the new Terms. It is your responsibility to review these terms periodically for updates.
            </p>
          </section>
          
           <section className="space-y-4">
            <h2 className="text-3xl font-headline text-foreground">9. Shipping Charges</h2>
            <p>
                A flat-rate shipping fee of $8.95 will be added to all orders containing one or two individual products. Shipping is provided free of charge for any order that includes the Bio-Throne™ Bundle. This is part of our commitment to providing the best value and encouraging sustainable shipping practices. Shipping costs are non-refundable.
            </p>
          </section>

           <section className="space-y-4">
            <h2 className="text-3xl font-headline text-foreground">10. Data We Collect</h2>
             <p>
                To process your order and provide a secure shopping experience, we collect necessary personal information. This includes:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong>Shipping Information:</strong> Your full name, shipping address, city, state, and ZIP code are required to deliver your products accurately and on time.</li>
                <li><strong>Contact Information:</strong> Your email address and optional phone number are used to send order confirmations, shipping updates, and to contact you if there are any issues with your order. If you opt-in, we may also use your phone number for SMS updates.</li>
                <li><strong>IP Address:</strong> To protect against fraudulent transactions and enhance the security of our checkout process, we collect your IP address when you complete the security captcha.</li>
            </ul>
            <p>
                We are committed to protecting your privacy. This data is collected solely for the purpose of fulfilling your order and ensuring the security and integrity of our payment system. We do not store your credit card details; all payment processing is handled securely by PayPal.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-headline text-foreground">11. Third-Party Cookies and Tracking Pixels</h2>
            <p>
              Our website utilizes cookies, tracking pixels, and related technologies from third-party services for advertising and marketing purposes. These services may include, but are not limited to, Meta (Facebook and Instagram), Google, Pinterest, and Reddit. These technologies are used solely for advertising our products on those platforms.
            </p>
            <p>
              When you visit our website, these third-party services may place cookies on your browser to collect data about your activity. This data helps us to measure the effectiveness of our advertising campaigns and to deliver targeted advertisements to you on other websites and social media platforms. By using our site, you consent to the use of such cookies and tracking technologies. You can typically manage your cookie preferences and opt-out of targeted advertising through your browser settings or by visiting the privacy settings of the respective third-party platforms.
            </p>
          </section>

        </div>
    )
}
