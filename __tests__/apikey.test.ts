/**
 * API Key Authentication Integration Tests
 *
 * Skenario:
 * 1. Authentication Tests - Memverifikasi berbagai kondisi authentication
 *    - Tanpa API key
 *    - Dengan API key invalid/tidak ada
 *    - Dengan API key expired
 *    - Dengan API key inactive
 *    - Dengan valid API key
 *    - Dengan format Bearer token
 *
 * 2. CRUD API Key Operations - Menguji operasi CRUD dengan API key authentication
 *    - GET: Mengambil daftar API key user
 *    - POST: Membuat API key baru
 *    - POST /update: Mengupdate status/expired API key
 *    - POST /delete: Menghapus API key
 *
 * 3. Authorization Tests - Memverifikasi ownership dan permissions
 *    - Tidak bisa mengakses API key user lain
 *    - Tidak bisa mengupdate/menghapus API key user lain
 *
 * Prerequisites:
 * - Server harus running (bun dev)
 * - PostgreSQL database harus aktif
 * - Environment: BUN_PUBLIC_BASE_URL
 */
import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { prisma } from "../src/utils/db";
import { Prisma } from "../generated/prisma";
import { nanoid } from "nanoid";

const BASE_URL = process.env.BUN_PUBLIC_BASE_URL || "http://localhost:3000";

async function fetchApi(endpoint: string, options: RequestInit = {}) {
	const response = await fetch(`${BASE_URL}${endpoint}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
	});
	return { status: response.status, data: await response.json() };
}

describe("API Key Authentication", () => {
	let testUserId: string;
	let validApiKey: Prisma.ApiKeyGetPayload<Record<string, never>>;
	let expiredApiKey: Prisma.ApiKeyGetPayload<Record<string, never>>;
	let inactiveApiKey: Prisma.ApiKeyGetPayload<Record<string, never>>;

	beforeAll(async () => {
		// Create test user
		const user = await prisma.user.create({
			data: {
				email: `test-${nanoid(8)}@example.com`,
				name: "Test User",
			},
		});
		testUserId = user.id;

		// Create valid API key
		validApiKey = await prisma.apiKey.create({
			data: {
				name: "Valid Test Key",
				key: `sk-test-${nanoid(32)}`,
				userId: testUserId,
				isActive: true,
			},
		});

		// Create expired API key
		expiredApiKey = await prisma.apiKey.create({
			data: {
				name: "Expired Test Key",
				key: `sk-expired-${nanoid(32)}`,
				userId: testUserId,
				isActive: true,
				expiresAt: new Date(Date.now() - 1000), // Already expired
			},
		});

		// Create inactive API key
		inactiveApiKey = await prisma.apiKey.create({
			data: {
				name: "Inactive Test Key",
				key: `sk-inactive-${nanoid(32)}`,
				userId: testUserId,
				isActive: false,
			},
		});
	});

	afterAll(async () => {
		// Cleanup test data
		await prisma.apiKey.deleteMany({
			where: { userId: testUserId },
		});
		await prisma.user.delete({
			where: { id: testUserId },
		});
	});

	/**
	 * Scenario: GET /api/apikey - Retrieve user's API keys
	 * Memverifikasi bahwa endpoint hanya dapat diakses dengan authentication yang valid
	 */
	describe("GET /api/apikey", () => {
		it("should return 401 without API key", async () => {
			const response = await fetchApi("/api/apikey");
			expect(response.status).toBe(401);
			expect(response.data.message).toBe("Unauthorized");
		});

		it("should return 401 with invalid API key", async () => {
			const response = await fetchApi("/api/apikey", {
				headers: {
					"X-API-Key": "invalid-key-12345",
				},
			});
			expect(response.status).toBe(401);
		});

		it("should return 401 with non-existent API key", async () => {
			const response = await fetchApi("/api/apikey", {
				headers: {
					"X-API-Key": `sk-${nanoid(32)}`,
				},
			});
			expect(response.status).toBe(401);
		});

		it("should return 401 with expired API key", async () => {
			const response = await fetchApi("/api/apikey", {
				headers: {
					"X-API-Key": expiredApiKey.key,
				},
			});
			expect(response.status).toBe(401);
		});

		it("should return 401 with inactive API key", async () => {
			const response = await fetchApi("/api/apikey", {
				headers: {
					"X-API-Key": inactiveApiKey.key,
				},
			});
			expect(response.status).toBe(401);
		});

		it("should return 200 with valid API key", async () => {
			const response = await fetchApi("/api/apikey", {
				headers: {
					"X-API-Key": validApiKey.key,
				},
			});
			expect(response.status).toBe(200);
			expect(response.data.apiKeys).toBeDefined();
		});

		it("should accept Bearer token format", async () => {
			const response = await fetchApi("/api/apikey", {
				headers: {
					Authorization: `Bearer ${validApiKey.key}`,
				},
			});
			expect(response.status).toBe(200);
		});
	});

	/**
	 * Scenario: POST /api/apikey - Create new API key
	 * Memverifikasi bahwa user dapat membuat API key baru
	 */
	describe("POST /api/apikey", () => {
		it("should return 401 without API key", async () => {
			const response = await fetchApi("/api/apikey", {
				method: "POST",
				body: JSON.stringify({ name: "New Key" }),
			});
			expect(response.status).toBe(401);
		});

		it("should create API key with valid API key", async () => {
			const response = await fetchApi("/api/apikey", {
				method: "POST",
				headers: {
					"X-API-Key": validApiKey.key,
				},
				body: JSON.stringify({ name: "Created via Test" }),
			});
			expect(response.status).toBe(200);
			expect(response.data.apiKey).toBeDefined();
			expect(response.data.apiKey.name).toBe("Created via Test");
			expect(response.data.apiKey.key).toMatch(/^sk-/);

			// Cleanup created key
			await prisma.apiKey.delete({ where: { id: response.data.apiKey.id } });
		});
	});

	/**
	 * Scenario: POST /api/apikey/update - Update API key status
	 * Memverifikasi bahwa user dapat mengupdate API key miliknya
	 * Memverifikasi bahwa user tidak dapat mengupdate API key user lain (403)
	 */
	describe("POST /api/apikey/update", () => {
		let tempKeyId: string;

		beforeAll(async () => {
			const key = await prisma.apiKey.create({
				data: {
					name: "Temp Key for Update Test",
					key: `sk-update-${nanoid(32)}`,
					userId: testUserId,
					isActive: true,
				},
			});
			tempKeyId = key.id;
		});

		it("should return 401 without API key", async () => {
			const response = await fetchApi("/api/apikey/update", {
				method: "POST",
				body: JSON.stringify({ id: tempKeyId, isActive: false }),
			});
			expect(response.status).toBe(401);
		});

		it("should return 403 when updating another user's key", async () => {
			// Create another user and key
			const otherUser = await prisma.user.create({
				data: {
					email: `other-${nanoid(8)}@example.com`,
					name: "Other User",
				},
			});
			const otherKey = await prisma.apiKey.create({
				data: {
					name: "Other User Key",
					key: `sk-other-${nanoid(32)}`,
					userId: otherUser.id,
					isActive: true,
				},
			});

			const response = await fetchApi("/api/apikey/update", {
				method: "POST",
				headers: {
					"X-API-Key": validApiKey.key,
				},
				body: JSON.stringify({ id: otherKey.id, isActive: false }),
			});
			expect(response.status).toBe(403);

			await prisma.apiKey.delete({ where: { id: otherKey.id } });
			await prisma.user.delete({ where: { id: otherUser.id } });
		});

		it("should update API key with valid API key", async () => {
			const response = await fetchApi("/api/apikey/update", {
				method: "POST",
				headers: {
					"X-API-Key": validApiKey.key,
				},
				body: JSON.stringify({ id: tempKeyId, isActive: false }),
			});
			expect(response.status).toBe(200);
			expect(response.data.apiKey.isActive).toBe(false);

			// Restore
			await prisma.apiKey.update({
				where: { id: tempKeyId },
				data: { isActive: true },
			});
		});
	});

	/**
	 * Scenario: POST /api/apikey/delete - Delete API key
	 * Memverifikasi bahwa user dapat menghapus API key miliknya
	 * Memverifikasi bahwa user tidak dapat menghapus API key user lain (403)
	 */
	describe("POST /api/apikey/delete", () => {
		let tempKeyId: string;

		beforeAll(async () => {
			const key = await prisma.apiKey.create({
				data: {
					name: "Temp Key for Delete Test",
					key: `sk-delete-${nanoid(32)}`,
					userId: testUserId,
					isActive: true,
				},
			});
			tempKeyId = key.id;
		});

		it("should return 401 without API key", async () => {
			const response = await fetchApi("/api/apikey/delete", {
				method: "POST",
				body: JSON.stringify({ id: tempKeyId }),
			});
			expect(response.status).toBe(401);
		});

		it("should return 403 when deleting another user's key", async () => {
			const otherUser = await prisma.user.create({
				data: {
					email: `other-del-${nanoid(8)}@example.com`,
					name: "Other User",
				},
			});
			const otherKey = await prisma.apiKey.create({
				data: {
					name: "Other User Key",
					key: `sk-other-del-${nanoid(32)}`,
					userId: otherUser.id,
					isActive: true,
				},
			});

			const response = await fetchApi("/api/apikey/delete", {
				method: "POST",
				headers: {
					"X-API-Key": validApiKey.key,
				},
				body: JSON.stringify({ id: otherKey.id }),
			});
			expect(response.status).toBe(403);

			await prisma.apiKey.delete({ where: { id: otherKey.id } });
			await prisma.user.delete({ where: { id: otherUser.id } });
		});

		it("should delete API key with valid API key", async () => {
			const response = await fetchApi("/api/apikey/delete", {
				method: "POST",
				headers: {
					"X-API-Key": validApiKey.key,
				},
				body: JSON.stringify({ id: tempKeyId }),
			});
			expect(response.status).toBe(200);
			expect(response.data.success).toBe(true);

			// Verify deleted
			const deleted = await prisma.apiKey.findUnique({
				where: { id: tempKeyId },
			});
			expect(deleted).toBeNull();
		});
	});
});