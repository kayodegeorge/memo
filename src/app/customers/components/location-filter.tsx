"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { useState } from "react"; // Import useEffect
import { useQuery } from "@tanstack/react-query"; // Import useQueryClient
import { getLocations, LocationResponse } from "@/api/public";
import { useDeliveryDetails } from "@/store/deliveryDetails";
import useFormErrorStore from "@/store/customer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

const searchFormSchema = z.object({
  country: z.string().min(1, { message: "Country is required" }),
  state: z.string().min(1, { message: "State is required" }),
  city: z.string().min(1, { message: "City is required" }),
  date: z.date(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

interface SearchFormProps {
  onSubmit: (data: object) => void;
  className?: string;
  variant?: "default" | "sheet";
  isFetching: boolean;
}

// Helper functions to extract location data
const extractCountries = (data: LocationResponse["data"]) => {
  return Object.keys(data);
};

const extractStates = (data: LocationResponse["data"], country: string) => {
  return Object.keys(data[country]?.states || {});
};

const extractCities = (
  data: LocationResponse["data"],
  country: string,
  state: string
) => {
  return data[country]?.states[state]?.cities || [];
};

const LoadingSelectItem = () => (
  <SelectItem value="loading" disabled>
    Loading...
  </SelectItem>
);

export function SearchForm({
  onSubmit,
  className,
  variant = "default",
  isFetching,
}: SearchFormProps) {
  let savedLocations: string = "{}";

  if (typeof window !== "undefined") {
    savedLocations = localStorage.getItem("delivery-storage") ?? "{}";
  }

  const parsedData = JSON.parse(savedLocations);
  const { country, state, city } = parsedData?.state?.deliveryDetails || {};

  const [selectedCountry, setSelectedCountry] = useState<string>(country);
  const [selectedState, setSelectedState] = useState<string>(state);
  const [selectedCity, setSelectedCity] = useState<string>(city);

  const setDeliveryDetails = useDeliveryDetails(
    (state) => state.setDeliveryDetails
  );

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      country: country,
      state: state,
      city: city,
      date: undefined,
    },
    mode: "onSubmit",
  });

  // Single query for all location data
  const locationsQuery = useQuery({
    queryKey: ["locations"],
    queryFn: getLocations,
  });

  console.log(locationsQuery);

  const locationData = locationsQuery.data?.data || {};
  const countries = extractCountries(locationData);
  const states = selectedCountry
    ? extractStates(locationData, selectedCountry)
    : [];
  const cities =
    selectedCountry && selectedState
      ? extractCities(locationData, selectedCountry, selectedState)
      : [];

  const setFormError = useFormErrorStore((state) => state.setFormError);
  const resetFormError = useFormErrorStore((state) => state.resetFormError);

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    form.setValue("country", value);
    form.setValue("state", "");
    form.setValue("city", "");
    setSelectedState("");
  };

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    form.setValue("state", value);
    form.setValue("city", "");
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    form.setValue("city", value);
  };

  const onError = (errors: object) => {
    const errorKeys = Object.keys(errors).map((field) => field.toUpperCase());

    if (errorKeys.length === 4) {
      setFormError(true, "All fields on the form are required");
    } else {
      const missingFields = errorKeys.join(" and ");
      setFormError(
        true,
        `${missingFields} field${errorKeys.length > 1 ? "s" : ""} ${
          errorKeys.length === 1 ? "is" : "are"
        } required`
      );
    }
  };

  function handleSubmit(values: SearchFormValues) {
    resetFormError();
    setDeliveryDetails({
      ...values,
      date: values.date ? format(values.date, "yyyy-MM-dd") : "",
    });
    onSubmit(values);
  }

  const renderLocationSelects = () => (
    <>
      {/* Country Select */}
      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <Select
              onValueChange={handleCountryChange}
              value={field.value || "default"}
            >
              <FormControl>
                <SelectTrigger className="h-10 text-black border-r border-l-0 rounded-none border-y-0 !outline-none">
                  <SelectValue placeholder="Country">
                    {locationsQuery.isLoading
                      ? "Loading countries..."
                      : selectedCountry
                      ? selectedCountry
                      : "Country"}
                  </SelectValue>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="default" disabled>
                  Select a country
                </SelectItem>
                {locationsQuery.isLoading ? (
                  <LoadingSelectItem />
                ) : (
                  countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      {/* State Select */}
      <FormField
        control={form.control}
        name="state"
        render={({ field }) => (
          <FormItem>
            <Select
              onValueChange={handleStateChange}
              value={field.value || "default"}
              disabled={!selectedCountry}
            >
              <FormControl>
                <SelectTrigger
                  className={cn(
                    "h-10 text-black border-x-1 rounded-none border-y-0 !outline-none",
                    !selectedCountry && "text-gray-400 opacity-70"
                  )}
                >
                  <SelectValue placeholder="State">
                    {!selectedCountry
                      ? "Select country first"
                      : selectedState
                      ? selectedState
                      : "State"}
                  </SelectValue>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="default" disabled>
                  Select a state
                </SelectItem>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      {/* City Select */}
      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <Select
              onValueChange={handleCityChange}
              value={field.value || "default"}
              disabled={!selectedState}
            >
              <FormControl>
                <SelectTrigger
                  className={cn(
                    "h-10 text-black border-x-1 rounded-none border-y-0 !outline-none",
                    !selectedState && "text-gray-400 opacity-70"
                  )}
                >
                  <SelectValue placeholder="City">
                    {!selectedState
                      ? "Select state first"
                      : selectedCity
                      ? selectedCity
                      : "City"}
                  </SelectValue>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="default" disabled>
                  Select a city
                </SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </>
  );

  if (variant === "sheet") {
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className={cn("flex flex-col h-full", className)}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Let&apos;s Find Vendors Near You
            </h2>
          </div>

          <div className="space-y-10 flex-1">
            {/* Location Selects */}
            <div className="mt-5 flex flex-col gap-10">
              {renderLocationSelects()}
            </div>
            {/* Date Picker */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full h-14 justify-start border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            <span className="text-gray-400">
                              {field.value
                                ? format(field.value, "PPP")
                                : "Delivery date"}
                            </span>
                          </div>
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-8 bg-red-600 hover:bg-red-700 text-white h-12"
            loading={isFetching}
          >
            Get Started
          </Button>
        </form>
      </Form>
    );
  }

  return (
    <div className="w-full px-5 md:px-7 lg:px-9">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit, onError)}
          className={cn("max-w-6xl mx-auto relative", className)}
        >
          <div className="bg-white rounded-full shadow-lg p-2 md:p-3  !min-w-[700px] mx-auto">
            <div className="border-2 border-primary rounded-full gap-2 md:gap-4 items-center">
              {/* Location Selects */}
              <div className="md:col-span-7 grid grid-cols-4 gap-2 overflow-x-hidden">
                {renderLocationSelects()}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "!w-full !h-full text-left font-normal rounded-none border-x-1 border-y-0 border-r-0 border-gray-200",
                                !field.value && "text-muted-foreground",
                                "rounded-r-full"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a delivery date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              return date < today;
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Get Started Button */}
          <div className="flex justify-center mt-8">
            <Button size="lg" type="submit" loading={isFetching}>
              Get Started
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
