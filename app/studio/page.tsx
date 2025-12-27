import type { ReactNode } from "react";
import { Text } from "@radix-ui/themes";
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
  List,
  Menu,
  MoreHorizontal,
  Palette,
  Search,
  Settings,
  Share2,
  Sparkles,
  UserRound,
} from "lucide-react";

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
    badge: "+2 this week",
    badgeColor: "text-[#0bda5e] bg-[#0bda5e]/10",
    icon: <FolderOpen className="h-5 w-5 text-primary" aria-hidden="true" />,
  },
  {
    label: "Last Edited",
    value: "2h ago",
    icon: <History className="h-5 w-5 text-orange-400" aria-hidden="true" />,
  },
  {
    label: "Shared Projects",
    value: "4",
    icon: <Share2 className="h-5 w-5 text-purple-400" aria-hidden="true" />,
  },
];

const sequences: SequenceCard[] = [
  {
    badgeLabel: "Doc",
    badgeIcon: <FileText className="h-3.5 w-3.5 text-blue-400" aria-hidden />,
    badgeColor: "border-white/10 bg-black/60",
    imageAlt: "Abstract blue data visualization pattern representing API structure",
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
  return (
    <div className="flex h-full min-h-[calc(100vh-4rem)] w-full overflow-hidden rounded-xl border border-border bg-[#0f1723] text-white">
      <aside className="hidden h-full w-[260px] shrink-0 flex-col border-r border-border/60 bg-[#111822] md:flex">
        <div className="flex h-full flex-col justify-between p-4">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 px-2">
              <div
                aria-label="User profile avatar showing abstract colorful gradient"
                className="size-10 rounded-full ring-2 ring-white/10 bg-cover bg-center"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBvsaXsqqB-er5iafnCXR7C__mDhGtah8Rl9jALRanYCOwj_MqJHjzHYVy1bNCu065RU3BP9HFg-GVMtl5uS28woG4lYPOCARr5ZlsuGBcoCG7wmpagjBYQUveIpBsKxlgLGffgJpsf3NghrQrCg4tww-M2fWQ3bXsIR6inRq4pIg9YsmtszyxD9pIYFrXFQ0dvqXYqZJDQhK_aNLNmjIkJcszEfpiH2KWdsM-GOcy8zrJ1mzNobwnJJS0XKtjEFfZjsYHcmvarLnE")',
                }}
              />
              <div className="flex flex-col">
                <Text size="3" weight="bold" className="text-white">
                  DevStudio
                </Text>
                <Text size="1" className="text-[#92a9c9]">
                  Pro Plan
                </Text>
              </div>
            </div>
            <nav className="flex flex-col gap-2">
              <SidebarLink icon={<Home className="h-5 w-5" />} label="Home" />
              <SidebarLink
                active
                icon={<Grid2x2 className="h-5 w-5" />}
                label="Studio"
              />
              <SidebarLink
                icon={<Settings className="h-5 w-5" />}
                label="Settings"
              />
              <SidebarLink
                icon={<HelpCircle className="h-5 w-5" />}
                label="Help"
              />
            </nav>
          </div>
          <button className="flex h-10 w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#136dec] px-4 text-sm font-bold text-white transition-colors hover:bg-blue-600 shadow-lg shadow-blue-900/20">
            <Text asChild size="2" weight="bold" className="tracking-[0.015em]">
              <span>Create New</span>
            </Text>
          </button>
        </div>
      </aside>

      <main className="flex w-full flex-col bg-[#0f1723]">
        <header className="flex items-center justify-between border-b border-border/60 bg-[#111822]/95 px-4 py-3 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-4">
            <button className="text-[#92a9c9] md:hidden" aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex size-8 items-center justify-center rounded bg-[#136dec]/10 text-[#136dec]">
              <Grid className="h-5 w-5" aria-hidden="true" />
            </div>
            <Text size="5" weight="bold" className="tracking-[-0.02em]">
              Studio
            </Text>
          </div>
          <div className="flex flex-1 items-center justify-end gap-6">
            <div className="hidden items-center gap-6 sm:flex">
              <Text
                size="2"
                weight="medium"
                className="text-[#92a9c9] transition-colors hover:text-white"
              >
                Dashboard
              </Text>
              <Text
                size="2"
                weight="medium"
                className="border-b-2 border-[#136dec] pb-0.5 text-white"
              >
                Studio
              </Text>
            </div>
            <div className="hidden h-6 w-px bg-border/60 sm:block" />
            <div className="flex items-center gap-3">
              <button
                className="text-[#92a9c9] transition-colors hover:text-white"
                aria-label="Notifications"
              >
                <Bell className="h-6 w-6" />
              </button>
              <div
                aria-label="Small user avatar for top navigation"
                className="size-9 rounded-full ring-2 ring-white/10 bg-cover bg-center"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAhjy3V7kF3SpcVuonsEi3959ODdZHGTFe-qtYtpTOLzoHLR6KkZBwiJhl-kXq2Idv1s6QhseucCdr2PfQMKo9ywCGHSU9Z3LQ0wE5_xCHu_mLLOdTH3rGML4tUg1jJYZ_aIyjhDo4M8xRbfvDiRA_l_3PUMQy1rIMRTZWFfz-wEjO1oTD9R-4IcIDt33Wfr9eED0CZDnkuS3Z_qNC3O8TtE-mfjBD6GFRQUZ_xSHM36QJvNil-u97k6doaSkL7X5Y1OzauDyGrazM")',
                }}
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-4 py-6 sm:px-6 lg:px-10">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <Text
                    size="8"
                    weight="bold"
                    className="tracking-[-0.033em] text-white sm:text-[38px]"
                  >
                    Good morning, Alex
                  </Text>
                  <Text size="3" className="text-[#92a9c9]">
                    You have 12 active sequences ready for review.
                  </Text>
                </div>
                <button className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[#233348] bg-[#1a2533] px-4 text-sm font-bold text-white transition-colors hover:border-[#136dec]/50">
                  <PlusIcon />
                  <Text asChild size="2" weight="bold" className="tracking-[0.015em]">
                    <span>Create Sequence</span>
                  </Text>
                </button>
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
                      <Text size="7" weight="bold" className="leading-tight text-white">
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
                  <input
                    type="text"
                    placeholder="Search sequences..."
                    className="w-full rounded-lg border border-[#233348] bg-[#1a2533] py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-[#92a9c9] outline-none transition focus:border-[#136dec] focus:ring-1 focus:ring-[#136dec]"
                  />
                </div>
                <div className="flex items-center gap-2 self-end md:self-auto">
                  <div className="mx-1 hidden h-8 w-px bg-[#233348] md:block" />
                  <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#92a9c9] transition hover:bg-[#1a2533] hover:text-white">
                    <Filter className="h-5 w-5" aria-hidden="true" />
                    <Text asChild size="2" weight="medium" className="hidden sm:inline">
                      <span>Filter</span>
                    </Text>
                  </button>
                  <button className="flex items-center gap-2 rounded-lg border border-[#233348] bg-[#1a2533] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#253242]">
                    <ArrowDownNarrowWide className="h-5 w-5" aria-hidden="true" />
                    <Text asChild size="2" weight="medium">
                      <span>Date: Newest</span>
                    </Text>
                  </button>
                  <div className="flex gap-1 rounded-lg border border-[#233348] bg-[#1a2533] p-1">
                    <button className="rounded bg-[#136dec] p-1.5 text-white shadow-sm">
                      <Grid2x2 className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button className="rounded p-1.5 text-[#92a9c9] transition hover:bg-white/5 hover:text-white">
                      <List className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sequences.map((sequence) => (
                  <article
                    key={sequence.title}
                    className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-[#233348] bg-[#1a2533] transition-all duration-300 hover:-translate-y-1 hover:border-[#136dec]/50 hover:shadow-xl hover:shadow-black/20"
                  >
                    <div className="relative h-44 w-full overflow-hidden">
                      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#1a2533] to-transparent opacity-60" />
                      <div
                        aria-label={sequence.imageAlt}
                        className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url("${sequence.imageUrl}")` }}
                      />
                      <div className="absolute right-3 top-3 z-20">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md ${sequence.badgeColor} border border-white/10`}
                        >
                          {sequence.badgeIcon}
                          <Text size="1" weight="medium">
                            {sequence.badgeLabel}
                          </Text>
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 p-5">
                      <div className="space-y-1">
                        <Text
                          size="4"
                          weight="bold"
                          className="leading-snug text-white transition-colors group-hover:text-[#136dec]"
                        >
                          {sequence.title}
                        </Text>
                        <Text size="2" className="text-[#92a9c9]">
                          {sequence.description}
                        </Text>
                      </div>
                      <div className="mt-auto flex items-center justify-between border-t border-[#233348] pt-4">
                        <div className="flex items-center gap-1 text-[#92a9c9]">
                          <Clock3 className="h-4 w-4" aria-hidden="true" />
                          <Text size="1" weight="medium">
                            {sequence.timestamp}
                          </Text>
                        </div>
                        <button className="rounded p-1 text-[#92a9c9] transition hover:bg-white/10 hover:text-white">
                          <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
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

function SidebarLink({
  active,
  icon,
  label,
}: {
  active?: boolean;
  icon: ReactNode;
  label: string;
}) {
  return (
    <a
      href="#"
      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
        active
          ? "bg-[#233348] text-white"
          : "text-[#92a9c9] hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className="text-[20px] text-inherit">{icon}</span>
      <Text size="2" weight="medium">
        {label}
      </Text>
    </a>
  );
}

function PlusIcon() {
  return (
    <span className="flex items-center justify-center rounded bg-[#136dec]/10 p-1 text-[#136dec]">
      <svg
        aria-hidden="true"
        className="h-4 w-4"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M11 13H5a1 1 0 1 1 0-2h6V5a1 1 0 1 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0z" />
      </svg>
    </span>
  );
}
