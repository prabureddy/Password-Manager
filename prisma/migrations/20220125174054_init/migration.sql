-- CreateTable
CREATE TABLE "Manager" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "site" VARCHAR(200) NOT NULL,
    "username" VARCHAR(40) NOT NULL,
    "password" VARCHAR(40) NOT NULL,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("id")
);
