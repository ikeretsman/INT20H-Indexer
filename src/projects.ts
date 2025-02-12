import { ponder } from "ponder:registry";
import {
  project as tProject,
  userProject as tUserProject,
} from "../ponder.schema";

ponder.on("ProjectsRegistry:ProjectCreated", async ({ context, event }) => {
  const { db } = context;
  const {
    args: { project, projectId },
  } = event;

  const { students, teachers } = project;

  await db.insert(tProject).values({
    ...project,
    id: projectId,
    createdAt: project.createdAt * 1_000n,
    expiresAt: project.expiresAt * 1_000n,
  });

  const userProjectPromises = [...students, ...teachers].map((address) =>
    db.insert(tUserProject).values({
      user: address,
      projectId,
    })
  );

  await Promise.all(userProjectPromises);
});
