import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosInstance from "@/api/axiosInstance";
import { BiLoaderCircle } from "react-icons/bi";

const CreateProblemPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const zschema = z.object({
    title: z.string().min(3, "Title required"),
    description: z.string().min(10, "Description required"),
    difficulty: z.enum(["easy", "medium", "hard"]),
    tags: z.array(z.string()).min(1, "Select at least one tag"),
    VisibleTestCases: z
      .array(
        z.object({
          input: z.string().min(1),
          output: z.string().min(1),
          explanation: z.string().optional(),
        }),
      )
      .min(1),
    HiddenTestCases: z
      .array(
        z.object({
          input: z.string().min(1),
          output: z.string().min(1),
        }),
      )
      .min(1),
    StartCode: z.object({
      javascript: z.string().min(1),
      python: z.string().min(1),
      java: z.string().min(1),
      cpp: z.string().min(1),
    }),
    referencesolution: z.object({
      javascript: z.string().min(1),
      python: z.string().min(1),
      java: z.string().min(1),
      cpp: z.string().min(1),
    }),
  });

  // Form validation
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(zschema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "easy",
      tags: [],
      VisibleTestCases: [{ input: "", output: "", explanation: "" }],
      HiddenTestCases: [{ input: "", output: "" }],
      StartCode: { javascript: "", python: "", java: "", cpp: "" },
      referencesolution: { javascript: "", python: "", java: "", cpp: "" },
    },
  });

  // Dynamic test cases
  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible,
  } = useFieldArray({ control, name: "VisibleTestCases" });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
  } = useFieldArray({ control, name: "HiddenTestCases" });

  // Submit
  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
     await axiosInstance.post("/problem/create", data); 
      alert("✅ Problem created!");
      setTimeout(() => window.location.reload(), 1500);
    } catch (error: any) {
      alert("❌ " + (error.response?.data?.message || "Error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 mt-20">
      <h1 className="text-3xl font-bold mb-8 text-sun-text-primary dark:text-moon-text-primary">
        Create Problem
      </h1>


      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-sun-text-primary dark:text-moon-text-primary mb-2">
            Title
          </label>
          <input
            {...register("title")}
            type="text"
            placeholder="Problem title"
            className="w-full px-4 py-2 border rounded-md bg-white dark:bg-moon-bg border-sun-border dark:border-moon-border text-sun-text-primary dark:text-moon-text-primary"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-sun-text-primary dark:text-moon-text-primary mb-2">
            Description
          </label>
          <textarea
            {...register("description")}
            placeholder="Problem description"
            rows={5}
            className="w-full px-4 py-2 border rounded-md bg-white dark:bg-moon-bg border-sun-border dark:border-moon-border text-sun-text-primary dark:text-moon-text-primary"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-sun-text-primary dark:text-moon-text-primary mb-2">
            Difficulty
          </label>
          <select
            {...register("difficulty")}
            className="w-full px-4 py-2 border rounded-md bg-white dark:bg-moon-bg border-sun-border dark:border-moon-border text-sun-text-primary dark:text-moon-text-primary"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-sun-text-primary dark:text-moon-text-primary mb-2">
            Tags
          </label>
          <div className="flex gap-4">
            {["array", "Linkedlist", "graph", "dp"].map((tag) => (
              <label key={tag} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={tag}
                  {...register("tags")}
                  className="w-4 h-4"
                />
                <span className="text-sun-text-primary dark:text-moon-text-primary">
                  {tag}
                </span>
              </label>
            ))}
          </div>
          {errors.tags && (
            <p className="text-red-500 text-sm mt-1">{errors.tags.message}</p>
          )}
        </div>

        {/* Visible Test Cases */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-sun-text-primary dark:text-moon-text-primary mb-4">
            Visible Test Cases
          </h2>
          {visibleFields.map((field, i) => (
            <div
              key={field.id}
              className="mb-4 p-4 border rounded-md bg-sun-bg/20 dark:bg-moon-bg/20"
            >
              <input
                {...register(`VisibleTestCases.${i}.input`)}
                placeholder="Input"
                className="w-full px-4 py-2 border rounded-md bg-white dark:bg-moon-bg mb-2"
              />
              <input
                {...register(`VisibleTestCases.${i}.output`)}
                placeholder="Output"
                className="w-full px-4 py-2 border rounded-md bg-white dark:bg-moon-bg mb-2"
              />
              <textarea
                {...register(`VisibleTestCases.${i}.explanation`)}
                placeholder="Explanation (optional)"
                rows={3}
                className="w-full px-4 py-2 border rounded-md bg-white dark:bg-moon-bg mb-2"
              />
              <button
                type="button"
                onClick={() => removeVisible(i)}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              appendVisible({ input: "", output: "", explanation: "" })
            }
            className="px-4 py-2 bg-sun-accent dark:bg-moon-lzincy text-white rounded-md text-sm"
          >
            Add Visible Test Case
          </button>
        </div>

        {/* Hidden Test Cases */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-sun-text-primary dark:text-moon-text-primary mb-4">
            Hidden Test Cases
          </h2>
          {hiddenFields.map((field, i) => (
            <div
              key={field.id}
              className="mb-4 p-4 border rounded-md bg-sun-bg/20 dark:bg-moon-bg/20"
            >
              <input
                {...register(`HiddenTestCases.${i}.input`)}
                placeholder="Input"
                className="w-full px-4 py-2 border rounded-md bg-white dark:bg-moon-bg mb-2"
              />
              <input
                {...register(`HiddenTestCases.${i}.output`)}
                placeholder="Output"
                className="w-full px-4 py-2 border rounded-md bg-white dark:bg-moon-bg mb-2"
              />
              <button
                type="button"
                onClick={() => removeHidden(i)}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendHidden({ input: "", output: "" })}
            className="px-4 py-2 bg-sun-accent dark:bg-moon-lzincy text-white rounded-md text-sm"
          >
            Add Hidden Test Case
          </button>
        </div>

        {/* Start Code */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-sun-text-primary dark:text-moon-text-primary mb-4">
            Start Code
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {["javascript", "python", "java", "cpp"].map((lang) => (
              <div key={lang}>
                <label className="block text-sm font-medium mb-2 capitalize text-sun-text-primary dark:text-moon-text-primary">
                  {lang}
                </label>
                <textarea
                  {...register(`StartCode.${lang}` as any)}
                  placeholder={`${lang} code`}
                  rows={5}
                  className="w-full px-4 py-2 border rounded-md bg-white dark:bg-moon-bg font-mono text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Reference Solution */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-sun-text-primary dark:text-moon-text-primary mb-4">
            Reference Solution
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {["javascript", "python", "java", "cpp"].map((lang) => (
              <div key={lang}>
                <label className="block text-sm font-medium mb-2 capitalize text-sun-text-primary dark:text-moon-text-primary">
                  {lang}
                </label>
                <textarea
                  {...register(`referencesolution.${lang}` as any)}
                  placeholder={`${lang} solution`}
                  rows={5}
                  className="w-full px-4 py-2 border rounded-md bg-white dark:bg-moon-bg font-mono text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="border-t pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-sun-accent dark:bg-moon-lzincy text-white font-semibold rounded-md flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
          >
            {isLoading && <BiLoaderCircle className="animate-spin" size={20} />}
            {isLoading ? "Creating..." : "Create Problem"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProblemPage;
