"use client";

import { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookFormSchema, BookFormSchema } from "../schemas/books.schema";
import { BookItem, BookFormData } from "../types/books.types";

interface UseBookFormParams {
  open: boolean;
  bookToEdit: BookItem | null;
  onSave: (formData: BookFormData) => void;
  onOpenChange: (open: boolean) => void;
}

export function useBookForm({
  open,
  bookToEdit,
  onSave,
  onOpenChange,
}: UseBookFormParams) {
  const isEditing = Boolean(bookToEdit);

  const form = useForm<BookFormSchema>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: "",
      author: "",
      publisher: "",
      edition: "",
      publicationYear: new Date().getFullYear(),
      shelfId: "Rak A1",
      categories: [],
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const selectedCategories = watch("categories") || [];
  const selectedPublisher = watch("publisher") || "";
  const selectedShelfId = watch("shelfId") || "";
  const selectedYear = watch("publicationYear");

  // Sinkronisasi data saat modal dibuka atau bookToEdit berubah
  useEffect(() => {
    if (open) {
      if (bookToEdit) {
        reset({
          title: bookToEdit.title,
          author: bookToEdit.author || "",
          publisher: bookToEdit.publisher || "",
          edition: bookToEdit.edition || "",
          publicationYear: bookToEdit.publicationYear ?? new Date().getFullYear(),
          shelfId: bookToEdit.shelfId || "Rak A1",
          categories: bookToEdit.categories?.length ? bookToEdit.categories : [],
        });
      } else {
        reset({
          title: "",
          author: "",
          publisher: "",
          edition: "",
          publicationYear: new Date().getFullYear(),
          shelfId: "Rak A1",
          categories: [],
        });
      }
    }
  }, [bookToEdit, open, reset]);

  // Handler toggle multi-kategori
  const toggleCategory = useCallback(
    (cat: string) => {
      const nextCategories = selectedCategories.includes(cat)
        ? selectedCategories.filter((c) => c !== cat)
        : [...selectedCategories, cat];
      setValue("categories", nextCategories, { shouldValidate: true });
    },
    [selectedCategories, setValue]
  );

  // Setters untuk input khusus (Searchable Select & Year Select)
  const setPublisher = useCallback(
    (val: string) => {
      setValue("publisher", val, { shouldValidate: true });
    },
    [setValue]
  );

  const setShelfId = useCallback(
    (val: string) => {
      setValue("shelfId", val, { shouldValidate: true });
    },
    [setValue]
  );

  const setPublicationYear = useCallback(
    (year: number | null) => {
      setValue("publicationYear", year, { shouldValidate: true });
    },
    [setValue]
  );

  // Submit handler
  const onSubmit = handleSubmit((data: BookFormSchema) => {
    onSave({
      id: bookToEdit?.id,
      ...data,
      publicationYear: data.publicationYear ?? null,
    });
    onOpenChange(false);
  });

  return {
    isEditing,
    register,
    errors,
    isSubmitting,
    selectedCategories,
    selectedPublisher,
    selectedShelfId,
    selectedYear,
    toggleCategory,
    setPublisher,
    setShelfId,
    setPublicationYear,
    onSubmit,
  };
}
