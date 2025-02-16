import { User, Organization, Customer, ConstructionSite } from "@shared/schema";
import { type Store } from "express-session";

export interface IStorage {
  sessionStore: Store;

  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: any): Promise<User>;

  // Organization operations
  getOrganization(id: number): Promise<Organization | undefined>;
  createOrganization(org: any): Promise<Organization>;
  listOrganizations(): Promise<Organization[]>;

  // Customer operations
  createCustomer(customer: any): Promise<Customer>;
  listCustomersByOrg(orgId: number): Promise<Customer[]>;

  // Construction site operations
  createSite(site: any): Promise<ConstructionSite>;
  listSitesByCustomer(customerId: number): Promise<ConstructionSite[]>;
}