"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Linkedin,
  Mail,
  Send,
  Copy,
  type LucideIcon,
} from "lucide-react";
import { translate } from "@/lib/i18n";
import { Button, TextArea, Text, Heading } from "@radix-ui/themes";

type DirectChannel = {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
};

export default function ContactPage() {
  const emailAddress = translate("contact.email-value");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setIsSubmitting] = useState(false);

  const directChannels: DirectChannel[] = useMemo(
    () => [
      {
        icon: Mail,
        title: translate("contact.channel.email"),
        description: translate("contact.email-value"),
      },
      {
        icon: Linkedin,
        title: translate("contact.channel.linkedin"),
        description: "Professional updates",
        href: translate("contact.linked-profile"),
      },
    ],
    [emailAddress]
  );

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (error) {
      console.error("Failed to copy email address", error);
    }
  };

  const handleSubmitMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    try {
      setIsSubmitting(true);
      await fetch("/api/contact/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedMessage }),
      });
      setMessage("");
    } catch (error) {
      console.error("Failed to send contact message", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 mt-12 md:mt-6 py-8 px-6 md:px-14">
      <section className="space-y-3">
        <Text className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase text-primary">
          {translate("navigation.contact")}
        </Text>
        <div className="space-y-2">
          <Heading as="h1" className="font-bold text-foreground sm:text-5xl">
            {translate("contact.welcomeMessage")}
          </Heading>
          <Text className="max-w-3xl text-base text-muted-foreground sm:text-lg">
            {translate("contact.welcomeDescription")}
          </Text>
        </div>
      </section>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="flex flex-col gap-5 lg:col-span-5">
          <div className="space-y-1">
            <Heading as="h2" className="text-2xl font-semibold text-foreground">
              {translate("contact.directChannels")}
            </Heading>
            <Text className="text-sm text-muted-foreground">
              {translate("contact.directChannelsDescription")}
            </Text>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
            {directChannels.map((channel) => (
              <article
                key={channel.title}
                className="relative mt-3 flex items-start gap-4 rounded-xl border border-[#d1d5db] dark:border-[#324867] bg-white dark:bg-[#192433] p-5 hover:border-primary/50 transition-colors group cursor-pointer shadow-sm"
              >
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <channel.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <Heading
                    as="h3"
                    className="text-base font-semibold text-foreground"
                  >
                    {channel.title}
                  </Heading>
                  <Text className="text-sm text-muted-foreground">
                    {channel.description}
                  </Text>
                </div>
                {channel.href ? (
                  <a
                    href={channel.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground transition-colors group-hover:text-primary"
                    aria-label={`${channel.title} link`}
                  >
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : (
                  <Button
                    aria-label={`Copy ${channel.description}`}
                    variant="ghost"
                    className="text-muted-foreground absolute right-4 top-4 transition-colors hover:text-primary"
                    onClick={handleCopyEmail}
                  >
                    {copiedEmail ? (
                      <Check className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Copy className="h-4 w-4" aria-hidden="true" />
                    )}
                  </Button>
                )}
              </article>
            ))}
          </div>
        </section>
        <section className="lg:col-span-7">
          <div className="flex flex-col h-full rounded-2xl border border-[#d1d5db] dark:border-[#324867] bg-white dark:bg-[#192433] overflow-hidden shadow-lg">
            <div className="px-6 py-5 sm:px-8 border-0 border-b border-[#d1d5db] dark:border-black">
              <Heading
                as="h2"
                className="text-xl font-semibold text-foreground"
              >
                {translate("contact.sendMessage")}
              </Heading>
              <Text className="text-sm text-muted-foreground">
                {translate("contact.replyTime")}
              </Text>
            </div>
            <form
              className="flex flex-col gap-6 px-6 py-6 sm:px-8 sm:py-8"
              onSubmit={handleSubmitMessage}
            >
              <label className="flex flex-col gap-2">
                <Text className="text-sm font-medium text-foreground">
                  {translate("contact.form.messageLabel")}
                </Text>
                <TextArea
                  aria-label="Message"
                  placeholder={translate("contact.form.messagePlaceholder")}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </label>
              <div className="flex items-center justify-end">
                <Button
                  loading={submitting}
                  className="h-12 min-w-[150px] text-base font-semibold cursor-pointer"
                >
                  {translate("common.send")}
                  <Send className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
