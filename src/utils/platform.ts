/**
 * Best-effort detection of the visitor’s desktop OS and Mac CPU architecture, used to pick the
 * download to highlight. Takes a navigator-like object so it stays testable and never touches
 * globals during prerender.
 */

import type { MacArch } from "@/utils/githubReleaseAssets";

export type DesktopOs = "windows" | "macos";

/** The parts of `Navigator` we read. `userAgentData` is Chromium-only and not in the DOM lib. */
export type NavigatorLike = {
	userAgent: string;
	maxTouchPoints?: number;
	userAgentData?: {
		platform: string;
		getHighEntropyValues?: (
			hints: string[],
		) => Promise<{ architecture?: string }>;
	};
};

export function detectDesktopOs(nav: NavigatorLike): DesktopOs | null {
	const platform = nav.userAgentData?.platform;
	if (platform) {
		if (platform === "Windows") return "windows";
		if (platform === "macOS") return "macos";
		return null;
	}

	const ua = nav.userAgent;
	if (/Windows NT/.test(ua)) return "windows";
	// iPadOS in desktop mode sends a Mac user agent; touch support gives it away.
	if (/Macintosh/.test(ua) && (nav.maxTouchPoints ?? 0) <= 1) return "macos";
	return null;
}

/**
 * Only Chromium exposes the CPU architecture. Safari and Firefox report "Intel Mac OS X" even on
 * Apple Silicon, so they resolve to `null`.
 */
export async function detectMacArch(
	nav: NavigatorLike,
): Promise<MacArch | null> {
	const getHighEntropyValues = nav.userAgentData?.getHighEntropyValues;
	if (!getHighEntropyValues) return null;
	try {
		const { architecture } = await getHighEntropyValues.call(
			nav.userAgentData,
			["architecture"],
		);
		if (architecture === "arm") return "aarch64";
		if (architecture === "x86") return "x64";
		return null;
	} catch {
		return null;
	}
}
