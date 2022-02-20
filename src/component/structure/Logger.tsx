import { useEffect, useState } from 'react'
import LoggerType, { LogType } from '../../structure/LoggerType'

import './logger.scss'

export type PropsType = {
  logger: LoggerType
}

export default function Logger({ logger }: PropsType) {
  const [logs, setLogs] = useState<LogType[]>([])

  useEffect(() => {
    logger.registerHooks(setLogs)
    return () => logger.unregisterHooks()
  }, [logger])

  return (
    <div className="logger">
      {logs.map((log, i) => (
        <div key={i} style={{ paddingLeft: 10 * log.indent }}>{log.content}</div>
      ))}
    </div>
  )
}