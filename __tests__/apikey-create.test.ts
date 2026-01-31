import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { prisma } from "../src/utils/db";
import { nanoid } from "nanoid";

describe("ApiKey Creation", () => {
  let userId: string;

  beforeEach(async () => {
    // Create a test user
    const testUser = await prisma.user.create({
      data: {
        email: `test-${nanoid(10)}@example.com`,
        name: "Test User",
        emailVerified: true,
        role: "user",
      },
    });
    userId = testUser.id;
  });

  afterEach(async () => {
    // Clean up: delete the test user and associated API keys
    await prisma.apiKey.deleteMany({
      where: {
        userId: userId,
      },
    });
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  });

  it("should create a new API key for a user", async () => {
    const apiKeyName = "Test API Key";
    const apiKeyValue = `sk-${nanoid(32)}`;

    const newApiKey = await prisma.apiKey.create({
      data: {
        name: apiKeyName,
        key: apiKeyValue,
        userId: userId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        key: true,
        userId: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Assertions
    expect(newApiKey).toBeDefined();
    expect(newApiKey.name).toBe(apiKeyName);
    expect(newApiKey.key).toBe(apiKeyValue);
    expect(newApiKey.userId).toBe(userId);
    expect(newApiKey.isActive).toBe(true);
    expect(newApiKey.createdAt).toBeInstanceOf(Date);
    expect(newApiKey.updatedAt).toBeInstanceOf(Date);
    expect(newApiKey.updatedAt.getTime()).toBeGreaterThanOrEqual(newApiKey.createdAt.getTime());
  });

  it("should create an API key with default active status", async () => {
    const apiKeyName = "Test API Key with Default Status";
    const apiKeyValue = `sk-${nanoid(32)}`;

    const newApiKey = await prisma.apiKey.create({
      data: {
        name: apiKeyName,
        key: apiKeyValue,
        userId: userId,
        // Not specifying isActive to test default value
      },
      select: {
        id: true,
        name: true,
        key: true,
        userId: true,
        isActive: true,
      },
    });

    // Assertions
    expect(newApiKey).toBeDefined();
    expect(newApiKey.name).toBe(apiKeyName);
    expect(newApiKey.key).toBe(apiKeyValue);
    expect(newApiKey.userId).toBe(userId);
    expect(newApiKey.isActive).toBe(true); // Should default to true
  });

  it("should create an API key with inactive status when specified", async () => {
    const apiKeyName = "Test Inactive API Key";
    const apiKeyValue = `sk-${nanoid(32)}`;

    const newApiKey = await prisma.apiKey.create({
      data: {
        name: apiKeyName,
        key: apiKeyValue,
        userId: userId,
        isActive: false, // Explicitly set to false
      },
      select: {
        id: true,
        name: true,
        key: true,
        userId: true,
        isActive: true,
      },
    });

    // Assertions
    expect(newApiKey).toBeDefined();
    expect(newApiKey.name).toBe(apiKeyName);
    expect(newApiKey.key).toBe(apiKeyValue);
    expect(newApiKey.userId).toBe(userId);
    expect(newApiKey.isActive).toBe(false);
  });

  it("should enforce unique constraint on API key value", async () => {
    const apiKeyName = "Duplicate Test Key";
    const apiKeyValue = `sk-${nanoid(32)}`;

    // Create the first API key
    await prisma.apiKey.create({
      data: {
        name: apiKeyName,
        key: apiKeyValue,
        userId: userId,
        isActive: true,
      },
    });

    // Attempt to create another API key with the same value (should fail)
    try {
      await prisma.apiKey.create({
        data: {
          name: `${apiKeyName} 2`,
          key: apiKeyValue, // Same key value
          userId: userId,
          isActive: true,
        },
      });
      // If we reach this line, the test should fail
      expect(true).toBe(false);
    } catch (error) {
      // Expect the error to be related to unique constraint violation
      expect(error).toBeDefined();
    }
  });

  it("should link the API key to the correct user", async () => {
    const apiKeyName = "User Link Test";
    const apiKeyValue = `sk-${nanoid(32)}`;

    const newApiKey = await prisma.apiKey.create({
      data: {
        name: apiKeyName,
        key: apiKeyValue,
        userId: userId,
        isActive: true,
      },
      include: {
        user: true,
      },
    });

    // Assertions
    expect(newApiKey).toBeDefined();
    expect(newApiKey.user).toBeDefined();
    expect(newApiKey.user.id).toBe(userId);
    expect(newApiKey.userId).toBe(userId);
  });
});