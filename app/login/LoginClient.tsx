"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { translate } from "@/lib/i18n";

export default function LoginClient({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const { status } = useSession();

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
          <Text color="gray">{translate("auth.message")}</Text>
          <Button
            onClick={() => signIn("google", { callbackUrl })}
            loading={status === "loading"}
            className="w-full"
            data-testid="google-sign-in"
          >
            {translate("auth.cta.google")}
          </Button>
        </Flex>
      </Card>
    </main>
  );
}
