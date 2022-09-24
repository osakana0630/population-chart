import { FC, useEffect, useState, ChangeEvent, useMemo } from 'react'
import { Chart } from 'react-google-charts'
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

type PopulationData = {
  [prefCode: number]: { year: number; value: number }[]
}

const ChartsHome: FC<Props> = ({}) => {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([])
  const [selectedPrefCode, setSelectedPrefCode] = useState<number[]>([])
  const [populationData, setPopulationData] = useState<PopulationData | null>(
    null,
  )

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

  // 人口数取得
  useEffect(() => {
    if (!selectedPrefCode.length) return
    selectedPrefCode.forEach((prefCode) => {
      if (
        populationData &&
        Object.keys(populationData).includes(String(prefCode))
      ) {
        return
      }

      axios
        .get(baseUrl + `population/composition/perYear?&prefCode=${prefCode}`, {
          headers: {
            'X-API-KEY': process.env.REACT_APP_RESAS_API_KEY as string,
          },
        })
        .then((res) => {
          setPopulationData((prev) => ({
            ...prev,
            [prefCode]: res.data.result.data[0].data,
          }))
        })
    })
  }, [populationData, selectedPrefCode])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const targetCode = Number(event.target.value)
    if (event.target.checked) {
      // 重複排除処理をかませる
      setSelectedPrefCode((prev) => [
        ...Array.from(new Set([...prev, targetCode])),
      ])
    } else {
      // チェック外した時
      // 該当都道府県のチャートデータを削除する
      setSelectedPrefCode((prev) => prev.filter((code) => code !== targetCode))
      const copyPopulationData = { ...populationData }
      delete copyPopulationData[targetCode]
      setPopulationData(copyPopulationData)
    }
  }

  const isSelected = (prefCode: number) => {
    return selectedPrefCode.includes(prefCode)
  }

  const createChartData = (): any => {
    if (!selectedPrefCode.length) {
      return [
        ['年', 'dummy'],
        ['2022', 0],
      ]
    }

    const firstRow = ['年']
    prefectures.forEach((pref) => {
      if (selectedPrefCode.includes(pref.prefCode)) {
        firstRow.push(pref.prefName)
      }
    })

    const dataRow: any = []
    Object.values(populationData || {}).forEach((population, index) => {
      population.forEach((p, i) => {
        if (index === 0) {
          dataRow.push([String(p.year), p.value])
        } else {
          dataRow[i].push(p.value)
        }
      })
    })

    dataRow.unshift(firstRow)

    return dataRow
  }

  const chartData = createChartData()
  console.log(chartData)

  const options = {
    title: '年別人口数',
    curveType: 'function',
    legend: { position: 'bottom' },
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
      <Grid item xs={12}>
        <Chart
          chartType="LineChart"
          width="100%"
          height="400px"
          data={chartData}
          options={options}
        />
      </Grid>
    </Grid>
  )
}

export default ChartsHome
