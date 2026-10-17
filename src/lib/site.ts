import profile from "../../public/profile.json";

export const SITE_URL = profile.url;
export const SITE_NAME = profile.name;
export const SITE_TITLE =
  "Priyanshu Gupta — Software Developer | priyanshubuild";
export const SITE_DESCRIPTION =
  "Priyanshu Gupta (priyanshubuild), software developer focused on C++, algorithms, Linux and React/Next.js. Explore projects, GitHub activity and contact.";
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const PROFILE_LINKS = Object.values(profile.profiles);

export function serializeJSONLD(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
