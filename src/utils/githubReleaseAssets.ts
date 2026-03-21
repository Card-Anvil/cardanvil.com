/**
 * Resolve the Windows NSIS installer from GitHub’s latest release via the public API.
 * GitHub enables CORS for the REST API, so this works from the browser.
 */

export type GithubReleaseAsset = {
	name: string;
	browser_download_url: string;
};

export type GithubLatestReleaseJson = {
	assets: GithubReleaseAsset[];
};

export function parseGitHubRepoFromUrl(repoPageUrl: string): {
	owner: string;
	repo: string;
} | null {
	try {
		const u = new URL(repoPageUrl);
		if (u.hostname !== "github.com") return null;
		const segments = u.pathname
			.replace(/^\/+|\/+$/g, "")
			.split("/")
			.filter(Boolean);
		if (segments.length < 2) return null;
		const [owner, repo] = segments;
		if (!owner || !repo) return null;
		return { owner, repo };
	} catch {
		return null;
	}
}

export function githubLatestReleaseApiUrl(owner: string, repo: string): string {
	return `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/releases/latest`;
}

/**
 * Tauri NSIS bundles use `{productName}_{version}_x64-setup.exe`.
 * Prefer assets whose names start with `namePrefix` when set (e.g. `cardanvil_`).
 */
export function pickWindowsNsisInstallerAsset(
	assets: GithubReleaseAsset[],
	namePrefix: string,
): GithubReleaseAsset | null {
	const suffix = "_x64-setup.exe";
	const withSuffix = assets.filter((a) => a.name.endsWith(suffix));
	if (withSuffix.length === 0) return null;

	const trimmed = namePrefix.trim();
	if (trimmed.length > 0) {
		const prefixed = withSuffix.filter((a) => a.name.startsWith(trimmed));
		if (prefixed.length > 0) return pickOne(prefixed);
	}

	return pickOne(withSuffix);
}

function pickOne(candidates: GithubReleaseAsset[]): GithubReleaseAsset {
	if (candidates.length === 0) {
		throw new Error("pickOne: expected at least one candidate");
	}
	if (candidates.length === 1) {
		const only = candidates[0];
		if (only === undefined) {
			throw new Error("pickOne: missing sole candidate");
		}
		return only;
	}
	const sorted = [...candidates].sort((a, b) => a.name.localeCompare(b.name));
	const last = sorted[sorted.length - 1];
	if (last === undefined) {
		throw new Error("pickOne: sort produced no last element");
	}
	return last;
}

export async function fetchLatestWindowsNsisInstaller(
	repoPageUrl: string,
	options: { namePrefix: string; signal?: AbortSignal },
): Promise<GithubReleaseAsset | null> {
	const parsed = parseGitHubRepoFromUrl(repoPageUrl);
	if (!parsed) return null;

	const url = githubLatestReleaseApiUrl(parsed.owner, parsed.repo);
	const res = await fetch(url, {
		signal: options.signal,
		headers: {
			Accept: "application/vnd.github+json",
			"X-GitHub-Api-Version": "2022-11-28",
		},
	});

	if (!res.ok) return null;

	const data = (await res.json()) as GithubLatestReleaseJson;
	if (!data.assets?.length) return null;

	return pickWindowsNsisInstallerAsset(data.assets, options.namePrefix);
}
