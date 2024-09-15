"use client";
import { useEffect, useState } from "react";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";

type Employee = {
  name: string;
  email: string;
};

interface ReferenceData {
  category: string[];
  legal: string[];
  inquiry: string[];
  app: string[];
  followup: string[];
}

const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;

const schema = z.object({
  category: z.string().nonempty({ message: "Category selection is required" }),
  inquiry_type: z.string().nonempty({ message: "Inquiry type is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().regex(phoneRegex, {
    message: "Phone number must be in xxx-xxx-xxxx format",
  }),
  // manufacturer: z.string().min(2, { message: "Manufacturer is required" }),
  // item: z.string().min(4, { message: "Item is required" }),
  details: z.string().min(4, { message: "Details are required" }),
});

type FormData = z.infer<typeof schema>;

export default function OrdersComponent() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [customerTypes, setCustomerTypes] = useState<string[]>([]);
  const [inquiryTypes, setInquiryTypes] = useState<string[]>([]);
  const [userUuid, setUserUuid] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [subCategoryOptions, setSubCategoryOptions] = useState<string[]>([]);
  const [referenceData, setReferenceData] = useState<ReferenceData>({
    category: [],
    legal: [],
    inquiry: [],
    app: [],
    followup: [],
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
        toast.error("Error fetching user. Please log in again.");
        router.push("/sign-in");
        return;
      }
      if (user) {
        setUserUuid(user.id);
      } else {
        toast.error("No active user found. Please log in.");
        router.push("/sign-in");
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    if (userUuid) {
      const fetchUserData = async () => {
        const { data, error } = await supabase
          .from("employees")
          .select("name, contact_info")
          .eq("user_uuid", userUuid)
          .single();
        if (error) {
          console.error("Error fetching user data:", error.message);
        } else if (data) {
          setUserName(data.name);
          setUserEmail(data.contact_info);
        }
      };

      fetchUserData();
    }
  }, [userUuid]);


  const onSubmit = async (data: FormData) => {
    if (!userUuid) {
      toast.error("User is not authenticated.");
      return;
    }
  
    const submissionData = {
      user_uuid: userUuid,
      name: userName,
      employee_email: userEmail,
      category: data.category,
      inquiry_type: data.inquiry_type,
      phone: data.phone,
      email: data.email,
      details: data.details
    };
  
    const { error } = await supabase.from("support_requests").insert(submissionData);
    if (error) {
      console.error("Error submitting support request:", error);
      toast.error("There was an error submitting your request.");
    } else {
      toast.success("Your support request has been submitted.");
      reset();
      setIsDialogOpen(false);
    }
  };

  const fetchReferenceData = async () => {
    const { data: category } = await supabase
      .from("support_references")
      .select("option_value")
      .eq("field_name", "category")
      .order("display_order");

    const { data: legal } = await supabase
      .from("support_references")
      .select("option_value")
      .eq("field_name", "legal")
      .order("display_order");

    const { data: inquiry } = await supabase
      .from("support_references")
      .select("option_value")
      .eq("field_name", "inquiry")
      .order("display_order");

    const { data: app } = await supabase
      .from("support_references")
      .select("option_value")
      .eq("field_name", "app")
      .order("display_order");

      const { data: followup } = await supabase
    .from("support_references")
    .select("option_value")
    .eq("field_name", "followup")
    .order("display_order");

  console.log("Fetched followup data:", followup); // Add this line

    setReferenceData({
      category: category?.map((c) => c.option_value) || [],
      legal: legal?.map((l) => l.option_value) || [],
      inquiry: inquiry?.map((i) => i.option_value) || [],
      app: app?.map((a) => a.option_value) || [],
      followup: followup?.map((f) => f.option_value) || [],
    });
  };

  useEffect(() => {
    fetchReferenceData();
  }, []);

  const handleCategoryChange = (value: string) => {
    console.log("Selected category:", value); // Add this line
    setSelectedCategory(value);
    updateSubCategoryOptions(value);
  };

  const updateSubCategoryOptions = (category: string) => {
    console.log("Updating subcategory options for:", category); // Debugging log
    switch (category) {
      case "Legal Inquiry":
        setSubCategoryOptions(referenceData.legal);
        break;
      case "HR | Staff Management Inquiry":
        setSubCategoryOptions(referenceData.inquiry);
        break;
      case "App Support":
        setSubCategoryOptions(referenceData.app);
        break;
      case "Following Up":
        setSubCategoryOptions(referenceData.followup);
        break;
        default:
          setSubCategoryOptions([]);
    }
  };

  useEffect(() => {
    console.log("Selected Category:", selectedCategory); // Debugging log
    console.log("Sub Category Options:", subCategoryOptions); // Debugging log
  }, [selectedCategory, subCategoryOptions]);

  return (
    <div className="flex justify-center mt-36">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Contact AHR For Support</CardTitle>
          <CardDescription>
            Fill out the form below to contact AHR for support. You will receive
            updates via email as soon as we start working on your request!
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={userName || ""} disabled />
              </div>
              <div className="grid gap-2 space-y-2">
                <Label htmlFor="category">Category</Label>
                <Controller
                  name="category"
                  control={control}
                  defaultValue="" // Set default value to an empty string
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleCategoryChange(value);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {referenceData.category.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-red-500">{errors.category.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2 space-y-2">
                <Label htmlFor="inquiry_type">Inquiry Type</Label>
                <Controller
                  name="inquiry_type"
                  control={control}
                  defaultValue="" // Set default value to an empty string
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        {subCategoryOptions.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.inquiry_type && (
                  <p className="text-red-500">{errors.inquiry_type.message}</p>
                )}
              </div>

              {/* <div className="grid gap-2">
                <Label htmlFor="inquiry_type">Inquiry Type</Label>
                <Controller
                  name="inquiry_type"
                  control={control}
                  defaultValue="" // Set default value to an empty string
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        {subCategoryOptions.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.inquiry_type && (
                  <p className="text-red-500">{errors.inquiry_type.message}</p>
                )}
              </div> */}
              
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="123-456-7890 Format"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-red-500">{errors.phone.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Enter email"
                  type="email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>
            {/* <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer | Class</Label>
                <Input
                  id="manufacturer"
                  placeholder="Sig | CCW etc."
                  {...register("manufacturer")}
                />
                {errors.manufacturer && (
                  <p className="text-red-500">{errors.manufacturer.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="item">Item | Model | Course</Label>
                <Input
                  id="item"
                  placeholder="P320 | 16 Hour etc."
                  {...register("item")}
                />
                {errors.item && (
                  <p className="text-red-500">{errors.item.message}</p>
                )}
              </div>
            </div> */}
            <div className="space-y-2">
              <Label htmlFor="details">Inquiry Details</Label>
              <Textarea
                id="details"
                placeholder="Give us the nitty gritty and the low down on your inquiry!"
                rows={4}
                {...register("details")}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="button"
              variant="ringHover"
              className="ml-auto"
              onClick={() => setIsDialogOpen(true)}
            >
              Submit Inquiry
            </Button>
          </CardFooter>
        </form>
      </Card>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Please Note:
            </AlertDialogTitle>
            <AlertDialogDescription>
              We are a very small team and may not be able to take on every inquiry as fast as we would like.
              We will do our best to get back to you within 24 hours, but please
              be patient with us.
              <Separator className="my-4 mb-4" />
              Thank you for your understanding and have a great day!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleSubmit(onSubmit)();
              }}
            >
              Understood
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
