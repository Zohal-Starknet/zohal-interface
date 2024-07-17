"use client";
import { PropsWithClassName } from "@zohal/app/_lib/utils";

import Form from "../../_ui/form";
import SubPanel from "./trade-sub-pannel";

export default function Swap({ className }: PropsWithClassName) {


  return (
    <Form className={className}>
      <SubPanel className="mb-4" />
    </Form>
  );
}
