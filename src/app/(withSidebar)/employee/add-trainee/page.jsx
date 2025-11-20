"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { AddTraineeCard } from "@/components/employees/add-trainee-card";
import { SuccessComponent } from "@/components/employees/success-component";

export default function AddTraineePage() {
  const searchParams = useSearchParams();
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [trainee, setTrainee] = useState({});

  useEffect(() => {
    const successParam = searchParams.get("success");
    const traineeData = searchParams.get("trainee");
    if (successParam && traineeData) {
      setSuccess(true);
      setTrainee(JSON.parse(traineeData));
    }
  }, [searchParams]);

  const { data: programs } = useFetch("/api/programs/employee");

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/trainees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to add trainee");
      }

      const result = await res.json();

      setTrainee(result);
      setSuccess(true);

      toast.success("تمت إضافة المتدرب", {
        description: `لقد تم تسجيل ${result.name}`,
      });
    } catch {
      toast.error("لم تتم إضافة المتدرب");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => setSuccess(false);

  //if (error) return <ErrorPage error={error} />;
  return success ? (
    <SuccessComponent onReset={handleReset} trainee={trainee} />
  ) : (
    <AddTraineeCard
      programs={programs}
      onSubmit={onSubmit}
      isLoading={isLoading}
    />
  );
}
