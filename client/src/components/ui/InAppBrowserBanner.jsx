import sweating from "../../assets/sweating.png";

export function InAppBrowserBanner() {
  return (
    <div className="flex items-start gap-3 rounded-[14px] border border-amber-200 bg-amber-50 px-4 py-3 text-left text-sm text-amber-900">
      <img src={sweating} alt="" aria-hidden="true" className="mt-0.5 h-10 w-10 shrink-0 select-none" />
      <div>
        <p className="font-semibold">Oops! Looks like you&apos;re in an in-app browser</p>
        <p className="mt-1 text-xs leading-relaxed text-amber-800">
          Google sign-in doesn&apos;t work from inside apps like Instagram, Facebook, or Messenger.
          Tap the menu (usually <span className="font-semibold">&#8942;</span> or the share icon),
          choose &quot;Open in browser&quot;, and you&apos;ll be good to go!
        </p>
      </div>
    </div>
  );
}
