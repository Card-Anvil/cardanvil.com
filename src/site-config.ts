/**
 * Central URLs for the marketing site.
 *
 * The download page resolves the Windows NSIS `.exe` and the macOS `.dmg` files at runtime via
 * GitHub’s `releases/latest` API (no hardcoded version). Adjust `GITHUB_REPO_URL` or
 * `DESKTOP_ASSET_NAME_PREFIX` if the app ships from another repository or uses a different Tauri
 * `productName`.
 */
export const SITE_ORIGIN = "https://cardanvil.com";

export const WEB_APP_ORIGIN = "https://cardanvil.app";

export const FEEDBACK_ORIGIN = "https://feedback.cardanvil.com";

/** Public repository whose Releases publish the desktop installers. */
export const GITHUB_REPO_URL = "https://github.com/Card-Anvil/cardanvil.com";

export const githubReleasesUrl = `${GITHUB_REPO_URL.replace(/\/$/, "")}/releases`;

/**
 * Tauri names bundles `{productName}_{version}_…`, and GitHub replaces the space in the
 * `productName` "Card Anvil" with a dot on upload.
 */
const DESKTOP_ASSET_NAME_PREFIX = "Card.Anvil_";

/** Desktop Windows download row: label + how to pick the asset on the latest release. */
export const WINDOWS_DESKTOP_INSTALLER = {
	label: "Windows installer (64-bit)",
	githubAssetNamePrefix: DESKTOP_ASSET_NAME_PREFIX,
} as const;

/** Desktop macOS download rows: one DMG per architecture on the latest release. */
export const MAC_DESKTOP_INSTALLER = {
	labels: {
		aarch64: "macOS — Apple Silicon (M1 and later)",
		x64: "macOS — Intel",
	},
	githubAssetNamePrefix: DESKTOP_ASSET_NAME_PREFIX,
} as const;
