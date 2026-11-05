import { LegalPage } from "@/components/legal/legal-page";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="November 5, 2026"
      intro={
        <p>
          This policy explains what information LinkNTell (&quot;we&quot;) collects when you use
          linkntell.com and how we use it.
        </p>
      }
      sections={[
        {
          heading: "Information we collect",
          body: (
            <p>
              When you sign in with Google we receive your name, email address and profile
              picture. We store these together with the sequences, frames and snippets you
              create in the app.
            </p>
          ),
        },
        {
          heading: "How we use it",
          body: (
            <p>
              We use this information only to authenticate you and to provide the features of
              the app. We do not sell your data or use it for advertising.
            </p>
          ),
        },
        {
          heading: "Cookies",
          body: (
            <p>
              We use strictly necessary cookies to keep you signed in and to protect sign-in
              requests. We do not use tracking or advertising cookies.
            </p>
          ),
        },
        {
          heading: "Service providers",
          body: (
            <p>
              The app is hosted on Vercel and its database runs on a managed PostgreSQL
              provider. Google provides sign-in. These providers process data only to run the
              service.
            </p>
          ),
        },
        {
          heading: "Your rights",
          body: (
            <p>
              You can ask us to access, correct or delete your data at any time through the
              contact page, or by email to the address in our security.txt file.
            </p>
          ),
        },
      ]}
    />
  );
}
