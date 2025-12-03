import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { ChevronDown, Check } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";

export default function CurrencySelector() {
  const { currency, toggleCurrency } = useCurrency();

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="light"
          className="text-white min-w-0 px-2 gap-1 font-medium h-10 data-[hover=true]:bg-white/10"
        >
          <span className="text-sm tracking-wide">{currency}</span>
          <ChevronDown className="h-4 w-4 opacity-70" />
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Seleccionar moneda"
        variant="faded"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={new Set([currency])}
        onSelectionChange={(keys) => toggleCurrency(Array.from(keys)[0])}
        className=""
      >
        <DropdownItem key="COP" textValue="COP">
          <div className="flex justify-between items-center w-full">
            <span className="font-medium text-gray-700">COP</span>
          </div>
        </DropdownItem>

        <DropdownItem key="USD" textValue="USD">
          <div className="flex justify-between items-center w-full">
            <span className="font-medium text-gray-700">USD</span>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}