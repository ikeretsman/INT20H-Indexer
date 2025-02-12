import { ponder } from "ponder:registry";
import { assignment as tAssignment, grades as tGrades } from "../ponder.schema";
import { randomUUID } from "node:crypto";
import { and, eq } from "ponder";

ponder.on(
  "AssignmentsRegistry:AssignmentCreated",
  async ({ context, event }) => {
    const { db } = context;
    const {
      args: { assignment, projectId },
    } = event;

    await db.insert(tAssignment).values({
      ...assignment,
      projectId,
      status: "created",
      id: randomUUID(),
    });
  }
);

ponder.on(
  "AssignmentsRegistry:AssignmentGraded",
  async ({ context, event }) => {
    const { db } = context;
    const {
      args: { teacher, projectId, student },
    } = event;

    const [assignment] = await db.sql
      .select({ id: tAssignment.id })
      .from(tAssignment)
      .where(
        and(
          eq(tAssignment.projectId, projectId),
          eq(tAssignment.student, student)
        )
      );

    if (!assignment) return;

    await db.insert(tGrades).values({ assignmentId: assignment.id, teacher });
    await db.update(tAssignment, { id: assignment.id }).set((row) => ({
      gradesCount: row.gradesCount + 1n,
    }));
  }
);

ponder.on("AssignmentsRegistry:ProjectFinished", async ({ context, event }) => {
  const { db } = context;
  const {
    args: { projectId, student },
  } = event;

  await db.sql
    .update(tAssignment)
    .set({ status: "finished" })
    .where(
      and(
        eq(tAssignment.projectId, projectId),
        eq(tAssignment.student, student)
      )
    );
});
