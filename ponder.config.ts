import { createConfig } from "ponder";
import { type Address, http } from "viem";
import * as chains from "viem/chains";
import { PROJECTS_REGISTRY_ABI } from "./abis/projects-registry";
import { USERS_REGISTRY_ABI } from "./abis/users-registry";
import { ASSIGNMENTS_REGISTRY_ABI } from "./abis/assignments-registry";

export default createConfig({
  networks: {
    chain: {
      chainId: chains[process.env.CHAIN as keyof typeof chains].id,
      transport: http(process.env.RPC_URL),
    },
  },
  contracts: {
    ProjectsRegistry: {
      network: "chain",
      abi: PROJECTS_REGISTRY_ABI,
      address: process.env.PROJECT_REGISTRY_ADDRESS as Address,
      startBlock: Number(process.env.START_BLOCK),
    },
    UsersRegistry: {
      network: "chain",
      abi: USERS_REGISTRY_ABI,
      address: process.env.USERS_REGISTRY_ADDRESS as Address,
      startBlock: Number(process.env.START_BLOCK),
    },
    AssignmentsRegistry: {
      network: "chain",
      abi: ASSIGNMENTS_REGISTRY_ABI,
      address: process.env.ASSIGNMENTS_REGISTRY_ADDRESS as Address,
      startBlock: Number(process.env.START_BLOCK),
    },
  },
});
