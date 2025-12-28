"use client";

import { translate } from "@/lib/i18n";
import { Heading, Text, TextArea } from "@radix-ui/themes";
import { CheckCircle, Lock, Save } from "lucide-react";
import { useSession } from "next-auth/react";
// import { useParams } from "next/navigation";
import { ChangeEvent, useState } from "react";

export default function ExplorePage() {
  //   const params = useParams<{ id: string }>();
  const { data: session } = useSession();
  const [bioText, setBioText] = useState("");

  //   console.log({ pp: params?.id });

  const handleBioChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value.length <= 240) setBioText(value);
  };

  return (
    <div className={`flex w-full justify-center px-4 py-8 sm:px-8 sm:py-10`}>
      <p>Hello Explorer</p>
    </div>
  );
}
