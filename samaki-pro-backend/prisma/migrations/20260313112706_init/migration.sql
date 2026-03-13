-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "fullName" TEXT,
    "role" TEXT NOT NULL DEFAULT 'FARMER',
    "phone" TEXT,
    "location" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "listings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "imageUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "sellerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "listings_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "profiles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "buyerId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL NOT NULL,
    "totalAmount" DECIMAL NOT NULL,
    "escrowId" TEXT,
    "transactionId" TEXT,
    "paymentProvider" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "orders_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "profiles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "orders_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "profiles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "orders_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "escrows" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "transactionId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'AWAITING_PAYMENT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "cages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "length" REAL,
    "width" REAL,
    "depth" REAL,
    "capacity" INTEGER,
    "location" TEXT,
    "farmerId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cages_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "profiles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "batches" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cageId" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "currentQuantity" INTEGER,
    "stockingDate" DATETIME NOT NULL,
    "estimatedHarvestDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "batches_cageId_fkey" FOREIGN KEY ("cageId") REFERENCES "cages" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sensor_readings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cageId" TEXT NOT NULL,
    "temperature" REAL,
    "ph" REAL,
    "dissolvedOxygen" REAL,
    "turbidity" REAL,
    "ammonia" REAL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sensor_readings_cageId_fkey" FOREIGN KEY ("cageId") REFERENCES "cages" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "escrows_orderId_key" ON "escrows"("orderId");
