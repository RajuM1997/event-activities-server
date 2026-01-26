import { Interests, UserStatus } from "@prisma/client";
import z from "zod";

const createUserValidationSchema = z.object({
  password: z.string().nonempty("Password is required").min(6).max(20),
  userData: z.object({
    email: z.string().nonempty("Email is required"),
    name: z.string().nonempty("Name is required"),
    bio: z.string().nonempty("Location is required"),
    interests: z.enum([...Object.values(Interests)]).optional(),
  }),
  locationData: z.object({
    city: z.string().nonempty("City is required"),
    area: z.string().nonempty("Area is required"),
    country: z.string().nonempty("Country is required"),
  }),
});

const createHostValidationSchema = z.object({
  password: z.string().nonempty("Password is required").min(6).max(20),
  status: z.enum([...Object.values(UserStatus)]).optional(),
  hostData: z.object({
    email: z.string().nonempty("Email is required"),
    name: z.string().nonempty("Name is required"),
    phoneNumber: z.string().nonempty("Phone number is required"),
    address: z.string().nonempty("Address is required"),
    bio: z.string().nonempty("Bio is required"),
  }),
});

const updateUserValidationSchema = z.object({
  userData: z.object({
    name: z.string().optional(),
    bio: z.string().optional(),
    interests: z.enum([...Object.values(Interests)]).optional(),
  }),
  locationData: z.object({
    city: z.string().optional(),
    area: z.string().optional(),
    country: z.string().optional(),
  }),
});

const updateHostValidationSchema = z.object({
  hostData: z.object({
    name: z.string().optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    bio: z.string().optional(),
  }),
});

export const UserValidation = {
  createUserValidationSchema,
  createHostValidationSchema,
  updateUserValidationSchema,
  updateHostValidationSchema,
};
