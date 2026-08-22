import { z } from "zod";

/**
 * Schema for Admins validation
 */
export const adminSchema = z.object({
  name: z.string().trim().min(1, "Admin name is required."),
  companyName: z.string().trim().optional().or(z.literal("")),
  phone: z.string().trim()
    .min(1, "Phone number is required.")
    .regex(/^\d{11}$/, "Phone number must be exactly 11 digits."),
  email: z.string().trim()
    .min(1, "Email is required.")
    .email("Invalid email address format."),
  password: z.string().optional().or(z.literal("")),
  isEdit: z.boolean().default(false),
}).superRefine((data, ctx) => {
  if (!data.isEdit) {
    if (!data.password || data.password.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Password is required for new admins.",
      });
    } else if (data.password.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Password must be at least 8 characters.",
      });
    }
  }
});

/**
 * Schema for Admin Users validation
 */
export const adminUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  email: z.string().trim()
    .min(1, "Email is required.")
    .email("Invalid email address format."),
  phone: z.string().trim().optional().or(z.literal("")),
  password: z.string().optional().or(z.literal("")),
  isEdit: z.boolean().default(false),
}).superRefine((data, ctx) => {
  if (!data.isEdit) {
    if (!data.password || data.password.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Password is required for new users.",
      });
    } else if (data.password.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Password must be at least 6 characters.",
      });
    }
  } else {
    if (data.password && data.password.trim() !== "" && data.password.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Password must be at least 6 characters.",
      });
    }
  }
});

export const vendorSchema = adminSchema;
export const vendorUserSchema = adminUserSchema;

