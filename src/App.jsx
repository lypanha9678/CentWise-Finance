import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [time, setTime] = useState(new Date())

  // Transactions State
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('centwise_tx')
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Salary Credit', amount: 3200, type: 'income', category: 'Salary', date: '06/01/2026' },
      { id: 2, text: 'Organic Groceries', amount: 120, type: 'expense', category: 'Food', date: '06/03/2026' },
      { id: 3, text: 'Movie Tickets', amount: 45, type: 'expense', category: 'Entertainment', date: '06/04/2026' }
    ]
  })

  // Savings Goal State
  const [savingGoal, setSavingGoal] = useState(() => {
    const saved = localStorage.getItem('centwise_goal')
    return saved ? JSON.parse(saved) : { target: 1500, current: 450, title: 'Summer Trip' }
  })

  // Transaction form states
  const [txText, setTxText] = useState('')
  const [txAmount, setTxAmount] = useState('')
  const [txType, setTxType] = useState('expense')
  const [txCategory, setTxCategory] = useState('Food')
  const [searchQuery, setSearchQuery] = useState('')

  // Goal form states
  const [goalAmountToAdd, setGoalAmountToAdd] = useState('')
  const [newGoalTarget, setNewGoalTarget] = useState('')
  const [newGoalTitle, setNewGoalTitle] = useState('')

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('centwise_tx', JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem('centwise_goal', JSON.stringify(savingGoal))
  }, [savingGoal])

  // Active digital clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense

  const handleAddTransaction = (e) => {
    e.preventDefault()
    const amtVal = parseFloat(txAmount)
    if (!txText.trim() || isNaN(amtVal) || amtVal <= 0) return

    const newTx = {
      id: Date.now(),
      text: txText.trim(),
      amount: amtVal,
      type: txType,
      category: txType === 'income' ? 'Salary' : txCategory,
      date: new Date().toLocaleDateString()
    }

    setTransactions([newTx, ...transactions])
    setTxText('')
    setTxAmount('')
  }

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id))
  }

  // Savings Goal updates
  const handleAddSavings = (e) => {
    e.preventDefault()
    const amtVal = parseFloat(goalAmountToAdd)
    if (isNaN(amtVal) || amtVal <= 0) return
    
    setSavingGoal(prev => ({
      ...prev,
      current: Math.min(prev.target, prev.current + amtVal)
    }))
    setGoalAmountToAdd('')
  }

  const handleCreateGoal = (e) => {
    e.preventDefault()
    const targetVal = parseFloat(newGoalTarget)
    if (!newGoalTitle.trim() || isNaN(targetVal) || targetVal <= 0) return

    setSavingGoal({
      title: newGoalTitle.trim(),
      target: targetVal,
      current: 0
    })
    setNewGoalTitle('')
    setNewGoalTarget('')
  }

  const getGreeting = () => {
    const hour = time.getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  const filteredTxs = transactions.filter(t => 
    t.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const goalProgressPercent = Math.min(100, Math.round((savingGoal.current / savingGoal.target) * 100))
  const radius = 34
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (Math.min(100, goalProgressPercent) / 100) * circumference

  return (
    <div className="budget-container">
      {/* Header */}
      <header className="budget-header">
        <div className="brand">
          <div className="brand-logo">C</div>
          <div>
            <h1>CentWise</h1>
            <p className="subtitle">Interactive Finance Core</p>
          </div>
        </div>
        <div className="clock-widget">
          <div className="clock-time">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div className="clock-date">
            {time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
        </div>
      </header>

      {/* Totals Balance Grid */}
      <div className="totals-grid">
        <div className="glass-card total-box balance">
          <span className="box-label">Net Balance</span>
          <span className="box-value">${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="glass-card total-box income">
          <span className="box-label">Total Inflow</span>
          <span className="box-value">${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="glass-card total-box expense">
          <span className="box-label">Total Outflow</span>
          <span className="box-value">${totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Main Panel Grid */}
      <main className="budget-panel-grid">
        
        {/* Left Side: Transaction Logger & Savings Goal */}
        <div className="left-panel">
          {/* Transaction Logger */}
          <section className="glass-card form-card">
            <h3>Log Transaction</h3>
            <form onSubmit={handleAddTransaction} className="tx-form">
              <div className="input-group">
                <label>Description</label>
                <input 
                  type="text" 
                  placeholder="e.g. Electric Bill..."
                  value={txText}
                  onChange={(e) => setTxText(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>Amount ($)</label>
                  <input 
                    type="number" 
                    step="any"
                    placeholder="0.00"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Type</label>
                  <select 
                    value={txType} 
                    onChange={(e) => setTxType(e.target.value)}
                    className="select-field"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>

              {txType === 'expense' && (
                <div className="input-group">
                  <label>Category</label>
                  <select 
                    value={txCategory} 
                    onChange={(e) => setTxCategory(e.target.value)}
                    className="select-field"
                  >
                    <option value="Food">Food</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Rent">Rent</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}

              <button type="submit" className="submit-tx-btn">Register Transaction</button>
            </form>
          </section>

          {/* Savings Target Goal */}
          <section className="glass-card savings-card">
            <div className="savings-header">
              <h3>Savings Target</h3>
              <span className="badge">Active Goal</span>
            </div>
            
            <div className="goal-detail-view">
              <div className="goal-visual">
                <div className="progress-ring-container">
                  <svg className="progress-ring" width="80" height="80">
                    <circle className="progress-ring-bg" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="6" fill="transparent" r={radius} cx="40" cy="40"/>
                    <circle className="progress-ring-bar" stroke="var(--accent)" strokeWidth="6" fill="transparent" r={radius} cx="40" cy="40"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="progress-percent">{goalProgressPercent}%</span>
                </div>
              </div>
              <div className="goal-text-info">
                <h4>{savingGoal.title}</h4>
                <p>Saved: <strong>${savingGoal.current}</strong> of ${savingGoal.target}</p>
                
                <form onSubmit={handleAddSavings} className="add-savings-form">
                  <input 
                    type="number" 
                    placeholder="Add cash..."
                    value={goalAmountToAdd}
                    onChange={(e) => setGoalAmountToAdd(e.target.value)}
                    className="mini-input"
                  />
                  <button type="submit" className="mini-add-btn">+</button>
                </form>
              </div>
            </div>

            {/* Set New Goal */}
            <details className="new-goal-accordion">
              <summary>Set a New Savings Goal</summary>
              <form onSubmit={handleCreateGoal} className="new-goal-form">
                <input 
                  type="text" 
                  placeholder="Goal Title (e.g. Laptop)..."
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  className="input-field"
                  required
                />
                <input 
                  type="number" 
                  placeholder="Target Amount ($)..."
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(e.target.value)}
                  className="input-field"
                  required
                />
                <button type="submit" className="create-goal-btn">Set Goal</button>
              </form>
            </details>
          </section>
        </div>

        {/* Right Side: Transaction Ledger Logs */}
        <div className="right-panel">
          <section className="glass-card ledger-card">
            <div className="ledger-header">
              <div>
                <h2>{getGreeting()}, Panha.</h2>
                <p className="welcome-desc">Track and filter transaction histories below.</p>
              </div>
              <input 
                type="text" 
                placeholder="Search ledger..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-ledger-input"
              />
            </div>

            <div className="ledger-list-container">
              {filteredTxs.length > 0 ? (
                <div className="ledger-list">
                  {filteredTxs.map(tx => (
                    <div key={tx.id} className={`ledger-row ${tx.type}`}>
                      <div className="row-left">
                        <span className={`cat-label-tag ${tx.category.toLowerCase()}`}>{tx.category}</span>
                        <div>
                          <strong>{tx.text}</strong>
                          <p className="row-time">{tx.date}</p>
                        </div>
                      </div>
                      <div className="row-right">
                        <strong className="amount-val">
                          {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </strong>
                        <button className="delete-tx-btn" onClick={() => handleDeleteTransaction(tx.id)}>&times;</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-msg">No transactions found in database.</p>
              )}
            </div>
          </section>
        </div>

      </main>
    </div>
  )
}

export default App
