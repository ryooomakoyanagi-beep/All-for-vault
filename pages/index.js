import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>All for Vault</title>
        <meta name="description" content="棒高跳技術分析とアドバイスツール" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div
            className="w-full h-full bg-center bg-cover blur-sm"
            style={{ backgroundImage: "url(/hero.jpg)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 py-12 max-w-md mx-auto">
          {/* Branding */}
          <div className="text-center mb-16 mt-8">
            <div className="mb-4 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/50 overflow-hidden">
                <div 
                  className="w-10 h-10 rounded-full bg-cover bg-center"
                  style={{ backgroundImage: "url(/main.jpg)" }}
                />
              </div>
            </div>

            <h1 className="text-5xl font-black tracking-tight mb-3 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              All for Vault
            </h1>
            <p className="text-white text-base font-semibold tracking-wide drop-shadow-lg">
              あなたの跳躍を次のレベルへ
            </p>
          </div>

          {/* Feature Cards */}
          <div className="space-y-5">
            <Link href="/analysis" className="block">
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm p-6 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/20 active:scale-[0.98]">
                <div className="flex items-start gap-4">
                  <div 
                    className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden"
                  >
                    <div 
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: "url(/picture1.jpg)" }}
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white mb-2">助走・ポール分析</h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      跳躍データを入力して、助走とポール選択のフィードバックを取得
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-blue-400 text-sm font-semibold">
                  <span>分析を開始</span>
                  <span>›</span>
                </div>
              </div>
            </Link>

            <Link href="/advice" className="block">
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm p-6 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/20 active:scale-[0.98]">
                <div className="flex items-start gap-4">
                  <div 
                    className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden"
                  >
                    <div 
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: "url(/picture2.jpg)" }}
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white mb-2">技術アドバイス</h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      AIによる技術的なアドバイスを取得します
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-orange-400 text-sm font-semibold">
                  <span>相談を開始</span>
                  <span>›</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Disclaimer Link */}
          <div className="mt-8 text-center">
            <Link
              href="/disclaimer"
              className="text-slate-400 hover:text-slate-300 text-sm transition-colors underline underline-offset-2"
            >
              注意事項 / プライバシー
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
