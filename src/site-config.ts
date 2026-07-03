/**
 * Central URLs for the marketing site.
 *
 * The download page resolves the Windows NSIS `.exe` at runtime via GitHub’s
 * `releases/latest` API (no hardcoded version). Adjust `GITHUB_REPO_URL` or
 * `WINDOWS_DESKTOP_INSTALLER.githubAssetNamePrefix` if the app ships from
 * another repository or uses a different Tauri `productName`.
 */
export const SITE_ORIGIN = "https://cardanvil.com";

export const WEB_APP_ORIGIN = "https://cardanvil.com.app";

/** Public repository whose Releases publish the desktop installer. */
export const GITHUB_REPO_URL = "https://github.com/Card-Anvil/cardanvil.com";

export const githubReleasesUrl = `${GITHUB_REPO_URL.replace(/\/$/, "")}/releases`;

/** Desktop Windows download row: label + how to pick the asset on the latest release. */
export const WINDOWS_DESKTOP_INSTALLER = {
	label: "Windows installer (64-bit)",
	/**
	 * Tauri NSIS files are named `{productName}_{version}_x64-setup.exe`.
	 * Keep this equal to `productName` plus `_` from `ProxyWeaver/src-tauri/tauri.conf.json`.
	 */
	githubAssetNamePrefix: "cardanvil_",
} as const;
