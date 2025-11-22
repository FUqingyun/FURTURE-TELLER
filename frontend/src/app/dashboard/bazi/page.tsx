'use client'

import { useState, useEffect } from 'react'
import { Solar, Lunar, LunarYear } from 'lunar-javascript'

interface BaziResult {
  yearGan: string; yearZhi: string;
  monthGan: string; monthZhi: string;
  dayGan: string; dayZhi: string;
  timeGan: string; timeZhi: string;
  yearHideGan: string[]; monthHideGan: string[]; dayHideGan: string[]; timeHideGan: string[];
  yearShiShen: string; monthShiShen: string; dayShiShen: string; timeShiShen: string;
  solarDate: string;
  lunarDate: string;
  gender: string;
}

export default function BaziPage() {
  // 日期状态
  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')
  
  // 时间状态
  const [hour, setHour] = useState('')
  const [minute, setMinute] = useState('')
  
  const [gender, setGender] = useState('1') // 1男 0女
  const [result, setResult] = useState<BaziResult | null>(null)

  // 生成年份选项 (1900 - 当前年份+1)
  const years = Array.from({ length: 150 }, (_, i) => new Date().getFullYear() + 1 - i)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  
  // 根据年月计算天数
  const getDaysInMonth = (y: string, m: string) => {
    if (!y || !m) return 31
    return new Date(parseInt(y), parseInt(m), 0).getDate()
  }
  const days = Array.from({ length: getDaysInMonth(year, month) }, (_, i) => i + 1)

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 60 }, (_, i) => i)

  const calculateBazi = (e: React.FormEvent) => {
    e.preventDefault()
    if (!year || !month || !day || !hour || !minute) return

    const dateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`
    const date = new Date(dateStr)
    const solar = Solar.fromDate(date)
    const lunar = solar.getLunar()
    const eightChar = lunar.getEightChar()

    setResult({
      yearGan: eightChar.getYearGan(), yearZhi: eightChar.getYearZhi(),
      monthGan: eightChar.getMonthGan(), monthZhi: eightChar.getMonthZhi(),
      dayGan: eightChar.getDayGan(), dayZhi: eightChar.getDayZhi(),
      timeGan: eightChar.getTimeGan(), timeZhi: eightChar.getTimeZhi(),
      yearHideGan: eightChar.getYearHideGan(),
      monthHideGan: eightChar.getMonthHideGan(),
      dayHideGan: eightChar.getDayHideGan(),
      timeHideGan: eightChar.getTimeHideGan(),
      yearShiShen: '偏财', monthShiShen: '正官', dayShiShen: '日主', timeShiShen: '七杀',
      solarDate: solar.toYmdHms(),
      lunarDate: lunar.toString(),
      gender: gender === '1' ? '男' : '女'
    })
  }

  // 通用下拉框样式
  const selectClassName = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-warm-500/20 focus:border-warm-500 transition-all outline-none bg-white appearance-none cursor-pointer"

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">四柱排盘</h1>
          <p className="text-gray-600 mt-1">专业排盘工具，支持公历/农历自动转换。</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧输入 */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">排盘信息</h2>
              <form onSubmit={calculateBazi} className="space-y-6">
                
                {/* 出生日期 - 谷歌风格三联下拉 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">出生日期 (公历)</label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="relative">
                      <select 
                        value={year} 
                        onChange={e => setYear(e.target.value)} 
                        className={selectClassName}
                        required
                      >
                        <option value="" disabled>年份</option>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                    </div>
                    <div className="relative">
                      <select 
                        value={month} 
                        onChange={e => setMonth(e.target.value)} 
                        className={selectClassName}
                        required
                      >
                        <option value="" disabled>月份</option>
                        {months.map(m => <option key={m} value={m}>{m}月</option>)}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                    </div>
                    <div className="relative">
                      <select 
                        value={day} 
                        onChange={e => setDay(e.target.value)} 
                        className={selectClassName}
                        required
                      >
                        <option value="" disabled>日期</option>
                        {days.map(d => <option key={d} value={d}>{d}日</option>)}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                    </div>
                  </div>
                </div>

                {/* 出生时间 - 两联下拉 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">出生时间</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <select 
                        value={hour} 
                        onChange={e => setHour(e.target.value)} 
                        className={selectClassName}
                        required
                      >
                        <option value="" disabled>小时</option>
                        {hours.map(h => <option key={h} value={h}>{h.toString().padStart(2, '0')}时</option>)}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                    </div>
                    <div className="relative">
                      <select 
                        value={minute} 
                        onChange={e => setMinute(e.target.value)} 
                        className={selectClassName}
                        required
                      >
                        <option value="" disabled>分钟</option>
                        {minutes.map(m => <option key={m} value={m}>{m.toString().padStart(2, '0')}分</option>)}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">性别</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="gender"
                          value="1"
                          checked={gender === '1'}
                          onChange={e => setGender(e.target.value)}
                          className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-warm-500 checked:border-4 transition-all"
                        />
                      </div>
                      <span className="text-gray-700 group-hover:text-gray-900">男 (乾造)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="gender"
                          value="0"
                          checked={gender === '0'}
                          onChange={e => setGender(e.target.value)}
                          className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-warm-500 checked:border-4 transition-all"
                        />
                      </div>
                      <span className="text-gray-700 group-hover:text-gray-900">女 (坤造)</span>
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full btn-warm py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                >
                  开始排盘
                </button>
              </form>
            </div>
          </div>

          {/* 右侧结果 */}
          <div className="lg:col-span-2">
            {result ? (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
                <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-100">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">公历</div>
                    <div className="text-lg font-medium text-gray-900">{result.solarDate}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">农历</div>
                    <div className="text-lg font-medium text-gray-900">{result.lunarDate}</div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 text-center mb-12">
                  {/* 标头 */}
                  <div className="text-gray-400 text-sm">年柱</div>
                  <div className="text-gray-400 text-sm">月柱</div>
                  <div className="text-gray-400 text-sm">日柱</div>
                  <div className="text-gray-400 text-sm">时柱</div>

                  {/* 天干 */}
                  <div className="text-4xl font-bold text-gray-900 py-4">{result.yearGan}</div>
                  <div className="text-4xl font-bold text-gray-900 py-4">{result.monthGan}</div>
                  <div className="text-4xl font-bold text-warm-600 py-4 bg-warm-50 rounded-lg">{result.dayGan}</div>
                  <div className="text-4xl font-bold text-gray-900 py-4">{result.timeGan}</div>

                  {/* 地支 */}
                  <div className="text-4xl font-bold text-gray-900 py-4">{result.yearZhi}</div>
                  <div className="text-4xl font-bold text-gray-900 py-4">{result.monthZhi}</div>
                  <div className="text-4xl font-bold text-warm-600 py-4 bg-warm-50 rounded-lg">{result.dayZhi}</div>
                  <div className="text-4xl font-bold text-gray-900 py-4">{result.timeZhi}</div>

                  {/* 藏干 */}
                  <div className="text-xs text-gray-500 flex flex-col gap-1">
                    {result.yearHideGan.map((g, i) => <span key={i}>{g}</span>)}
                  </div>
                  <div className="text-xs text-gray-500 flex flex-col gap-1">
                    {result.monthHideGan.map((g, i) => <span key={i}>{g}</span>)}
                  </div>
                  <div className="text-xs text-gray-500 flex flex-col gap-1">
                    {result.dayHideGan.map((g, i) => <span key={i}>{g}</span>)}
                  </div>
                  <div className="text-xs text-gray-500 flex flex-col gap-1">
                    {result.timeHideGan.map((g, i) => <span key={i}>{g}</span>)}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <h3 className="text-sm font-bold text-blue-800 mb-2">💡 大运排盘功能开发中</h3>
                  <p className="text-xs text-blue-600">当前版本仅展示基础四柱信息，完整大运流年及神煞分析将在后续版本更新。</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-white rounded-2xl border border-gray-100 border-dashed min-h-[400px]">
                <div className="text-center text-gray-400">
                  <div className="text-6xl mb-4">☯️</div>
                  <p>请输入左侧信息开始排盘</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
