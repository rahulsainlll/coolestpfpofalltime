import Layout from "@/components/layout";

export default function Privacy() {
  return (
    <Layout className="prose prose-sm">
      <h1>Privacy Policy for Coolest PFP of All Time</h1>

      <h2>1. Introduction</h2>
      <p>
        This Privacy Policy explains how <strong>Coolest PFP of All Time</strong> ("we," "us," or "our") collects, uses, and discloses your information when you use our Service. By accessing or using the Service, you consent to the collection and use of information in accordance with this policy.
      </p>

      <h2>2. Information We Collect</h2>
      <p>
        We collect the following information from users:
        <ul>
          <li>
            <strong>Twitter Profile Picture (PFP):</strong> We use the Twitter API to retrieve your public profile picture to display and facilitate voting.
          </li>
          <li>
            <strong>Email Address:</strong> We collect your email address through the Twitter API for account management and communication purposes.
          </li>
        </ul>
      </p>

      <h2>3. How We Use Your Information</h2>
      <p>
        The information we collect is used to:
        <ul>
          <li>Display your Twitter PFP on our platform.</li>
          <li>Enable voting and ranking of PFPs based on user preferences.</li>
          <li>Communicate with you regarding account-related matters.</li>
        </ul>
      </p>

      <h2>4. Data Sharing and Disclosure</h2>
      <p>
        We do not sell or share your personal data with third parties, except as required by law or to comply with legal obligations. Your Twitter PFP is displayed publicly on the site as part of the Service.
      </p>

      <h2>5. Data Security</h2>
      <p>
        We implement reasonable measures to protect your data from unauthorized access, alteration, or disclosure. However, we cannot guarantee the absolute security of your information.
      </p>

      <h2>6. Data Retention</h2>
      <p>
        We retain your Twitter PFP and email address only for as long as necessary to provide the Service or as required by law. You may request the deletion of your data by contacting us.
      </p>

      <h2>7. Your Rights</h2>
      <p>
        You have the right to:
        <ul>
          <li>Access the information we hold about you.</li>
          <li>Request correction of inaccurate information.</li>
          <li>Request deletion of your data.</li>
        </ul>
        To exercise these rights, please contact us at <a href="mailto:voltyiscodingcurrently@gmail.com">voltyiscodingcurrently@gmail.com</a>.
      </p>

      <h2>8. Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Any changes will be posted on this page. Continued use of the Service after changes are posted constitutes your acceptance of the updated Privacy Policy.
      </p>

      <h2>9. Contact Us</h2>
      <p>
        If you have any questions or concerns about this Privacy Policy, please contact us at <a href="mailto:voltyiscodingcurrently@gmail.com">voltyiscodingcurrently@gmail.com</a>.
      </p>

      <p>
        By using <strong>Coolest PFP of All Time</strong>, you agree to the terms outlined in this Privacy Policy.
      </p>
    </Layout>
  )
}