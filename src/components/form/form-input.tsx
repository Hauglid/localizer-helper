'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function FormInput({
  name,
  placeholder,
  type,
  disabled,
  children,
  ...props
}: { name: string } & InputProps) {
  const formContext = useFormContext();

  return (
    <FormField
      control={formContext.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {children && <FormLabel className="text-xs">{children}</FormLabel>}
          <FormControl>
            <Input
              type={type}
              disabled={disabled}
              placeholder={placeholder}
              {...props}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
