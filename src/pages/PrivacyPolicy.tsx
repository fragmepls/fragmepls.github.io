import React from 'react';
import '../styles/PrivacyPolicy.css';
import {SEO} from "../components/SEO";

const PrivacyPolicy: React.FC = () => {
    return (
        <>
            <SEO
                title="fragmepls - Privacy Policy"
                description="Privacy policy for fragmepls.dev"
                path="/privacy"
            />
            <div className="privacy-policy">
                <h1>Privacy Policy</h1>
                <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>

                <section>
                    <h2>Information I Collect</h2>
                    <p>When you submit a message through our contact form, I collect:</p>
                    <ul>
                        <li>The text content you submit</li>
                        <li>Your IP address</li>
                        <li>Timestamp of submission</li>
                    </ul>
                </section>

                <section>
                    <h2>How I Use Your Information</h2>
                    <p>I use the collected information to:</p>
                    <ul>
                        <li>Respond to your messages</li>
                        <li>Prevent spam and abuse</li>
                    </ul>
                </section>

                <section>
                    <h2>Data Storage</h2>
                    <p>Your data is stored securely using Firebase Firestore and is retained for 7 days.</p>
                </section>

                <section>
                    <h2>Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Request access to your data</li>
                        <li>Request deletion of your data</li>
                        <li>Object to data processing</li>
                    </ul>
                    <p>Contact me at fragmepls.dev@gmail.com to exercise these rights.</p>
                </section>

                <section>
                    <h2>Contact</h2>
                    <p>For privacy concerns, email: fragmepls.dev@gmail.com</p>
                </section>

                <section>
                    <h2>Legal Basis</h2>
                    <p>I process your data based on legitimate interest (spam prevention) and to fulfill communication
                        requests.</p>
                </section>
            </div>
        </>
    );
};

export default PrivacyPolicy;
