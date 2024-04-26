'use client';

import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';

export function FormError() {
  const formContext = useFormContext<{
    formError: string;
  }>();

  return (
    <FormField
      control={formContext.control}
      name="formError"
      render={() => (
        <FormItem>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
