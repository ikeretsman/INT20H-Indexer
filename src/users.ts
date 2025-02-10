import { ponder } from "ponder:registry";
import { user as tUser } from "../ponder.schema";
import { getRole } from "./types/roles";

ponder.on("UsersRegistry:UserCreated", async ({ context, event }) => {
  const { db } = context;
  const {
    args: { info, role: bytesRole, user },
  } = event;

  const role = getRole(bytesRole);
  if (!role) return;

  await db.insert(tUser).values({ ...info, role, address: user });
});
