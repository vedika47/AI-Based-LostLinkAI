import { Claim } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../config/prisma";

const createClaim = async (item: Claim, user: JwtPayload) => {
  const result = await prisma.claim.create({
    data: {
      foundItemId: item.foundItemId,
      distinguishingFeatures: item.distinguishingFeatures,
      lostDate: item.lostDate,
      userId: user.id,
    },
  });
  return result;
};

const getClaim = async () => {
  return prisma.claim.findMany({
    where: {
      isDeleted: false,
      foundItem: {
        isDeleted: false,
      },
    },
    include: {
      foundItem: {
        include: {
          category: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      },
    },
  });
};

const getMyClaim = async (user: JwtPayload) => {
  return prisma.claim.findMany({
    where: {
      userId: user.id,
      foundItem: {
        isDeleted: false,
      },
    },
    include: {
      foundItem: {
        include: {
          category: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });
};


// ✅ ADD THIS FUNCTION (IMPORTANT)
const getSingleClaim = async (id: string) => {
  const result = await prisma.claim.findFirst({
    where: {
      id,
      isDeleted: false,
      foundItem: {
        isDeleted: false,
      },
    },
    include: {
      foundItem: {
        include: {
          category: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });

  if (!result) {
    throw new Error("Claim not found");
  }

  return result;
};


const updateClaimStatus = async (claimId: string, data: Partial<Claim>) => {
  return prisma.claim.update({
    where: {
      id: claimId,
    },
    data,
  });
};

export const claimsService = {
  createClaim,
  getClaim,
  getMyClaim,
  getSingleClaim, // ✅ ADD THIS
  updateClaimStatus,
};