"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const formSchema = z.object({
  description: z.string().min(2),
  customer: z.string().min(2),
  manufacturer: z.string().optional(),
  model: z.string().min(2),
  workingLoadLimit: z.string().min(1),
  yearOfManufacture: z.string().min(4),
  dateOfInspection: z.string().min(1),
  serialNumber: z.string().min(1),
  reportRef: z.string().min(1),
  manager: z.string().min(1),
  equipmentImage: z.any().optional(),
});

export default function EquipmentInspection() {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "PELLE HYDRAULIQUE",
      customer: "SARL SOCIETE GABOUS TRAVAUX PUBLICS",
      manufacturer: "Hyundai",
      model: "R210LC-7",
      workingLoadLimit: "12TONNE",
      yearOfManufacture: "2010",
      dateOfInspection: new Date().toISOString().split("T")[0],
      serialNumber: "N6061A114(IMM: 42-04530-39)",
      reportRef: "RFC232/32",
      manager: "AMMAR CHEKIMA",
      equipmentImage: null,
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      toast.error("Image size should be less than 15MB.");
      return;
    }

    setImageFile(file);
    form.setValue("equipmentImage", file);

    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    form.setValue("equipmentImage", null);
    const fileInput = document.getElementById("equipmentImage");
    if (fileInput) fileInput.value = "";
  };

  const convertImageToBase64 = (file) =>
    new Promise((resolve, reject) => {
      if (!file) resolve(null);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result); // data:*/*;base64,...
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  async function onSubmit(values) {
    try {
      // Convert image to base64 if provided
      let imageBase64 = values.equipmentImage;
      if (imageFile) {
        imageBase64 = await convertImageToBase64(imageFile);
      }

      const payload = { ...values, equipmentImage: imageBase64 };

      // Send to server API
      const res = await fetch("/api/certificats/conformite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("Server error:", txt);
        toast.error("Failed generating PDF on server.");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "certificat-conformite.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("PDF generated and downloaded.");
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error generating PDF.");
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto" dir="ltr">
      <CardHeader>
        <CardTitle className={"text-center"}>Equipment Inspection Form</CardTitle>
        <CardDescription className={"text-center"}>
          Enter the details of the equipment inspection below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Produit)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer (Client)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter customer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer (Fabricant)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter manufacturer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model (Type)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter model" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="workingLoadLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Working Load Limit (Charge maxi. Utilization)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter working load limit" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="yearOfManufacture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year of Manufacture (Année de fabrication)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter year of manufacture" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfInspection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Inspection (Date d&apos;inspection)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number (Numéro de série)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter serial number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reportRef"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Report Reference (Numéro de rapport)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter report Ref" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="manager"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manager (Responsable)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter manager name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Equipment Image Upload */}
            <FormField
              control={form.control}
              name="equipmentImage"
              render={() => (
                <FormItem className="col-span-full">
                  <FormLabel>Equipment Image (Image de l&apos;équipement)</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {!imagePreview ? (
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          <Upload className="mx-auto h-12 w-12 text-forground" />
                          <div className="mt-4">
                            <Button type="button">
                              <label htmlFor="equipmentImage">Upload Image</label>
                            </Button>
                            <input
                              id="equipmentImage"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </div>
                          <p className="mt-2 text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
                        </div>
                      ) : (
                        <div className="relative">
                          <Image
                            src={imagePreview || "/placeholder.svg"}
                            width={400}
                            height={300}
                            alt="Equipment preview"
                            className="max-w-full h-48 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={removeImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <div className="mt-2 text-sm text-gray-600">
                            {imageFile?.name} ({Math.round((imageFile?.size || 0) / 1024)} KB)
                          </div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Submit Equipment Data
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
