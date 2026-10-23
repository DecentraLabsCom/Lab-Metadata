# Metadata schema

This is the normative off-chain shape. JSON object keys are case-sensitive.

## Top-level fields

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `name` | yes | string | Human-readable lab or simulation name. |
| `description` | yes | string | Human-readable description. |
| `image` | recommended | string | Primary HTTPS URL. |
| `demoEnabled` | no | boolean | Indicates that a provider offers a public demonstration. It does not grant access or bypass authorization. |
| `attributes` | no | object[] | Objects with `trait_type` and `value`. |

The document root contains `name`, `description`, the optional primary `image`, the
optional `demoEnabled` flag and the `attributes` collection. Additional images and
documentation are represented by the `additionalImages` and `docs` attributes.

## Standard attributes

`keywords`, `timeSlots` (minutes), `opens`, `closes`, `availableDays`,
`availableHours`, `timezone`, `maxConcurrentUsers`, `unavailableWindows`, and
`termsOfUse` are discovery and policy fields. Use Unix seconds for timestamps and
`HH:mm` for local hours. `maxConcurrentUsers` is meaningful for FMU resources; the
on-chain numeric `resourceType` remains authoritative (`0` = lab, `1` = FMU). For
metadata consumers, the equivalent attribute values are conventionally `lab` and
`fmu`.

The recommended shapes are:

| Attribute | Shape |
| --- | --- |
| `availableDays` | Array of uppercase weekday names (`MONDAY` … `SUNDAY`). |
| `availableHours` | `{ "start": "HH:mm", "end": "HH:mm" }`. |
| `unavailableWindows` | Array of `{ "startUnix": number, "endUnix": number, "reason": string }`. |
| `termsOfUse` | `{ "url": string, "version": string, "effectiveDate": number, "sha256": string? }`; `effectiveDate` is Unix seconds and `sha256`, when present, is a lowercase 64-character hex digest. |

The following attributes describe classification, pricing and booking:

| Attribute | Meaning |
| --- | --- |
| `classification` | Array of `{ scheme, schemeVersion, code, label }`; current schemes are `OECD-FORD` and optional `ISCED-F`. |
| `classificationPrimaryScheme` | Usually `OECD-FORD`. |
| `educationalProgramLinked` | Boolean indicating that ISCED-F fields are intentionally linked. |
| `pricing` | `{ displayAmount, displayUnit, rawPricePerSecond, roundingMode, billingMode }`; `rawPricePerSecond` uses 10,000,000 raw units per credit and `roundingMode` is `nearest-per-second`. |
| `bookingMode` | `slot` for minute slots or `calendar-period` for day/week/month ranges. |
| `allowedDurationRange` | `{ unit, min, max }` for calendar-period bookings. |
| `allowedDurations` | Expanded duration options, each `{ unit, value }`. |
| `periodRules` | `{ startGranularity, minimumNoticeHours?, allowCustomDateRange, minDurationDays, maxDurationDays, enforceDailyWindow? }`. |

These fields describe catalog and billing presentation. The contract's raw `price` and
the reservation's immutable timestamps remain authoritative for settlement.

`enforceDailyWindow` is relevant to `calendar-period` bookings: when `true`,
`availableHours` applies to the booking start and end; when omitted or `false`,
long-running bookings are not restricted by that daily window. `minimumNoticeHours`
specifies an optional minimum notice period in hours.

For an hourly display amount, `rawPricePerSecond` is the nearest integer to
`displayAmount * 10,000,000 / 3,600`. For day/week/month displays, convert the
corresponding calendar duration to seconds first. Keep the raw value as a string to
avoid JavaScript number precision loss.

FMU documents may additionally expose `fmiVersion`, `simulationType`, `fmuFileName`,
`defaultStartTime`, `defaultStopTime`, `defaultStepSize`, and `modelVariables`.
`modelVariables` is an array of descriptors such as `{ name, displayName, description, causality,
variability, type, unit, displayUnit, start, min, max, enumItems }`. FMI descriptions,
numeric bounds, enumeration choices and display-unit conversion metadata are retained
when available. A `displayUnit` object uses `{ name, factor, offset, inverse? }`.
For normal display units the conversion is `display value = factor * FMI value + offset`;
when `inverse` is true (FMI 3), it is `display value = factor / FMI value` and the
offset must be zero. `enumItems` is an array of
`{ value, name, description? }` entries. `min` and `max` are numeric operating-range
bounds, not a declared input resolution. `displayName` is an optional user-facing
label; `name` remains the FMI identifier. It can be populated from an AAS display
name by a metadata producer, but this metadata contract does not perform AAS
language selection. Keep `unit` as the model's FMI unit; the UI
converts to and from `displayUnit` while sending values to the FMU in its native unit.
Optional variable metadata should come from the FMU or a linked semantic source; do
not repeat FMI values in another field.
For an FMU resource, include `fmuFileName`. The auto-described trio `fmiVersion`,
`simulationType` and `modelVariables` may be absent; when present, the fields must be
coherent.

See the [metadata examples](examples.md), or download the complete JSON fixtures:
[`remote-lab.json`](../examples/remote-lab.json),
[`long-reservation-lab.json`](../examples/long-reservation-lab.json) and
[`fmu-simulation.json`](../examples/fmu-simulation.json).
