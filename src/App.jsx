import { useState, useRef } from 'react'
import { motion } from 'framer-motion' // eslint-disable-line
import { topics } from './data'
import { numberToDanish } from './numberUtils'
import { FaGithub, FaInstagram, FaTelegram, FaEnvelope, FaSun, FaCloud, FaCloudRain, FaSnowflake, FaBolt, FaWind, FaTemperatureHalf } from 'react-icons/fa6'
import './App.css'
import { Analytics } from '@vercel/analytics/react'

const DANISH_CHARS = ['æ', 'ø', 'å', 'Æ', 'Ø', 'Å']
const VERB_COLS = ['imperativ', 'infinitiv', 'praesens', 'imperfektum', 'perfektum', 'english']
const VERB_LABELS = { imperativ: 'Imperativ', infinitiv: 'Infinitiv', praesens: 'Præsens', imperfektum: 'Imperfektum', perfektum: 'Perfektum', english: 'English' }
const WEATHER_TEMPERATURES = [25, 20, 15, 13, 12, -5, -9, 6]
const CLOCK_QUIZ_TIMES = [
  '08:00',
  '08:15',
  '08:30',
  '08:45',
  '08:02',
  '07:47',
  '09:05',
  '10:10',
  '11:20',
  '12:25',
  '13:35',
  '18:50',
]
const WEATHER_ICONS = {
  sun: FaSun,
  'cloud-sun': FaCloud,
  cloud: FaCloud,
  rain: FaCloudRain,
  wind: FaWind,
  snow: FaSnowflake,
  storm: FaBolt,
}
const HOUSING_ROOMS = [
  { number: 1, danish: 'en entré', planName: 'entré', english: 'an entrance hall', className: 'entry', type: 'Entrance', items: ['🚪', '🧥'], fixtures: ['dør', 'knagerække'], words: ['en entré', 'en opgang', 'en knagerække'] },
  { number: 2, danish: 'en gang', planName: 'gang', english: 'a hallway', className: 'hall', type: 'Hallway', items: ['↔️', '🚪', '🚪'], fixtures: ['døre'], words: ['en gang', 'et værelse'] },
  { number: 3, danish: 'et køkken', planName: 'køkken', english: 'a kitchen', className: 'kitchen', type: 'Kitchen', items: ['🧊', '🚰', '🍳', '🍽️'], fixtures: ['køleskab', 'vask', 'komfur', 'bord'], words: ['et køkken', 'et køkkenbord', 'et køleskab', 'en fryser', 'et komfur', 'en ovn', 'et køkkenskab', 'en skuffe', 'en thermokande', 'en tallerken', 'en kniv', 'en gaffel', 'en ske', 'en elkedel', 'en køkkenvask', 'en emhætte', 'en potteplante', 'et gardin', 'et skærebræt'] },
  { number: 4, danish: 'en spisestue', planName: 'spisestue', english: 'a dining room', className: 'dining', type: 'Dining room', items: ['🍽️', '🪑', '🪑'], fixtures: ['bord', 'stole'], words: ['en spisestue', 'en tallerken', 'en kniv', 'en gaffel', 'en ske', 'et hvidt bord', 'det er hvidt'] },
  { number: 5, danish: 'et bryggers', planName: 'bryggers', english: 'a utility room', className: 'utility', type: 'Utility', items: ['🧺', '🧼'], fixtures: ['vask', 'skab'], words: ['et bryggers', 'et køkkenskab', 'en skuffe', 'en vandhane', 'en håndvask'] },
  { number: 6, danish: 'et badeværelse', planName: 'bad', english: 'a bathroom', className: 'bathroom', type: 'Bathroom', items: ['🚿', '🚰', '🪞'], fixtures: ['bruser', 'håndvask'], words: ['et badeværelse', 'en bruseniche', 'en bruser', 'en håndvask', 'en vandhane', 'et spejl', 'en hylde', 'en bademåtte', 'et badeforhæng', 'et håndklæde', 'en hårtørrer', 'en tandbørste', 'en sæbe', 'en knagerække'] },
  { number: 7, danish: 'et toilet', planName: 'toilet', english: 'a toilet', className: 'toilet', type: 'Toilet', items: ['🚽', '🧻'], fixtures: ['toilet', 'papir'], words: ['et toilet', 'en toiletrulle', 'en håndvask', 'en vandhane', 'en sæbe'] },
  { number: 8, danish: 'en stue', planName: 'stue', english: 'a living room', className: 'living', type: 'Living room', items: ['🛋️', '📺', '🪴'], fixtures: ['sofa', 'tv', 'plante'], words: ['en stue', 'en hvid sofa', 'den er hvid', 'en potteplante', 'tre hvide blomster', 'de er hvide'] },
  { number: 9, danish: 'et soveværelse', planName: 'soveværelse', english: 'a bedroom', className: 'bedroom', type: 'Bedroom', items: ['🛏️', '🪟'], fixtures: ['seng', 'vindue'], words: ['et soveværelse', 'et værelse', 'et gardin'] },
  { number: 10, danish: 'et børneværelse', planName: 'børneværelse', english: "a children's room", className: 'kids', type: "Children's room", items: ['🧸', '🛏️'], fixtures: ['legetøj', 'seng'], words: ['et børneværelse', 'et værelse', 'tre hvide blomster'] },
  { number: 11, danish: 'et kontor / et arbejdsværelse', planName: 'kontor', english: 'an office / study', className: 'office', type: 'Office / study', items: ['💻', '📚'], fixtures: ['skrivebord', 'bøger'], words: ['et kontor', 'et arbejdsværelse', 'et værelse', 'et hvidt bord'] },
]

function DanishKeyboard({ onChar }) {
  return (
    <div className="danish-keyboard">
      <p>DK</p>
      {DANISH_CHARS.map(c => (
        <button key={c} onClick={() => onChar(c)}>{c}</button>
      ))}
    </div>
  )
}

function VerbsTable({ verbs }) {
  const [hidden, setHidden] = useState([])

  const toggleCol = (col) => {
    setHidden(prev => prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col])
  }

  return (
    <div className="verbs-section">
      <div className="col-toggles">
        <span>Hide columns:</span>
        {VERB_COLS.map(col => (
          <button
            key={col}
            className={hidden.includes(col) ? 'active' : ''}
            onClick={() => toggleCol(col)}
          >
            {VERB_LABELS[col]}
          </button>
        ))}
      </div>
      <div className="verbs-table-wrap">
        <table className="verbs-table">
          <thead>
            <tr>
              {VERB_COLS.filter(c => !hidden.includes(c)).map(col => (
                <th key={col}>{VERB_LABELS[col]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {verbs.map((verb, i) => (
              <tr key={i}>
                {VERB_COLS.filter(c => !hidden.includes(c)).map(col => (
                  <td key={col}>{verb[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function VerbQuiz({ verbs }) {
  const QUIZ_COLS = ['imperativ', 'infinitiv', 'praesens', 'imperfektum', 'perfektum']
  const [shuffled] = useState(() => [...verbs].sort(() => Math.random() - 0.5))
  const [index, setIndex] = useState(0)
  const [inputs, setInputs] = useState({})
  const [result, setResult] = useState(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [currentHidden, setCurrentHidden] = useState(() => {
    const all = [...QUIZ_COLS]
    return all.sort(() => Math.random() - 0.5).slice(0, 2)
  })
  const VerbQuiz  = useRef(null)

  const verb = shuffled[index]

  const insertChar = (char) => {
    const activeEl = document.activeElement
    if (activeEl && activeEl.tagName === 'INPUT') {
      const pos = activeEl.selectionStart ?? activeEl.value.length
      const key = activeEl.dataset.key
      const val = inputs[key] || ''
      const newVal = val.slice(0, pos) + char + val.slice(pos)
      setInputs(prev => ({ ...prev, [key]: newVal }))
      setTimeout(() => {
        activeEl.focus()
        activeEl.setSelectionRange(pos + 1, pos + 1)
      }, 0)
    }
  }

  const check = () => {
    let allCorrect = true
    for (const col of currentHidden) {
      const answer = verb[col].toLowerCase().trim()
      const userAnswer = (inputs[col] || '').toLowerCase().trim()
      if (userAnswer !== answer) { allCorrect = false; break }
    }
    setResult(allCorrect ? 'correct' : 'wrong')
    setScore(s => ({ correct: s.correct + (allCorrect ? 1 : 0), total: s.total + 1 }))
  }

  const next = () => {
    setIndex((index + 1) % shuffled.length)
    setInputs({})
    setResult(null)
    setCurrentHidden([...QUIZ_COLS].sort(() => Math.random() - 0.5).slice(0, 2))
  }

  return (
    <div className="quiz-wrapper">
      <DanishKeyboard onChar={insertChar} />
      <div className="quiz verb-quiz">
        <div className="score">✅ {score.correct} / {score.total}</div>
        <motion.div className={`quiz-card ${result === 'correct' ? 'flash-correct' : ''}`} key={index} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
          <p className="verb-english">{verb.english}</p>
          <div className="verb-quiz-grid">
            {QUIZ_COLS.map(col => (
              <div key={col} className="verb-quiz-row">
                <span className="verb-quiz-label">{VERB_LABELS[col]}</span>
                {currentHidden.includes(col) && !result ? (
                  <input
                    data-key={col}
                    value={inputs[col] || ''}
                    onChange={e => setInputs(prev => ({ ...prev, [col]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && check()}
                    placeholder="..."
                    className="verb-input"
                  />
                ) : currentHidden.includes(col) && result ? (
                  <div className={`verb-answer-check ${(inputs[col] || '').toLowerCase().trim() === verb[col].toLowerCase().trim() ? 'ok' : 'fail'}`}>
                    <span className="user-ans">{inputs[col] || '—'}</span>
                    {(inputs[col] || '').toLowerCase().trim() !== verb[col].toLowerCase().trim() && (
                      <span className="correct-ans">→ {verb[col]}</span>
                    )}
                  </div>
                ) : (
                  <span className="verb-quiz-value">{verb[col]}</span>
                )}
              </div>
            ))}
          </div>

          {!result && (
            <div className="quiz-actions" style={{ marginTop: '16px' }}>
              <button onClick={check}>Check</button>
            </div>
          )}

          {result && (
            <motion.div className={`result ${result}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {result === 'correct' ? '✅ Correct!' : '❌ Check the answers above'}
              <button onClick={next}>Next →</button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function NumbersTable({ words }) {
  const basic = words.slice(0, 20)
  const tens = words.slice(20, 27)
  const big = words.slice(27)

  return (
    <div className="numbers-page">
      <div className="numbers-section">
        <h3>1 — 20</h3>
        <div className="numbers-columns">
          <div className="numbers-col">
            {basic.slice(0, 10).map((word, i) => (
              <div key={i} className="number-row">
                <span className="number-num">{i}</span>
                <span className="number-danish">{word.danish}</span>
              </div>
            ))}
          </div>
          <div className="numbers-col">
            {basic.slice(10).map((word, i) => (
              <div key={i} className="number-row">
                <span className="number-num">{i + 11}</span>
                <span className="number-danish">{word.danish}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="numbers-section">
        <h3>Tens</h3>
        <div className="numbers-columns">
          {tens.map((word, i) => (
            <div key={i} className="number-row">
              <span className="number-num">{(i + 2) * 10}</span>
              <span className="number-danish">{word.danish}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="numbers-section">
        <h3>Big numbers</h3>
        <div className="numbers-columns">
          {big.map((word, i) => (
            <div key={i} className="number-row">
              <span className="number-num">{word.english}</span>
              <span className="number-danish">{word.danish}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FlashCard({ word, mode }) {
  const [revealed, setRevealed] = useState(false)
  const question = mode === 'en-da' ? word.english : word.danish
  const answer = mode === 'en-da' ? word.danish : word.english

  return (
    <motion.div
      className="flashcard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => setRevealed(!revealed)}
    >
      <div className="flashcard-left">
        <span className="flashcard-emoji">{word.emoji}</span>
      </div>
      <div className="flashcard-right">
        <p className="flashcard-question">{question}</p>
        {revealed
          ? <p className="flashcard-answer">{answer}</p>
          : <p className="flashcard-hint">tap to reveal</p>
        }
      </div>
    </motion.div>
  )
}

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function normalizeAnswer(value) {
  return value.toLowerCase().trim().replace(/[.!?]/g, '').replace(/\s+/g, ' ')
}

function WeatherIcon({ word, className = '' }) {
  const Icon = WEATHER_ICONS[word.icon] || FaCloud

  return (
    <div className={`weather-icon weather-icon-${word.id} ${className}`}>
      <Icon />
    </div>
  )
}

function WeatherTable({ words }) {
  return (
    <div className="weather-table-wrap">
      <table className="weather-table">
        <thead>
          <tr>
            <th>Weather</th>
            <th>Danish</th>
            <th>English</th>
          </tr>
        </thead>
        <tbody>
          {words.map(word => (
            <tr key={word.id}>
              <td><WeatherIcon word={word} /></td>
              <td>{word.danish}</td>
              <td>{word.english}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function weatherTemperatureAnswer(temp) {
  const prefix = temp < 0 ? 'det er minus ' : 'det er '
  const absTemp = Math.abs(temp)
  const danishNumber = numberToDanish(absTemp)

  return `${prefix}${danishNumber} grader`
}

function WeatherQuiz({ words }) {
  const [index, setIndex] = useState(0)
  const [weatherInput, setWeatherInput] = useState('')
  const [tempInput, setTempInput] = useState('')
  const [result, setResult] = useState(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [flash, setFlash] = useState(false)
  const [cards] = useState(() => words.map((word, i) => ({
    word,
    temp: WEATHER_TEMPERATURES[i % WEATHER_TEMPERATURES.length],
  })).sort(() => Math.random() - 0.5))
  const weatherInputRef = useRef(null)

  const card = cards[index]

  const insertChar = (char) => {
    const activeEl = document.activeElement
    if (!activeEl || activeEl.tagName !== 'INPUT') return

    const pos = activeEl.selectionStart ?? activeEl.value.length
    const target = activeEl.dataset.weatherInput
    const current = target === 'temperature' ? tempInput : weatherInput
    const nextValue = current.slice(0, pos) + char + current.slice(pos)

    if (target === 'temperature') {
      setTempInput(nextValue)
    } else {
      setWeatherInput(nextValue)
    }

    setTimeout(() => {
      activeEl.focus()
      activeEl.setSelectionRange(pos + 1, pos + 1)
    }, 0)
  }

  const check = () => {
    if (!weatherInput.trim() || !tempInput.trim()) return

    const weatherCorrect = normalizeAnswer(weatherInput) === normalizeAnswer(card.word.danish)
    const tempAnswer = weatherTemperatureAnswer(card.temp)
    const tempCorrect = normalizeAnswer(tempInput) === normalizeAnswer(tempAnswer)
    const correct = weatherCorrect && tempCorrect

    if (correct) { setFlash(true); setTimeout(() => setFlash(false), 500) }
    setResult({ weatherCorrect, tempCorrect, correct })
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }))
  }

  const next = () => {
    setIndex((index + 1) % cards.length)
    setWeatherInput('')
    setTempInput('')
    setResult(null)
  }

  return (
    <div className="quiz-wrapper">
      <DanishKeyboard onChar={insertChar} />
      <div className="quiz weather-quiz">
        <div className="score">✅ {score.correct} / {score.total}</div>
        <motion.div className={`quiz-card ${flash ? 'flash-correct' : ''}`} key={`${card.word.id}-${card.temp}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
          <div className="weather-prompt">
            <div className="weather-temp"><FaTemperatureHalf /> {card.temp}°</div>
            <WeatherIcon word={card.word} className="weather-icon-large" />
          </div>
          <p className="quiz-question">Answer in Danish</p>

          {!result && (
            <>
              <input
                ref={weatherInputRef}
                data-weather-input="weather"
                value={weatherInput}
                onChange={e => setWeatherInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && check()}
                placeholder="Hvordan er vejret?"
                autoFocus
              />
              <input
                data-weather-input="temperature"
                value={tempInput}
                onChange={e => setTempInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && check()}
                placeholder="det er tyve grader"
              />
              <div className="quiz-actions">
                <button onClick={() => {
                  setWeatherInput(card.word.danish.slice(0, Math.max(1, Math.ceil(card.word.danish.length / 3))))
                  weatherInputRef.current?.focus()
                }}>💡 Hint</button>
                <button onClick={check}>Check</button>
              </div>
            </>
          )}

          {result && (
            <motion.div className={`result ${result.correct ? 'correct' : 'wrong'}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {result.correct ? '✅ Correct!' : (
                <div className="weather-result-lines">
                  <span className={result.weatherCorrect ? 'ok' : 'fail'}>{card.word.danish}</span>
                  <span className={result.tempCorrect ? 'ok' : 'fail'}>{weatherTemperatureAnswer(card.temp)}</span>
                </div>
              )}
              <button onClick={next}>Next →</button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function NumberQuiz() {
  const [range, setRange] = useState(20)
  const [number, setNumber] = useState(7)
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [hints, setHints] = useState([])
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [flash, setFlash] = useState(false)
  const inputRef = useRef(null)

  const answer = numberToDanish(number)

  const insertChar = (char) => {
    const pos = inputRef.current?.selectionStart ?? input.length
    const newVal = input.slice(0, pos) + char + input.slice(pos)
    setInput(newVal)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(pos + 1, pos + 1)
    }, 0)
  }

  const newNumber = (r) => {
    const max = r ?? range
    setNumber(Math.floor(Math.random() * max) + 1)
    setInput('')
    setResult(null)
    setHints([])
  }

  const check = () => {
    if (!input.trim()) return
    const correct = input.trim().toLowerCase() === answer.toLowerCase()
    if (correct) { setFlash(true); setTimeout(() => setFlash(false), 500) }
    setResult(correct ? 'correct' : 'wrong')
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }))
  }

  const addHint = () => {
    const available = answer.split('').map((_, i) => i).filter(i => !hints.includes(i))
    if (available.length === 0) return
    setHints(prev => [...prev, getRandomItem(available)])
  }

  const hintDisplay = answer.split('').map((char, i) =>
    hints.includes(i) ? char : '_'
  ).join(' ')

  return (
    <div className="quiz-wrapper">
      <DanishKeyboard onChar={insertChar} />
      <div className="quiz">
        <div className="range-selector">
          <span>Range:</span>
          {[20, 100, 1000].map(r => (
            <button key={r} className={range === r ? 'active' : ''} onClick={() => { setRange(r); newNumber(r) }}>
              1–{r}
            </button>
          ))}
        </div>
        <div className="score">✅ {score.correct} / {score.total}</div>
        <motion.div className={`quiz-card ${flash ? 'flash-correct' : ''}`} key={number} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
          <p className="big-number">{number}</p>
          <p className="quiz-question">Write this number in Danish</p>
          {!result && (
            <>
              <p className="hint-display">{hintDisplay}</p>
              <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && check()} placeholder="Type in Danish..." autoFocus />
              <div className="quiz-actions">
                <button onClick={addHint}>💡 Hint</button>
                <button onClick={check}>Check</button>
              </div>
            </>
          )}
          {result && (
            <motion.div className={`result ${result}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {result === 'correct' ? '✅ Correct!' : `❌ Answer: ${answer}`}
              <button onClick={() => newNumber()}>Next →</button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function hourToClockNumber(hour) {
  return hour % 12 || 12
}

function clockAnswer(time, useWords = false) {
  const [hourRaw, minuteRaw] = time.split(':').map(Number)
  const minute = minuteRaw
  const hour = hourToClockNumber(hourRaw)
  const nextHour = hourToClockNumber(hourRaw + 1)
  const hourText = useWords ? numberToDanish(hour) : String(hour)
  const nextHourText = useWords ? numberToDanish(nextHour) : String(nextHour)
  const minuteText = (value) => useWords ? numberToDanish(value) : String(value)

  if (minute === 0) return `Den er ${hourText}`
  if (minute === 15) return `Den er kvart over ${hourText}`
  if (minute === 30) return `Den er halv ${nextHourText}`
  if (minute === 45) return `Den er kvart i ${nextHourText}`
  if (minute < 30) {
    const unit = minute === 1 ? 'minut' : 'minutter'
    return `Den er ${minuteText(minute)} ${unit} over ${hourText}`
  }

  const minutesTo = 60 - minute
  const unit = minutesTo === 1 ? 'minut' : 'minutter'
  return `Den er ${minuteText(minutesTo)} ${unit} i ${nextHourText}`
}

function clockAngles(time) {
  const [hourRaw, minute] = time.split(':').map(Number)
  const hour = hourRaw % 12

  return {
    minute: minute * 6,
    hour: (hour * 30) + (minute * 0.5),
  }
}

function ClockFace({ time }) {
  const angles = clockAngles(time)

  return (
    <div className="clock-face">
      {[12, 3, 6, 9].map(num => (
        <span key={num} className={`clock-num clock-num-${num}`}>{num}</span>
      ))}
      <span className="clock-center" />
      <span className="clock-hand clock-hour" style={{ transform: `rotate(${angles.hour}deg)` }} />
      <span className="clock-hand clock-minute" style={{ transform: `rotate(${angles.minute}deg)` }} />
    </div>
  )
}

function ClockQuiz() {
  const [shuffled] = useState(() => [...CLOCK_QUIZ_TIMES].sort(() => Math.random() - 0.5))
  const [index, setIndex] = useState(0)
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [flash, setFlash] = useState(false)
  const inputRef = useRef(null)

  const time = shuffled[index]
  const answer = clockAnswer(time)
  const acceptedAnswers = [answer, clockAnswer(time, true)].map(normalizeAnswer)

  const insertChar = (char) => {
    const pos = inputRef.current?.selectionStart ?? input.length
    const newVal = input.slice(0, pos) + char + input.slice(pos)
    setInput(newVal)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(pos + 1, pos + 1)
    }, 0)
  }

  const check = () => {
    if (!input.trim()) return
    const correct = acceptedAnswers.includes(normalizeAnswer(input))
    if (correct) { setFlash(true); setTimeout(() => setFlash(false), 500) }
    setResult(correct ? 'correct' : 'wrong')
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }))
  }

  const next = () => {
    setIndex((index + 1) % shuffled.length)
    setInput('')
    setResult(null)
  }

  return (
    <div className="quiz-wrapper">
      <DanishKeyboard onChar={insertChar} />
      <div className="quiz clock-quiz">
        <div className="score">✅ {score.correct} / {score.total}</div>
        <motion.div className={`quiz-card ${flash ? 'flash-correct' : ''}`} key={time} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
          <div className="clock-question">
            <ClockFace time={time} />
            <div>
              <p>Hvad er klokken?</p>
              <strong>{time}</strong>
            </div>
          </div>
          {!result && (
            <>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && check()}
                placeholder="Den er kvart over 8"
                autoFocus
              />
              <div className="quiz-actions">
                <button onClick={() => setInput(answer.split(' ').slice(0, 3).join(' '))}>💡 Hint</button>
                <button onClick={check}>Check</button>
              </div>
            </>
          )}
          {result && (
            <motion.div className={`result ${result}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {result === 'correct' ? '✅ Correct!' : `❌ Answer: ${answer}`}
              <button onClick={next}>Next →</button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function Quiz({ words, mode }) {
  const [shuffled] = useState(() => [...words].sort(() => Math.random() - 0.5))
  const [index, setIndex] = useState(0)
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [hints, setHints] = useState([])
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [flash, setFlash] = useState(false)
  const inputRef = useRef(null)

  const word = shuffled[index]
  const question = mode === 'en-da' ? word.english : word.danish
  const answer = mode === 'en-da' ? word.danish : word.english

  const insertChar = (char) => {
    const pos = inputRef.current?.selectionStart ?? input.length
    const newVal = input.slice(0, pos) + char + input.slice(pos)
    setInput(newVal)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(pos + 1, pos + 1)
    }, 0)
  }

  const check = () => {
    if (!input.trim()) return
    const correct = input.trim().toLowerCase() === answer.toLowerCase()
    if (correct) { setFlash(true); setTimeout(() => setFlash(false), 500) }
    setResult(correct ? 'correct' : 'wrong')
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }))
  }

  const next = () => {
    setIndex((index + 1) % shuffled.length)
    setInput('')
    setResult(null)
    setHints([])
  }

  const addHint = () => {
    const available = answer.split('').map((_, i) => i).filter(i => !hints.includes(i) && answer[i] !== ' ')
    if (available.length === 0) return
    setHints(prev => [...prev, getRandomItem(available)])
  }

  const hintDisplay = answer.split('').map((char, i) =>
    char === ' ' ? ' ' : hints.includes(i) ? char : '_'
  ).join(' ')

  return (
    <div className="quiz-wrapper">
      <DanishKeyboard onChar={insertChar} />
      <div className="quiz">
        <div className="score">✅ {score.correct} / {score.total}</div>
        <motion.div className={`quiz-card ${flash ? 'flash-correct' : ''}`} key={index} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flashcard-emoji">{word.emoji}</div>
          <p className="quiz-question">Translate: <strong>{question}</strong></p>
          {!result && (
            <>
              <p className="hint-display">{hintDisplay}</p>
              <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && check()} placeholder="Type in Danish..." autoFocus />
              <div className="quiz-actions">
                <button onClick={addHint}>💡 Hint</button>
                <button onClick={check}>Check</button>
              </div>
            </>
          )}
          {result && (
            <motion.div className={`result ${result}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {result === 'correct' ? '✅ Correct!' : `❌ Answer: ${answer}`}
              <button onClick={next}>Next →</button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function HousingPlan() {
  const [activeRoom, setActiveRoom] = useState(HOUSING_ROOMS[2])

  return (
    <div className="housing-plan-page">
      <div className="floor-plan-card">
        <div className="floor-plan-title">
          <span>Plantegning</span>
        </div>
        <div className="floor-plan" aria-label="Apartment floor plan">
          <div className="front-door">Main entrance</div>
          {HOUSING_ROOMS.map(room => (
            <button
              key={room.number}
              className={`room room-${room.className} ${activeRoom.number === room.number ? 'active' : ''}`}
              onClick={() => setActiveRoom(room)}
            >
              <span className="room-number">{room.number}</span>
              <span className="room-items" aria-hidden="true">
                {room.items.map(item => <span key={item}>{item}</span>)}
              </span>
              <span className="room-fixtures">
                {room.fixtures.map(fixture => <span key={fixture}>{fixture}</span>)}
              </span>
              <span className="room-name">{room.planName || room.danish}</span>
              <span className="room-type">{room.type}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="room-panel">
        <div className="room-panel-number">{activeRoom.number}</div>
        <p className="room-panel-danish">{activeRoom.danish}</p>
        <p className="room-panel-english">{activeRoom.english}</p>
        <div className="room-words">
          <p>Room words</p>
          <div>
            {activeRoom.words.map(word => (
              <span key={word}>{word}</span>
            ))}
          </div>
        </div>
        <div className="room-list">
          {HOUSING_ROOMS.map(room => (
            <button
              key={room.number}
              className={activeRoom.number === room.number ? 'active' : ''}
              onClick={() => setActiveRoom(room)}
            >
              <span>{room.number}</span>
              {room.danish}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function getInitialView(topicId) {
  return topicId === 'numbers' || topicId === 'verbs' || topicId === 'weather' ? 'table' : 'cards'
}

export default function App() {
  const [topic, setTopic] = useState(null)
  const [view, setView] = useState('cards')
  const [mode, setMode] = useState('en-da')

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          🇩🇰 <span>Stanislav</span> Bachinskiy
        </div>
        <div className="navbar-topics">
          <button className={!topic ? 'active' : ''} onClick={() => setTopic(null)}>Home</button>
          {topics.map(t => (
            <button
              key={t.id}
              className={topic?.id === t.id ? 'active' : ''}
              onClick={() => {
                if (!t.comingSoon) {
                  setTopic(t)
                  setView(getInitialView(t.id))
                }
              }}
            >
              {t.emoji} {t.title}
            </button>
          ))}
        </div>
        <div className="navbar-right">Danish Practice 🇩🇰</div>
      </nav>

      <div className="app">
        {!topic && (
          <motion.div className="home" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
  <h1>🇩🇰 Danish Practice</h1>
  <p className="subtitle">Choose a topic to start learning</p>
  <div className="topics-grid">
    {topics.map(t => (
      <motion.div
        key={t.id}
        className={`topic-card ${t.comingSoon ? 'coming-soon' : ''}`}
        whileHover={!t.comingSoon ? { y: -6 } : {}}
        onClick={() => {
          if (!t.comingSoon) {
            setTopic(t)
            setView(getInitialView(t.id))
          }
        }}
      >
        <span className="topic-emoji">{t.emoji}</span>
        <h3>{t.title}</h3>
        {t.comingSoon
          ? <p className="coming-soon-label">Coming Soon</p>
          : <p>{(t.words?.length || 0) + (t.verbs?.length || 0)} words</p>
        }
      </motion.div>
    ))}
  </div>
</motion.div>
        )}

        {topic && (
          <>
            <motion.div className="header" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <button className="back" onClick={() => setTopic(null)}>← Topics</button>
              <h2>{topic.emoji} {topic.title}</h2>
              <div className="header-controls">
                {topic.id !== 'numbers' && topic.id !== 'verbs' && topic.id !== 'weather' && !(topic.id === 'housing' && view === 'plan') && (
                  <select value={mode} onChange={e => setMode(e.target.value)}>
                    <option value="en-da">EN → DA</option>
                    <option value="da-en">DA → EN</option>
                  </select>
                )}
              </div>
            </motion.div>

            <div className="view-tabs">
              {topic.id === 'numbers' && (
                <>
                  <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')}>📋 Table</button>
                  <button className={view === 'numquiz' ? 'active' : ''} onClick={() => setView('numquiz')}>🔢 Number Quiz</button>
                </>
              )}
              {topic.id === 'verbs' && (
                <>
                  <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')}>📋 Table</button>
                  <button className={view === 'quiz' ? 'active' : ''} onClick={() => setView('quiz')}>✏️ Quiz</button>
                </>
              )}
              {topic.id === 'weather' && (
                <>
                  <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')}>📋 Table</button>
                  <button className={view === 'quiz' ? 'active' : ''} onClick={() => setView('quiz')}>✏️ Quiz</button>
                </>
              )}
              {topic.id === 'housing' && (
                <>
                  <button className={view === 'cards' ? 'active' : ''} onClick={() => setView('cards')}>📚 Cards</button>
                  <button className={view === 'quiz' ? 'active' : ''} onClick={() => setView('quiz')}>✏️ Quiz</button>
                  <button className={view === 'plan' ? 'active' : ''} onClick={() => setView('plan')}>🏠 Rooms Plan</button>
                </>
              )}
              {topic.id === 'time' && (
                <>
                  <button className={view === 'cards' ? 'active' : ''} onClick={() => setView('cards')}>📚 Cards</button>
                  <button className={view === 'quiz' ? 'active' : ''} onClick={() => setView('quiz')}>✏️ Quiz</button>
                  <button className={view === 'clockquiz' ? 'active' : ''} onClick={() => setView('clockquiz')}>🕒 Clock Quiz</button>
                </>
              )}
              {topic.id !== 'numbers' && topic.id !== 'verbs' && topic.id !== 'weather' && topic.id !== 'housing' && topic.id !== 'time' && (
                <>
                  <button className={view === 'cards' ? 'active' : ''} onClick={() => setView('cards')}>📚 Cards</button>
                  <button className={view === 'quiz' ? 'active' : ''} onClick={() => setView('quiz')}>✏️ Quiz</button>
                </>
              )}
            </div>

            {topic.id === 'numbers' && view === 'table' && <NumbersTable words={topic.words} />}
            {topic.id === 'numbers' && view === 'numquiz' && <NumberQuiz />}
            {topic.id === 'verbs' && view === 'table' && <VerbsTable verbs={topic.verbs} />}
            {topic.id === 'verbs' && view === 'quiz' && <VerbQuiz verbs={topic.verbs} />}
            {topic.id === 'weather' && view === 'table' && <WeatherTable words={topic.words} />}
            {topic.id === 'weather' && view === 'quiz' && <WeatherQuiz words={topic.words} />}
            {topic.id === 'housing' && view === 'plan' && <HousingPlan />}
            {topic.id === 'time' && view === 'clockquiz' && <ClockQuiz />}
            {topic.id !== 'numbers' && topic.id !== 'verbs' && topic.id !== 'weather' && view === 'cards' && (
              <div className="cards-grid">
                {topic.words.map((word, i) => <FlashCard key={i} word={word} mode={mode} />)}
              </div>
            )}
            {topic.id !== 'numbers' && topic.id !== 'verbs' && topic.id !== 'weather' && view === 'quiz' && (
              <Quiz words={topic.words} mode={mode} />
            )}
          </>
        )}
      </div>

      <footer className="footer">
        <span>Stanislav Bachinskiy</span>
        <a href="https://github.com/bochie" target="_blank"><FaGithub /> GitHub</a>
        <a href="mailto:stasikus2003@email.com"><FaEnvelope /> Email</a>
        <a href="https://instagram.com/bachie_" target="_blank"><FaInstagram /> Instagram</a>
        <a href="https://t.me/cringelord" target="_blank"><FaTelegram /> Telegram</a>
      </footer>
        <Analytics />
    </>
  )
}
