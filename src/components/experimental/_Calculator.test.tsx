import {describe, it, expect} from "vitest";
import { render, screen } from "@testing-library/react";
import {Calculator} from "./Calculator";

type Operation =  "add" | "substract" | "multiply" | "divide" | string;

interface Case  {
    a: number
    b: number
    operation : Operation
    expected: string
}

describe("Calculator", () => {
    const a = 1
    const b = 10
    const common = {a,b}

    const useCases : Case[]= [
        {...common, operation : "add", expected: "11" },
        {...common, operation : "substract", expected: "-9" },
        {...common, operation : "multiply", expected: "10" },
        {...common, operation : "divide", expected: "0.1" },
        {...common, b: 0, operation : "divide", expected: "Error" }, // dividir entre 0
        {...common, operation : "anasbsy", expected: "Invalid operation"},
    ]

    it.each(useCases)(`Deberia retornar $expected cuando $a y $b son $operation`, (option) => {
        render(<Calculator {...option} />);
        const reg = new RegExp(option.expected, "i");
        const label = screen.getByText(reg);
        expect(label).toBeInTheDocument();
    })
})