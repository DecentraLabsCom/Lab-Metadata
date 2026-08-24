# Metadata examples

These examples are complete metadata documents for the main laboratory resource
types. They are intended for provider onboarding, marketplace rendering and
consumer integration tests. The JSON files in [`../examples/`](../examples/) are
the same examples as standalone fixtures.

The examples use `example.edu` URLs and illustrative Unix timestamps. Replace
those values with provider-owned content before publication. Metadata is a
catalogue and discovery document; it does not grant access or change the
reservation state stored on-chain.

## Example: remote laboratory

This is a short-duration remote laboratory with fixed minute-based booking
options and a single concurrent user.

```json
{
  "name": "Basic Electronics Lab",
  "description": "Remote experiments for introductory circuit analysis.",
  "image": "https://example.edu/labs/electronics/cover.png",
  "demoEnabled": false,
  "attributes": [
    {"trait_type": "resourceType", "value": "lab"},
    {"trait_type": "classification", "value": [{"scheme": "OECD-FORD", "schemeVersion": "Frascati Manual 2015", "code": "2.2", "label": "Electrical engineering, electronic engineering, information engineering"}]},
    {"trait_type": "classificationPrimaryScheme", "value": "OECD-FORD"},
    {"trait_type": "keywords", "value": ["Ohm's Law", "Kirchhoff's Laws"]},
    {"trait_type": "timeSlots", "value": [30, 60]},
    {"trait_type": "pricing", "value": {"displayAmount": "2.5", "displayUnit": "hour", "rawPricePerSecond": "6944", "roundingMode": "nearest-per-second", "billingMode": "linear-duration"}},
    {"trait_type": "bookingMode", "value": "slot"},
    {"trait_type": "allowedDurations", "value": [{"unit": "minute", "value": 30}, {"unit": "minute", "value": 60}]},
    {"trait_type": "opens", "value": 1767225600},
    {"trait_type": "closes", "value": 1798761599},
    {"trait_type": "additionalImages", "value": ["https://example.edu/labs/electronics/bench.png"]},
    {"trait_type": "docs", "value": ["https://example.edu/labs/electronics/handbook.pdf"]},
    {"trait_type": "termsOfUse", "value": {"url": "https://example.edu/labs/electronics/terms-v1.pdf", "version": "1.0", "effectiveDate": 1767225600}},
    {"trait_type": "availableDays", "value": ["MONDAY", "TUESDAY", "WEDNESDAY"]},
    {"trait_type": "availableHours", "value": {"start": "09:00", "end": "17:00"}},
    {"trait_type": "timezone", "value": "Europe/Madrid"},
    {"trait_type": "maxConcurrentUsers", "value": 1},
    {"trait_type": "unavailableWindows", "value": []}
  ]
}
```

Download the fixture: [`remote-lab.json`](../examples/remote-lab.json).

## Example: long-reservation laboratory

This example describes a remote environmental chamber for experiments lasting
from one to fourteen days. `allowedDurationRange` and `periodRules` describe
the catalogue policy; the reservation's immutable `start` and `end` timestamps
remain authoritative once it is created.

```json
{
  "name": "Environmental Chamber",
  "description": "Remote environmental chamber for experiments that require stable temperature and humidity over several hours or days.",
  "image": "https://example.edu/labs/environmental-chamber/cover.png",
  "demoEnabled": false,
  "attributes": [
    {"trait_type": "resourceType", "value": "lab"},
    {"trait_type": "classification", "value": [{"scheme": "OECD-FORD", "schemeVersion": "Frascati Manual 2015", "code": "2.7", "label": "Environmental engineering"}]},
    {"trait_type": "classificationPrimaryScheme", "value": "OECD-FORD"},
    {"trait_type": "keywords", "value": ["temperature", "humidity", "long-running experiment"]},
    {"trait_type": "pricing", "value": {"displayAmount": "12", "displayUnit": "day", "rawPricePerSecond": "1389", "roundingMode": "nearest-per-second", "billingMode": "linear-duration"}},
    {"trait_type": "bookingMode", "value": "calendar-period"},
    {"trait_type": "allowedDurationRange", "value": {"unit": "day", "min": 1, "max": 14}},
    {"trait_type": "allowedDurations", "value": [{"unit": "day", "value": 1}, {"unit": "day", "value": 2}, {"unit": "day", "value": 3}, {"unit": "day", "value": 4}, {"unit": "day", "value": 5}, {"unit": "day", "value": 6}, {"unit": "day", "value": 7}, {"unit": "day", "value": 8}, {"unit": "day", "value": 9}, {"unit": "day", "value": 10}, {"unit": "day", "value": 11}, {"unit": "day", "value": 12}, {"unit": "day", "value": 13}, {"unit": "day", "value": 14}]},
    {"trait_type": "periodRules", "value": {"startGranularity": "day", "allowCustomDateRange": true, "minDurationDays": 1, "maxDurationDays": 14}},
    {"trait_type": "opens", "value": 1767225600},
    {"trait_type": "closes", "value": 1830297599},
    {"trait_type": "additionalImages", "value": ["https://example.edu/labs/environmental-chamber/chamber.png"]},
    {"trait_type": "docs", "value": ["https://example.edu/labs/environmental-chamber/protocol.pdf"]},
    {"trait_type": "termsOfUse", "value": {"url": "https://example.edu/labs/environmental-chamber/terms-v2.pdf", "version": "2.0", "effectiveDate": 1769904000}},
    {"trait_type": "availableDays", "value": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]},
    {"trait_type": "availableHours", "value": {"start": "00:00", "end": "23:59"}},
    {"trait_type": "timezone", "value": "Europe/Madrid"},
    {"trait_type": "maxConcurrentUsers", "value": 1},
    {"trait_type": "unavailableWindows", "value": [{"startUnix": 1789344000, "endUnix": 1789430400, "reason": "Annual chamber calibration"}]}
  ]
}
```

Download the fixture: [`long-reservation-lab.json`](../examples/long-reservation-lab.json).

## Example: FMU simulation

This example describes a concurrent FMI 2.0 co-simulation. The FMU file itself
is provisioned and executed by the provider's Lab Station; metadata only
exposes discovery information and model-variable descriptors.

```json
{
  "name": "Spring Damper FMU",
  "description": "A concurrent FMU simulation for a damped spring model.",
  "image": "https://example.edu/fmu/spring-damper.png",
  "demoEnabled": false,
  "attributes": [
    {"trait_type": "resourceType", "value": "fmu"},
    {"trait_type": "classification", "value": [{"scheme": "OECD-FORD", "schemeVersion": "Frascati Manual 2015", "code": "2.3", "label": "Mechanical engineering"}]},
    {"trait_type": "classificationPrimaryScheme", "value": "OECD-FORD"},
    {"trait_type": "keywords", "value": ["FMI", "dynamics", "control"]},
    {"trait_type": "timeSlots", "value": [30, 60, 120]},
    {"trait_type": "pricing", "value": {"displayAmount": "1.5", "displayUnit": "hour", "rawPricePerSecond": "4167", "roundingMode": "nearest-per-second", "billingMode": "linear-duration"}},
    {"trait_type": "bookingMode", "value": "slot"},
    {"trait_type": "allowedDurations", "value": [{"unit": "minute", "value": 30}, {"unit": "minute", "value": 60}, {"unit": "minute", "value": 120}]},
    {"trait_type": "opens", "value": 1767225600},
    {"trait_type": "closes", "value": 1798761599},
    {"trait_type": "additionalImages", "value": []},
    {"trait_type": "docs", "value": ["https://example.edu/fmu/spring-damper-guide.pdf"]},
    {"trait_type": "termsOfUse", "value": {"url": "https://example.edu/fmu/spring-damper/terms-v1.pdf", "version": "1.0", "effectiveDate": 1767225600}},
    {"trait_type": "availableDays", "value": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]},
    {"trait_type": "availableHours", "value": {"start": "00:00", "end": "23:59"}},
    {"trait_type": "timezone", "value": "Europe/Madrid"},
    {"trait_type": "unavailableWindows", "value": []},
    {"trait_type": "fmiVersion", "value": "2.0"},
    {"trait_type": "simulationType", "value": "CoSimulation"},
    {"trait_type": "fmuFileName", "value": "spring-damper.fmu"},
    {"trait_type": "defaultStartTime", "value": 0},
    {"trait_type": "defaultStopTime", "value": 10},
    {"trait_type": "defaultStepSize", "value": 0.01},
    {"trait_type": "maxConcurrentUsers", "value": 10},
    {"trait_type": "modelVariables", "value": [{"name": "position", "causality": "output", "type": "Real", "unit": "m", "start": 0}, {"name": "velocity", "causality": "output", "type": "Real", "unit": "m/s", "start": 0}, {"name": "force", "causality": "input", "type": "Real", "unit": "N", "start": 0}]}
  ]
}
```

Download the fixture: [`fmu-simulation.json`](../examples/fmu-simulation.json).

## Validation checklist

Before publishing an example as provider metadata:

- Keep `name` and `description` populated.
- Use `resourceType: lab` for remote/physical resources and `resourceType: fmu`
  for concurrent FMU simulations.
- Keep Unix timestamps, URLs and booking rules consistent with the provider's
  actual catalogue.
- Never include credentials, JWTs, private keys or session tickets.
- Treat `price`, reservation timestamps and lifecycle state from the blockchain
  as authoritative over catalogue hints.

See the [metadata schema](metadata-schema.md) for the complete field catalogue.
