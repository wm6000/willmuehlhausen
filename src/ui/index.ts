/**
 * The primitive layer. Pages and components import from "@/ui" and never name a
 * subfolder, so the split below can change without touching a consumer.
 *
 * Raw DOM tags are legal only inside this directory — see scripts/check-structure.mjs.
 */

export { cx } from "@/ui/cx";
export type { ClassValue } from "@/ui/cx";

export { Text } from "@/ui/text/Text";
export type { TextProps, TextSize, TextTone, TextWeight } from "@/ui/text/Text";
export { Heading } from "@/ui/text/Heading";
export type { HeadingProps } from "@/ui/text/Heading";
export { Link, NavigationLink } from "@/ui/text/Link";
export type { LinkProps, LinkVariant, NavigationLinkProps } from "@/ui/text/Link";

export { Stack } from "@/ui/box/Stack";
export type { Align, Gap, Justify, StackProps } from "@/ui/box/Stack";
export { Row } from "@/ui/box/Row";
export type { RowProps } from "@/ui/box/Row";
export { Grid } from "@/ui/box/Grid";
export type { GridProps } from "@/ui/box/Grid";
export { Box } from "@/ui/box/Box";
export type { BoxBackground, BoxPad, BoxProps } from "@/ui/box/Box";
export { Section } from "@/ui/box/Section";
export type { SectionProps } from "@/ui/box/Section";

export { Button } from "@/ui/controls/Button";
export type { ButtonProps, ButtonSize, ButtonVariant } from "@/ui/controls/Button";
export { ButtonLink } from "@/ui/controls/ButtonLink";
export type { ButtonLinkProps } from "@/ui/controls/ButtonLink";
export { Form } from "@/ui/inputs/Form";
export type { FormProps } from "@/ui/inputs/Form";
export { Field, fieldDescribedBy } from "@/ui/inputs/Field";
export type { FieldProps } from "@/ui/inputs/Field";
export { Input } from "@/ui/inputs/Input";
export type { InputProps, InputType } from "@/ui/inputs/Input";
export { Checkbox } from "@/ui/inputs/Checkbox";
export type { CheckboxProps } from "@/ui/inputs/Checkbox";
export { Select } from "@/ui/inputs/Select";
export type { SelectOption, SelectProps } from "@/ui/inputs/Select";
export { Textarea } from "@/ui/inputs/Textarea";
export type { TextareaProps } from "@/ui/inputs/Textarea";
export { Switch } from "@/ui/inputs/Switch";
export type { SwitchProps } from "@/ui/inputs/Switch";

export { Card } from "@/ui/display/Card";
export type { CardProps } from "@/ui/display/Card";
export { Badge } from "@/ui/display/Badge";
export type { BadgeProps, BadgeTone } from "@/ui/display/Badge";
export { Dot } from "@/ui/display/Dot";
export type { DotProps } from "@/ui/display/Dot";
export { Icon } from "@/ui/display/Icon";
export type { IconName, IconProps } from "@/ui/display/Icon";

export { SkipLink } from "@/ui/escapes/SkipLink";
export type { SkipLinkProps } from "@/ui/escapes/SkipLink";
export { VisuallyHidden } from "@/ui/escapes/VisuallyHidden";
export type { VisuallyHiddenProps } from "@/ui/escapes/VisuallyHidden";
