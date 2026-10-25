---
name: per-diem-expense-report-generator
description: Generate Evertz per diem travel expense reports as correctly formatted, self-calculating Excel workbooks from an employee name, customer, trip dates, and explicitly named partial-day dates. Use when creating or validating weekly per diem expense reports that must follow the Evertz WBD Expense report template, preserve reference tabs and formulas, split trips into Sunday-to-Saturday worksheets, and report weekly and grand totals.
---

# Per Diem Expense Report Generator

Generate one `.xlsx` workbook from the user’s travel details and the standard Evertz WBD `Expense report` template.

## Collect inputs

Before generating, obtain all four inputs:

* Employee’s full name. Ask explicitly when absent; do not infer it from profile context.
* Customer name.
* Trip start date and end date.
* Specific partial-day date(s) to pay at 50%. Ask explicitly when absent; accept `none`.

If any input is missing, ask for it before creating the workbook.

## Apply fixed assumptions

Unless the user explicitly supplies an approved variation, use:

* Destination: `United States`
* Currency: `USD`
* Full-day amount: `$100.00`, description `Per Diam - Full Day`
* Partial-day amount: `$50.00`, description `Per Diam - Partial Day`
* Department: `Service`

Do not infer partial days from arrival, departure, travel, or weekend patterns. Only dates explicitly named by the user are partial.

## Build weekly worksheets

Partition the trip into calendar weeks running Sunday through Saturday.

* Create one worksheet for every week touched by the trip, in chronological order.
* The first worksheet begins on the trip start date, even when that is not Sunday.
* The last worksheet ends on the trip end date, even when that is not Saturday.
* Title every weekly worksheet `Week Ending DD-Mon-YY`, using that week’s Saturday date. Example: `Week Ending 20-Jun-26`.
* Use the Evertz WBD `Expense report` layout and its accounting number format, including `$` and `-` for zero values.

## Populate each weekly worksheet

Keep the template’s header, totals, formulas, formatting, and blank-row behavior intact. In the header block, set:

* `WEEK ENDING` to the week’s Saturday date.
* `NAME` to the employee’s full name.
* `DEPARTMENT` to `Service`.
* `CUSTOMER TRIP` to the customer name.
* `TRIP DESTINATION` to `United States`.

Populate daily rows beginning at row 15:

* Column C: calendar date for each trip day in the worksheet’s covered range.
* Column D: exactly `Per Diam - Full Day` or `Per Diam - Partial Day`.
* Column E: `USD`.
* Column F (`Amount`): leave blank.
* Column L (`Per Diem`): `100` for full days or `50` for partial days.
* Columns G–T: preserve the template category formulas in the form `=IF($D{row}={col}$14,$F{row},"")`.
* Column U (`Total`): `=SUM(G{row}:T{row})`.
* Column V (`HST`): `0`.
* Column W (`Net of HST`): `=+U{row}-V{row}`.

For unused daily rows, retain the template’s blank-row formulas and leave date and description blank.

## Preserve totals and reference tabs

Do not remove or redesign template calculations. Preserve:

* Column-sum row 30.
* The `Subtotal` block with `=SUM(U15:U29)`.
* `Advances`.
* The `Total` calculation as `=(Subtotal-Advances)`.
* The three reference tabs: `Per Diem (USD$)`, `Per Diem (Mixed Currency)`, and `Expense Descriptions`.
* The `Internal-Use Per Diem` calculator and its `VLOOKUP` formulas, unchanged.

Order tabs as all weekly worksheets in chronological order, followed by the three reference tabs. Keep the internal-use calculator wherever it appears in the supplied template unless the template’s documented tab order requires otherwise.

## Validate and name the workbook

Before delivery:

* Recalculate all formulas so cached values are current.
* Verify there are no `#REF!`, `#VALUE!`, `#NAME?`, or other formula errors.
* Confirm each weekly total and the grand total equal full days × `$100` plus partial days × `$50`.
* Name the file `{Customer} PD Expenses {StartMon D}-{EndMon D} {Year}.xlsx`. Example: `NBC Universal PD Expenses Jun 15-Jul 10 2026.xlsx`.

## Respond after generation

Briefly summarize:

* Weeks covered.
* Explicit partial-day date(s), or `none`.
* Weekly totals.
* Grand total.

Then offer to generate the next report.
