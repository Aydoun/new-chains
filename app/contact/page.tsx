"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Github,
  Linkedin,
  Mail,
  Send,
  Twitter,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { translate } from "@/lib/i18n";

type DirectChannel = {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
};

export default function ContactPage() {
  const emailAddress = translate("contact.email-value");
  const [copiedEmail, setCopiedEmail] = useState(false);

  const directChannels: DirectChannel[] = useMemo(
    () => [
      {
        icon: Mail,
        title: "Email Support",
        description: emailAddress,
      },
      {
        icon: Github,
        title: "GitHub Repository",
        description: "Report bugs & contribute",
        href: "https://github.com",
      },
      {
        icon: Linkedin,
        title: "LinkedIn",
        description: "Professional updates",
        href: "https://www.linkedin.com",
      },
      {
        icon: Twitter,
        title: "Twitter / X",
        description: "Latest news & announcements",
        href: "https://x.com",
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

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-8 sm:px-10 lg:px-14">
      <section className="space-y-3">
        <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
          {translate("navigation.contact")}
        </p>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            Get in Touch
          </h1>
          <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
            Have questions about the sequence explorer, encountering issues, or
            just want to say hello? Reach out through our direct channels or
            send a message below.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="flex flex-col gap-5 lg:col-span-5">
          <header className="space-y-1">
            <h2 className="text-2xl font-semibold text-foreground">
              Direct Channels
            </h2>
            <p className="text-sm text-muted-foreground">
              Connect with us on social platforms or send an email directly.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {directChannels.map((channel) => (
              <article
                key={channel.title}
                className="group flex cursor-pointer items-start gap-4 rounded-xl border border-border bg-card/70 p-5 shadow-sm transition-colors hover:border-primary/60"
              >
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <channel.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <h3 className="text-base font-semibold text-foreground">
                    {channel.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {channel.description}
                  </p>
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
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground transition-colors hover:text-primary"
                    onClick={handleCopyEmail}
                  >
                    {copiedEmail ? (
                      <Check className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Mail className="h-4 w-4" aria-hidden="true" />
                    )}
                  </Button>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="lg:col-span-7">
          <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-6 py-5 sm:px-8">
              <h2 className="text-xl font-semibold text-foreground">
                Send a Message
              </h2>
              <p className="text-sm text-muted-foreground">
                We typically reply within 24 hours.
              </p>
            </div>

            <form
              className="flex flex-col gap-6 px-6 py-6 sm:px-8 sm:py-8"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-foreground">
                    Name
                  </span>
                  <Input
                    aria-label="Name"
                    placeholder="Your name"
                    className="h-12 border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/60"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-foreground">
                    Email Address
                  </span>
                  <Input
                    aria-label="Email Address"
                    placeholder="you@example.com"
                    type="email"
                    className="h-12 border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/60"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-foreground">
                  Subject
                </span>
                <Input
                  aria-label="Subject"
                  placeholder="What is this regarding?"
                  className="h-12 border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/60"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-foreground">
                  Message
                </span>
                <Textarea
                  aria-label="Message"
                  placeholder="How can we help you today?"
                  className="min-h-[160px] border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/60"
                />
              </label>

              <div className="flex items-center justify-end">
                <Button className="h-12 min-w-[150px] text-base font-semibold">
                  Send Message
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
