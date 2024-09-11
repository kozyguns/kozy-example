"use client";
import React from "react";
import Link from "next/link";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import {
  AdminReviewAuditsCard,
  DrosGuidanceCard,
  AdminSubmitAuditsCard,
  AdminTimeOffReviewCard,
  TimeOffRequestCard,
  WaiverCard,
  OrderCard,
  DepositsCard,
  WaiverReviewCard,
  AdminWaiverReviewCard,
  RangeWalkCard,
  RangeRepairCard,
  AdminSOPCard,
  PointsCard,
} from "@/components/LandingCards";
import { Separator } from "./ui/separator";
import { useRole } from "../context/RoleContext";
import { Button } from "./ui/button";

const words = "Admin Dashboard";
const subwords = "Let's Get On It!";

const LandingPageAdmin: React.FC = React.memo(() => {
  const { role } = useRole();

  if (role !== "admin") {
    return (
      <div>
        <h1>You must be signed in to view this page.</h1>
        <Link href="/sign-in">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="w-full py-12 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              <TextGenerateEffect words={words} />
            </h1>
            <h2 className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
              <TextGenerateEffect words={subwords} />
            </h2>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-6">
        <div className="container px-4 md:px-6">
          <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2 md:grid-cols-2">
            <div className="col-span-full flex justify-center"></div>
            <div className="col-span-full flex justify-center"></div>
            <div className="col-span-full flex justify-center">
            <DrosGuidanceCard />
            </div>
            <PointsCard />
            <AdminSOPCard />
            <Separator />
            <Separator />
            <RangeWalkCard />
            <RangeRepairCard />
            <Separator />
            <Separator />
            <AdminWaiverReviewCard />
            <DepositsCard />
            <Separator />
            <Separator />
            <AdminSubmitAuditsCard />
            <AdminReviewAuditsCard />
            <TimeOffRequestCard />
            <AdminTimeOffReviewCard />
            <Separator />
            <Separator />
            <WaiverCard />
            <OrderCard />
            <div className="col-span-full flex justify-center"></div>
          </div>
        </div>
      </section>
    </>
  );
});

LandingPageAdmin.displayName = "LandingPageAdmin";

export default LandingPageAdmin;
