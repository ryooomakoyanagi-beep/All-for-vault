import Head from 'next/head'
import Link from 'next/link'

export default function Disclaimer() {
  return (
    <>
      <Head>
        <title>注意事項 - All for Vault</title>
        <meta name="description" content="利用規約・免責事項・プライバシー" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
          <Link href="/" className="text-white/90 hover:text-white mb-6 inline-block">
            ← ホームに戻る
          </Link>

          <h1 className="text-4xl font-black tracking-tight mb-8 text-white">
            注意事項
          </h1>

          <div className="space-y-5">
            {/* Section A: 利用目的 */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-3">A. 利用目的</h2>
              <ul className="space-y-2 text-slate-300 text-sm leading-relaxed">
                <li>• 本アプリは棒高跳の意思決定を補助するツールです</li>
                <li>• 最終判断は本人または指導者が行ってください</li>
                <li>• 安全を最優先に考えてご利用ください</li>
              </ul>
            </div>

            {/* Section B: 安全・免責 */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-3">B. 安全・免責</h2>
              <ul className="space-y-2 text-slate-300 text-sm leading-relaxed">
                <li>• 出力は推奨であり、結果を保証するものではありません</li>
                <li>• 怪我・事故等の責任は負いかねます</li>
                <li>• 無理な変更は避け、安全を第一に考えてください</li>
              </ul>
            </div>

            {/* Section C: 個人情報 */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-3">C. 個人情報</h2>
              <ul className="space-y-2 text-slate-300 text-sm leading-relaxed">
                <li>• 氏名・連絡先など個人情報は入力しないでください</li>
              </ul>
            </div>

            {/* Section D: 外部サービス（OpenAI API） */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-3">D. 外部サービス（OpenAI API）</h2>
              <ul className="space-y-2 text-slate-300 text-sm leading-relaxed">
                <li>• 技術アドバイス機能は外部APIを利用してテキスト生成する場合があります</li>
                <li>• 送信されるのは入力内容と必要最小限の文脈です</li>
                <li>• APIキーはユーザー側に表示しません</li>
              </ul>
            </div>

            {/* Section E: フィードバック */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-3">E. フィードバック</h2>
              <ul className="space-y-2 text-slate-300 text-sm leading-relaxed">
                <li>• フィードバックは改善目的で保存されます（内容・評価・端末情報など）</li>
                <li>• 個人特定できる情報は書かないでください</li>
                <li>• 管理者のみ閲覧可能です</li>
              </ul>
            </div>

            {/* Section F: 変更・停止 */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-3">F. 変更・停止</h2>
              <ul className="space-y-2 text-slate-300 text-sm leading-relaxed">
                <li>• 内容は予告なく変更・停止する場合があります</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
