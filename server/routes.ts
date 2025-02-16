import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertOrgSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Organizations
  app.post("/api/organizations", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "superadmin") {
      return res.sendStatus(403);
    }
    
    const parseResult = insertOrgSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json(parseResult.error);
    }

    const org = await storage.createOrganization(parseResult.data);
    res.status(201).json(org);
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

  // Additional routes would be implemented for:
  // - Vendor management
  // - Item/inventory management
  // - Unit management 
  // - Quotation system
  // Each would include proper auth checks and data isolation

  const httpServer = createServer(app);
  return httpServer;
}
