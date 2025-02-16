import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertOrgSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { db } from "./db";

// Combined schema for organization and admin creation
const createOrgWithAdminSchema = z.object({
  organization: insertOrgSchema,
  admin: insertUserSchema.extend({
    role: z.literal("admin"),
  }),
});

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Organizations
  app.post("/api/organizations", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "superadmin") {
      return res.sendStatus(403);
    }

    const parseResult = createOrgWithAdminSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json(parseResult.error);
    }

    try {
      const { organization, admin } = parseResult.data;

      // Create organization and admin user in a transaction
      const result = await db.transaction(async (tx) => {
        const [org] = await storage.createOrganization(organization);

        // Create admin user for the organization
        const [adminUser] = await storage.createUser({
          ...admin,
          organizationId: org.id,
        });

        return { org, adminUser };
      });

      res.status(201).json(result);
    } catch (error) {
      console.error("Failed to create organization with admin:", error);
      res.status(500).json({ message: "Failed to create organization with admin" });
    }
  });

  app.get("/api/organizations", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "superadmin") {
      return res.sendStatus(403);
    }

    const orgs = await storage.listOrganizations();
    res.json(orgs);
  });

  // Customers
  app.get("/api/organizations/:orgId/customers", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const orgId = parseInt(req.params.orgId);
    if (req.user.role !== "superadmin" && req.user.organizationId !== orgId) {
      return res.sendStatus(403);
    }

    const customers = await storage.listCustomersByOrg(orgId);
    res.json(customers);
  });

  // Construction Sites
  app.get("/api/customers/:customerId/sites", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const customerId = parseInt(req.params.customerId);
    const customer = await storage.getCustomer(customerId);

    if (!customer || (req.user.role !== "superadmin" && req.user.organizationId !== customer.organizationId)) {
      return res.sendStatus(403);
    }

    const sites = await storage.listSitesByCustomer(customerId);
    res.json(sites);
  });

  const httpServer = createServer(app);
  return httpServer;
}