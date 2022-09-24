import { FC, useEffect, useState, ChangeEvent } from 'react'
import {
  Grid,
  Checkbox,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
} from '@mui/material'
import axios from 'axios'

type Props = {}

type Prefecture = {
  prefCode: number
  prefName: string
}

const baseUrl = 'https://opendata.resas-portal.go.jp/api/v1/'

const ChartsHome: FC<Props> = ({}) => {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([])
  const [selectedPrefCode, setSelectedPrefCode] = useState<number[]>([])

  // 都道府県取得
  useEffect(() => {
    axios
      .get(baseUrl + 'prefectures', {
        headers: { 'X-API-KEY': process.env.REACT_APP_RESAS_API_KEY as string },
      })
      .then((res) => {
        setPrefectures(res.data.result)
      })
  }, [])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const targetCode = Number(event.target.value)
    if (event.target.checked) {
      // 重複排除処理をかませる
      setSelectedPrefCode((prev) => [
        ...Array.from(new Set([...prev, targetCode])),
      ])
    } else {
      setSelectedPrefCode((prev) => prev.filter((code) => code !== targetCode))
    }
  }

  const isSelected = (prefCode: number) => {
    return selectedPrefCode.includes(prefCode)
  }

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        padding: '60px',
      }}
    >
      <h1>チャートホーム画面</h1>
      {/* チェックボックス */}
      <Grid item xs={12}>
        <h3>人口推移を表示したい都道府県を選択してください</h3>
        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
          <FormLabel component="legend">都道府県</FormLabel>
          <FormGroup row>
            {prefectures.map((pref, i) => (
              <FormControlLabel
                key={i}
                checked={isSelected(pref.prefCode)}
                value={pref.prefCode}
                control={
                  <Checkbox name={pref.prefName} onChange={handleChange} />
                }
                label={pref.prefName}
              />
            ))}
          </FormGroup>
        </FormControl>
      </Grid>

      {/* chart 部分*/}
      <Grid item xs={12}></Grid>
    </Grid>
  )
}

export default ChartsHome
