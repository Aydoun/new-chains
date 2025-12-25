import LoginClient from "./LoginClient";

type PageProps = {
  searchParams?: Promise<{
    callbackUrl?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const raw = params?.callbackUrl;
  const callbackUrl = Array.isArray(raw) ? raw[0] : raw ?? "/";

  return <LoginClient callbackUrl={callbackUrl} />;
}
