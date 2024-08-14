"use client";
import { PropsWithClassName } from "@zohal/app/_lib/utils";

import Form from "../../_ui/form";
import SubPanel from "./new_sub_pannel";

export default function Trade({ className }: PropsWithClassName) {
  return (
    <Form className={className}>
      <SubPanel className="mb-2" />
    </Form>
  );
}