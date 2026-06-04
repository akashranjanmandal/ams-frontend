import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Icon, type IconName } from "./Icon";

export function TextField({
  error,
  helperText,
  icon,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
  helperText?: string;
  icon?: IconName;
}) {
  const input = <input aria-invalid={error || undefined} type="text" {...props} />;

  return (
    <div className="input-block">
      {icon ? (
        <div className="input-wrap input-with-icon">
          <Icon className="inp-icon" name={icon} size={15} />
          {input}
        </div>
      ) : (
        input
      )}
      {helperText ? <p className={`helper-text ${error ? "err" : ""}`}>{helperText}</p> : null}
    </div>
  );
}

export function SelectField({
  options,
  defaultValue
}: {
  options: string[];
  defaultValue?: string;
}) {
  return (
    <select defaultValue={defaultValue ?? options[0]}>
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} />;
}
