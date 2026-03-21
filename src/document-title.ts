/**
 * Resolves document title the same way TanStack Router's head pipeline does:
 * walk matches leaf → root, and within each route's `meta` array last → first.
 */
export function documentTitleFromMatches(
	matches: Array<{ meta?: Array<{ title?: string } | undefined> | undefined }>,
): string | undefined {
	const routeMeta = matches
		.map((m) => m.meta)
		.filter((meta): meta is NonNullable<typeof meta> => Boolean(meta));
	for (let i = routeMeta.length - 1; i >= 0; i--) {
		const metas = routeMeta[i];
		for (let j = metas.length - 1; j >= 0; j--) {
			const m = metas[j];
			if (m?.title) return m.title;
		}
	}
	return undefined;
}
