import { Hex, keccak256, toHex } from "viem";

const TEACHER = keccak256(toHex("TEACHER_ROLE"));
const STUDENT = keccak256(toHex("STUDENT_ROLE"));
const ADMIN = keccak256(toHex("ADMIN_ROLE"));

const ROLES = {
  [TEACHER]: "teacher",
  [STUDENT]: "student",
  [ADMIN]: "admin",
} as const;
export type RolesType = (typeof ROLES)[keyof typeof ROLES];

export const getRole = (bytes: Hex) => ROLES[bytes] ?? null;
