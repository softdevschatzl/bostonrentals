<template>
  <div class="container">
    <h1>Privacy Policy</h1>
    <h2>The Privacy Policy For Alexander's Rentals</h2>
    <p>Last Updated: 02/03/2024</p>
    <p>Welcome to Alexander's Rentals, a Rentals Search Website affiliated with The Real Broker MA. This privacy policy outlines our practices regarding the collection, use, and disclosure of personal and non-personal information we receive from users of our website.</p>
    <h3>1. Information Collection and Use</h3>
    <p>We collect the following types of information:</p>
    <ul>
      <li>Personal Information: Full name, phone number, email address, and age.</li>
      <li>Non-Personal Information: IP address and browser type.</li>
    </ul>
    <p>This information is collected through registration forms, cookies, and analytics tools. We use third-party services such as AWS Cognito and Amazon Analytics for data processing.</p>
    <p>The collected data is used for age verification, personalizing your rental search experience, marketing purposes, analytics, and verification.</p>
    <h3>2. Data Storage and Security</h3>
    <p>All data is securely stored on Amazon AWS Cloud services, including EC2 and RDS. Amazon is responsible for implementing security measures to protect your personal data.</p>
    <h3>3. Data Sharing and Disclosure</h3>
    <p>We share your information with the following third parties:</p>
    <ul>
      <li>IP-API for geolocation services.</li>
      <li>AWS for data storage and hosting.</li>
      <li>YouGotListings for accessing rental listings.</li>
    </ul>
    <p>Your data may be disclosed only in legal situations as required by law.</p>
    <h3>4. User Rights and Controls</h3>
    <p>You have the right to update or delete any personal data provided to us through our service. You can also opt-out of communications via email or SMS. Please refer to our Cookies Agreement for information on managing cookies and tracking technologies.</p>
    <h3>5. Compliance with Privacy Laws</h3>
    <p>We strive to comply with all applicable privacy laws. However, we are currently reviewing our obligations under various privacy legislations. We recommend consulting a legal advisor for specific legal advice on this matter.</p>
    <h3>6. Policy Updates</h3>
    <p>Our Privacy Policy may be updated periodically. We will notify you of any changes by prompting you upon login, and you will be required to agree to the updated policy.</p>
    <h3>7. Contact Us</h3>
    <p>If you have any questions about this Privacy Policy, please contact us at [Insert Contact Information].</p>
  </div>
</template>

<script>
export default {
  name: 'PrivacyPolicyPage',
  // Add your component logic here
}
</script>

<style scoped>
  h1 {
    margin-bottom: 5vh;
    text-decoration: underline;
  }
  p {
    margin-bottom: 3vh;
  }
  h2, h3 {
    margin-bottom: 2vh;
  }
  ul {
    margin-bottom: 2vh;
  }
  .container {
    border: 3px solid black;
    padding: 10px;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
</style>
