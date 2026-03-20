import { NextFunction, Request, Response } from "express";
import sendResponse from "../../global/response";
import { StatusCodes } from "http-status-codes";
import { Claim } from "@prisma/client";
import { claimsService } from "./claim.service";

// CREATE CLAIM
const createClaim = async (req: Request, res: Response) => {
  try {
    const item: Claim = req.body;
    const result = await claimsService.createClaim(item, req.user);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Claim created successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: error?.message,
      data: null,
    });
  }
};

// GET ALL CLAIMS
const getClaim = async (req: Request, res: Response) => {
  try {
    const result = await claimsService.getClaim();

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Claims retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: error?.message,
      data: null,
    });
  }
};

// ✅ GET SINGLE CLAIM (IMPORTANT FIX)
const getSingleClaim = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await claimsService.getSingleClaim(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Claim retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: error?.message,
      data: null,
    });
  }
};

// GET MY CLAIMS
const getMyClaim = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const result = await claimsService.getMyClaim(user);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "My claims retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: error?.message,
      data: null,
    });
  }
};

// UPDATE STATUS
const updateClaimStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await claimsService.updateClaimStatus(
      req.params.claimId,
      req.body
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Claim updated successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const claimsController = {
  createClaim,
  getClaim,
  getSingleClaim, // ✅ added
  getMyClaim,
  updateClaimStatus,
};