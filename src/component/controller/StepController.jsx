import { ArrowForward, Pause, PlayArrow, Replay } from "@mui/icons-material"
import { IconButton, Paper, Divider, Slider } from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { Fragment, useCallback, useContext, useEffect, useState } from "react"
import { Controller } from "../../util/contexts"

import "./controller.scss"

const marks = [
  {
    value: 0,
    label: "0.5x",
  },
  {
    value: 1,
    label: "1x",
  },
  {
    value: 2,
    label: "2x",
  },
  {
    value: 3,
    label: "4x",
  },
]

export default function StepController({ reset, ended, setEnded }) {
  const [playing, setPlaying] = useState(false)
  const [stepping, setStepping] = useState(false)

  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  })

  const { step, setSpeed } = useContext(Controller)

  const next = useCallback(() => {
    setStepping(true)
    step().then(isEnded => {
      if (isEnded) {
        setEnded(true)
        setPlaying(false)
      }
      setStepping(false)
    })
  }, [step, setEnded])

  useEffect(() => {
    if (!stepping && playing) next()
  }, [stepping, playing, next])

  return (
    <ThemeProvider theme={theme}>
      <div className="controller-wrap">
        <Paper className="controller">
          {
            !ended ? (
              <Fragment>
                <IconButton aria-label="下一步" color="primary" onClick={next} disabled={stepping}>
                  <ArrowForward />
                </IconButton>
                <IconButton
                  aria-label={playing ? "暂停自动执行" : "自动执行"}
                  onClick={() => setPlaying(!playing)}
                  color={playing ? "warning" : "success"}
                >
                  {playing ? <Pause /> : <PlayArrow />}
                </IconButton>
              </Fragment>
            ) : (
              <div>算法已经结束</div>
            )
          }
          <IconButton aria-label="重置" onClick={reset} disabled={stepping}>
            <Replay />
          </IconButton>
          <Divider orientation="vertical" flexItem />
          <div>
            执行速度
          </div>
          <div>
            <Slider
              className="speed-slider"
              aria-label="执行速度"
              defaultValue={1}
              onChange={(_, v) => setSpeed(v)}
              marks={marks}
              min={0}
              max={3}
            />
          </div>
        </Paper>
      </div>
    </ThemeProvider>
  )
}