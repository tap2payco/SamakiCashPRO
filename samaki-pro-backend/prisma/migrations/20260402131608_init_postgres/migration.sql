-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('FARMER', 'VENDOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('AVAILABLE', 'SOLD', 'PENDING');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'ESCROW_FUNDED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'REFUNDED');

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'FARMER',
    "phone" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listings" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "imageUrl" TEXT,
    "status" "ListingStatus" NOT NULL DEFAULT 'AVAILABLE',
    "sellerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "escrowId" TEXT,
    "transactionId" TEXT,
    "paymentProvider" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escrows" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "transactionId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'AWAITING_PAYMENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "escrows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "length" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "depth" DOUBLE PRECISION,
    "capacity" INTEGER,
    "location" TEXT,
    "farmerId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batches" (
    "id" TEXT NOT NULL,
    "cageId" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "currentQuantity" INTEGER,
    "stockingDate" TIMESTAMP(3) NOT NULL,
    "estimatedHarvestDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sensor_readings" (
    "id" TEXT NOT NULL,
    "cageId" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION,
    "ph" DOUBLE PRECISION,
    "dissolvedOxygen" DOUBLE PRECISION,
    "turbidity" DOUBLE PRECISION,
    "ammonia" DOUBLE PRECISION,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sensor_readings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_scores" (
    "id" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "loanLimit" DECIMAL(12,2) NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "history" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credit_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insurance_policies" (
    "id" TEXT NOT NULL,
    "cageId" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "premiumAmount" DECIMAL(10,2) NOT NULL,
    "coverageLimit" DECIMAL(12,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "triggerData" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "insurance_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "export_passports" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "hashData" TEXT NOT NULL,
    "waterQuality" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "export_passports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carbon_credits" (
    "id" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "tokensEarned" DECIMAL(10,4) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carbon_credits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cold_chain_assets" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "assetType" TEXT NOT NULL,
    "totalCost" DECIMAL(10,2) NOT NULL,
    "amountPaid" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'LEASING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cold_chain_assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "escrows_orderId_key" ON "escrows"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "credit_scores_farmerId_key" ON "credit_scores"("farmerId");

-- CreateIndex
CREATE UNIQUE INDEX "insurance_policies_cageId_key" ON "insurance_policies"("cageId");

-- CreateIndex
CREATE UNIQUE INDEX "export_passports_batchId_key" ON "export_passports"("batchId");

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cages" ADD CONSTRAINT "cages_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batches" ADD CONSTRAINT "batches_cageId_fkey" FOREIGN KEY ("cageId") REFERENCES "cages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sensor_readings" ADD CONSTRAINT "sensor_readings_cageId_fkey" FOREIGN KEY ("cageId") REFERENCES "cages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_scores" ADD CONSTRAINT "credit_scores_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insurance_policies" ADD CONSTRAINT "insurance_policies_cageId_fkey" FOREIGN KEY ("cageId") REFERENCES "cages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insurance_policies" ADD CONSTRAINT "insurance_policies_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "export_passports" ADD CONSTRAINT "export_passports_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "export_passports" ADD CONSTRAINT "export_passports_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carbon_credits" ADD CONSTRAINT "carbon_credits_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carbon_credits" ADD CONSTRAINT "carbon_credits_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cold_chain_assets" ADD CONSTRAINT "cold_chain_assets_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
