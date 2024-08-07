"use client";
import { PropsWithClassName } from "@zohal/app/_lib/utils";

import Form from "../../_ui/form";
import SubPanel from "./trade_sub_pannel";

export default function Swap({ className }: PropsWithClassName) {
  return (
    <Form className={className}>
      <SubPanel className="mb-2" />
    </Form>
  );
}