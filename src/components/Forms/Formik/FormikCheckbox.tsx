import { useField } from "formik";

type FormikCheckboxProps = {
  name: string;
  required?: boolean;
  label?: string;
};

export default function FormikCheckbox({
  name,
  required = false,
  label
}: FormikCheckboxProps) {
  const [field] = useField({
    name,
    type: "checkbox",
    required
  });

  return (
    <div className="flex flex-row items-center space-x-2">
      <input
        id={name}
        type="checkbox"
        className="text-blue-600 bg-gray-100 border-gray-900 rounded focus:ring-blue-500 focus:ring-2"
        {...field}
      />
      <label htmlFor={name} className="text-sm font-semibold text-gray-700">
        {label}
      </label>
    </div>
  );
}