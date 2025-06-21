-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "instructor" TEXT,
    "teacherId" TEXT,
    "duration" TEXT,
    "level" TEXT DEFAULT 'beginner',
    "category" TEXT,
    "language" TEXT DEFAULT 'fr',
    "audioUrl" TEXT,
    "videoUrl" TEXT,
    "downloadUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Course_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Course" ("audioUrl", "category", "createdAt", "description", "downloadUrl", "duration", "id", "instructor", "language", "level", "slug", "teacherId", "title", "updatedAt", "videoUrl") SELECT "audioUrl", "category", "createdAt", "description", "downloadUrl", "duration", "id", "instructor", "language", "level", "slug", "teacherId", "title", "updatedAt", "videoUrl" FROM "Course";
DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
