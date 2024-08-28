"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { RiArrowRightSFill, RiArrowDropLeftFill } from "react-icons/ri";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { SiMinutemailer } from "react-icons/si";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { verifyOtp } from "@/actions/auth";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";

const FormSchema = z
  .object({
    email: z.string().email({ message: "Invalid Email Address" }),
    password: z.string().min(6, { message: "Password is too short" }),
    "confirm-pass": z.string().min(6, { message: "Password is too short" }),
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
  })
  .refine(
    (data) => {
      if (data["confirm-pass"] !== data.password) {
        console.log("running");
        return false;
      } else {
        return true;
      }
    },
    { message: "Password does't match", path: ["confirm-pass"] }
  );

export default function SignUp({ redirectTo }: { redirectTo: string }) {
  const queryString =
    typeof window !== "undefined" ? window.location.search : "";
  const urlParams = new URLSearchParams(queryString);

  const verify = urlParams.get("verify");
  const existEmail = urlParams.get("email");

  const [passwordReveal, setPasswordReveal] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(verify === "true");
  const [verifyStatus, setVerifyStatus] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [isSendAgain, startSendAgain] = useTransition();
  const pathname = usePathname();
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      "confirm-pass": "",
      firstName: "",
      lastName: "",
    },
  });

  const sendVerifyEmail = async (data: z.infer<typeof FormSchema>) => {
    try {
      const json = await postEmail({
        email: data.email,
        password: data.password,
        "confirm-pass": data["confirm-pass"],
        firstName: data.firstName,
        lastName: data.lastName,
      });
      if (json.success) {
        router.replace((pathname || "/") + "?verify=true&email=" + data.email);
        setIsConfirmed(true);
        toast.success(
          json.message || "Please check your email for verification."
        );
      } else {
        throw new Error(json.error || "An error occurred during signup");
      }
    } catch (error: unknown) {
      console.error("Error in sendVerifyEmail:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const postEmail = async (data: z.infer<typeof FormSchema>) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
      const res = await fetch("/api/signup", requestOptions);
      const json = await res.json();
      if (!res.ok) {
        console.error("Signup error:", json);
        throw new Error(json.error || "An error occurred during signup");
      }
      return json;
    } catch (error: unknown) {
      console.error("Error in postEmail:", error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      };
      const res = await fetch("/api/resend-verification", requestOptions);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(
          json.error || "An error occurred while resending verification email"
        );
      }
      return json;
    } catch (error: unknown) {
      console.error("Error in resendVerificationEmail:", error);
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  };

  const inputOptClass = cn({
    " border-green-500": verifyStatus === "success",
    " border-red-500": verifyStatus === "failed",
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!isPending) {
      startTransition(async () => {
        try {
          await sendVerifyEmail(data);
        } catch (error: unknown) {
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("An unexpected error occurred");
          }
        }
      });
    }
  }

  return (
    <div
      className={` whitespace-nowrap p-5 space-x-5 overflow-hidden  items-center align-top   ${
        isPending ? "animate-pulse" : ""
      }`}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            `space-y-3 inline-block w-full transform transition-all`,
            {
              "-translate-x-[110%]": isConfirmed,
            }
          )}
        >
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  First Name
                </FormLabel>
                <FormControl>
                  <Input className="h-8" type="text" {...field} />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Last Name
                </FormLabel>
                <FormControl>
                  <Input className="h-8" type="text" {...field} />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className=" font-semibold  test-sm">
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    className="h-8"
                    placeholder="example@gmail.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Password
                </FormLabel>
                <FormControl>
                  <div className=" relative">
                    <Input
                      className="h-8"
                      type={passwordReveal ? "text" : "password"}
                      {...field}
                    />
                    <div
                      className="absolute right-2 top-[30%] cursor-pointer group"
                      onClick={() => setPasswordReveal(!passwordReveal)}
                    >
                      {passwordReveal ? (
                        <FaRegEye className=" group-hover:scale-105 transition-all" />
                      ) : (
                        <FaRegEyeSlash className=" group-hover:scale-105 transition-all" />
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm-pass"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <div className=" relative">
                    <Input
                      className="h-8"
                      type={passwordReveal ? "text" : "password"}
                      {...field}
                    />
                    <div
                      className="absolute right-2 top-[30%] cursor-pointer group"
                      onClick={() => setPasswordReveal(!passwordReveal)}
                    >
                      {passwordReveal ? (
                        <FaRegEye className=" group-hover:scale-105 transition-all" />
                      ) : (
                        <FaRegEyeSlash className=" group-hover:scale-105 transition-all" />
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-8 bg-indigo-500 hover:bg-indigo-600 transition-all text-white flex items-center gap-2"
          >
            <AiOutlineLoading3Quarters
              className={cn(!isPending ? "hidden" : "block animate-spin")}
            />
            Continue
            <RiArrowRightSFill className=" size-4" />
          </Button>
          <div className="text-center text-sm">
            <h1>
              Already have account?{" "}
              <Link
                href={redirectTo ? `/signin?next=` + redirectTo : "/signin"}
                className="text-blue-400"
              >
                Signin
              </Link>
            </h1>
          </div>
        </form>
      </Form>
      {/* verify email */}
      <div
        className={cn(
          `w-full inline-block h-80 text-wrap align-top  transform transition-all space-y-3`,
          isConfirmed ? "-translate-x-[105%]" : "translate-x-0"
        )}
      >
        <div className="flex h-full items-center justify-center flex-col space-y-5">
          <SiMinutemailer className=" size-8" />

          <h1 className="text-2xl font-semibold text-center">Verify email</h1>
          <p className="text-center text-sm">
            {" A verification code has been sent to "}
            <span className="font-bold">
              {verify === "true" ? existEmail : form.getValues("email")}
            </span>
          </p>

          <InputOTP
            pattern={REGEXP_ONLY_DIGITS}
            id="input-otp"
            maxLength={6}
            onChange={async (value) => {
              if (value.length === 6) {
                document.getElementById("input-otp")?.blur();
                const res = await verifyOtp({
                  email: form.getValues("email"),
                  otp: value,
                  type: "email",
                });
                const { error } = JSON.parse(res);
                if (error) {
                  setVerifyStatus("failed");
                } else {
                  setVerifyStatus("success");
                  router.push(redirectTo);
                }
              }
            }}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className={inputOptClass} />
              <InputOTPSlot index={1} className={inputOptClass} />
              <InputOTPSlot index={2} className={inputOptClass} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} className={inputOptClass} />
              <InputOTPSlot index={4} className={cn(inputOptClass)} />
              <InputOTPSlot index={5} className={cn(inputOptClass)} />
            </InputOTPGroup>
          </InputOTP>
          <div className="text-sm flex gap-2">
            <p>{"Didn't work?"} </p>
            <span
              className="text-blue-400 cursor-pointer hover:underline transition-all flex items-center gap-2 "
              onClick={async () => {
                if (!isSendAgain) {
                  startSendAgain(async () => {
                    try {
                      const email = form.getValues("email") || existEmail;
                      if (email) {
                        const json = await resendVerificationEmail(email);
                        if (json.success) {
                          toast.success(
                            "Please check your email for the verification code."
                          );
                        } else {
                          toast.error(
                            json.error || "Failed to resend verification email"
                          );
                        }
                      } else {
                        toast.error("Email address is missing");
                      }
                    } catch (error) {
                      console.error(
                        "Error resending verification email:",
                        error
                      );
                      toast.error("Failed to resend verification email");
                    }
                  });
                }
              }}
            >
              <AiOutlineLoading3Quarters
                className={`${!isSendAgain ? "hidden" : "block animate-spin"}`}
              />
              Send me another code.
            </span>
          </div>
          <Button
            type="submit"
            className="w-full h-8 bg-indigo-500 hover:bg-indigo-600 transition-all text-white flex items-center gap-2"
            onClick={async () => {
              setIsConfirmed(false);
            }}
          >
            <RiArrowDropLeftFill className=" size-5" />
            Change Email
          </Button>
        </div>
      </div>
    </div>
  );
}
