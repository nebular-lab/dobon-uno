import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { socketClient } from "@/hooks/useSocket";

const CreateFormSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "ユーザー名は3文字以上8文字以下で入力してください",
    })
    .max(8, {
      message: "ユーザー名は3文字以上8文字以下で入力してください",
    }),
});

const JoinFormSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "ユーザー名は3文字以上8文字以下で入力してください",
    })
    .max(8, {
      message: "ユーザー名は3文字以上8文字以下で入力してください",
    }),
  password: z.string(),
});

export const Title = () => {
  return (
    <div className="flex flex-col items-center gap-24">
      <div className="w-full pt-56 text-center text-5xl">DOBON UNO</div>
      <div className="flex gap-24">
        <CreateForm />
        <JoinForm />
      </div>
    </div>
  );
};

const CreateForm = () => {
  const createForm = useForm<z.infer<typeof CreateFormSchema>>({
    resolver: zodResolver(CreateFormSchema),
    defaultValues: {
      username: "",
    },
  });
  function onCreateSubmit(data: z.infer<typeof CreateFormSchema>) {
    socketClient.emit("createRoom", data.username);
  }
  return (
    <Card className="flex w-[350px] flex-col ">
      <CardHeader>
        <CardTitle>ルーム作成</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 ">
        <Form {...createForm}>
          <form
            onSubmit={createForm.handleSubmit(onCreateSubmit)}
            className="flex size-full  flex-col justify-between space-y-6 "
          >
            <FormField
              control={createForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ユーザー名 ※3文字〜8文字</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className="" />
                </FormItem>
              )}
            />
            <div className="flex justify-center ">
              <Button type="submit">作成</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

const JoinForm = () => {
  const joinForm = useForm<z.infer<typeof JoinFormSchema>>({
    resolver: zodResolver(JoinFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  function onJoinSubmit(data: z.infer<typeof JoinFormSchema>) {
    socketClient.emit("joinRoom", data.username, data.password);
  }
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>ルーム参加</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...joinForm}>
          <form
            onSubmit={joinForm.handleSubmit(onJoinSubmit)}
            className="w-full space-y-6"
          >
            <FormField
              control={joinForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ユーザー名 ※3文字〜8文字</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={joinForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ルームID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button type="submit">参加</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
