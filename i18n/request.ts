import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(["fr", "en"], requested) ? requested : "fr";
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
