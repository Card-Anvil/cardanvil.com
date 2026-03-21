/**
 * Central URLs for the marketing site. Update `WINDOWS_DOWNLOAD_ASSETS` and
 * `GITHUB_RELEASE_DOWNLOAD` when release artifacts or tagging changes.
 *
 * GitHub “latest” URLs only work if each release publishes assets with the
 * same `fileName`. Versioned Tauri filenames require `pinned` + updating
 * `tag` / `fileName` per release, or stable renamed assets in CI.
 */
export const WEB_APP_ORIGIN = "https://app.cardanvil.com";

/** Public app repository (Releases). */
export const GITHUB_REPO_URL = "https://github.com/Card-Anvil/cardanvil.com";

export const githubReleasesUrl = `${GITHUB_REPO_URL.replace(/\/$/, "")}/releases`;

export type GithubReleaseDownload =
	| { type: "latest" }
	| { type: "pinned"; tag: string };

/** `latest` → …/releases/latest/download/{file}; `pinned` → …/releases/download/{tag}/{file} */
export const GITHUB_RELEASE_DOWNLOAD: GithubReleaseDownload = {
	type: "latest",
};

export const WINDOWS_DOWNLOAD_ASSETS: { label: string; fileName: string }[] = [
	{
		label: "Windows installer (64-bit)",
		// Replace with the exact name under Release → Assets when you publish.
		fileName: "proxyweaver_x64-setup.exe",
	},
];

export function githubWindowsAssetUrl(fileName: string): string {
	const base = GITHUB_REPO_URL.replace(/\/$/, "");
	const enc = encodeURIComponent(fileName);
	if (GITHUB_RELEASE_DOWNLOAD.type === "latest") {
		return `${base}/releases/latest/download/${enc}`;
	}
	const tagEnc = encodeURIComponent(GITHUB_RELEASE_DOWNLOAD.tag);
	return `${base}/releases/download/${tagEnc}/${enc}`;
}

export function windowsDownloadsWithUrls(): {
	label: string;
	fileName: string;
	href: string;
}[] {
	return WINDOWS_DOWNLOAD_ASSETS.map((a) => ({
		...a,
		href: githubWindowsAssetUrl(a.fileName),
	}));
}
