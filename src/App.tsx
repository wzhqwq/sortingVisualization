import './App.scss'
import { AppBar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, TextField, Toolbar, Typography } from '@mui/material'
import { BoltRounded, BubbleChart, CallMergeRounded, ChangeHistory, DownloadRounded, Filter1Rounded, FilterNoneRounded, Menu, Shuffle, TouchAppRounded } from '@mui/icons-material'
import { Fragment, useCallback, useContext, useEffect, useState } from 'react'
import { HashRouter, Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom'
import StepController from './component/controller/StepController'
import ContextWrapper from './util/ContextWrapper'
import Stage from './component/stage/Stage'
import { Algorithm } from './algorithm/algorithmType'
import { Controller } from './util/contexts'
import bubbleSort from './algorithm/bubbleSort'
import { MapLike } from 'typescript'
import selectionSort from './algorithm/selectionSort'
import insertionSort from './algorithm/insertionSort'
import quickSort from './algorithm/quickSort'
import mergeSort from './algorithm/mergeSort'
import heapSort from './algorithm/heapSort'
import boxSort from './algorithm/boxSort'

type PageInfoType = {
  title: string,
  icon: JSX.Element,
  algorithm: Algorithm,
}

const pages: MapLike<PageInfoType> = {
  '/box': {
    title: '箱子排序',
    icon: <FilterNoneRounded />,
    algorithm: boxSort,
  },
  '/bubble': {
    title: '冒泡排序',
    icon: <BubbleChart />,
    algorithm: bubbleSort,
  },
  '/heap': {
    title: '堆排序',
    icon: <ChangeHistory />,
    algorithm: heapSort,
  },
  '/insert': {
    title: '插入排序',
    icon: <DownloadRounded />,
    algorithm: insertionSort,
  },
  '/merge': {
    title: '归并排序（非递归）',
    icon: <CallMergeRounded />,
    algorithm: mergeSort,
  },
  '/quick': {
    title: '快速排序',
    icon: <BoltRounded />,
    algorithm: quickSort,
  },
  '/radix': {
    title: '基数排序',
    icon: <Filter1Rounded />,
    algorithm: null,
  },
  '/select': {
    title: '选择排序',
    icon: <TouchAppRounded />,
    algorithm: selectionSort,
  },
}

function App() {
  const [open, setOpen] = useState(false)
  const [showGenerateData, setShowGenerateData] = useState(false)
  const [arr, setArr] = useState([2, 3, 3])
  const [startNumber, setStartNumber] = useState(0)
  const [endNumber, setEndNumber] = useState(100)
  const [size, setSize] = useState(10)

  const navigate = useNavigate()
  const location = useLocation()

  const generateData = useCallback(() => {
    const arrNew = []
    for (let i = 0; i < size; i++) {
      arrNew.push(Math.floor(Math.random() * (endNumber - startNumber + 1)) + startNumber)
    }
    setArr(arrNew)
    setShowGenerateData(false)
  }, [startNumber, endNumber, size])

  return (
    <div className="app">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="选择算法" onClick={() => setOpen(!open)}>
            <Menu />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {pages[location.pathname]?.title || ''}
          </Typography>
          <Button color="inherit" onClick={() => setShowGenerateData(true)}>
            <Shuffle />
            随机生成数据
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <List sx={{ width: 250 }}>
          {
            Object.keys(pages).map(page => (
              <ListItemButton key={page} onClick={() => {
                navigate(page)
                setOpen(false)
              }}>
                <ListItemIcon>
                  {pages[page].icon}
                </ListItemIcon>
                <ListItemText primary={pages[page].title} />
              </ListItemButton>
            ))
          }
        </List>
      </Drawer>
      <ContextWrapper>
        <Routes>
          <Route path="/" element={<Navigate to="/bubble" replace />} />
          {Object.keys(pages).filter(page => pages[page].algorithm).map(page => (
            <Route path={page} element={<AlgorithmPage algorithm={pages[page].algorithm} arr={arr} />} key={page} />
          ))}
        </Routes>
      </ContextWrapper>
      <Dialog open={showGenerateData} onClose={() => setShowGenerateData(false)}>
        <DialogTitle>随机生成数据</DialogTitle>
        <DialogContent>
          <div className="form-line">
            <TextField type="number" size="small" label="数据规模" value={size} onChange={e => setSize(parseInt(e.target.value))} />
          </div>
          <div className="form-line">
            <TextField type="number" size="small" label="数据范围起始" value={startNumber} onChange={e => setStartNumber(parseInt(e.target.value))} />
            <span>~</span>
            <TextField type="number" size="small" label="数据范围结束" value={endNumber} onChange={e => setEndNumber(parseInt(e.target.value))} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowGenerateData(false)}>取消</Button>
          <Button variant="contained" onClick={generateData}>随机生成</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

function AlgorithmPage({ algorithm, arr }: {algorithm: Algorithm, arr: number[]}) {
  const [ended, setEnded] = useState(false)

  const controller = useContext(Controller)

  useEffect(() => {
    setEnded(controller.startAlgorithm(arr, algorithm))
    return () => controller.stopAlgorithm()
  }, [controller, algorithm, arr])

  const reset = useCallback(() => {
    controller.stopAlgorithm()
    setEnded(false)
    setEnded(controller.startAlgorithm(arr, algorithm))
  }, [controller, algorithm, arr])

  return (
    <Fragment>
      <Stage />
      <StepController ended={ended} setEnded={setEnded} reset={reset} />
    </Fragment>
  )
}

function AppWrapped() {
  return (
    <HashRouter>
      <App />
    </HashRouter>
  )
}

export default AppWrapped