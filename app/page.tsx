import HomeClient from "./HomeClient";

type PageProps = {
  searchParams?: Promise<{
    sequence?: string | string[];
  }>;
};

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;

  const raw = params?.sequence;
  const sequenceId = Array.isArray(raw) ? raw[0] : raw ?? null;

  return <HomeClient sequenceId={sequenceId} />;
}
