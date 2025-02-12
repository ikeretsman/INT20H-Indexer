import {
  index,
  onchainTable,
  primaryKey,
  relations,
  uniqueIndex,
} from "ponder";

export const user = onchainTable(
  "users",
  (t) => ({
    address: t.hex().primaryKey(),
    role: t.text().notNull(),
    name: t.text().notNull(),
    email: t.text().notNull(),
  }),
  (table) => ({
    roleIndex: index("role_index").on(table.role),
    emailIndex: index("email_index").on(table.email),
  })
);

export const userRelations = relations(user, ({ many }) => ({
  projects: many(project),
  assignment: many(assignment),
  grades: many(grades),
}));

export const project = onchainTable(
  "project",
  (t) => ({
    id: t.bigint().primaryKey(),
    name: t.text().notNull(),
    description: t.text().notNull(),
    creator: t.hex().notNull(),
    createdAt: t.bigint("created_at").notNull(),
    expiresAt: t.bigint("expires_at").notNull(),
    maxAssignments: t.bigint("max_assignemnts").notNull(),
    token: t.hex().notNull(),
    reward: t.bigint().notNull(),
  }),
  (table) => ({
    creatorIndex: index("creator_index").on(table.creator),
    tokenIndex: index("token_index").on(table.token),
  })
);

export const projectRelations = relations(project, ({ one, many }) => ({
  creator: one(user, { fields: [project.creator], references: [user.address] }),
  assignments: many(assignment),
  userProjectRelation: many(userProject),
}));

export const userProject = onchainTable(
  "user_project",
  (t) => ({
    user: t.hex().notNull(),
    projectId: t.bigint("project_id").notNull(),
  }),
  (table) => ({ pk: primaryKey({ columns: [table.user, table.projectId] }) })
);

export const userProjectRelations = relations(userProject, ({ one }) => ({
  user: one(user, { fields: [userProject.user], references: [user.address] }),
  project: one(project, {
    fields: [userProject.projectId],
    references: [project.id],
  }),
}));

export const assignment = onchainTable(
  "assignments",
  (t) => ({
    id: t.uuid().primaryKey(),
    student: t.hex().notNull(),
    projectId: t.bigint("project_id").notNull(),
    data: t.text().notNull(),
    gradesCount: t.bigint().notNull(),
    status: t.text().notNull(),
  }),
  (table) => ({
    studentProjectUniqueConstraint: uniqueIndex(
      "students_project_unique_constraint"
    ).on(table.student, table.projectId),
  })
);

export const assignmentRelations = relations(assignment, ({ one, many }) => ({
  user: one(user, { fields: [assignment.student], references: [user.address] }),
  project: one(project, {
    fields: [assignment.projectId],
    references: [project.id],
  }),
  grades: many(grades),
}));

export const grades = onchainTable(
  "grades",
  (t) => ({
    assignmentId: t.uuid().notNull(),
    teacher: t.hex().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.assignmentId, table.teacher] }),
  })
);

export const gradesRelations = relations(grades, ({ one }) => ({
  assignment: one(assignment, {
    fields: [grades.assignmentId],
    references: [assignment.id],
  }),
  teacher: one(user, {
    fields: [grades.teacher],
    references: [user.address],
  }),
}));
