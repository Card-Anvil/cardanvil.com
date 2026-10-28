import { describe, expect, it } from "vitest";
import { detectDesktopOs, detectMacArch } from "./platform";

const WINDOWS_UA =
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36";
const MAC_SAFARI_UA =
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15";
const IPHONE_UA =
	"Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const LINUX_UA =
	"Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0";

describe("detectDesktopOs", () => {
	it("reads the user agent string", () => {
		expect(detectDesktopOs({ userAgent: WINDOWS_UA })).toBe("windows");
		expect(
			detectDesktopOs({ userAgent: MAC_SAFARI_UA, maxTouchPoints: 0 }),
		).toBe("macos");
	});

	it("prefers userAgentData.platform when present", () => {
		expect(
			detectDesktopOs({
				userAgent: WINDOWS_UA,
				userAgentData: { platform: "macOS" },
			}),
		).toBe("macos");
		expect(
			detectDesktopOs({
				userAgent: MAC_SAFARI_UA,
				userAgentData: { platform: "Linux" },
			}),
		).toBeNull();
	});

	it("does not treat iOS or iPadOS as macOS", () => {
		expect(
			detectDesktopOs({ userAgent: IPHONE_UA, maxTouchPoints: 5 }),
		).toBeNull();
		// iPadOS in desktop mode sends a Mac user agent.
		expect(
			detectDesktopOs({ userAgent: MAC_SAFARI_UA, maxTouchPoints: 5 }),
		).toBeNull();
	});

	it("returns null for other platforms", () => {
		expect(detectDesktopOs({ userAgent: LINUX_UA })).toBeNull();
	});
});

describe("detectMacArch", () => {
	const withArch = (architecture: string) => ({
		userAgent: MAC_SAFARI_UA,
		userAgentData: {
			platform: "macOS",
			getHighEntropyValues: async () => ({ architecture }),
		},
	});

	it("maps Chromium architecture hints", async () => {
		expect(await detectMacArch(withArch("arm"))).toBe("aarch64");
		expect(await detectMacArch(withArch("x86"))).toBe("x64");
		expect(await detectMacArch(withArch(""))).toBeNull();
	});

	it("returns null without client hints", async () => {
		expect(await detectMacArch({ userAgent: MAC_SAFARI_UA })).toBeNull();
	});

	it("returns null when the hint request fails", async () => {
		expect(
			await detectMacArch({
				userAgent: MAC_SAFARI_UA,
				userAgentData: {
					platform: "macOS",
					getHighEntropyValues: () => Promise.reject(new Error("denied")),
				},
			}),
		).toBeNull();
	});
});
