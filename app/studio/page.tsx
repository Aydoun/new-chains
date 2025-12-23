import { translate } from "@/lib/i18n";
import { Text } from "@radix-ui/themes";

export default function StudioPage() {
  return (
    <div className="p-6 sm:p-8">
      <Text weight="bold" size="6">
        {translate("navigation.studio")}
      </Text>
      <div className="mt-4 h-64 p-8 rounded-md border border-dashed border-muted" />
    </div>
  );
}
