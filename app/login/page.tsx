"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { translate } from "@/lib/i18n";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { status } = useSession();

  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  return (
    <main className="flex h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <Flex direction="column" gap="4">
          <Heading size="6">{translate("auth.login")}</Heading>
          <Text color="gray">
            {translate("auth.message") ??
              "Sign in with your Google account to keep your drafts private and pick up where you left off."}
          </Text>
          <Button
            onClick={() => signIn("google", { callbackUrl })}
            loading={status === "loading"}
            className="w-full"
            data-testid="google-sign-in"
          >
            Continue with Google
          </Button>
        </Flex>
      </Card>
    </main>
  );
}
