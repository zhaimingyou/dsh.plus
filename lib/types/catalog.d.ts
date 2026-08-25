export type CatalogLocale = 'zh' | 'en';
export interface CatalogEntry {
    id: string;
    name: string;
    summary: string;
    description?: string;
    categories: string[];
    repository: string;
    homepage?: string;
    publisher?: string;
    license?: string;
    updatedAt?: string;
    stars: number;
    cover?: string;
    install: string;
}
/**
 * Load the full merged catalog for one locale. Throws when the provider page
 * cannot be fetched so the route can answer 502 and the client can offer an
 * explicit retry. Star-enrichment failures are swallowed inside loadStars().
 */
export declare function loadCatalog(locale: CatalogLocale): Promise<CatalogEntry[]>;
