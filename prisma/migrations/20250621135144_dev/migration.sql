/*
  Warnings:

  - A unique constraint covering the columns `[userId,courseId]` on the table `Certificate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,questionId]` on the table `CommunityLike` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,answerId]` on the table `CommunityLike` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,courseId]` on the table `UserCourse` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,courseId]` on the table `UserFavorite` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Quiz" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Quiz_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "quizId" TEXT,
    "lessonId" TEXT,
    "options" JSONB NOT NULL,
    "explanation" TEXT,
    CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Question_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_courseId_key" ON "Quiz"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_userId_courseId_key" ON "Certificate"("userId", "courseId");

-- CreateIndex
CREATE INDEX "CommunityAnswer_questionId_idx" ON "CommunityAnswer"("questionId");

-- CreateIndex
CREATE INDEX "CommunityAnswer_userId_idx" ON "CommunityAnswer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityLike_userId_questionId_key" ON "CommunityLike"("userId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityLike_userId_answerId_key" ON "CommunityLike"("userId", "answerId");

-- CreateIndex
CREATE INDEX "CommunityQuestion_userId_idx" ON "CommunityQuestion"("userId");

-- CreateIndex
CREATE INDEX "CourseFeedback_userId_courseId_idx" ON "CourseFeedback"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCourse_userId_courseId_key" ON "UserCourse"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFavorite_userId_courseId_key" ON "UserFavorite"("userId", "courseId");
