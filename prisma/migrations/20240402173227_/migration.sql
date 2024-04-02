-- CreateTable
CREATE TABLE "pago" (
    "id" SERIAL NOT NULL,
    "request_user" INTEGER NOT NULL,
    "desing_id" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "checkout_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pago_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pago" ADD CONSTRAINT "pago_desing_id_fkey" FOREIGN KEY ("desing_id") REFERENCES "designRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pago" ADD CONSTRAINT "pago_request_user_fkey" FOREIGN KEY ("request_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
