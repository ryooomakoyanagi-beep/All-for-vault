import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Analysis() {
  const router = useRouter()
  // Individual useState for each input field
  const [poleLength, setPoleLength] = useState('14')
  const [poleWeight, setPoleWeight] = useState('150')
  const [gripPosition, setGripPosition] = useState('50')
  const [takeoffOffset, setTakeoffOffset] = useState('0')
  const [midMark, setMidMark] = useState('13.5')
  const [poleBend, setPoleBend] = useState('')
  const [landingPoint, setLandingPoint] = useState('')
  const [runupSpeed, setRunupSpeed] = useState('')
  const [notes, setNotes] = useState('')
  
  const [analysisResult, setAnalysisResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false)

  // Check if feedback should be shown
  useEffect(() => {
    if (analysisResult && !localStorage.getItem('feedbackSubmitted_feature1') && !localStorage.getItem('feedbackDismissed_feature1')) {
      setShowFeedbackPrompt(true)
    }
  }, [analysisResult])

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Update corresponding state based on field name
    switch (name) {
      case 'poleLength':
        setPoleLength(value)
        break
      case 'poleWeight':
        setPoleWeight(value)
        break
      case 'gripPosition':
        setGripPosition(value)
        break
      case 'takeoffOffset':
        setTakeoffOffset(value)
        break
      case 'midMark':
        setMidMark(value)
        break
      case 'poleBend':
        setPoleBend(value)
        break
      case 'landingPoint':
        setLandingPoint(value)
        break
      case 'runupSpeed':
        setRunupSpeed(value)
        break
      case 'notes':
        setNotes(value)
        break
      default:
        break
    }
  }

  // Handle pole length increment/decrement with alternating pattern
  // Pattern: 14 → 14.7 → 15 → 15.7 → 16 → 16.7 → 17 (increment)
  // Pattern: 13.7 → 13 → 12.7 → 12 → 11.7 → 11 → 10.7 → 10 (decrement)
  const adjustPoleLength = (direction) => {
    const current = parseFloat(poleLength) || 14
    const isIncrement = direction === 'increment'
    
    // Check decimal part to determine next step
    const decimalPart = current % 1
    let step
    
    if (isIncrement) {
      // If decimal is 0.0 or close to 0, add 0.7; if 0.7, add 0.3
      if (decimalPart < 0.1) {
        step = 0.7
      } else if (Math.abs(decimalPart - 0.7) < 0.1) {
        step = 0.3
      } else {
        step = 0.7
      }
    } else {
      // If decimal is 0.0 or close to 0, subtract 0.3; if 0.7, subtract 0.7
      if (decimalPart < 0.1) {
        step = -0.3
      } else if (Math.abs(decimalPart - 0.7) < 0.1) {
        step = -0.7
      } else {
        step = -0.3
      }
    }
    
    const newValue = current + step
    setPoleLength(newValue.toFixed(1))
  }

  // Handle grip position increment/decrement (10cm steps, base: 50cm)
  const adjustGripPosition = (direction) => {
    const current = parseFloat(gripPosition) || 50
    const step = direction === 'increment' ? 10 : -10
    const newValue = current + step
    
    // Ensure value doesn't go below 0
    if (newValue >= 0) {
      setGripPosition(newValue.toString())
    }
  }

  // Handle takeoff offset increment/decrement (10cm steps, base: 0cm)
  const adjustTakeoffOffset = (direction) => {
    const current = parseFloat(takeoffOffset) || 0
    const step = direction === 'increment' ? 10 : -10
    const newValue = current + step
    setTakeoffOffset(newValue.toString())
  }

  // Handle pole weight increment/decrement (10lbs steps, base: 150lbs)
  const adjustPoleWeight = (direction) => {
    const current = parseFloat(poleWeight) || 150
    const step = direction === 'increment' ? 10 : -10
    const newValue = current + step
    
    // Ensure value doesn't go below 0
    if (newValue >= 0) {
      setPoleWeight(newValue.toString())
    }
  }

  // Handle mid mark increment/decrement (0.1m steps, base: 13.5m)
  const adjustMidMark = (direction) => {
    const current = parseFloat(midMark) || 13.5
    const step = direction === 'increment' ? 0.1 : -0.1
    const newValue = current + step
    setMidMark(newValue.toFixed(2))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setAnalysisResult(null)

    try {
      // Gather all input values
      // Convert takeoffOffset from cm to m (with sign)
      const takeoffOffsetCm = parseFloat(takeoffOffset) || 0
      const takeoffOffsetM = (takeoffOffsetCm / 100).toFixed(2)
      const takeoffOffsetWithSign = takeoffOffsetCm >= 0 ? `+${takeoffOffsetM}` : takeoffOffsetM
      
      const formData = {
        poleLength,
        poleWeight,
        gripPosition,
        takeoffOffset: takeoffOffsetWithSign,
        midMark,
        poleBend,
        landingPoint,
        runupSpeed,
        notes
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || '分析に失敗しました')
      }

      const data = await response.json()
      setAnalysisResult(data)
    } catch (err) {
      setError(err.message)
      console.error('Analysis error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="analysis-page relative min-h-screen overflow-hidden">
      <Head>
        <title>Run-up Analysis - All for Vault</title>
        <meta name="description" content="Run-up & Pole 分析ページ" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-center bg-cover blur-sm"
          style={{ backgroundImage: "url(/picture1.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <main className="analysis-container relative z-10">
        <Link href="/" className="back-link">← ホームに戻る</Link>
        
        <h1 className="analysis-title">Run-up Analysis</h1>
        <p className="analysis-subtitle">助走、踏切位置、ポールの分析を行います</p>

        <form onSubmit={handleSubmit} className="analysis-form">
          <div className="form-group">
            <label htmlFor="poleLength">使用ポール長 (ft)</label>
            <div className="pole-length-control">
              <button
                type="button"
                className="pole-length-button"
                onClick={() => adjustPoleLength('decrement')}
                aria-label="ポール長を減らす"
              >
                −
              </button>
              <input
                type="number"
                id="poleLength"
                name="poleLength"
                value={poleLength}
                onChange={handleChange}
                placeholder="14"
                step="0.1"
                required
                className="pole-length-input"
              />
              <button
                type="button"
                className="pole-length-button"
                onClick={() => adjustPoleLength('increment')}
                aria-label="ポール長を増やす"
              >
                ＋
              </button>
            </div>
            {!poleLength && (
              <p className="field-hint">基準: 14ft（ボタンで調整）</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="poleWeight">使用ポール硬さ (lbs)</label>
            <div className="pole-weight-control">
              <button
                type="button"
                className="pole-weight-button"
                onClick={() => adjustPoleWeight('decrement')}
                aria-label="ポール硬さを10lbs減らす"
              >
                ←
              </button>
              <input
                type="number"
                id="poleWeight"
                name="poleWeight"
                value={poleWeight}
                onChange={handleChange}
                placeholder="150"
                step="10"
                min="0"
                required
                className="pole-weight-input"
              />
              <button
                type="button"
                className="pole-weight-button"
                onClick={() => adjustPoleWeight('increment')}
                aria-label="ポール硬さを10lbs増やす"
              >
                →
              </button>
            </div>
            <p className="field-hint">基準: 150lbs（10lbs単位で調整）</p>
          </div>

          <div className="form-group">
            <label htmlFor="gripPosition">
              グリップ位置 (cm)
              <span className="field-note">（ポールの先端から何センチか）</span>
            </label>
            <div className="grip-position-control">
              <button
                type="button"
                className="grip-position-button"
                onClick={() => adjustGripPosition('decrement')}
                aria-label="グリップ位置を10cm減らす"
              >
                ←
              </button>
              <input
                type="number"
                id="gripPosition"
                name="gripPosition"
                value={gripPosition}
                onChange={handleChange}
                placeholder="50"
                step="10"
                min="0"
                required
                className="grip-position-input"
              />
              <button
                type="button"
                className="grip-position-button"
                onClick={() => adjustGripPosition('increment')}
                aria-label="グリップ位置を10cm増やす"
              >
                →
              </button>
            </div>
            <p className="field-hint">基準: 50cm（10cm単位で調整、こぶし一個=10cm）</p>
          </div>

          <div className="form-group">
            <label htmlFor="takeoffOffset">踏切位置のズレ (cm)</label>
            <div className="takeoff-offset-control">
              <button
                type="button"
                className="takeoff-offset-button"
                onClick={() => adjustTakeoffOffset('decrement')}
                aria-label="踏切位置のズレを10cm減らす（オーバー）"
              >
                ←
              </button>
              <input
                type="number"
                id="takeoffOffset"
                name="takeoffOffset"
                value={takeoffOffset}
                onChange={handleChange}
                placeholder="0"
                step="10"
                required
                className="takeoff-offset-input"
              />
              <button
                type="button"
                className="takeoff-offset-button"
                onClick={() => adjustTakeoffOffset('increment')}
                aria-label="踏切位置のズレを10cm増やす（届いていない）"
              >
                →
              </button>
            </div>
            <p className="field-hint">
              基準: 0cm（10cm単位で調整）<br />
              ＋の場合：届いていない / −の場合：オーバーしている
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="midMark">6歩前中間マーク (m)</label>
            <div className="midmark-control">
              <button
                type="button"
                className="midmark-button"
                onClick={() => adjustMidMark('decrement')}
                aria-label="6歩前中間マークを0.1m減らす"
              >
                ←
              </button>
              <input
                type="number"
                id="midMark"
                name="midMark"
                value={midMark}
                onChange={handleChange}
                placeholder="13.5"
                step="0.1"
                required
                className="midmark-input"
              />
              <button
                type="button"
                className="midmark-button"
                onClick={() => adjustMidMark('increment')}
                aria-label="6歩前中間マークを0.1m増やす"
              >
                →
              </button>
            </div>
            <p className="field-hint">基準: 13.5m（0.1m単位で調整）</p>
          </div>

          <div className="form-group">
            <label htmlFor="poleBend">湾曲（ポールのしなり具合）</label>
            <select
              id="poleBend"
              name="poleBend"
              value={poleBend}
              onChange={handleChange}
              required
            >
              <option value="">選択してください</option>
              <option value="少">少</option>
              <option value="普通">普通</option>
              <option value="大">大</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="landingPoint">着地点</label>
            <select
              id="landingPoint"
              name="landingPoint"
              value={landingPoint}
              onChange={handleChange}
              required
            >
              <option value="">選択してください</option>
              <option value="手前">手前</option>
              <option value="中央">中央</option>
              <option value="奥">奥</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="runupSpeed">助走スピード</label>
            <select
              id="runupSpeed"
              name="runupSpeed"
              value={runupSpeed}
              onChange={handleChange}
              required
            >
              <option value="">選択してください</option>
              <option value="良い">良い</option>
              <option value="普通">普通</option>
              <option value="遅い">遅い</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="notes">その他（疲労度や風の有無）</label>
            <textarea
              id="notes"
              name="notes"
              value={notes}
              onChange={handleChange}
              placeholder="その他の情報やメモを入力してください"
              rows={4}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="submit-button"
          >
            {loading ? '分析中...' : '分析する'}
          </button>
        </form>

        {error && (
          <div className="error-message">
            <p>エラー: {error}</p>
          </div>
        )}

        {loading && (
          <div className="loading-message">
            <p>分析中…</p>
          </div>
        )}

        {analysisResult && (
          <div className="result-section">
            <h2 className="result-title">分析結果</h2>
            
            {/* 【結論】 */}
            <div className="result-item">
              <h3 className="result-heading">【結論】</h3>
              <p className="result-content">
                {analysisResult.gripAdjustment ? (
                  <>
                    現在のポールを維持することを推奨します。
                    <span> | 推奨グリップ位置: {analysisResult.gripAdjustment.newGripPosition.toFixed(1)}cm（拳{analysisResult.gripAdjustment.newGripFists}個目）</span>
                  </>
                ) : analysisResult.newPole ? (
                  <>
                    推奨ポール: {analysisResult.newPole.length}ft, {analysisResult.newPole.weight}lbs
                    {analysisResult.currentGripPosition !== undefined && (
                      <span> | 現在のポール: {analysisResult.currentGripPosition.toFixed(1)}cm（拳{analysisResult.currentGripFists}個目）</span>
                    )}
                  </>
                ) : (
                  <>
                    現在のポールを維持することを推奨します。
                    {analysisResult.currentGripPosition !== undefined && (
                      <span> | 現在のポール: {analysisResult.currentGripPosition.toFixed(1)}cm（拳{analysisResult.currentGripFists}個目）</span>
                    )}
                  </>
                )}
              </p>
            </div>

            {/* 【ポール・グリップ提案】 */}
            {(analysisResult.newPole || analysisResult.gripAdjustment) && (
              <div className="result-item">
                <h3 className="result-heading">【ポール・グリップ提案】</h3>
                <p className="result-content">
                  {/* アプローチ1: ポールを変えない場合のグリップ位置調整 */}
                  {analysisResult.gripAdjustment && (
                    <span>
                      <strong>アプローチ1（現在のポールを維持）:</strong> グリップ位置を{analysisResult.gripAdjustment.direction}{analysisResult.gripAdjustment.amount}cm調整してください。
                      推奨グリップ位置: {analysisResult.gripAdjustment.newGripPosition.toFixed(1)}cm（拳{analysisResult.gripAdjustment.newGripFists}個目）
                      <br /><br />
                    </span>
                  )}
                  
                  {/* アプローチ2: ポールを変えた場合 */}
                  {analysisResult.newPole && (
                    <span>
                      <strong>アプローチ2（ポールを変更）:</strong> {analysisResult.recommendation || 
                       `推奨ポール: ${analysisResult.newPole.length}ft, ${analysisResult.newPole.weight}lbs`}
                      {analysisResult.newPoleGripFromTop !== null && analysisResult.newPoleGripFromTop !== undefined && (
                        <span> | グリップ位置: {analysisResult.newPoleGripFromTop.toFixed(1)}cm（拳{analysisResult.newPoleGripFists}個目）</span>
                      )}
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* 【助走調整】 */}
            {(analysisResult.startAdjustment || analysisResult.recommendedMidMark) && (
              <div className="result-item">
                <h3 className="result-heading">【助走調整】</h3>
                <p className="result-content">
                  {analysisResult.startAdjustment && (
                    <span>{analysisResult.startAdjustment}<br /></span>
                  )}
                  {analysisResult.recommendedMidMark && (
                    <span>
                      推奨中間マーク: {analysisResult.recommendedMidMark.toFixed(2)}m
                      {analysisResult.currentMidMark !== undefined && (
                        <span>（現在: {analysisResult.currentMidMark.toFixed(2)}m</span>
                      )}
                      {analysisResult.midMarkDifferenceCm !== undefined && analysisResult.midMarkDifferenceCm !== 0 && (
                        <span>
                          {analysisResult.midMarkDifferenceCm > 0 ? '+' : ''}
                          {analysisResult.midMarkDifferenceCm.toFixed(1)}cm
                        </span>
                      )}
                      {analysisResult.currentMidMark !== undefined && <span>）</span>}
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* 【技術的フィードバック】 */}
            {analysisResult.techFeedback && (
              <div className="result-item">
                <h3 className="result-heading">【技術的フィードバック】</h3>
                <p className="result-content">{analysisResult.techFeedback}</p>
              </div>
            )}

            {/* 【追加データで精度向上】 */}
            {analysisResult.takeoffPhysical && (
              <div className="result-item">
                <h3 className="result-heading">【追加データで精度向上】</h3>
                <p className="result-content">
                  物理的踏切位置: {analysisResult.takeoffPhysical.toFixed(2)}m
                  {analysisResult.idealTakeoffPosition && (
                    <span> | 理想の踏切位置: {analysisResult.idealTakeoffPosition.toFixed(2)}m</span>
                  )}
                  {analysisResult.newPoleGripFromTop !== null && analysisResult.newPoleGripFromTop !== undefined && (
                    <span>
                      <br />
                      変更後ポールの上から: {analysisResult.newPoleGripFromTop.toFixed(1)}cm
                      {analysisResult.newPoleGripFists !== null && (
                        <span>（拳{analysisResult.newPoleGripFists}個目）</span>
                      )}
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Feedback Prompt */}
        {showFeedbackPrompt && (
          <div className="mt-6 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm p-6 rounded-2xl">
            <p className="text-white font-semibold mb-4">分析は完了しました。30秒でフィードバックお願いします</p>
            <div className="flex gap-4">
              <Link
                href="/feedback?feature=feature1"
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                フィードバックする
              </Link>
              <button
                onClick={() => {
                  localStorage.setItem('feedbackDismissed_feature1', '1')
                  setShowFeedbackPrompt(false)
                }}
                className="px-6 py-2 bg-slate-700/50 text-slate-300 font-semibold rounded-lg hover:bg-slate-700 transition-all"
              >
                あとで
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
