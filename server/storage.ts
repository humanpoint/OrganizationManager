import { IStorage } from "./interfaces";
import {
  User, Organization, Customer, ConstructionSite,
  SiteContact, Vendor, Item, Unit,
  InsertUser, InsertOrganization, InsertCustomer,
  InsertConstructionSite, InsertSiteContact, InsertVendor,
  InsertItem, InsertUnit,
  users, organizations, customers, constructionSites,
  siteContacts, vendors, items, units
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  // Organization operations
  async getOrganization(id: number): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).where(eq(organizations.id, id));
    return org;
  }

  async createOrganization(org: InsertOrganization): Promise<Organization> {
    const [newOrg] = await db.insert(organizations).values(org).returning();
    return newOrg;
  }

  async listOrganizations(): Promise<Organization[]> {
    return await db.select().from(organizations);
  }

  // Customer operations
  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }

  async listCustomersByOrg(orgId: number): Promise<Customer[]> {
    return await db
      .select()
      .from(customers)
      .where(eq(customers.organizationId, orgId));
  }

  // Construction site operations
  async createSite(site: InsertConstructionSite): Promise<ConstructionSite> {
    const [newSite] = await db.insert(constructionSites).values(site).returning();
    return newSite;
  }

  async listSitesByCustomer(customerId: number): Promise<ConstructionSite[]> {
    return await db
      .select()
      .from(constructionSites)
      .where(eq(constructionSites.customerId, customerId));
  }

  // Additional implementation for other entities...
}

export const storage = new DatabaseStorage();