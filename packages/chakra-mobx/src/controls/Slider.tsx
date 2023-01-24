import { ForwardedRef, forwardRef } from "react"
import { observer } from "mobx-react-lite"
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderProps,
} from "@chakra-ui/react"
import { ReactField } from "@json-schema-form/react"
import { useNumberSchema } from "./NumberInput.js"

type Props<P extends object> = { field: ReactField<P> } & SliderProps

export default observer(
  forwardRef(
    <P extends object>(
      { field, ...props }: Props<P>,
      ref: ForwardedRef<any>
    ) => {
      const { min, max, step } = useNumberSchema(field.schema)
      return (
        <Slider
          ref={ref}
          min={min}
          max={max}
          step={step}
          value={field.value}
          onChange={(value) => (field.value = value ?? field.value)}
          {...props}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      )
    }
  )
)
