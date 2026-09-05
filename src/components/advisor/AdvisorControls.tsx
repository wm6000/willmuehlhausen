import { Field, Grid, Select } from "@/ui";
import { CITIES, PASSES, SKI_TYPES, type City, type SkiType } from "@/data/ski";

export type AdvisorControlsProps = {
  city: City;
  pass: string;
  skiType: SkiType;
  onCity: (city: City) => void;
  onPass: (pass: string) => void;
  onSkiType: (type: SkiType) => void;
};

const CITY_OPTIONS = CITIES.map((city) => ({ value: city, label: city }));
const PASS_OPTIONS = PASSES.map((pass) => ({ value: pass, label: pass }));
const TYPE_OPTIONS = SKI_TYPES.map((type) => ({ value: type.value, label: type.label }));

/**
 * Signed out, these stand in for the profile: they're the three things the advisor
 * would otherwise know about you. Signed in they disappear, because it does.
 */
export function AdvisorControls({ city, pass, skiType, onCity, onPass, onSkiType }: AdvisorControlsProps) {
  return (
    <Grid gap={4} className="advisor-controls">
      <Field id="advisor-city" label="Near">
        <Select
          id="advisor-city"
          value={city}
          options={CITY_OPTIONS}
          onChange={(value) => onCity(value as City)}
        />
      </Field>
      <Field id="advisor-pass" label="Ski pass">
        <Select id="advisor-pass" value={pass} options={PASS_OPTIONS} onChange={onPass} />
      </Field>
      <Field id="advisor-type" label="Ski type">
        <Select
          id="advisor-type"
          value={skiType}
          options={TYPE_OPTIONS}
          onChange={(value) => onSkiType(value as SkiType)}
        />
      </Field>
    </Grid>
  );
}
