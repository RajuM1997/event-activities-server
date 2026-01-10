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

export const UserValidation = {
  createUserValidationSchema,
  createHostValidationSchema,
};
