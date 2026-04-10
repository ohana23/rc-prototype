type TranslationMap = Record<string, unknown>;

type CdnFeatureContext = {
  enableCDN?: boolean;
} | null | undefined;

type RequestTranslationsOptions = {
  oldTranslations?: TranslationMap;
  enableCDN?: boolean;
};

export const CDN_TRANSLATION_FEATURE_FLAG_KEY = "cdn-translation";

export const getCDNTranslationLDId = () => "";

export const getFallbackList = (locale: string) => [locale, "en"];

export const isCDNFeatureFlagEnabled = (context?: CdnFeatureContext, enableCDN?: boolean) =>
  Boolean(enableCDN ?? context?.enableCDN ?? false);

export const usePreloadTranslations = () => {
  // no-op on server
};

export const useRequestTranslations = (
  _source: unknown,
  defaultTranslations: TranslationMap = {},
  options: RequestTranslationsOptions = {}
) => {
  return {
    status: "resolved" as const,
    translations: options.oldTranslations ?? defaultTranslations,
  };
};
