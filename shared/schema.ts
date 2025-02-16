import { pgTable, text, serial, integer, boolean, json, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Organizations
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  primaryContactName: text("primary_contact_name").notNull(),
  primaryContactNumber: text("primary_contact_number").notNull(),
  designation: text("designation").notNull(),
  primaryEmail: text("primary_email").notNull(),
  primaryPhone: text("primary_phone").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Users with extended fields
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(),  // superadmin, admin, manager, employee
  designation: text("designation"),
  contactNumber: text("contact_number"),
  organizationId: integer("organization_id").references(() => organizations.id),
  department: text("department"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Customers
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizations.id),
  name: text("name").notNull(),
  address: text("address").notNull(),
  primaryContactName: text("primary_contact_name").notNull(),
  primaryContactNumber: text("primary_contact_number").notNull(),
  designation: text("designation").notNull(),
  primaryEmail: text("primary_email").notNull(),
  primaryPhone: text("primary_phone").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Construction Sites
export const constructionSites = pgTable("construction_sites", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => customers.id),
  siteName: text("site_name").notNull(),
  streetName: text("street_name").notNull(),
  area: text("area").notNull(),
  city: text("city").notNull(),
  mapLocation: json("map_location"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Site Contact Persons
export const siteContacts = pgTable("site_contacts", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id").notNull().references(() => constructionSites.id),
  name: text("name").notNull(),
  number: text("number").notNull(),
  designation: text("designation").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Vendors
export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizations.id),
  name: text("name").notNull(),
  address: text("address").notNull(),
  primaryContactName: text("primary_contact_name").notNull(),
  primaryContactNumber: text("primary_contact_number").notNull(),
  designation: text("designation").notNull(),
  primaryEmail: text("primary_email").notNull(),
  primaryPhone: text("primary_phone").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Units
export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizations.id),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Items (Goods)
export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizations.id),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'good' or 'service'
  unitId: integer("unit_id").references(() => units.id),
  purchasePrice: integer("purchase_price"),
  salePrice: integer("sale_price"),
  associatedGoods: json("associated_goods"), // For services, array of good IDs
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema types
export const insertUserSchema = createInsertSchema(users);
export const insertOrgSchema = createInsertSchema(organizations);
export const insertCustomerSchema = createInsertSchema(customers);
export const insertSiteSchema = createInsertSchema(constructionSites);
export const insertContactSchema = createInsertSchema(siteContacts);
export const insertVendorSchema = createInsertSchema(vendors);
export const insertItemSchema = createInsertSchema(items);
export const insertUnitSchema = createInsertSchema(units);

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = z.infer<typeof insertOrgSchema>;
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type ConstructionSite = typeof constructionSites.$inferSelect;
export type InsertConstructionSite = z.infer<typeof insertSiteSchema>;
export type SiteContact = typeof siteContacts.$inferSelect;
export type InsertSiteContact = z.infer<typeof insertContactSchema>;
export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type Item = typeof items.$inferSelect;
export type InsertItem = z.infer<typeof insertItemSchema>;
export type Unit = typeof units.$inferSelect;
export type InsertUnit = z.infer<typeof insertUnitSchema>;
