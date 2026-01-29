// API Route for Feature 1: Run-up & Pole Analysis

import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

// Base path for reference files
const basePath = path.join(process.cwd(), 'data', 'reference')
const getFilePath = (filename) => path.join(basePath, filename)

// Helper function to load and parse CSV file
function loadCSVFile(filename) {
  try {
    const filePath = getFilePath(filename)
    console.log(`Loading CSV: ${filename}`)
    console.log(`Resolved path: ${filePath}`)
    console.log(`Current working directory: ${process.cwd()}`)
    
    if (!fs.existsSync(filePath)) {
      const error = new Error(`File not found: ${filename}`)
      error.fileName = filename
      error.resolvedPath = filePath
      error.cwd = process.cwd()
      throw error
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    
    // Parse CSV with headers
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    })
    
    return records
  } catch (error) {
    console.error(`Error loading CSV file ${filename}:`, error)
    if (error.fileName) {
      console.error(`  File name: ${error.fileName}`)
      console.error(`  Resolved path: ${error.resolvedPath}`)
      console.error(`  Current working directory: ${error.cwd}`)
    }
    throw error
  }
}

// API response messages (ja / en)
const msg = {
  ja: {
    keepPole: '現在のポールを維持することを推奨します',
    recommendedPole: (l, w) => `推奨ポール: ${l}ft, ${w}lbs`,
    noPoleFound: '条件に合うポールが見つかりませんでした（±1ft、±15lbs以内）。現在のポールを維持してください。',
    startBack: (cm) => `スタート位置：${cm}cm 後ろへ`,
    startForward: (cm) => `スタート位置：${cm}cm 前へ`,
    poleBendLess: 'ポールのしなりが少ないため、ポールが硬すぎる可能性があります。柔らかいポールを使用するか、グリップ位置を高くすることを検討してください。',
    poleBendLarge: 'ポールのしなりが大きいため、ポールが柔らかすぎる可能性があります。硬いポールを使用するか、グリップ位置を低くすることを検討してください。',
    landingFront: '着地点が手前のため、回転が不足している可能性があります。スタンダードを前に移動するか、少し柔らかいポールを使用することを検討してください。',
    landingBack: '着地点が奥のため、回転しすぎている可能性があります。スタンダードを後ろに移動するか、少し硬いポールを使用することを検討してください。',
    landingCenter: '着地点が中央で、ジャンプがバランスよくできています。',
    runupSlow: '助走スピードが遅いため、助走スピードを向上させることで、より良い結果が得られる可能性があります。',
    runupGood: '助走スピードは良好です。',
    noTechFeedback: '技術的なフィードバックはありません。',
    gripDirectionHigher: '高く',
    gripDirectionLower: '低く'
  },
  en: {
    keepPole: 'We recommend keeping your current pole.',
    recommendedPole: (l, w) => `Recommended pole: ${l}ft, ${w}lbs`,
    noPoleFound: 'No suitable pole found within constraints (±1ft, ±15lbs). Please keep your current pole.',
    startBack: (cm) => `Start position: ${cm}cm back`,
    startForward: (cm) => `Start position: ${cm}cm forward`,
    poleBendLess: 'Pole bend is small; the pole may be too stiff. Consider a softer pole or a higher grip.',
    poleBendLarge: 'Pole bend is large; the pole may be too soft. Consider a stiffer pole or a lower grip.',
    landingFront: 'Landing is short; you may be under-rotating. Consider moving the standard forward or using a slightly softer pole.',
    landingBack: 'Landing is long; you may be over-rotating. Consider moving the standard back or using a slightly stiffer pole.',
    landingCenter: 'Landing is centered and the jump is well balanced.',
    runupSlow: 'Run-up speed is slow; improving it may lead to better results.',
    runupGood: 'Run-up speed is good.',
    noTechFeedback: 'No technical feedback.',
    gripDirectionHigher: 'higher',
    gripDirectionLower: 'lower'
  }
}

function getMsg(lang) {
  return msg[lang === 'en' ? 'en' : 'ja']
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const lang = req.body.lang === 'en' ? 'en' : 'ja'
    const m = getMsg(lang)

    // Parse all fields from the request body
    const {
      poleLength,      // 使用ポール長 (ft)
      poleWeight,      // 使用ポール硬さ (lbs)
      gripPosition,    // グリップ位置 (cm)
      takeoffOffset,   // 踏切位置のズレ (m)
      midMark,         // 6歩前中間マーク (m)
      poleBend,        // 湾曲（ポールのしなり具合）
      landingPoint,    // 着地点
      runupSpeed,      // 助走スピード
      notes            // その他（任意）
    } = req.body

    // Log the received data
    console.log('=== Analysis Request Received ===')
    console.log('Pole Length (ft):', poleLength)
    console.log('Pole Weight (lbs):', poleWeight)
    console.log('Grip Position (cm):', gripPosition)
    console.log('Takeoff Offset (m):', takeoffOffset)
    console.log('Mid Mark (m):', midMark)
    console.log('Pole Bend:', poleBend)
    console.log('Landing Point:', landingPoint)
    console.log('Runup Speed:', runupSpeed)
    console.log('Notes:', notes || '(なし)')
    console.log('Full request body:', JSON.stringify(req.body, null, 2))
    console.log('================================')

    // Basic validation for required fields
    const requiredFields = {
      poleLength: '使用ポール長',
      poleWeight: '使用ポール硬さ',
      gripPosition: 'グリップ位置',
      takeoffOffset: '踏切位置のズレ',
      midMark: '6歩前中間マーク',
      poleBend: '湾曲',
      landingPoint: '着地点',
      runupSpeed: '助走スピード'
    }

    const missingFields = []
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!req.body[field] || req.body[field].toString().trim() === '') {
        missingFields.push(label)
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: '必須フィールドが不足しています',
        missingFields: missingFields
      })
    }

    // Calculate Effective_lbs
    // Formula: Effective_lbs = PoleWeight_lbs + GripOffset_cm × 0.656
    const poleWeightNum = parseFloat(poleWeight)
    const gripPositionNum = parseFloat(gripPosition)
    
    if (isNaN(poleWeightNum) || isNaN(gripPositionNum)) {
      return res.status(400).json({
        error: 'ポール硬さまたはグリップ位置の値が無効です',
        details: {
          poleWeight: poleWeight,
          gripPosition: gripPosition
        }
      })
    }

    const effectiveLbs = poleWeightNum + (gripPositionNum * 0.656)
    
    console.log('=== Effective_lbs Calculation ===')
    console.log('Pole Weight (lbs):', poleWeightNum)
    console.log('Grip Position (cm):', gripPositionNum)
    console.log('Effective_lbs:', effectiveLbs.toFixed(2))
    console.log('=================================')

    // Calculate Resistance Index (RI)
    // Formula: RI = PoleWeight + 20 × (PoleLength − 14)
    const poleLengthNum = parseFloat(poleLength)
    
    if (isNaN(poleLengthNum)) {
      return res.status(400).json({
        error: 'ポール長の値が無効です',
        details: {
          poleLength: poleLength
        }
      })
    }

    const resistanceIndex = poleWeightNum + (20 * (poleLengthNum - 14))
    
    console.log('=== Resistance Index Calculation ===')
    console.log('Pole Length (ft):', poleLengthNum)
    console.log('Pole Weight (lbs):', poleWeightNum)
    console.log('Resistance Index (RI):', resistanceIndex.toFixed(2))
    console.log('===================================')

    // Load and parse CSV files
    console.log('Loading CSV files...')
    
    let djMidChartData = []
    let poleResistanceData = []
    
    try {
      // Load dj_mid_chart.csv
      djMidChartData = loadCSVFile('dj_mid_chart.csv')
      console.log(`Loaded ${djMidChartData.length} rows from dj_mid_chart.csv`)
      console.log('Sample row from dj_mid_chart.csv:', djMidChartData[0])
      
      // Load pole_resistance.csv
      poleResistanceData = loadCSVFile('pole_resistance.csv')
      console.log(`Loaded ${poleResistanceData.length} rows from pole_resistance.csv`)
      console.log('Sample row from pole_resistance.csv:', poleResistanceData[0])
    } catch (csvError) {
      console.error('Error loading CSV files:', csvError)
      const errorResponse = {
        error: 'CSVファイルの読み込みに失敗しました',
        details: csvError.message
      }
      if (csvError.fileName) {
        errorResponse.fileName = csvError.fileName
        errorResponse.resolvedPath = csvError.resolvedPath
        errorResponse.cwd = csvError.cwd
        console.error(`  Failed file: ${csvError.fileName}`)
        console.error(`  Resolved path: ${csvError.resolvedPath}`)
        console.error(`  Current working directory: ${csvError.cwd}`)
      }
      return res.status(500).json(errorResponse)
    }

    // Find recommended pole based on bend and RI
    let recommendedPole = null
    
    // Convert pole_resistance.csv data to numeric values
    const poleResistanceNumeric = poleResistanceData.map(row => ({
      length: parseFloat(row.Length_ft),
      weight: parseFloat(row.Weight_lbs),
      resistanceIndex: parseFloat(row.ResistanceIndex)
    })).filter(row => !isNaN(row.length) && !isNaN(row.weight) && !isNaN(row.resistanceIndex))

    console.log('=== Pole Recommendation ===')
    console.log('Current RI:', resistanceIndex.toFixed(2))
    console.log('Current Bend:', poleBend)
    
    if (poleBend === '普通') {
      // Keep current pole
      recommendedPole = {
        length: poleLengthNum,
        weight: poleWeightNum,
        message: m.keepPole
      }
      console.log('Recommendation: Keep current pole')
    } else {
      // Calculate target RI based on bend
      let targetRI = resistanceIndex
      
      if (poleBend === '少') {
        // RI is too high, find poles with slightly lower RI
        targetRI = resistanceIndex - 10 // Adjust by -10
        console.log('Bend is too small, looking for lower RI:', targetRI.toFixed(2))
      } else if (poleBend === '大') {
        // RI is too low, find poles with higher RI
        targetRI = resistanceIndex + 10 // Adjust by +10
        console.log('Bend is too large, looking for higher RI:', targetRI.toFixed(2))
      }

      // Filter poles within constraints: ±1ft and ±15lbs
      const filteredPoles = poleResistanceNumeric.filter(pole => {
        const lengthDiff = Math.abs(pole.length - poleLengthNum)
        const weightDiff = Math.abs(pole.weight - poleWeightNum)
        return lengthDiff <= 1 && weightDiff <= 15
      })

      console.log(`Filtered poles within constraints (${filteredPoles.length} poles):`, 
        filteredPoles.length > 0 ? filteredPoles.slice(0, 5).map(p => `${p.length}ft/${p.weight}lbs`) : 'none')

      // Find pole with closest RI to target from filtered poles
      let closestPole = null
      let minDifference = Infinity

      for (const pole of filteredPoles) {
        const difference = Math.abs(pole.resistanceIndex - targetRI)
        if (difference < minDifference) {
          minDifference = difference
          closestPole = pole
        }
      }

      if (closestPole) {
        recommendedPole = {
          length: closestPole.length,
          weight: closestPole.weight,
          resistanceIndex: closestPole.resistanceIndex,
          message: m.recommendedPole(closestPole.length, closestPole.weight)
        }
        console.log('Recommended pole:', recommendedPole)
      } else {
        console.log('No suitable pole found within constraints (±1ft, ±15lbs)')
        recommendedPole = {
          length: poleLengthNum,
          weight: poleWeightNum,
          message: m.noPoleFound
        }
      }
    }
    console.log('===========================')

    // Calculate physical takeoff point and recommend mid mark
    console.log('=== Takeoff and Mid Mark Analysis ===')
    
    // Parse takeoffOffset (handle +/- signs in string)
    let takeoffOffsetNum = 0
    if (typeof takeoffOffset === 'string') {
      // Remove spaces and parse
      const cleaned = takeoffOffset.trim().replace(/\s+/g, '')
      takeoffOffsetNum = parseFloat(cleaned)
    } else {
      takeoffOffsetNum = parseFloat(takeoffOffset)
    }
    
    if (isNaN(takeoffOffsetNum)) {
      return res.status(400).json({
        error: '踏切位置のズレの値が無効です',
        details: {
          takeoffOffset: takeoffOffset
        }
      })
    }

    // Calculate physical takeoff point: takeoff_physical = 3.30 + takeoffOffset
    let takeoffPhysical = 3.30 + takeoffOffsetNum
    
    // Constrain to between 3.00 and 4.10 meters
    takeoffPhysical = Math.max(3.00, Math.min(4.10, takeoffPhysical))
    
    console.log('Takeoff Offset (m):', takeoffOffsetNum)
    console.log('Physical Takeoff Point (m):', takeoffPhysical.toFixed(2))
    
    // Convert takeoff_physical to cm for comparison with CSV (Takeoff_cm)
    const takeoffPhysicalCm = takeoffPhysical * 100
    
    // Search dj_mid_chart for closest matching takeoff row
    const djMidChartNumeric = djMidChartData.map(row => ({
      gripCm: parseFloat(row.Grip_cm),
      takeoffCm: parseFloat(row.Takeoff_cm),
      midMarkM: parseFloat(row.Mid_mark_m)
    })).filter(row => !isNaN(row.takeoffCm) && !isNaN(row.midMarkM))
    
    let closestTakeoffRow = null
    let minTakeoffDifference = Infinity
    
    for (const row of djMidChartNumeric) {
      const difference = Math.abs(row.takeoffCm - takeoffPhysicalCm)
      if (difference < minTakeoffDifference) {
        minTakeoffDifference = difference
        closestTakeoffRow = row
      }
    }
    
    if (!closestTakeoffRow) {
      return res.status(500).json({
        error: 'dj_mid_chart.csvから適切なデータが見つかりませんでした'
      })
    }
    
    console.log('Closest takeoff row:', closestTakeoffRow)
    console.log('Base mid mark (m):', closestTakeoffRow.midMarkM)
    
    // Adjust mid mark based on takeoffOffset
    let recommendedMidMark = closestTakeoffRow.midMarkM
    let adjustment = 0
    
    if (takeoffOffsetNum > 0) {
      // Too close: add 0.05 to 0.20m (proportional to offset size)
      // Scale adjustment: max 0.20m for offset of 0.30m or more
      const maxOffset = 0.30
      const adjustmentRange = 0.20 - 0.05 // 0.15m range
      const adjustmentFactor = Math.min(1, Math.abs(takeoffOffsetNum) / maxOffset)
      adjustment = 0.05 + (adjustmentRange * adjustmentFactor)
      recommendedMidMark += adjustment
      console.log('Takeoff too close, adding', adjustment.toFixed(3), 'm')
    } else if (takeoffOffsetNum < 0) {
      // Too far: subtract 0.05 to 0.20m (proportional to offset size)
      const maxOffset = 0.30
      const adjustmentRange = 0.20 - 0.05 // 0.15m range
      const adjustmentFactor = Math.min(1, Math.abs(takeoffOffsetNum) / maxOffset)
      adjustment = -(0.05 + (adjustmentRange * adjustmentFactor))
      recommendedMidMark += adjustment
      console.log('Takeoff too far, subtracting', Math.abs(adjustment).toFixed(3), 'm')
    } else {
      console.log('Takeoff offset is zero, no adjustment needed')
    }
    
    // Round to nearest 0.05m
    recommendedMidMark = Math.round(recommendedMidMark / 0.05) * 0.05
    
    console.log('Recommended Mid Mark (m):', recommendedMidMark.toFixed(2))
    console.log('=====================================')

    // Calculate start position adjustment based on takeoffOffset
    console.log('=== Start Position Adjustment ===')
    
    let startAdjustment = null
    const offsetCm = Math.abs(takeoffOffsetNum * 100) // Convert to cm
    
    if (offsetCm < 5) {
      // Less than 5cm difference → no change
      startAdjustment = null
      console.log('Offset < 5cm, no start adjustment needed')
    } else if (offsetCm >= 5 && offsetCm < 10) {
      // 5-9cm → adjust by 5cm
      if (takeoffOffsetNum > 0) {
        startAdjustment = m.startBack(5)
      } else {
        startAdjustment = m.startForward(5)
      }
      console.log('Offset 5-9cm, adjusting by 5cm')
    } else {
      const adjustmentCm = Math.round(offsetCm / 10) * 10
      if (takeoffOffsetNum > 0) {
        startAdjustment = m.startBack(adjustmentCm)
      } else {
        startAdjustment = m.startForward(adjustmentCm)
      }
      console.log(`Offset ≥10cm, adjusting by ${adjustmentCm}cm`)
    }
    
    console.log('Start Adjustment:', startAdjustment || '変更なし')
    console.log('==================================')

    // Generate technical feedback based on poleBend, landingPoint, and runupSpeed
    console.log('=== Technical Feedback Generation ===')
    
    let techFeedback = []
    
    // Analyze pole bend
    if (poleBend === '少') {
      techFeedback.push(m.poleBendLess)
      console.log('Pole bend is too small')
    } else if (poleBend === '大') {
      techFeedback.push(m.poleBendLarge)
      console.log('Pole bend is too large')
    } else if (poleBend === '普通') {
      if (landingPoint === '手前') {
        techFeedback.push(m.landingFront)
        console.log('Landing point is too close (under-rotation)')
      } else if (landingPoint === '奥') {
        techFeedback.push(m.landingBack)
        console.log('Landing point is too far (over-rotation)')
      } else if (landingPoint === '中央') {
        techFeedback.push(m.landingCenter)
        console.log('Landing point is well-balanced')
      }
    }
    
    if (runupSpeed === '遅い') {
      techFeedback.push(m.runupSlow)
      console.log('Runup speed is slow')
    } else if (runupSpeed === '良い') {
      techFeedback.push(m.runupGood)
      console.log('Runup speed is good')
    }
    
    const techFeedbackText = techFeedback.length > 0 
      ? techFeedback.join(' ') 
      : m.noTechFeedback
    
    console.log('Technical Feedback:', techFeedbackText)
    console.log('=====================================')

    // Calculate ideal takeoff position (base: 3.30m)
    const idealTakeoffPosition = 3.30

    // Calculate grip position from top for recommended pole (if new pole is recommended)
    // グリップ位置は「ポールの先端（上）から何センチか」を表しているので、そのまま使用
    let newPoleGripFromTop = null
    let newPoleGripFists = null
    if (recommendedPole && recommendedPole.length !== poleLengthNum) {
      // グリップ位置そのものが「ポールの上から」の距離
      newPoleGripFromTop = gripPositionNum
      // Calculate number of fists (10cm per fist)
      newPoleGripFists = Math.round(newPoleGripFromTop / 10)
    }

    // Calculate grip position adjustment if keeping current pole
    // 技術的フィードバックに基づいて、現在のポールを維持する場合のグリップ位置調整を計算
    let gripAdjustment = null
    let adjustedGripPosition = null
    let adjustedGripFists = null
    
    if (poleBend === '少') {
      const adjustmentAmount = 20
      adjustedGripPosition = Math.max(0, gripPositionNum - adjustmentAmount)
      adjustedGripFists = Math.round(adjustedGripPosition / 10)
      gripAdjustment = {
        direction: m.gripDirectionHigher,
        amount: adjustmentAmount,
        newGripPosition: adjustedGripPosition,
        newGripFists: adjustedGripFists
      }
    } else if (poleBend === '大') {
      const adjustmentAmount = 20
      adjustedGripPosition = gripPositionNum + adjustmentAmount
      adjustedGripFists = Math.round(adjustedGripPosition / 10)
      gripAdjustment = {
        direction: m.gripDirectionLower,
        amount: adjustmentAmount,
        newGripPosition: adjustedGripPosition,
        newGripFists: adjustedGripFists
      }
    }

    // Calculate current mid mark and difference from recommended
    const currentMidMark = parseFloat(midMark) || 0
    const midMarkDifference = recommendedMidMark - currentMidMark
    const midMarkDifferenceCm = midMarkDifference * 100 // Convert to cm

    // Return success response with received data, calculations, and recommendation
    res.status(200).json({
      success: true,
      message: 'データを受信し、CSVファイルを読み込みました',
      receivedData: {
        poleLength,
        poleWeight,
        gripPosition,
        takeoffOffset,
        midMark,
        poleBend,
        landingPoint,
        runupSpeed,
        notes: notes || null
      },
      effectiveLbs: parseFloat(effectiveLbs.toFixed(2)),
      resistanceIndex: parseFloat(resistanceIndex.toFixed(2)),
      takeoffPhysical: parseFloat(takeoffPhysical.toFixed(2)),
      idealTakeoffPosition: parseFloat(idealTakeoffPosition.toFixed(2)),
      recommendedMidMark: parseFloat(recommendedMidMark.toFixed(2)),
      currentMidMark: parseFloat(currentMidMark.toFixed(2)),
      midMarkDifferenceCm: parseFloat(midMarkDifferenceCm.toFixed(1)),
      currentGripPosition: parseFloat(gripPositionNum.toFixed(1)),
      currentGripFists: Math.round(gripPositionNum / 10),
      newPoleGripFromTop: newPoleGripFromTop ? parseFloat(newPoleGripFromTop.toFixed(1)) : null,
      newPoleGripFists: newPoleGripFists,
      gripAdjustment: gripAdjustment,
      startAdjustment: startAdjustment,
      techFeedback: techFeedbackText,
      newPole: recommendedPole ? {
        length: recommendedPole.length,
        weight: recommendedPole.weight
      } : null,
      recommendation: recommendedPole?.message || null
    })
  } catch (error) {
    console.error('Analysis API error:', error)
    res.status(500).json({ 
      error: '分析処理中にエラーが発生しました',
      details: error.message 
    })
  }
}
