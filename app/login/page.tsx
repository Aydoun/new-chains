import LoginClient from "./LoginClient";

type PageProps = {
  searchParams?: Promise<{
    callbackUrl?: string | string[];
    error?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const raw = params?.callbackUrl;
  const callbackUrl = Array.isArray(raw) ? raw[0] : (raw ?? "/");
  const error = Array.isArray(params?.error) ? params.error[0] : params?.error;

  return <LoginClient callbackUrl={callbackUrl} error={error ?? null} />;
}
