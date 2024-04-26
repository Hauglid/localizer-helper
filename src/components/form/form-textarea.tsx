'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useFormContext } from 'react-hook-form';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function FormTextarea({
  name,
  placeholder,
  children,
  ...props
}: {
  name: string;
} & TextareaProps) {
  const formContext = useFormContext();

  return (
    <FormField
      control={formContext.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {children && <FormLabel className="text-xs">{children}</FormLabel>}
          <FormControl>
            <Textarea placeholder={placeholder} {...field} {...props} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
