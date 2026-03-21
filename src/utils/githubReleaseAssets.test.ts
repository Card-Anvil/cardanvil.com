import { describe, expect, it } from "vitest";
import {
	githubLatestReleaseApiUrl,
	parseGitHubRepoFromUrl,
	pickWindowsNsisInstallerAsset,
} from "./githubReleaseAssets";

describe("parseGitHubRepoFromUrl", () => {
	it("parses owner and repo", () => {
		expect(
			parseGitHubRepoFromUrl("https://github.com/Card-Anvil/cardanvil.com"),
		).toEqual({ owner: "Card-Anvil", repo: "cardanvil.com" });
		expect(
			parseGitHubRepoFromUrl("https://github.com/Card-Anvil/cardanvil.com/"),
		).toEqual({ owner: "Card-Anvil", repo: "cardanvil.com" });
	});

	it("returns null for invalid URLs", () => {
		expect(parseGitHubRepoFromUrl("https://example.com/a/b")).toBeNull();
		expect(parseGitHubRepoFromUrl("not-a-url")).toBeNull();
	});
});

describe("githubLatestReleaseApiUrl", () => {
	it("encodes path segments", () => {
		expect(githubLatestReleaseApiUrl("Card-Anvil", "cardanvil.com")).toBe(
			"https://api.github.com/repos/Card-Anvil/cardanvil.com/releases/latest",
		);
	});
});

describe("pickWindowsNsisInstallerAsset", () => {
	const mk = (name: string) => ({
		name,
		browser_download_url: `https://example.com/${name}`,
	});

	it("matches Tauri NSIS suffix and optional prefix", () => {
		expect(
			pickWindowsNsisInstallerAsset(
				[mk("cardanvil_0.1.0_x64-setup.exe"), mk("other_9.9.9_x64-setup.exe")],
				"cardanvil_",
			)?.name,
		).toBe("cardanvil_0.1.0_x64-setup.exe");
	});

	it("falls back to any NSIS-like name when prefix misses", () => {
		expect(
			pickWindowsNsisInstallerAsset(
				[mk("myapp_2.0.0_x64-setup.exe")],
				"cardanvil_",
			)?.name,
		).toBe("myapp_2.0.0_x64-setup.exe");
	});

	it("returns null when no installer asset", () => {
		expect(
			pickWindowsNsisInstallerAsset(
				[mk("cardanvil_0.1.0_x64_en-US.msi")],
				"cardanvil_",
			),
		).toBeNull();
	});
});
