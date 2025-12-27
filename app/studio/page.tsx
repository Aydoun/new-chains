"use client";

import type { ReactNode } from "react";
import { Text, TextField } from "@radix-ui/themes";
import Link from "next/link";
import {
  ArrowDownNarrowWide,
  Bell,
  Clock3,
  FileText,
  Filter,
  FolderOpen,
  Grid,
  Grid2x2,
  HelpCircle,
  History,
  Home,
  Link as LinkIcon,
  List,
  Menu,
  MoreHorizontal,
  Palette,
  Plus,
  Search,
  Settings,
  Share2,
  Sparkles,
  SquarePlus,
  User,
  UserRound,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useGetStudioSequencesQuery } from "../services/sequences";
import { SessionLoader } from "@/components/ui/spinner";
import { timeAgo } from "@/lib/utils";
import { MiniSequenceFrame, SequenceFrame } from "@/components/sequence-card";

type StatCard = {
  icon: ReactNode;
  label: string;
  value: string;
  badge?: string;
  badgeColor?: string;
};

type SequenceCard = {
  badgeColor: string;
  badgeIcon: ReactNode;
  badgeLabel: string;
  description: string;
  imageAlt: string;
  imageUrl: string;
  timestamp: string;
  title: string;
};

const stats: StatCard[] = [
  {
    label: "Total Sequences",
    value: "12",
    icon: <LinkIcon className="h-5 w-5 text-primary" aria-hidden="true" />,
  },
  {
    label: "Last Edited",
    value: "2h ago",
    icon: <History className="h-5 w-5 text-orange-400" aria-hidden="true" />,
  },
];

const sequences: SequenceCard[] = [
  {
    badgeLabel: "Doc",
    badgeIcon: <FileText className="h-3.5 w-3.5 text-blue-400" aria-hidden />,
    badgeColor: "border-white/10 bg-black/60",
    imageAlt:
      "Abstract blue data visualization pattern representing API structure",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDqUrwASi9M2G698GNIp2lf6JU2Sp-mESgBty4xM2WKE65UjBOknJMk7y7ImRaBpke4CbsBLAx-m1Xe0aBqKrrhcaohlxIkdf6o766uemjRLYqmUJoNsLhF9CUeo5yzJvJW56rgQU_UY52SRZf06TtYJ5lM6dN9daFxjXnIQKujlfyRv3VJyLXTOph_-bhd66ua50gZv9Bce9BeOueVQjprBFY-8JRvFCXi4cV6BNKdTwxHnGMnTPwaMFBhz13L_WuXP24MUIaSi_A",
    title: "API Documentation v2",
    description: "Core backend endpoints reference",
    timestamp: "2h ago",
  },
  {
    badgeLabel: "Code",
    badgeIcon: <Sparkles className="h-3.5 w-3.5 text-green-400" aria-hidden />,
    badgeColor: "border-white/10 bg-black/60",
    imageAlt: "Dark computer screen displaying colorful code syntax",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCFrHScbjuoVRFXbZ4UgP0Ou6iIhXZ57VyOnYgs-aD4gLfC985sN1r7TeJbLQUtb_r93mBj1a6tsPxE_G1GTqEkZAByuERW8ZytCG0bSRdeGLD0dzV0uqy1VfhSXLpAtTBs-Md_D5iqefCsl5h075Vv7PFY4FM09uqylAStK5no0izbTxl11zySxIlIiEB7reV0CepbdQNYUfuZZFr5E6q07CA48m2p0yPLgjwPEXtLGX3AmeeB1AfZUi1ULpQw59XLDSOt52nZT-Q",
    title: "Authentication Flow",
    description: "OAuth 2.0 implementation scripts",
    timestamp: "Yesterday",
  },
  {
    badgeLabel: "Doc",
    badgeIcon: <FileText className="h-3.5 w-3.5 text-blue-400" aria-hidden />,
    badgeColor: "border-white/10 bg-black/60",
    imageAlt: "Minimalist desk setup with notebook and pen",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAFlPzeyzj6EJZfrysnR978pia4WjUYTBinA2yYqJz10i9sW7mZcBSHQI0PNsWrEEktGZZgPpu9CJVmHTgZLFWfD4gVH3GmCMaK2f0duonVtJkht_wVoPNg2zolWkG6YjNhmAyye1LdZl8bsai60lup4XvFbTs5RlPGPUWJ76yZ9sp7ooIgO7Rsz93zyBFc9YRIgLoVFx5Cm5K6ho_0R9xCw0f1-YrNliVm_mnhsDNbIgF-n7NzbPKutYqPsPGqA2jSyOB6Pcr94n8",
    title: "Q3 Strategy Meeting",
    description: "Notes and action items from Monday",
    timestamp: "3 days ago",
  },
  {
    badgeLabel: "Code",
    badgeIcon: <Sparkles className="h-3.5 w-3.5 text-green-400" aria-hidden />,
    badgeColor: "border-white/10 bg-black/60",
    imageAlt: "Abstract geometric shapes in dark purple and blue",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBq0Ep34p-VkWtBJIYBaTDLWYDMRZIRkbrNXIhs8wLZrwCjZXlBjjcIhaC-8fdFdra-fL00w4kncNfHXyAqU6bs5lrYUnn-GbPGM_bGhYzVcOZnBVR2K4U7t32SjYWpYwKiHHk6n9MEjvcjrCvxlTRWc2oJQdjBIe4FWnVHEDt0_mmgH5g6kGenTGIZvaTHCGk8lCWnbfJsK89oH1fYEx7CAJy48rBQM837hfTg8U7ssGjjlvvEgXjs2H7gT3qpNFB6QMzKYnJwunw",
    title: "User Onboarding Script",
    description: "Automated email sequence logic",
    timestamp: "5 days ago",
  },
  {
    badgeLabel: "Code",
    badgeIcon: <Sparkles className="h-3.5 w-3.5 text-green-400" aria-hidden />,
    badgeColor: "border-white/10 bg-black/60",
    imageAlt: "Digital mesh network on dark background",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDCAgMqyJ3KXkgDk3uljZHt1LXUwup0oe6JITYh1yLKHGqgyjAtgl7aiWbW9PVfd4GLb8e24wWjb8pD7u2x3cJAeVsseISFu9xpRhQkmUgHxf3XnJPGe3fpd-wvIGzc6csrMjRVkODzjXKaiR5w2V4srpIhOqnSTikq0okqMsE8HixC09i2sR4ltFheBN7kakgYliNBppio0wA7frRnb7vWDX_BxAuakcRzgxUdfh1fstWvRjAfh2cT8v5rqavvOSUpIYdaN750Lvg",
    title: "Payment Integration",
    description: "Stripe & PayPal adapter classes",
    timestamp: "1 week ago",
  },
  {
    badgeLabel: "Design",
    badgeIcon: <Palette className="h-3.5 w-3.5 text-purple-400" aria-hidden />,
    badgeColor: "border-white/10 bg-black/60",
    imageAlt: "Abstract colorful gradient waves",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCNbxwMMCbHecXyEJW_kWbzh4P8ETk84o8FdAh4HJ3MOnGQb09_Tn0Q97eRXhss5e4Gu_J9083d-86PlJPS2dKkjMMJLEaLPTmDllM0sgzRzqIB5dlsxYUQqXMr2uOI1qrH0bYnlCUlvVWPvxoQOcf3tjExgrY4W1hMQuiD9kinr7v2bCY_YQXDDQRJltfYOOIgvcdrgTlyyjQVlRu0yhgu5n1MaVH2qR4mZn8X2tOKJH26DX2B-Pct6He7Ay7ZZmGiJkQPleLeays",
    title: "Design Tokens",
    description: "Color palette and typography JSON",
    timestamp: "2 weeks ago",
  },
];

export default function StudioPage() {
  const { data: session, status } = useSession();
  const {
    data: sequences,
    isLoading,
    isFetching,
    isError,
  } = useGetStudioSequencesQuery();
  const isBusy = status === "loading" || isLoading || isFetching;
  const studioOwnerName = session?.user?.name;

  if (isBusy) return <SessionLoader />;

  console.log({ sequences });

  return (
    <div className="flex h-full min-h-[calc(100vh-4rem)] w-full overflow-hidden rounded-xl ">
      <main className="flex w-full flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-4 py-6 sm:px-6 lg:px-10">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <Text
                    size="6"
                    weight="bold"
                    className="tracking-[-0.033em] text-white sm:text-[38px]"
                  >
                    Hello Alex
                  </Text>
                  <Text size="3" className="text-[#92a9c9]">
                    You have 12 active sequences
                  </Text>
                </div>
                {/* <button className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[#233348] bg-[#1a2533] px-4 text-sm font-bold text-white transition-colors hover:border-[#136dec]/50">
                  <SquarePlus />
                  <Text
                    asChild
                    size="2"
                    weight="bold"
                    className="tracking-[0.015em]"
                  >
                    <span>Create Sequence</span>
                  </Text>
                </button> */}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col gap-3 rounded-xl border border-[#233348] bg-[#1a2533]/70 p-5 transition-colors hover:bg-[#1a2533]"
                  >
                    <div className="flex items-start justify-between">
                      <Text size="2" weight="medium" className="text-[#92a9c9]">
                        {stat.label}
                      </Text>
                      {stat.icon}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <Text
                        size="7"
                        weight="bold"
                        className="leading-tight text-white"
                      >
                        {stat.value}
                      </Text>
                      {stat.badge ? (
                        <Text
                          size="1"
                          weight="medium"
                          className={`rounded-full px-2 py-0.5 ${stat.badgeColor}`}
                        >
                          {stat.badge}
                        </Text>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 p-2 md:flex-row md:items-center md:justify-between">
                <div className="relative flex-1 md:max-w-md">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#92a9c9]">
                    <Search className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <TextField.Root
                    type="text"
                    placeholder="Search..."
                    className="w-full rounded-lg border border-[#233348] bg-[#1a2533] pl-11 text-sm text-white placeholder:text-[#92a9c9] outline-none transition focus:border-[#136dec] focus:ring-1 focus:ring-[#136dec]"
                  />
                </div>
                <div className="flex items-center gap-2 self-end md:self-auto">
                  <div className="mx-1 hidden h-8 w-px bg-[#233348] md:block" />
                  <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#92a9c9] transition hover:bg-[#1a2533] hover:text-white">
                    <Filter className="h-5 w-5" aria-hidden="true" />
                    <Text
                      asChild
                      size="2"
                      weight="medium"
                      className="hidden sm:inline"
                    >
                      <span>Filter</span>
                    </Text>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sequences?.map((sequence) => (
                  <article
                    key={sequence.title}
                    className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-[#233348] bg-[#1a2533] transition-all duration-300 hover:border-[#136dec]/50 hover:shadow-xl hover:shadow-black/20"
                  >
                    <div className="h-44 w-full overflow-hidden">
                      <SequenceFrame text={sequence.firstFrame?.content} />
                    </div>
                    <div className="flex flex-col gap-3 p-5">
                      <div className="space-y-1">
                        <Text
                          size="4"
                          weight="bold"
                          className="leading-snug text-white transition-colors group-hover:text-[#f87171]"
                          as="div"
                        >
                          {sequence.title}
                        </Text>
                        <Text size="2" className="text-[#92a9c9]">
                          {sequence.description}
                        </Text>
                      </div>
                      <div className="flex items-center gap-1 hover:underline text-[#92a9c9]">
                        <User className="h-4 w-4" aria-hidden="true" />
                        <Link href="/">Visit The Author</Link>
                      </div>
                      <div className="mt-auto flex items-center justify-between border-t border-[#233348] pt-2">
                        <div className="flex items-center gap-1 text-[#92a9c9]">
                          <Clock3 className="h-4 w-4" aria-hidden="true" />
                          <Text size="1" weight="medium">
                            {timeAgo(sequence.createdAt)}
                          </Text>
                        </div>
                        <button className="rounded p-1 text-[#92a9c9] transition hover:bg-white/10 hover:text-white">
                          <Share2 />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="h-4" />
          </div>
        </div>
      </main>
    </div>
  );
}
