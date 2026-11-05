import { LegalPage } from "@/components/legal/legal-page";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="November 5, 2026"
      intro={
        <p>
          By using linkntell.com you agree to these terms. The service is currently in beta.
        </p>
      }
      sections={[
        {
          heading: "Your account",
          body: (
            <p>
              You sign in with your Google account and are responsible for the activity on it.
              Do not share access with others.
            </p>
          ),
        },
        {
          heading: "Your content",
          body: (
            <p>
              You keep ownership of the content you create. You give us permission to store and
              display it so the app can work. Do not upload content that is illegal or that you
              do not have the right to share.
            </p>
          ),
        },
        {
          heading: "Acceptable use",
          body: (
            <p>
              Do not try to break, overload or gain unauthorized access to the service or other
              users&apos; data.
            </p>
          ),
        },
        {
          heading: "Beta disclaimer",
          body: (
            <p>
              The service is provided as is, without warranties. Features may change and data
              may be lost while in beta.
            </p>
          ),
        },
        {
          heading: "Security reports",
          body: (
            <p>
              If you find a security issue, please report it using the contact in
              /.well-known/security.txt.
            </p>
          ),
        },
      ]}
    />
  );
}
