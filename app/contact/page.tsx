import { translate } from "@/lib/i18n";
import { Text } from "@radix-ui/themes";

export default function ContactPage() {
  return (
    <div className="p-6 sm:p-8">
      <Text as="h1" weight="bold" size="6">
        {translate("navigation.contact")}
      </Text>
      <div className="mt-4 h-64 p-8 rounded-md border border-dashed border-muted">
        <Text as="h1" weight="bold" size="6">
          {`${translate("contact.mail")} : ${translate("contact.email-value")}`}
        </Text>
      </div>
    </div>
  );
}
