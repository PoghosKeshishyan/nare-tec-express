-- CreateTable
CREATE TABLE "Header" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "logo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Parent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Child" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number_of_hours" INTEGER NOT NULL,
    "cost_for_per_hour" TEXT NOT NULL,
    "cost_for_extended_minutes" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enrollment" TEXT NOT NULL,
    "discharge" TEXT NOT NULL,
    "birth" TEXT NOT NULL,
    "parent_id" TEXT,
    CONSTRAINT "Child_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Parent" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Month" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "month" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Year" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "year" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Story" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" TEXT NOT NULL,
    "parent_id" TEXT,
    "payment_date" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    CONSTRAINT "Story_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Parent" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Week" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "week" INTEGER NOT NULL,
    "month" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "parent_id" TEXT,
    "child_id" TEXT,
    "dates" TEXT NOT NULL,
    "total_time_in_week" TEXT NOT NULL,
    "total_days" INTEGER NOT NULL,
    CONSTRAINT "Week_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Parent" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Week_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "Child" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Day" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "arrived" TEXT,
    "isGone" TEXT,
    "completed" BOOLEAN NOT NULL,
    "week_id" TEXT NOT NULL,
    CONSTRAINT "Day_week_id_fkey" FOREIGN KEY ("week_id") REFERENCES "Week" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
