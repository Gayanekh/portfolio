// The Privacy and Terms pages' text. It says what Portory really does (what the sign-up form asks for, what is stored
// and where, what the Account page can do), in plain words. A first draft to be read and approved by the owner, not legal advice.

export const UPDATED = "10 November 2026";

// Where people can write about privacy or the terms: a forwarding address that reaches the owner.
export const CONTACT_EMAIL = "hello@portory.net";

export type Block = { p: string } | { ul: string[] };
export type Section = { title: string; blocks: Block[] };
export type Doc = { title: string; italic: string; intro: string; sections: Section[]; other: { href: string; label: string } };

export const PRIVACY: Doc = {
  title: "Privacy",
  italic: "policy.",
  intro: "Portory lets you pick a designed website template, edit it and publish it at portory.net/you. This page explains what personal information Portory handles when you do, and what you can choose.",
  other: { href: "/terms", label: "Terms of use" },
  sections: [
    {
      title: "What we collect",
      blocks: [
        {
          ul: [
            "Your account: your first and last name, your email address and a password. Passwords are handled by Supabase, our sign-in provider, which stores them in protected form.",
            "If you continue with Google: your name, email address and profile picture, from your Google account.",
            "Your page: the text and pictures you add (JPEG, PNG, WebP or GIF files), your colors and fonts, and your page address.",
          ],
        },
        { p: "Portory uses only the cookies needed to keep you signed in. It does not run analytics or advertising trackers." },
      ],
    },
    {
      title: "How we use it",
      blocks: [
        {
          ul: [
            "To create and keep your account, and to keep you signed in.",
            "To save your drafts and your page, and to publish it when you choose.",
            "To send the emails your account needs, such as confirming your email address or resetting your password.",
          ],
        },
        { p: "We do not sell your information, and we do not use it for advertising." },
      ],
    },
    {
      title: "What is public",
      blocks: [
        { p: "A page is private, a draft only you can see, until you publish it. Once it is published, anyone with its link can see it, and it shows what you put on it. You decide whether your email address and phone number appear." },
      ],
    },
    {
      title: "Who handles your data",
      blocks: [
        {
          ul: [
            "Supabase keeps accounts, pages and uploaded pictures.",
            "Vercel hosts the website.",
            "Google, only if you choose Continue with Google.",
          ],
        },
        { p: "They handle your information only to run Portory for you." },
      ],
    },
    {
      title: "Your choices",
      blocks: [
        {
          ul: [
            "Change your name or password on your Account page.",
            "Take a published page back to a draft at any time with its Visibility switch.",
            "Delete your account on your Account page. That removes your profile, your page and the pictures you uploaded, and signs you out everywhere.",
          ],
        },
      ],
    },
    {
      title: "Changes to this page",
      blocks: [{ p: "If this page changes in a meaningful way, the date at the top changes with it." }],
    },
  ],
};

export const TERMS: Doc = {
  title: "Terms",
  italic: "of use.",
  intro: "These terms are the simple rules for using Portory. By creating an account or using Portory, you agree to them.",
  other: { href: "/privacy", label: "Privacy policy" },
  sections: [
    {
      title: "Using Portory",
      blocks: [{ p: "Portory lets you choose a template, change its text, pictures, colors and fonts, and publish the result at your own address on portory.net." }],
    },
    {
      title: "Your account",
      blocks: [{ p: "Give accurate details when you sign up and keep your password safe. You are responsible for what happens under your account." }],
    },
    {
      title: "Your content",
      blocks: [
        { p: "What you add to your page stays yours. You give Portory permission to store it and show it as needed to run the service, including showing a published page to anyone with its link. You confirm that you have the right to use the text and pictures you add." },
      ],
    },
    {
      title: "What you may not do",
      blocks: [
        {
          ul: [
            "Use Portory for anything unlawful, or publish content that infringes someone else's rights or is hateful, harassing or deceptive.",
            "Upload anything harmful, such as malware.",
            "Try to break, overload or get around Portory, or to reach other people's accounts.",
          ],
        },
        { p: "We may unpublish content, or suspend an account, that breaks these rules." },
      ],
    },
    {
      title: "Portory is still growing",
      blocks: [{ p: "Portory is new and still being built. Some features are unfinished, we may change or remove features, and the service may sometimes be unavailable. It is provided as it is, without promises that it will always work." }],
    },
    {
      title: "Ending your account",
      blocks: [{ p: "You can delete your account whenever you like, on your Account page. We may suspend an account that breaks these terms." }],
    },
    {
      title: "Changes to these terms",
      blocks: [{ p: "If these terms change in a meaningful way, the date at the top changes with them." }],
    },
  ],
};
