"use client";

import { translate } from "@/lib/i18n";
import { Button, Heading, Text, TextArea } from "@radix-ui/themes";
import { CheckCircle, Lock, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "@/app/services/users";
import { BIO_MAX_LENGTH } from "@/lib/constants";
import { SessionLoader } from "@/components/ui/spinner";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [bioText, setBioText] = useState("");
  const userId = session?.user?.id;
  const { data: user, isFetching: isFetchingUser } = useGetUserByIdQuery(
    userId ?? "",
    { skip: !userId }
  );
  const [updateUser, { isLoading: isUpdatingBio }] = useUpdateUserMutation();

  const handleBioChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value.length <= BIO_MAX_LENGTH) setBioText(value);
  };

  const handleBioSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await updateUser({
        id: userId,
        bio: bioText.trim(),
      }).unwrap();
    } catch (error) {
      console.error("Failed to update bio", error);
    }
  };

  useEffect(() => {
    if (user) {
      const bio = user.bio ?? "";
      setBioText(bio);
    }
  }, [user]);

  if (isFetchingUser) return <SessionLoader />;

  return (
    <div className={`flex w-full justify-center px-6 py-8 mt-12 md:mt-6`}>
      <div className="flex w-full max-w-5xl flex-col gap-8 text-foreground">
        <div className="flex flex-col gap-2">
          <Heading size="7">{translate("profile.header")}</Heading>
          <Text className="text-base text-muted-foreground">
            {translate("profile.description")}
          </Text>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)] transition-colors">
            <div className="flex flex-col items-center gap-6 border-b border-border p-6 md:flex-row md:items-start md:p-8">
              <div className="group relative cursor-pointer">
                <div
                  className="size-24 rounded-full bg-cover bg-center shadow-xl ring-4 ring-border"
                  style={{
                    backgroundImage: `url(${session?.user?.image})`,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="material-symbols-outlined text-white">
                    {translate("profile.image-alt")}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col items-center gap-2 md:items-start">
                <div>
                  <Heading
                    as="h3"
                    className="text-center text-lg font-bold md:text-left"
                  >
                    {session?.user?.name}
                  </Heading>
                </div>
                <div className="mt-1 flex gap-3">
                  <button className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-secondary/70">
                    {translate("profile.cta.avatar")}
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 md:p-8">
              <form className="flex flex-col gap-6" onSubmit={handleBioSubmit}>
                <div className="flex flex-col gap-2">
                  <label className="flex justify-between text-sm font-medium">
                    <span>Email Address</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Lock size={12} />
                      {translate("profile.googleAuth")}
                    </span>
                  </label>
                  <div className="relative opacity-75">
                    <input
                      className="w-full cursor-not-allowed rounded-lg border border-border bg-muted px-4 py-2.5 text-muted-foreground outline-none placeholder:text-muted-foreground/80"
                      type="email"
                      readOnly
                      defaultValue={session?.user?.email ?? ""}
                    />
                    <div className="absolute sm:hidden right-3 top-1/2 hidden md:flex -translate-y-1/2 items-center gap-1.5 rounded bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400 ring-1 ring-green-500/20">
                      <CheckCircle />
                      {translate("profile.verified")}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Bio</label>
                  <div className="relative">
                    <TextArea
                      rows={4}
                      value={bioText}
                      onChange={handleBioChange}
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <Text>{translate("profile.selfDesc")}</Text>
                    <Text>{`${bioText.length}/${BIO_MAX_LENGTH}`}</Text>
                  </div>
                </div>
                <div className="flex flex-col gap-4 border-t border-border pt-4">
                  <h4 className="text-sm font-medium">Connected Accounts</h4>
                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-card shadow-sm">
                        <svg
                          className="size-5"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Google</span>
                        <span className="text-xs text-muted-foreground">
                          {translate("profile.connectedMessage", {
                            email: session?.user?.email ?? "",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-end gap-3 border-t border-border pt-4">
                  <Button
                    className="flex items-center gap-2 rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-blue-900/20 transition hover:brightness-95"
                    type="submit"
                    loading={isUpdatingBio}
                  >
                    <Save />
                    {translate("common.save")}
                  </Button>
                </div>
              </form>
            </div>
          </div>
          <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-red-900/30 bg-red-900/10 p-6 text-red-300 md:flex-row md:items-center md:p-8">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold text-red-400">
                {translate("profile.delete")}
              </h3>
              <p className="text-sm text-red-300/70">
                {translate("profile.deleteWarn")}
              </p>
            </div>
            <button className="whitespace-nowrap rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-400 transition-colors hover:bg-red-500/20">
              {translate("profile.delete")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
