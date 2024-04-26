import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Form } from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "./form/form-input";
import { FormSubmitButton } from "./form/form-submit-button";

export function AddKeyForm({
  callback,
}: {
  callback: (keys: string[]) => void;
}) {
  const schema = z.object({
    key: z.string().min(1),
  });

  type Inputs = z.infer<typeof schema>;

  const form = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      key: "",
    },
  });

  function onSubmit(data: Inputs) {
    callback([data.key]);
    form.reset();
  }

  return (
    <div>
      Add new key
      <Form {...form}>
        <form
          className="flex flex-row items-start gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormInput name="key" placeholder="Key" />
          <FormSubmitButton title={"Add"} />
        </form>
      </Form>
    </div>
  );
}
