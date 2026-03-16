/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import * as fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { type FastifyServerOptions } from 'fastify';
import type * as Sentry from '@sentry/node';
import type * as SentryVue from '@sentry/vue';
import type { RedisOptions } from 'ioredis';
import type { ManifestChunk } from 'vite';

type RedisOptionsSource = Partial<RedisOptions> & {
	host: string;
	port: number;
	family?: number;
	pass: string;
	db?: number;
	prefix?: string;
};

/**
 * 設定ファイルの型
 */
type Source = {
	url?: string;
	port?: number;
	socket?: string;
	trustProxy?: FastifyServerOptions['trustProxy'];
	chmodSocket?: string;
	enableIpRateLimit?: boolean;
	disableHsts?: boolean;
	db: {
		host: string;
		port: number;
		db?: string;
		user?: string;
		pass?: string;
		disableCache?: boolean;
		extra?: { [x: string]: string | boolean };
	};
	dbReplications?: boolean;
	dbSlaves?: {
		host: string;
		port: number;
		db: string;
		user: string;
		pass: string;
	}[];
	redis: RedisOptionsSource;
	redisForPubsub?: RedisOptionsSource;
	redisForJobQueue?: RedisOptionsSource;
	redisForTimelines?: RedisOptionsSource;
	redisForReactions?: RedisOptionsSource;
	fulltextSearch?: {
		provider?: FulltextSearchProvider;
	};
	meilisearch?: {
		host: string;
		port: string;
		apiKey: string;
		ssl?: boolean;
		index: string;
		scope?: 'local' | 'global' | string[];
	};
	sentryForBackend?: { options: Partial<Sentry.NodeOptions>; enableNodeProfiling: boolean; };
	sentryForFrontend?: {
		options: Partial<SentryVue.BrowserOptions> & { dsn: string };
		vueIntegration?: SentryVue.VueIntegrationOptions | null;
		browserTracingIntegration?: Parameters<typeof SentryVue.browserTracingIntegration>[0] | null;
		replayIntegration?: Parameters<typeof SentryVue.replayIntegration>[0] | null;
	};

	publishTarballInsteadOfProvideRepositoryUrl?: boolean;

	setupPassword?: string;

	proxy?: string;
	proxySmtp?: string;
	proxyBypassHosts?: string[];

	allowedPrivateNetworks?: string[];

	maxFileSize?: number;

	clusterLimit?: number;

	id: string;

	outgoingAddress?: string;
	outgoingAddressFamily?: 'ipv4' | 'ipv6' | 'dual';

	deliverJobConcurrency?: number;
	inboxJobConcurrency?: number;
	relationshipJobConcurrency?: number;
	deliverJobPerSec?: number;
	inboxJobPerSec?: number;
	relationshipJobPerSec?: number;
	deliverJobMaxAttempts?: number;
	inboxJobMaxAttempts?: number;

	mediaProxy?: string;
	videoThumbnailGenerator?: string;

	perChannelMaxNoteCacheCount?: number;
	perUserNotificationsMaxCount?: number;
	deactivateAntennaThreshold?: number;
	pidFile: string;

	logging?: {
		sql?: {
			disableQueryTruncation?: boolean,
			enableQueryParamLogging?: boolean,
		}
	}
};

export type Config = {
	url: string;
	port: number;
	socket: string | undefined;
	trustProxy: NonNullable<FastifyServerOptions['trustProxy']>;
	chmodSocket: string | undefined;
	enableIpRateLimit: boolean;
	disableHsts: boolean | undefined;
	db: {
		host: string;
		port: number;
		db: string;
		user: string;
		pass: string;
		disableCache?: boolean;
		extra?: { [x: string]: string | boolean };
	};
	dbReplications: boolean | undefined;
	dbSlaves: {
		host: string;
		port: number;
		db: string;
		user: string;
		pass: string;
	}[] | undefined;
	fulltextSearch?: {
		provider?: FulltextSearchProvider;
	};
	meilisearch: {
		host: string;
		port: string;
		apiKey: string;
		ssl?: boolean;
		index: string;
		scope?: 'local' | 'global' | string[];
	} | undefined;
	proxy: string | undefined;
	proxySmtp: string | undefined;
	proxyBypassHosts: string[] | undefined;
	allowedPrivateNetworks: string[] | undefined;
	maxFileSize: number;
	clusterLimit: number | undefined;
	id: string;
	outgoingAddress: string | undefined;
	outgoingAddressFamily: 'ipv4' | 'ipv6' | 'dual' | undefined;
	deliverJobConcurrency: number | undefined;
	inboxJobConcurrency: number | undefined;
	relationshipJobConcurrency: number | undefined;
	deliverJobPerSec: number | undefined;
	inboxJobPerSec: number | undefined;
	relationshipJobPerSec: number | undefined;
	deliverJobMaxAttempts: number | undefined;
	inboxJobMaxAttempts: number | undefined;
	logging?: {
		sql?: {
			disableQueryTruncation?: boolean,
			enableQueryParamLogging?: boolean,
		}
	}

	version: string;
	publishTarballInsteadOfProvideRepositoryUrl: boolean;
	setupPassword: string | undefined;
	host: string;
	hostname: string;
	scheme: string;
	wsScheme: string;
	apiUrl: string;
	wsUrl: string;
	authUrl: string;
	driveUrl: string;
	userAgent: string;
	frontendEntry: ManifestChunk;
	frontendManifestExists: boolean;
	frontendEmbedEntry: ManifestChunk;
	frontendEmbedManifestExists: boolean;
	mediaProxy: string;
	externalMediaProxyEnabled: boolean;
	videoThumbnailGenerator: string | null;
	redis: RedisOptions & RedisOptionsSource;
	redisForPubsub: RedisOptions & RedisOptionsSource;
	redisForJobQueue: RedisOptions & RedisOptionsSource;
	redisForTimelines: RedisOptions & RedisOptionsSource;
	redisForReactions: RedisOptions & RedisOptionsSource;
	sentryForBackend: { options: Partial<Sentry.NodeOptions>; enableNodeProfiling: boolean; } | undefined;
	sentryForFrontend: {
		options: Partial<SentryVue.BrowserOptions> & { dsn: string };
		vueIntegration?: SentryVue.VueIntegrationOptions | null;
		browserTracingIntegration?: Parameters<typeof SentryVue.browserTracingIntegration>[0] | null;
		replayIntegration?: Parameters<typeof SentryVue.replayIntegration>[0] | null;
	} | undefined;
	perChannelMaxNoteCacheCount: number;
	perUserNotificationsMaxCount: number;
	deactivateAntennaThreshold: number;
	pidFile: string;
};

export type FulltextSearchProvider = 'sqlLike' | 'sqlPgroonga' | 'meilisearch';

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

/** Path of repository root directory */
let rootDir = _dirname;
// 見つかるまで上に遡る
while (!fs.existsSync(resolve(rootDir, 'packages'))) {
	const parentDir = dirname(rootDir);
	if (parentDir === rootDir) {
		throw new Error('Cannot find root directory');
	}
	rootDir = parentDir;
}

/** Path of configuration directory */
const configDir = resolve(rootDir, '.config');
/** Path of built directory */
const projectBuiltDir = resolve(rootDir, 'built');

const compiledConfigFilePathForTest = resolve(projectBuiltDir, '._config_.json');

export const compiledConfigFilePath = fs.existsSync(compiledConfigFilePathForTest)
	? compiledConfigFilePathForTest
	: resolve(projectBuiltDir, '.config.json');

export function loadConfig(): Config {
	if (!fs.existsSync(compiledConfigFilePath)) {
		throw new Error('Compiled configuration file not found. Try running \'pnpm compile-config\'.');
	}

	const meta = JSON.parse(fs.readFileSync(resolve(projectBuiltDir, 'meta.json'), 'utf-8'));

	const frontendManifestExists = fs.existsSync(resolve(projectBuiltDir, '_frontend_vite_/manifest.json'));
	const frontendEmbedManifestExists = fs.existsSync(resolve(projectBuiltDir, '_frontend_embed_vite_/manifest.json'));
	const frontendManifest = frontendManifestExists ?
		JSON.parse(fs.readFileSync(resolve(projectBuiltDir, '_frontend_vite_/manifest.json'), 'utf-8'))
		: { 'src/_boot_.ts': { file: null } };
	const frontendEmbedManifest = frontendEmbedManifestExists ?
		JSON.parse(fs.readFileSync(resolve(projectBuiltDir, '_frontend_embed_vite_/manifest.json'), 'utf-8'))
		: { 'src/boot.ts': { file: null } };

	const config = JSON.parse(fs.readFileSync(compiledConfigFilePath, 'utf-8')) as Source;

	const url = tryCreateUrl(config.url ?? process.env.MISSKEY_URL ?? '');
	const databaseUrl = process.env.DATABASE_URL;
	const parsedDatabaseUrl = databaseUrl ? parseDatabaseUrl(databaseUrl) : null;
	const version = meta.version;
	const host = url.host;
	const hostname = url.hostname;
	const scheme = url.protocol.replace(/:$/, '');
	const wsScheme = scheme.replace('http', 'ws');

	const dbHost = parsedDatabaseUrl?.host ?? config.db.host;
	const dbPort = parsedDatabaseUrl?.port ?? config.db.port;
	const dbDb = parsedDatabaseUrl?.db ?? config.db.db ?? '';
	const dbUser = parsedDatabaseUrl?.user ?? config.db.user ?? '';
	const dbPass = parsedDatabaseUrl?.pass ?? config.db.pass ?? '';

	const externalMediaProxy = config.mediaProxy ?
		config.mediaProxy.endsWith('/') ? config.mediaProxy.substring(0, config.mediaProxy.length - 1) : config.mediaProxy
		: null;
	const internalMediaProxy = `${scheme}://${host}/proxy`;
	const redis = convertRedisOptions(config.redis, host);

	return {
		version,
		publishTarballInsteadOfProvideRepositoryUrl: !!config.publishTarballInsteadOfProvideRepositoryUrl,
		setupPassword: config.setupPassword,
		url: url.origin,
		port: config.port ?? parseInt(process.env.PORT ?? '', 10),
		socket: config.socket,
		trustProxy: config.trustProxy ?? [
			'10.0.0.0/8',
			'172.16.0.0/12',
			'192.168.0.0/16',
			'127.0.0.1/32',
			'::1/128',
			'fc00::/7',
		],
		chmodSocket: config.chmodSocket,
		disableHsts: config.disableHsts,
		enableIpRateLimit: config.enableIpRateLimit ?? true,
		host,
		hostname,
		scheme,
		wsScheme,
		wsUrl: `${wsScheme}://${host}`,
		apiUrl: `${scheme}://${host}/api`,
		authUrl: `${scheme}://${host}/auth`,
		driveUrl: `${scheme}://${host}/files`,
		db: { ...config.db, host: dbHost, port: dbPort, db: dbDb, user: dbUser, pass: dbPass, extra: { ...config.db.extra, ssl: true } },
		dbReplications: config.dbReplications,
		dbSlaves: config.dbSlaves,
		fulltextSearch: config.fulltextSearch,
		meilisearch: config.meilisearch,
		redis,
		redisForPubsub: config.redisForPubsub ? convertRedisOptions(config.redisForPubsub, host) : redis,
		redisForJobQueue: config.redisForJobQueue ? convertRedisOptions(config.redisForJobQueue, host) : redis,
		redisForTimelines: config.redisForTimelines ? convertRedisOptions(config.redisForTimelines, host) : redis,
		redisForReactions: config.redisForReactions ? convertRedisOptions(config.redisForReactions, host) : redis,
		sentryForBackend: config.sentryForBackend,
		sentryForFrontend: config.sentryForFrontend,
		id: config.id,
		proxy: config.proxy,
		proxySmtp: config.proxySmtp,
		proxyBypassHosts: config.proxyBypassHosts,
		allowedPrivateNetworks: config.allowedPrivateNetworks,
		maxFileSize: config.maxFileSize ?? 262144000,
		clusterLimit: config.clusterLimit,
		outgoingAddress: config.outgoingAddress,
		outgoingAddressFamily: config.outgoingAddressFamily,
		deliverJobConcurrency: config.deliverJobConcurrency,
		inboxJobConcurrency: config.inboxJobConcurrency,
		relationshipJobConcurrency: config.relationshipJobConcurrency,
		deliverJobPerSec: config.deliverJobPerSec,
		inboxJobPerSec: config.inboxJobPerSec,
		relationshipJobPerSec: config.relationshipJobPerSec,
		deliverJobMaxAttempts: config.deliverJobMaxAttempts,
		inboxJobMaxAttempts: config.inboxJobMaxAttempts,
		mediaProxy: externalMediaProxy ?? internalMediaProxy,
		externalMediaProxyEnabled: externalMediaProxy !== null && externalMediaProxy !== internalMediaProxy,
		videoThumbnailGenerator: config.videoThumbnailGenerator ?
			config.videoThumbnailGenerator.endsWith('/') ? config.videoThumbnailGenerator.substring(0, config.videoThumbnailGenerator.length - 1) : config.videoThumbnailGenerator
			: null,
		userAgent: `Misskey/${version} (${config.url})`,
		frontendEntry: frontendManifest['src/_boot_.ts'],
		frontendManifestExists: frontendManifestExists,
		frontendEmbedEntry: frontendEmbedManifest['src/boot.ts'],
		frontendEmbedManifestExists: frontendEmbedManifestExists,
		perChannelMaxNoteCacheCount: config.perChannelMaxNoteCacheCount ?? 1000,
		perUserNotificationsMaxCount: config.perUserNotificationsMaxCount ?? 500,
		deactivateAntennaThreshold: config.deactivateAntennaThreshold ?? (1000 * 60 * 60 * 24 * 7),
		pidFile: config.pidFile,
		logging: config.logging,
	};
}

function tryCreateUrl(url: string) {
	try {
		return new URL(url);
	} catch (_) {
		throw new Error(`url="${url}" is not a valid URL.`);
	}
}

function parseDatabaseUrl(databaseUrl: string) {
	const url = tryCreateUrl(databaseUrl);

	if (url.protocol !== 'postgres:' && url.protocol !== 'postgresql:') {
		throw new Error(`DATABASE_URL protocol must be postgres:// or postgresql://, got "${url.protocol}"`);
	}

	const firstSlashes = databaseUrl.indexOf('//');
	const preBase = databaseUrl.substring(firstSlashes + 2);
	const secondSlash = preBase.indexOf('/');
	const base = secondSlash !== -1 ? preBase.substring(0, secondSlash) : preBase;
	let afterBase = secondSlash !== -1 ? preBase.substring(secondSlash + 1) : undefined;

	if (afterBase && afterBase.indexOf('?') !== -1) {
		afterBase = afterBase.substring(0, afterBase.indexOf('?'));
	}

	const lastAtSign = base.lastIndexOf('@');
	const usernameAndPassword = lastAtSign !== -1 ? base.substring(0, lastAtSign) : '';

	let username = usernameAndPassword;
	let password = '';
	const firstColon = usernameAndPassword.indexOf(':');

	if (firstColon !== -1) {
		username = usernameAndPassword.substring(0, firstColon);
		password = usernameAndPassword.substring(firstColon + 1);
	}

	const host = url.hostname;
	const port = url.port ? parseInt(url.port, 10) : undefined;

	if (!host) {
		throw new Error(`DATABASE_URL="${databaseUrl}" must include a hostname.`);
	}

	return {
		host,
		port,
		db: afterBase ? decodeURIComponent(afterBase) : undefined,
		user: decodeURIComponent(username),
		pass: decodeURIComponent(password),
	};
}

function convertRedisOptions(options: RedisOptionsSource, host: string): RedisOptions & RedisOptionsSource {
	return {
		...options,
		password: options.pass,
		prefix: options.prefix ?? host,
		family: options.family ?? 0,
		keyPrefix: `${options.prefix ?? host}:`,
		db: options.db ?? 0,
	};
}
