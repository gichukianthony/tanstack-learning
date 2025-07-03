import { useForm } from "@tanstack/react-form";
import { z, ZodObject } from "zod";
import type { ZodTypeAny } from "zod";

type FieldType = "text" | "email" | "password" | "checkbox";

type FieldConfig<T> = {
  name: keyof T & string;
  label: string;
  type: FieldType;
  placeholder?: string;
};

type GenericFormProps<T extends ZodObject<any>> = {
  schema: T;
  fields: FieldConfig<z.infer<T>>[];
  onSubmit: (data: z.infer<T>) => void;
  className?: string;
  fieldClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
};

const validateField = <T,>(value: T, schema: ZodTypeAny) => {
  const result = schema.safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
};

export function GenericForm<T extends ZodObject<any>>({
  schema,
  fields,
  onSubmit,
  className,
  fieldClassName,
  inputClassName,
  buttonClassName,

}: GenericFormProps<T>) {
  const defaultValues = Object.fromEntries(
    Object.keys(schema.shape).map((key) => [
      key,
      key === "agreeToTerms" ? false : "",
    ])
  );

  const form = useForm({
    defaultValues: defaultValues as z.infer<T>,
    onSubmit: async ({ value }) => {
      const result = schema.safeParse(value);
      if (!result.success) {
        console.error("Validation error:", result.error.issues);
        return;
      }

      await new Promise((r) => setTimeout(r, 2000));
      alert("Submitted!");
      onSubmit(result.data);

      form.reset();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className={className || "space-y-4"}
    >
      {fields.map((field) => (
        <form.Field
          key={field.name}
          name={field.name}
          validators={{
            onChange: ({ value }) =>
              validateField(value, schema.shape[field.name]),
            onBlur: ({ value }) =>
              validateField(value, schema.shape[field.name]),
          }}
          children={(f) => (
            <div>
              <label className={field.inputClassName || "block text-sm font-medium text-gray-700 mb-1"}>
                {field.label}
              </label>

              {field.type === "checkbox" ? (
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={Boolean(f.state.value)}
                    onBlur={f.handleBlur}
                    onChange={(e) => f.handleChange(e.target.checked)}
                    className="mr-2 mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    {field.placeholder}
                  </span>
                </label>
              ) : (
                <input
                  type={field.type}
                  value={f.state.value}
                  onBlur={f.handleBlur}
                  onChange={(e) => f.handleChange(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${f.state.meta.errors.length > 0
                      ? "border-red-500"
                      : "border-gray-300"
                    }`}
                  placeholder={field.placeholder}
                />
              )}

              {f.state.meta.errors.length > 0 && (
                <p className="mt-1 text-sm text-red-600">
                  {String(f.state.meta.errors[0])}
                </p>
              )}
            </div>
          )}
        />
      ))}

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full py-2 px-4 rounded-md ${canSubmit
                ? "bg-blue-600 text-white"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        )}
      />
    </form>
  );
}