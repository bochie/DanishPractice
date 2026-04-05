import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { topics } from './data'
import { numberToDanish } from './numberUtils'
import './App.css'
import { FaGithub, FaInstagram, FaTelegram, FaEnvelope } from 'react-icons/fa6'

const DANISH_CHARS = ['æ', 'ø', 'å', 'Æ', 'Ø', 'Å']

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
              onClick={() => { setTopic(t); setView(t.id === 'numbers' ? 'table' : 'cards') }}
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
                onClick={() => { if (!t.comingSoon) { setTopic(t); setView(t.id === 'numbers' ? 'table' : 'cards') } }}
>
                <span className="topic-emoji">{t.emoji}</span>
                <h3>{t.title}</h3>
                {t.comingSoon ? <p className="coming-soon-label">Coming Soon</p> : <p>{t.words.length} words</p>}
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
                {topic.id !== 'numbers' && (
                  <select value={mode} onChange={e => setMode(e.target.value)}>
                    <option value="en-da">EN → DA</option>
                    <option value="da-en">DA → EN</option>
                  </select>
                )}
              </div>
            </motion.div>

            <div className="view-tabs">
              {topic.id === 'numbers' ? (
                <>
                  <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')}>📋 Table</button>
                  <button className={view === 'numquiz' ? 'active' : ''} onClick={() => setView('numquiz')}>🔢 Number Quiz</button>
                </>
              ) : (
                <>
                  <button className={view === 'cards' ? 'active' : ''} onClick={() => setView('cards')}>📚 Cards</button>
                  <button className={view === 'quiz' ? 'active' : ''} onClick={() => setView('quiz')}>✏️ Quiz</button>
                </>
              )}
            </div>

            {view === 'table' && <NumbersTable words={topic.words} />}
            {view === 'cards' && (
              <div className="cards-grid">
                {topic.words.map((word, i) => (
                  <FlashCard key={i} word={word} mode={mode} />
                ))}
              </div>
            )}
            {view === 'quiz' && <Quiz words={topic.words} mode={mode} />}
            {view === 'numquiz' && <NumberQuiz />}
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
    </>
  )
}