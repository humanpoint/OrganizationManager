import { IStorage } from "./interfaces";
import {
  User, Organization, Customer, ConstructionSite,
  SiteContact, Vendor, Item, Unit,
  InsertUser, InsertOrganization, InsertCustomer,
  InsertConstructionSite, InsertSiteContact, InsertVendor,
  InsertItem, InsertUnit
} from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private organizations: Map<number, Organization>;
  private customers: Map<number, Customer>;
  private sites: Map<number, ConstructionSite>;
  private contacts: Map<number, SiteContact>;
  private vendors: Map<number, Vendor>;
  private items: Map<number, Item>;
  private units: Map<number, Unit>;
  
  sessionStore: session.SessionStore;
  private currentId: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.organizations = new Map();
    this.customers = new Map();
    this.sites = new Map();
    this.contacts = new Map();
    this.vendors = new Map();
    this.items = new Map();
    this.units = new Map();
    
    this.currentId = {
      users: 1,
      organizations: 1,
      customers: 1,
      sites: 1,
      contacts: 1,
      vendors: 1,
      items: 1,
      units: 1
    };

    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000
    });

    // Create default superadmin
    this.createUser({
      username: "superadmin",
      password: "password123", // This would be hashed in auth.ts
      email: "super@admin.com",
      role: "superadmin",
      designation: "Super Administrator",
      contactNumber: "",
      organizationId: null,
      department: "Administration"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const newUser = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  // Organization operations  
  async getOrganization(id: number): Promise<Organization | undefined> {
    return this.organizations.get(id);
  }

  async createOrganization(org: InsertOrganization): Promise<Organization> {
    const id = this.currentId.organizations++;
    const newOrg = { ...org, id };
    this.organizations.set(id, newOrg);
    return newOrg;
  }

  async listOrganizations(): Promise<Organization[]> {
    return Array.from(this.organizations.values());
  }

  // Customer operations
  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const id = this.currentId.customers++;
    const newCustomer = { ...customer, id };
    this.customers.set(id, newCustomer);
    return newCustomer;
  }

  async listCustomersByOrg(orgId: number): Promise<Customer[]> {
    return Array.from(this.customers.values())
      .filter(c => c.organizationId === orgId);
  }

  // Construction site operations
  async createSite(site: InsertConstructionSite): Promise<ConstructionSite> {
    const id = this.currentId.sites++;
    const newSite = { ...site, id };
    this.sites.set(id, newSite);
    return newSite;
  }

  async listSitesByCustomer(customerId: number): Promise<ConstructionSite[]> {
    return Array.from(this.sites.values())
      .filter(s => s.customerId === customerId);
  }

  // Similar patterns for other entities...
  // The implementation would continue with CRUD operations for all entities
}

export const storage = new MemStorage();
