import {
  Slider,
  SliderFilledTrack,
  SliderProps,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react"
import { ReactField } from "@json-schema-forms/react"
import { observer } from "mobx-react-lite"
import { ForwardedRef, forwardRef } from "react"

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
