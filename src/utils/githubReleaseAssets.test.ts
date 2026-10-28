import { describe, expect, it } from "vitest";
import {
	githubLatestReleaseApiUrl,
	parseGitHubRepoFromUrl,
	pickMacDmgAsset,
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

	it("picks the installer from a real release", () => {
		expect(
			pickWindowsNsisInstallerAsset(v3_1_0.map(mk), "Card.Anvil_")?.name,
		).toBe("Card.Anvil_3.1.0_x64-setup.exe");
	});
});

describe("pickMacDmgAsset", () => {
	const mk = (name: string) => ({
		name,
		browser_download_url: `https://example.com/${name}`,
	});

	it("picks the DMG for each architecture", () => {
		const assets = v3_1_0.map(mk);
		expect(pickMacDmgAsset(assets, "aarch64", "Card.Anvil_")?.name).toBe(
			"Card.Anvil_3.1.0_aarch64.dmg",
		);
		expect(pickMacDmgAsset(assets, "x64", "Card.Anvil_")?.name).toBe(
			"Card.Anvil_3.1.0_x64.dmg",
		);
	});

	it("returns null for a release without macOS builds", () => {
		const v3_0_0 = [
			"Card.Anvil_3.0.0_x64-setup.exe",
			"Card.Anvil_3.0.0_x64-setup.exe.sig",
			"latest.json",
		];
		expect(
			pickMacDmgAsset(v3_0_0.map(mk), "aarch64", "Card.Anvil_"),
		).toBeNull();
	});
});

/** Asset names from the v3.1.0 release, including the updater bundles to ignore. */
const v3_1_0 = [
	"Card.Anvil_3.1.0_aarch64.dmg",
	"Card.Anvil_3.1.0_x64-setup.exe",
	"Card.Anvil_3.1.0_x64-setup.exe.sig",
	"Card.Anvil_3.1.0_x64.dmg",
	"Card.Anvil_aarch64.app.tar.gz",
	"Card.Anvil_aarch64.app.tar.gz.sig",
	"Card.Anvil_x64.app.tar.gz",
	"Card.Anvil_x64.app.tar.gz.sig",
	"latest.json",
];
