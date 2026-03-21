import { Button } from "@chakra-ui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	function cycle() {
		if (theme === "light") {
			setTheme("dark");
		} else if (theme === "dark") {
			setTheme("system");
		} else {
			setTheme("light");
		}
	}

	const label =
		theme === "system"
			? "Theme: system. Click for light."
			: theme === "dark"
				? "Theme: dark. Click for system."
				: "Theme: light. Click for dark.";

	return (
		<Button
			type="button"
			size="sm"
			variant="outline"
			onClick={cycle}
			aria-label={label}
			title={label}
			disabled={!mounted}
		>
			{!mounted
				? "…"
				: theme === "system"
					? "System"
					: theme === "dark"
						? "Dark"
						: "Light"}
		</Button>
	);
}
