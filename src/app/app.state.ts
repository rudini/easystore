import { useStore } from 'src/framework/store'

export interface CounterState {
  count: number
  notChangedNumber: number,
  error: Error,
  loading: boolean
}

const initialState = {
  count: 0,
  notChangedNumber: 100,
  loading: false,
  error: null
}

const { setState, useEffect, useState } = useStore<CounterState>(initialState)
export { setState as dispatch, useEffect as dispatchEffect, useState as select };
