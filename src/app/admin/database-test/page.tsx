import { supabase } from '@/lib/supabase/client'

export default async function DatabaseTestPage() {
  let connectionStatus = 'Unknown'
  let error = null

  try {
    // Supabaseへの接続テスト
    const { error: testError } = await supabase
      .from('artworks')
      .select('count', { count: 'exact' })
      .limit(1)

    if (testError) {
      error = testError.message
      connectionStatus = 'Failed'
    } else {
      connectionStatus = 'Success'
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error'
    connectionStatus = 'Failed'
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">データベース接続テスト</h1>
      
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-gray-700">接続ステータス:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            connectionStatus === 'Success' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {connectionStatus}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-gray-700">Supabase URL:</span>
          <span className="text-sm text-gray-600">{process.env.NEXT_PUBLIC_SUPABASE_URL}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-gray-700">作品テーブル接続:</span>
          <span className="text-sm text-gray-600">
            {connectionStatus === 'Success' ? '✅ 接続OK' : '❌ 接続エラー'}
          </span>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <h3 className="text-lg font-medium text-red-800 mb-2">エラー詳細:</h3>
            <pre className="text-sm text-red-600 whitespace-pre-wrap">{error}</pre>
          </div>
        )}

        <div className="mt-6 space-y-2">
          <h3 className="text-lg font-medium text-gray-700">環境変数チェック:</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>✅ NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '設定済み' : '未設定'}</li>
            <li>✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '設定済み' : '未設定'}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
