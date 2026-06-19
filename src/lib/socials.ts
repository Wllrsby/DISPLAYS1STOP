export type SocialLink = {
  id: string;
  name: string;
  handle: string;
  url: string;
};

export const SOCIAL_CONFIG = {
  businessName: "1 Stop Plumbing & Green Energy Centre",
  tagline: "Follow us for bathroom inspiration, new arrivals, and showroom updates.",
  links: [
    {
      id: "instagram",
      name: "Instagram",
      handle: "@1stopplumbinggec",
      url: "https://www.instagram.com/1stopplumbinggec/",
    },
    {
      id: "facebook",
      name: "Facebook",
      handle: "@1stopplumbingGEC",
      url: "https://www.facebook.com/1stopplumbingGEC",
    },
    {
      id: "website",
      name: "Website",
      handle: "1stopplumbing.co.uk",
      url: "https://www.1stopplumbing.co.uk/",
    },
  ] satisfies SocialLink[],
};

export const SOCIAL_PROMPT_STORAGE_KEY = "display-social-prompt-dismissed";
