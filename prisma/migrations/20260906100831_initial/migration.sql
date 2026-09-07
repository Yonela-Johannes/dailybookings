-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'BUSINESS_OWNER', 'PLATFORM_ADMIN');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "MediaEntityType" AS ENUM ('VENUE', 'EMPLOYEE', 'PORTFOLIO', 'BLOG');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'FAILED');

-- CreateEnum
CREATE TYPE "VenueStatus" AS ENUM ('DRAFT', 'ACTIVE', 'SUSPENDED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "taxId" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Venue" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT,
    "description" TEXT,
    "categoryId" TEXT NOT NULL,
    "status" "VenueStatus" NOT NULL DEFAULT 'DRAFT',
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueAddress" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "suburb" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'South Africa',
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,

    CONSTRAINT "VenueAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueContact" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "instagram" TEXT,
    "facebook" TEXT,

    CONSTRAINT "VenueContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingConfig" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "instantConfirmation" BOOLEAN NOT NULL DEFAULT true,
    "acceptsOnlinePayments" BOOLEAN NOT NULL DEFAULT false,
    "requiresDeposit" BOOLEAN NOT NULL DEFAULT false,
    "depositPercentage" INTEGER NOT NULL DEFAULT 0,
    "cancellationPolicy" TEXT,
    "minimumNoticeMinutes" INTEGER NOT NULL DEFAULT 60,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookingConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceCategory" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "serviceCategoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "durationMinutes" INTEGER NOT NULL,
    "bufferMinutes" INTEGER NOT NULL DEFAULT 0,
    "price" DECIMAL(10,2) NOT NULL,
    "priceIsFrom" BOOLEAN NOT NULL DEFAULT false,
    "popular" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "bio" TEXT,
    "imageUrl" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueSchedule" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "opens" TEXT,
    "closes" TEXT,
    "closed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "VenueSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeSchedule" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "isWorking" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EmployeeSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeAvailability" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EmployeeAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeOff" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,

    CONSTRAINT "TimeOff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "durationTotal" INTEGER NOT NULL,
    "priceTotal" DECIMAL(10,2) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingService" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "employeeId" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "employeeId" TEXT,
    "rating" INTEGER NOT NULL,
    "body" TEXT,
    "serviceName" TEXT,
    "employeeName" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "employeeId" TEXT,
    "portfolioId" TEXT,
    "blogId" TEXT,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "type" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "entityType" "MediaEntityType" NOT NULL,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "BlogCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blog" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "featuredImage" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ZAR',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "provider" TEXT,
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payout" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discount" DECIMAL(10,2) NOT NULL,
    "isPercentage" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EmployeeServices" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EmployeeServices_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE INDEX "Business_ownerId_idx" ON "Business"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Venue_slug_key" ON "Venue"("slug");

-- CreateIndex
CREATE INDEX "Venue_businessId_idx" ON "Venue"("businessId");

-- CreateIndex
CREATE INDEX "Venue_categoryId_idx" ON "Venue"("categoryId");

-- CreateIndex
CREATE INDEX "Venue_status_idx" ON "Venue"("status");

-- CreateIndex
CREATE UNIQUE INDEX "VenueAddress_venueId_key" ON "VenueAddress"("venueId");

-- CreateIndex
CREATE UNIQUE INDEX "VenueContact_venueId_key" ON "VenueContact"("venueId");

-- CreateIndex
CREATE UNIQUE INDEX "BookingConfig_venueId_key" ON "BookingConfig"("venueId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "ServiceCategory_venueId_idx" ON "ServiceCategory"("venueId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategory_venueId_name_key" ON "ServiceCategory"("venueId", "name");

-- CreateIndex
CREATE INDEX "Service_serviceCategoryId_idx" ON "Service"("serviceCategoryId");

-- CreateIndex
CREATE INDEX "Employee_venueId_idx" ON "Employee"("venueId");

-- CreateIndex
CREATE UNIQUE INDEX "VenueSchedule_venueId_day_key" ON "VenueSchedule"("venueId", "day");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeSchedule_employeeId_day_key" ON "EmployeeSchedule"("employeeId", "day");

-- CreateIndex
CREATE INDEX "EmployeeAvailability_employeeId_date_idx" ON "EmployeeAvailability"("employeeId", "date");

-- CreateIndex
CREATE INDEX "TimeOff_employeeId_startDate_endDate_idx" ON "TimeOff"("employeeId", "startDate", "endDate");

-- CreateIndex
CREATE INDEX "Booking_userId_idx" ON "Booking"("userId");

-- CreateIndex
CREATE INDEX "Booking_venueId_idx" ON "Booking"("venueId");

-- CreateIndex
CREATE INDEX "Booking_venueId_date_idx" ON "Booking"("venueId", "date");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "BookingService_bookingId_idx" ON "BookingService"("bookingId");

-- CreateIndex
CREATE INDEX "BookingService_serviceId_idx" ON "BookingService"("serviceId");

-- CreateIndex
CREATE INDEX "BookingService_employeeId_idx" ON "BookingService"("employeeId");

-- CreateIndex
CREATE INDEX "Review_venueId_idx" ON "Review"("venueId");

-- CreateIndex
CREATE INDEX "Review_employeeId_idx" ON "Review"("employeeId");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "Review"("userId");

-- CreateIndex
CREATE INDEX "Media_venueId_idx" ON "Media"("venueId");

-- CreateIndex
CREATE INDEX "Media_employeeId_idx" ON "Media"("employeeId");

-- CreateIndex
CREATE INDEX "Media_portfolioId_idx" ON "Media"("portfolioId");

-- CreateIndex
CREATE INDEX "Media_blogId_idx" ON "Media"("blogId");

-- CreateIndex
CREATE INDEX "Portfolio_venueId_idx" ON "Portfolio"("venueId");

-- CreateIndex
CREATE INDEX "Favorite_venueId_idx" ON "Favorite"("venueId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_venueId_key" ON "Favorite"("userId", "venueId");

-- CreateIndex
CREATE INDEX "Notification_userId_read_idx" ON "Notification"("userId", "read");

-- CreateIndex
CREATE UNIQUE INDEX "BlogCategory_name_key" ON "BlogCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BlogCategory_slug_key" ON "BlogCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Blog_slug_key" ON "Blog"("slug");

-- CreateIndex
CREATE INDEX "Blog_categoryId_idx" ON "Blog"("categoryId");

-- CreateIndex
CREATE INDEX "Blog_published_idx" ON "Blog"("published");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_bookingId_key" ON "Payment"("bookingId");

-- CreateIndex
CREATE INDEX "Payout_businessId_idx" ON "Payout"("businessId");

-- CreateIndex
CREATE INDEX "Payout_status_idx" ON "Payout"("status");

-- CreateIndex
CREATE INDEX "Coupon_venueId_active_idx" ON "Coupon"("venueId", "active");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_venueId_code_key" ON "Coupon"("venueId", "code");

-- CreateIndex
CREATE INDEX "_EmployeeServices_B_index" ON "_EmployeeServices"("B");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venue" ADD CONSTRAINT "Venue_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venue" ADD CONSTRAINT "Venue_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueAddress" ADD CONSTRAINT "VenueAddress_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueContact" ADD CONSTRAINT "VenueContact_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingConfig" ADD CONSTRAINT "BookingConfig_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceCategory" ADD CONSTRAINT "ServiceCategory_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_serviceCategoryId_fkey" FOREIGN KEY ("serviceCategoryId") REFERENCES "ServiceCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueSchedule" ADD CONSTRAINT "VenueSchedule_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeSchedule" ADD CONSTRAINT "EmployeeSchedule_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeAvailability" ADD CONSTRAINT "EmployeeAvailability_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeOff" ADD CONSTRAINT "TimeOff_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingService" ADD CONSTRAINT "BookingService_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingService" ADD CONSTRAINT "BookingService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingService" ADD CONSTRAINT "BookingService_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BlogCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeServices" ADD CONSTRAINT "_EmployeeServices_A_fkey" FOREIGN KEY ("A") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeServices" ADD CONSTRAINT "_EmployeeServices_B_fkey" FOREIGN KEY ("B") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
