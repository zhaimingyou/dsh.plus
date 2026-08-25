import type { Context } from '@deepseek-ai/cordis';
export declare const name = "dsh.plus";
/**
 * Host entry: mount the catalog HTTP route once the web-server service is
 * available. This is the only host-side contribution — the plugin is a
 * read-only gallery; it installs nothing and mutates nothing.
 */
export declare function apply(ctx: Context): void;
